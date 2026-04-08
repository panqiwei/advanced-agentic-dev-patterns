# Agent Interoperability — 跨框架 Agent 互操作

不同厂商、不同框架构建的 AI agent 能够在无需了解对方内部实现的情况下协作完成任务的能力。这是当前 agent 生态从"孤岛"走向"网络"的核心工程挑战。

## 问题的结构

### 当前状态：孤岛生态

2024 年前后，agent 框架迅速增殖：LangGraph、CrewAI、Semantic Kernel、AutoGen、Google ADK、Anthropic Claude SDK……每个框架有自己的内部通信机制，但框架之间没有标准化接口。

结果：
- 每次跨框架集成都需要定制开发（点对点方案）
- 将 agent 包装成工具是常见妥协——但这削弱了 agent 的自主性
- 生态无法自然形成复合系统

### 根本张力：Agent ≠ Tool

传统 MCP/函数调用模型将外部能力暴露为工具（tool）：无状态、执行确定函数、单次请求-响应。

但 agent 有本质不同的需求：
- **多轮协商**：任务可能需要澄清、迭代
- **有状态执行**：任务跨越多个请求持续进行
- **异步委派**：client 不需要持续等待
- **能力声明**：agent 需要描述自己擅长什么

将 agent 包装成工具会强行截断这些能力。

## A2A 的解法

[A2A 协议](a2a-protocol.md)通过三个机制实现互操作：

### 1. 标准化发现（Agent Card）

[Agent Card](agent-card.md) 发布于固定端点 `/.well-known/agent-card`，让任何 A2A-compliant client 都能在运行时发现 agent 的能力和接口，无需预先配置。

### 2. 标准化通信语义（Task + Message）

[Task Lifecycle](task-lifecycle.md) 定义了跨框架统一的工作单元表示。无论底层用什么框架实现，A2A Task 的状态机是一致的。

### 3. 不透明执行（Opaque Execution）

Agent 协作时不暴露内部状态、记忆或工具实现。协作双方只依赖：
- 声明的能力（Agent Card skills）
- 交换的上下文（Message + Artifact）

这保护了知识产权，也使得跨组织协作成为可能。

## 与现有框架的关系

### 与 Orchestrator-Workers 的关系

[Orchestrator-Workers 模式](orchestrator-workers.md)描述的是单系统内的 agent 编排。A2A 将这个模式扩展到跨系统边界：orchestrator 可以是任何框架的 client agent，workers 可以是任何框架的 remote agent，中间通过 A2A 协议通信。

### 与 Agent OS 的关系

从 [Agent OS](agent-os.md) 视角，A2A 类比于操作系统的网络栈：
- 本地进程通信 ↔ 框架内 agent 调用
- TCP/IP 跨机器通信 ↔ A2A 跨框架通信
- DNS 服务发现 ↔ Agent Card 能力发现

AgenticOS Workshop（ASPLOS 2026）中 Cisco agntcy 框架明确将 A2A 作为"Internet of Agents"的通信层。

### 与 MCP 的互补关系

[MCP](../entities/mcp.md) 和 A2A 在 agent 技术栈中各司其职：

| 维度 | MCP | A2A |
|---|---|---|
| 连接对象 | Agent ↔ 工具/数据 | Agent ↔ Agent |
| 通信性质 | 无状态函数调用 | 有状态任务委派 |
| 典型场景 | 搜索、数据库查询 | 委托另一个 agent 完成子任务 |
| 发现机制 | JSON Schema 能力描述 | Agent Card |

## 生态意义

互操作性不只是技术问题，也是生态问题：

- **分工专业化**：团队可以专注构建最擅长的 agent，通过 A2A 接入生态
- **复合系统**：多个专业 agent 的能力可以组合，突破单 agent 能力上限
- **渐进采用**：A2A 是开放标准，已有 agent 系统可以逐步增加 A2A 接口而不必重写

## 开放问题

互操作性带来新的协调难题（超出 A2A 当前规范）：

- **能力语义对齐**：两个 agent 声明同样的 skill，但语义不同——谁来仲裁？
- **错误传播**：远程 agent 失败时，委托链如何处理？（与 [error-cascade](error-cascade.md) 相关）
- **信任模型**：如何验证 agent card 的声明是真实的？

## References

- `sources/google-a2a-protocol.md`
- [Google A2A 官方文档](../sources/google-a2a-protocol.md)
- [A2A Protocol](a2a-protocol.md)
- [Agent Card](agent-card.md)
- [Agentic Systems](agentic-systems.md)
- [Orchestrator-Workers](orchestrator-workers.md)
- [Error Cascade](error-cascade.md)
