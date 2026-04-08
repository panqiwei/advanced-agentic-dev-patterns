# Implicit Loop Architecture（隐式循环架构）

## 定义

隐式循环是 agent 系统的一种架构范式：agent 在一个开放的反馈循环中运行——**gather context → take action → verify work → repeat**——每一步由模型自主决定，而非预定义的流程图。

与之对比的是 **显式图架构**（如 LangGraph），后者将流程编码为节点和边的有向图，每个节点的前后关系在编译时确定。

## 核心特征

### 行为由约束塑造，非预设路径

隐式循环中不存在"第一步做 X、第二步做 Y"的硬编码。Agent 的行为通过以下机制间接约束：
- **Tool design**：[工具定义](tool-design.md) 决定了 agent 可以做什么
- **System prompt**：指导 agent 的角色、目标、约束
- **Permission handling**：限制哪些操作需要确认
- **Feedback mechanisms**：linting、测试、visual check 等提供方向修正

### 与 Workflows 的关系

在 [agentic systems](agentic-systems.md) 的分类中，隐式循环属于"agent"端而非"workflow"端。但 [harness engineering](harness-engineering.md) 的实践表明，最有效的系统往往在隐式循环内嵌入 workflow-like 的约束——如 [feature tracking](feature-tracking.md)、增量推进、状态交接。

## 实现：Claude Agent SDK

[Claude Agent SDK](../entities/claude-agent-sdk.md) 是隐式循环架构的典型实现。SDK 提供：
- **Compaction**：[context management](context-management.md) 使循环可无限延续
- **Subagents**：context 隔离 + 并行化
- **Tool system**：bash、文件操作、[MCP](../entities/mcp.md) 集成

核心设计原则："给 agent 一台计算机"——文件系统结构本身就是 context engineering 的一种形式。

## Codex 的实现细节

OpenAI 在 [agent loop 拆解](../sources/openai-unrolling-codex-agent-loop.md) 中详细展示了隐式循环的工程实现：

- **Prompt 构建**：system message → instructions → tools → developer message → user instructions（AGENTS.md 聚合）→ environment context → user message
- **循环驱动**：模型返回 tool call → 执行 → 输出追加到 prompt → 重新查询，直到产出 assistant message
- **Prompt caching**：后续请求是前序的精确前缀，实现线性而非二次方的采样成本
- **Compaction**：context 超限时自动压缩，包含 `encrypted_content` 保留模型潜在理解

### 会话原语

[Codex App Server](../sources/openai-unlocking-codex-harness.md) 将隐式循环表达为三层会话结构：Thread（持久会话） → Turn（一次 user→agent 交互） → Item（原子 I/O 单元），通过双向 JSON-RPC 暴露给客户端。

## OS Kernel Event Loop 的同构

[Karpathy 的 LLM-OS 类比](llm-os-analogy.md) 为隐式循环提供了一个精确的结构性解释：Agent = OS Kernel。OS kernel 的核心就是一个事件循环——接收中断 → 调度处理程序 → 执行 → 返回 → 等待下一个中断。隐式循环的 gather-act-verify-repeat 与此高度同构。

两者的共同特征是**事件驱动而非流程驱动**——没有预定义的"第一步做什么、第二步做什么"，而是由当前状态（观察到什么、收到什么反馈）决定下一步行为。这也解释了为什么隐式循环天然适合开放式任务——正如 OS kernel 不预知将运行什么进程，agent 不预知将遇到什么情况。

但 Karpathy 同时指出了一个根本差异：OS kernel 运行在确定性硬件上，agent 的"CPU"（LLM）是统计性的。这意味着隐式循环中的每一步都可能产生不同结果——[可靠性衰减](reliability-decay.md) 正是这种非确定性在多步循环中的累积效应。

## 显式图对比：LangGraph

[LangGraph](../entities/langgraph.md) 是显式图架构的代表实现（详见 [LangGraph 文档摘要](../sources/langgraph-documentation.md)）——用 StateGraph 定义节点和边的有向图，流程拓扑在编译时确定。

| | 隐式循环 (Claude SDK / Codex) | 显式图 (LangGraph) |
|---|---|---|
| 可预测性 | 低——模型自主决策 | 高——编译时确定流程 |
| 灵活性 | 高——可应对未预见情况 | 受限于预定义拓扑 |
| 调试 | 难——需推理决策链 | 易——状态转换可视化 |
| 模型依赖 | 高——依赖模型能力 | 低——结构由代码控制 |

[Harness engineering](harness-engineering.md) 的演进趋势（"what can I stop doing?"）暗示：随着模型能力提升，更多编排决策从代码转移到模型，隐式循环范式可能在长期占优。但对流程固定、合规优先的企业场景，显式图仍有其位置。

## OS 级支撑：Fork-Explore-Commit

隐式循环的探索式本质（模型自主决定下一步，可能走向死胡同再回退）目前完全在应用层实现。[AgenticOS Workshop](../sources/agenticos-workshop-asplos-2026.md) 中的 [Fork-Explore-Commit](fork-explore-commit.md) 原语提供了一种 OS 级的支撑方案：

- **Fork**：在隐式循环的关键决策点（如"选择哪种实现方案"）fork 执行状态
- **Explore**：各分支独立推进隐式循环
- **Commit**：选择最优分支的结果，丢弃其余

这不改变隐式循环的架构——循环内部仍然是 gather-act-verify-repeat。它改变的是循环外部的探索策略，从串行的"试错-回退"变为并行的"多路探索-择优提交"，并由 [Agent OS](agent-os.md) 提供高效的状态管理。

## 与分形架构的关系

[Cycle.js](../entities/cycle-js.md) 是[分形架构](fractal-architecture.md)的典型实现——每个组件都是"observables in → observables out"的纯函数，副作用被推到 driver 层。这种"组件不知道自己在系统中的位置、行为由外部约束塑造"的设计与隐式循环架构具有结构上的呼应：agent 也不知道任务的全局路径，行为由工具、prompt 和反馈间接约束。分形架构的统一接口原则（所有组件暴露相同 API）则暗示了一种可能：agent 系统中的 sub-agent 也可以遵循与顶层 agent 完全相同的接口契约。

## 相关概念

- [Agentic systems](agentic-systems.md) — 隐式循环在 workflows-agents 谱上的位置
- [Harness engineering](harness-engineering.md) — 在隐式循环中注入约束
- [Tool design](tool-design.md) — 工具定义塑造 agent 行为
- [Context management](context-management.md) — 循环持续运行的基础
- [ACI](aci.md) — agent 与工具的接口层
- [LangGraph](../entities/langgraph.md) — 显式图范式的代表
- [LLM-OS 类比](llm-os-analogy.md) — 隐式循环与 OS kernel event loop 的同构
- [Fork-Explore-Commit](fork-explore-commit.md) — OS 级探索原语
- [Agent OS](agent-os.md) — 隐式循环的系统层支撑
- [Fractal architecture](fractal-architecture.md) — Cycle.js 纯函数组件与隐式循环的结构同构

## References

- `sources/anthropic_official/building-agents-claude-agent-sdk.md`
- `sources/openai_official/unrolling-codex-agent-loop.md`
- `sources/openai_official/unlocking-codex-harness.md`
- `sources/langgraph-documentation.md`
- `sources/karpathy-llm-cpu-agent-os-kernel.md`
- `sources/agenticos-workshop-asplos-2026.md`
