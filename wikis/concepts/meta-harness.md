# Meta-Harness（元 Harness）

## 定义

Meta-harness 是一种 agent 平台架构模式：不直接编排 agent 行为，而是将 agent 的组件——session（状态日志）、harness（推理循环）、sandbox（执行环境）——虚拟化为稳定接口，使每个组件的底层实现可以独立替换。

这个概念直接来源于操作系统设计：OS 通过虚拟化硬件（进程、文件、设备驱动）为"尚未被构想的程序"提供通用抽象。Meta-harness 用同样的方法为"尚未被设计的 harness"提供通用接口。

## 核心设计原则

### 对接口有主张，对实现无主张

[Managed Agents](../sources/anthropic-managed-agents.md) 的设计哲学：系统对三个接口的形状有明确主张——

| 接口 | 职责 | 关键操作 |
|------|------|---------|
| **Session** | 持久化事件日志 | `emitEvent(id, event)`, `getEvents()`, `getSession(id)` |
| **Harness** | 推理循环 + 工具路由 | `wake(sessionId)`, 调用 Claude, 路由 tool calls |
| **Sandbox** | 代码执行 + 文件操作 | `execute(name, input) → string`, `provision({resources})` |

但对每个接口背后运行什么没有假设：sandbox 可以是容器、VPC 内的机器、手机、甚至 Pokemon 模拟器。

### Harness 假设会过时

[Harness engineering](harness-engineering.md) 的每个组件都编码了"模型做不到什么"的假设。这些假设会随模型能力提升而过时——Sonnet 4.5 需要 context reset 来对抗 context anxiety，Opus 4.5 上这个组件变成了死重。Meta-harness 的架构保证了：过时的组件可以被替换，而不需要重建整个系统。

这是 [Bitter Lesson](../sources/sutton-bitter-lesson.md) 在 agent 基础设施层的体现。

## Brain-Hands 解耦

Meta-harness 的核心架构决策是将"大脑"（Claude + harness）与"双手"（sandbox + 工具）解耦。

### 从 Pet 到 Cattle

初始设计将所有组件放入单一容器——session、harness、sandbox 共享环境。这创造了一个基础设施层的"宠物"：容器故障意味着 session 丢失，调试需要进入包含用户数据的容器。

解耦后，每个组件都变成了"牲畜"：
- **Sandbox 故障** → harness 捕获 tool-call error，反馈给 Claude，Claude 决定是否重试 → `provision({resources})` 初始化新容器
- **Harness 故障** → 新 harness 实例通过 `wake(sessionId)` 启动 → `getSession(id)` 恢复事件日志 → 从最后一个事件继续
- **Session** → 独立于两者的持久化存储，是系统的事实来源（source of truth）

### 统一工具接口

解耦的关键是将每只"手"变成统一的工具调用：`execute(name, input) → string`。这个接口足够通用，可以支持任意 MCP server、自定义工具、或内建工具。Harness 不需要知道工具的实现细节。

这使得一个 brain 可以连接多只 hand（many hands），hand 也可以在 brain 之间传递（many brains）。

## Session 外部化

Session 不是 Claude 的 context window——它是 context window 之外的持久化对象。

这个区分解决了长时任务中的一个基本矛盾：[context management](context-management.md) 中的 compaction/trimming 是不可逆决策，但不可能事先知道未来的 turn 需要哪些 token。Session 作为独立的持久化日志，保证了所有事件都可以被回溯查询（`getEvents()`），即使它们已经被从 Claude 的 context window 中移除。

这与 [虚拟上下文管理](virtual-context-management.md) 的思路一致：context window = RAM（有限、快速），session = 磁盘（无限、可查询）。但 Managed Agents 进一步将 session 从 sandbox 中分离出来——MemGPT 的外部存储仍在同一个执行环境中，Managed Agents 的 session 是独立的持久化服务。

## 安全边界

Brain-hands 解耦天然创建了安全边界：凭证存储在 brain 侧或专用 vault 中，sandbox 内的代码永远接触不到。

两种模式：
- **资源绑定**：Git token 在初始化时注入 remote URL，sandbox 内的 `git push/pull` 无需知道 token
- **代理访问**：OAuth token 存储在 vault 中，MCP 工具通过专用 proxy 访问外部服务，proxy 从 vault 获取凭证，harness 和 sandbox 都不接触凭证

这比应用层的 [guardrails](guardrails.md)（依赖分类器准确率）和 [Claude Code 权限系统](claude-code-permission-system.md)（依赖工具级控制）更底层：不是限制 agent 能做什么，而是从架构上使凭证不可达。与 [agent sandboxing](agent-sandboxing.md) 中 Execute-Only Agents 的"规划-执行分离"思路互补。

## 性能影响

Brain-hands 解耦的意外收获是性能提升。在耦合设计中，每个 session 都需要等待容器 provisioning（克隆 repo、启动进程、拉取事件），即使该 session 可能不需要 sandbox。

解耦后，inference 可以在容器 provisioning 之前开始——brain 只在需要时才通过 tool call 请求 sandbox。

| 指标 | 改善 |
|------|------|
| p50 TTFT | 下降 ~60% |
| p95 TTFT | 下降 >90% |

## 与 OS 虚拟化的同构

Meta-harness 深化了 [LLM-OS 类比](llm-os-analogy.md) 的一个维度：不仅 LLM = CPU、agent = kernel，而且 **agent 平台 = OS 虚拟化层**。

| OS 虚拟化 | Meta-Harness 虚拟化 |
|-----------|-------------------|
| `read()` 不关心底层是 1970s 磁盘组还是现代 SSD | `execute()` 不关心底层是容器还是手机 |
| 进程、文件、设备是持久抽象 | Session、harness、sandbox 是持久接口 |
| 实现可替换而不影响上层程序 | 具体 harness/sandbox 可替换而不影响上层服务 |

## 相关概念

- [Harness engineering](harness-engineering.md) — meta-harness 是 harness 的虚拟化层
- [LLM-OS 类比](llm-os-analogy.md) — OS 虚拟化是 meta-harness 的直接灵感
- [Context management](context-management.md) — session 外部化是 context management 的平台级演进
- [Agent sandboxing](agent-sandboxing.md) — brain-hands 解耦提供结构性安全边界
- [虚拟上下文管理](virtual-context-management.md) — session 与 context window 的分离扩展了虚拟内存类比
- [Implicit loop architecture](implicit-loop-architecture.md) — meta-harness 使不同的循环实现可插拔
- [Agent OS](agent-os.md) — meta-harness 在更高抽象层解决类似问题
- [Agent interoperability](agent-interoperability.md) — 统一接口是互操作的基础

## References

- `sources/anthropic-managed-agents.md`
