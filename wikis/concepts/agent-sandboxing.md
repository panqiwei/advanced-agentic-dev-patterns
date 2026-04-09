# Agent Sandboxing（Agent 沙箱与隔离）

## 定义

Agent 沙箱是在系统层面隔离和约束 AI agent 执行环境的安全机制——确保 agent 生成的代码、工具调用和数据访问在受控边界内运行，即使 agent 行为不可预测或被恶意注入。

## 与传统沙箱的区别

传统沙箱（容器、seccomp、AppArmor）假设被隔离的代码是静态已知的。Agent 沙箱面对的挑战根本不同：

- **动态代码生成**：Agent 生成的代码在运行前不存在，无法做静态分析
- **语义攻击面**：Prompt injection 通过语义层面绕过传统安全边界
- **工具链传递**：Agent 调用工具 A，工具 A 调用工具 B——权限边界在调用链中模糊化
- **上下文污染**：恶意输入可能不直接执行代码，而是污染 agent 的决策上下文

## AgenticOS Workshop 中的沙箱研究

[AgenticOS Workshop](../sources/agenticos-workshop-asplos-2026.md) 呈现了三种互补的系统级安全方案：

### Execute-Only Agents：架构级 Prompt Injection 防御

Tiwari 和 Williams 提出将 agent 的"规划"和"执行"严格分离到不同安全域——执行层只能执行预批准的操作集，不接受自然语言指令。这从根本上消除了 prompt injection 的攻击面，因为执行层没有语言理解能力。

这与 [guardrails](guardrails.md) 的分层防御思想一脉相承，但在更低的抽象层实现：不是在应用层过滤恶意输入，而是在架构层使恶意输入无法到达执行路径。

### Grimlock：eBPF + 可信通道

Wu 等人的 Grimlock 使用 eBPF（extended Berkeley Packet Filter）在内核级监控 agent 行为，配合可信通道（attested channels）确保 agent 与外部服务通信的完整性。

eBPF 的优势在于可观测性与执行的统一——同一个框架既可以观察 agent 行为（无侵入监控），也可以强制执行安全策略（阻断违规操作）。

### 动态沙箱与轻量级运行时

Workshop 征稿主题中的"dynamic sandboxing and lightweight runtimes for securely executing agent-generated code"指向另一个方向：不是限制 agent 的决策，而是让 agent 生成的代码在安全的环境中执行。这需要极低开销的沙箱创建/销毁（agent 可能每分钟生成数十段代码），同时维持足够的隔离保证。

## 与应用层安全的关系

应用层的 [guardrails](guardrails.md) 和系统层的 agent 沙箱形成互补的安全纵深：

| 层 | 机制 | 防御目标 |
|---|------|---------|
| 应用层 | Guardrails（输入/执行/输出侧检查） | 有害内容、越权操作 |
| 框架层 | Harness 工具权限、声明式工具 | 工具误用、不可逆操作 |
| 系统层 | Execute-Only、eBPF、动态沙箱 | Prompt injection、代码逃逸、通道劫持 |

单独依赖任何一层都不够——应用层 guardrails 可被语义攻击绕过，系统层沙箱不理解业务语义。多层协同是核心原则。

## Claude Code 的权限+沙箱纵深防御

[Claude Code 权限系统](claude-code-permission-system.md) 提供了一个生产级的权限与沙箱协作案例。Anthropic 官方文档明确将两层定义为互补而非替代：

| 层 | 作用范围 | 适用工具 |
|---|---|---|
| 权限层 | 控制 Claude 能调用哪些工具、访问哪些文件/域名 | 所有工具（Bash、Read、Edit、WebFetch、MCP） |
| 沙箱层 | OS 级强制限制文件系统和网络访问 | 仅 Bash 命令及其子进程 |

**关键区别**：Read 规则的 deny 只阻止内置 Read 工具——不阻止 `cat .env` 这样的 Bash 命令。OS 级沙箱补足了这个盲区，通过 allowRead/denyRead 路径配置在内核层强制文件访问。

**纵深防御的触发顺序**：
1. 权限规则阻止 Claude 发起受限工具调用（应用层）
2. 若 prompt injection 绕过了模型决策，沙箱在 OS 层拦截 Bash 子进程的越权访问（系统层）

启用沙箱的 `autoAllowBashIfSandboxed: true`（默认）时，沙箱内的 Bash 命令无需提示——沙箱边界替代了逐命令确认。

## Managed Agents 的结构性凭证隔离

[Managed Agents](../sources/anthropic-managed-agents.md) 的 brain-hands 解耦（[meta-harness](meta-harness.md)）提供了一种比应用层 guardrails 更根本的安全模式：从架构上使凭证对 sandbox 不可达。

在耦合设计中，所有组件共享同一容器——Claude 生成的不可信代码与凭证在同一环境中运行。prompt injection 只需说服 Claude 读取环境变量，即可获取 token 并 spawn 新的不受限 session。窄化 token 权限是一种缓解，但这编码了"模型用有限 token 做不了什么"的假设——而模型越来越聪明。

结构性修复是让凭证永远不进入 sandbox。两种模式：
- **资源绑定**：Git access token 在 sandbox 初始化时注入 remote URL，`git push/pull` 无需 agent 经手 token
- **代理访问**：OAuth token 存储在安全 vault 中，[MCP](../entities/mcp.md) 工具通过专用 proxy 访问外部服务，proxy 从 vault 获取凭证，harness 和 sandbox 都不接触凭证

这与上述 Execute-Only Agents（规划-执行分离）和 Claude Code 权限系统（分层控制）形成三层安全纵深：
1. 权限层：控制 agent 能调用哪些工具（应用层）
2. 沙箱层：限制代码的系统级访问（OS 层）
3. 凭证隔离：使凭证从架构上不可达（基础设施层）

## 相关概念

- [Agent OS](agent-os.md) — 沙箱是 Agent OS 的安全层
- [Guardrails](guardrails.md) — 应用层安全，与系统层沙箱互补
- [Harness engineering](harness-engineering.md) — 框架层安全和约束
- [Agent 资源控制](agent-resource-control.md) — 资源隔离是安全的基础
- [Claude Code 权限系统](claude-code-permission-system.md) — 权限+沙箱协作的生产实现
- [Meta-Harness](meta-harness.md) — brain-hands 解耦提供结构性凭证隔离

## References

- `sources/agenticos-workshop-asplos-2026.md`
- `sources/anthropic_official/claude-code-permissions.md`
- `sources/anthropic-managed-agents.md`
