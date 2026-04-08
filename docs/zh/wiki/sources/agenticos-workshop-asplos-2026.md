# AgenticOS Workshop @ ASPLOS 2026

## 元信息

- **来源**: `sources/agenticos-workshop-asplos-2026.md`
- **远程**: https://os-for-agent.github.io/
- **类型**: 学术 workshop（ASPLOS 2026 co-located）
- **日期**: 2026-03-23（匹兹堡，下午半天）
- **组织者**: Prof. Dong Li (UC Merced) 等
- **Keynote**: Prof. Dan Williams (Virginia Tech)

## 背景与定位

[ASPLOS](../entities/asplos.md) 2026 的 co-located workshop，学术系统社区首次聚焦 AI agent 基础设施的 OS 级设计。核心观点：传统 OS 抽象（进程、线程、文件、socket、资源控制器）从未为动态的、语义丰富的、自适应的 agent 负载而设计。要在规模上支持 AI agent，OS 本身需要变得 *agentic*。

这标志着 agent 研究从应用层（如何构建更好的 agent）向系统层（agent 需要什么样的基础设施）的范式下移。

## 关键论文与主题

### Research Papers（8 篇）

1. **AgentCgroup** — OS 级 [agent 资源控制](../concepts/agent-resource-control.md)，将 cgroup 概念扩展到 agent 负载。理解和控制 AI agent 的操作系统资源。
2. **Rethinking OS Interfaces for LLM Agents** — 重新思考面向 LLM agent 的 OS 接口设计（王元、李明宇、陈海波，上海交大）。
3. **Skills are the new Apps — Now It's Time for Skill OS** — 提出 Skill OS 概念：技能是新的应用程序，需要 OS 级的管理和编排（陈乐等，上海交大）。与 [agent-skills](../concepts/agent-skills.md) 概念的 OS 级延伸。
4. **LLM-Driven Rule Generation for WAF** — 探索 LLM agent 驱动的 WAF 规则生成，agent 管理安全系统的实例。
5. **Fork, Explore, Commit** — [Fork-Explore-Commit](../concepts/fork-explore-commit.md) OS 原语，为 agent 探索式执行提供系统级支持。
6. **Virtualizing Foundation Models with Self-evolving OS Layer** — 用自演化 OS 层虚拟化基础模型（IBM Research、Argonne 等）。
7. **Fuyun: Bridging the Semantic Gap in Serverless** — 通过 LLM agent 弥合 serverless 资源分配中的语义鸿沟。
8. **Towards Agentic Performance Management** — Agentic 性能管理（Amit Levy 组，Princeton）。

### Vision Papers（4 篇）

1. **Mobile-MCP** — 在 Android IPC 机制上实现 [MCP](../entities/mcp.md)，将标准化工具协议推向移动端。
2. **pMVX** — 策略级多版本执行，agent OS 内核自调优。
3. **Execute-Only Agents** — 架构级 prompt injection 防御：将"规划"和"执行"严格分离到不同安全域。与 [guardrails](../concepts/guardrails.md) 的系统级强化。
4. **Grimlock** — 基于 eBPF 和可信通道保护高自主系统。

### Invited Talk

**"Agents Are Not Just a Model Problem. They Are an Execution Problem."**（Guanlan Dai）

这个标题本身就是对当前 agent 研究方向的范式性纠正：大部分 agent 失败不是因为模型不够强，而是因为执行基础设施不匹配。这与 [harness engineering](../concepts/harness-engineering.md) 的核心主张（"agent 的失败是环境不足的信号"）高度一致，但将视角从应用层的 harness 下推到 OS 层的执行原语。

## 研究议题全景

Workshop 征稿主题勾勒出 [Agent OS](../concepts/agent-os.md) 的研究全景：

- **执行抽象**: 进程/容器/多内核增强，agent 专用运行时
- **沙箱与隔离**: agent 生成代码的动态沙箱化、轻量级运行时
- **语义感知调度**: 面向动态多 agent 负载的资源管理和调度
- **长时状态管理**: agent 上下文、prompt、记忆的 OS 级抽象（关联 [context management](../concepts/context-management.md)）
- **eBPF 可观测性**: 实时观测、自适应、约束执行
- **编译器-OS 协同**: agent 感知的 JIT 编译策略
- **GPU 虚拟化**: 大规模 agent 负载的加速器资源管理
- **安全与隔离**: agent 调用工具和数据流的安全机制（关联 [guardrails](../concepts/guardrails.md) 和 [agent 沙箱](../concepts/agent-sandboxing.md)）
- **Agent 管理系统**: 内核调优、异常检测、资源编排、故障恢复

## 与 wiki 现有知识的交叉

这个 workshop 是 wiki 中多条线索的系统层交汇点：

| Wiki 概念 | AgenticOS 延伸 |
|-----------|---------------|
| [Harness engineering](../concepts/harness-engineering.md) | 从应用层 harness 到 OS 层执行原语 |
| [Agent skills](../concepts/agent-skills.md) | Skill OS：技能的 OS 级管理和编排 |
| [Context management](../concepts/context-management.md) | 长时状态管理的 OS 级抽象 |
| [Guardrails](../concepts/guardrails.md) | Execute-Only Agents、Grimlock：系统级安全 |
| [Implicit loop architecture](../concepts/implicit-loop-architecture.md) | Fork-Explore-Commit：OS 原语支持探索式执行 |
| [MCP](../entities/mcp.md) | Mobile-MCP：协议跨平台实现 |

## 意义

这是学术系统社区对 agent 基础设施的首次系统性审视。它确认了一个方向：agent 不只是 ML/NLP 的问题，也是系统设计的问题。OS 需要新的抽象来服务 agent 负载，正如它曾经为 web 服务、容器化、微服务负载演化过一样。

## References

- `sources/agenticos-workshop-asplos-2026.md`
