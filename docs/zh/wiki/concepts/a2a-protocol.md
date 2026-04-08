# A2A Protocol — Agent2Agent 跨框架通信协议

Google 主导开发、现由 Linux Foundation 托管的开放标准，定义 AI agent 之间的互操作通信语义。A2A 处于 agent 技术栈的"网络层"——使不同厂商、不同框架构建的 agent 能够像同一个系统中的组件一样协作。

## 核心定位

### 为什么 agent 需要专门的通信协议？

[MCP](../entities/mcp.md) 已经标准化了 agent 与工具/数据源的接口（agent-to-tool）。但 agent-to-agent 通信有根本不同的需求：

- **工具调用**：单向、无状态、执行确定函数——适合 MCP
- **Agent 通信**：多轮对话、有状态任务、异步委派、协商过程——需要 A2A

核心论断："将 agent 包装成工具是根本性的降格"（Why Agents Are Not Tools）。Agent 有自主性，需要以"代理人"身份交互，而不是退化成被动执行的函数。

### 在技术栈中的位置

```
用户需求
  ↓
框架（ADK / LangGraph / CrewAI）—— 构建单个 agent 的内部逻辑
  ↓
MCP —— 连接 agent 与工具、数据源
  ↓
A2A —— 连接 agent 与 agent（跨组织、跨框架）
  ↓
多 agent 协作网络
```

## 核心机制

### Agent Card：能力发现

[Agent Card](agent-card.md) 是 agent 的"数字名片"，发布于 `/.well-known/agent-card` 端点。包含：身份、服务 URL、能力声明、技能列表、认证要求。

Client agent 通过 GET `/.well-known/agent-card` 发现 remote agent，再决定是否适合当前任务、如何鉴权。

### Task：有状态工作单元

[Task 生命周期](task-lifecycle.md)是 A2A 状态管理的核心。每个 Task 有唯一 ID，经历明确状态机：`submitted → working → completed/failed/canceled/rejected`，可中途进入 `input-required` 等待人类介入。

Task 设计天然支持长时运行操作（LRO）：client 可以断开连接后轮询，也可通过 push notification 接收异步更新。

### 传输机制三层

| 模式 | 机制 | 适用 |
|---|---|---|
| 同步轮询 | HTTP POST + 客户端轮询 Task | 短任务 |
| 流式传输 | SSE（Server-Sent Events） | 需要实时进度的长任务 |
| Push Notification | Webhook 回调 | 超长任务、断线重连 |

## 与现有概念的关系

### A2A 与 MCP

两者互补，共同构成 agent 生态的"配线架"：
- MCP = agent 连接工具/数据的接口标准
- A2A = agent 与 agent 直接对话的接口标准

MCP 实体页已记录 Mobile-MCP 等扩展。A2A 的互补关系使二者相加覆盖了 agent 生态的全部外部接口需求。

### A2A 与 Agent OS

从 [agent-os](agent-os.md) 视角看，A2A 可类比操作系统的"网络栈"：
- OS 内核调度本地进程 ↔ Agent OS 调度本地 agent
- TCP/IP 使不同 OS 的计算机互通 ↔ A2A 使不同框架的 agent 互通

[AgenticOS Workshop](../sources/agenticos-workshop-asplos-2026.md) 中的 Cisco agntcy 框架明确将 A2A 作为 agent 网络层之一。

### A2A 与 Agent Skills

[Agent Skills](agent-skills.md) 是单个 agent 的能力打包标准（Anthropic 提出）；A2A 的 Agent Card 中有 `skills` 字段，描述该 agent 对外暴露的能力。二者在能力声明层面有概念交叉，但层次不同：Skills 是内部封装，Agent Card skills 是对外的能力公告。

### A2A 与 Agentic Systems

[Agentic Systems](agentic-systems.md) 中的"多 agent 网络"（orchestrator-workers）实现通常需要某种跨 agent 通信协议。A2A 为这类架构提供了标准化路径，解决了此前只能依赖自定义点对点方案的工程痛点。

## 设计原则

A2A 官方声明的五条设计原则：

1. **简单**：复用已有标准（HTTP、JSON-RPC 2.0、SSE），不重新发明轮子
2. **企业就绪**：认证、授权、追踪、监控遵循企业 Web 实践
3. **异步优先**：原生支持长时任务和人类介入场景
4. **模态无关**：支持文本、文件、结构化数据等多种内容类型
5. **不透明执行**：agent 协作不暴露内部状态、记忆或工具实现

## 关键数据结构

| 概念 | 作用 |
|---|---|
| `AgentCard` | 能力发现的元数据文档 |
| `Task` | 有状态工作单元，支持 LRO |
| `Message` | 通信轮次（包含 Parts） |
| `Part` | 内容原子容器（text/file/data） |
| `Artifact` | 任务的可交付产物 |
| `contextId` | 跨任务的会话分组标识 |

## References

- `sources/google-a2a-protocol.md`
- [Google A2A 官方文档](../sources/google-a2a-protocol.md)
- [Agent Card](agent-card.md)
- [Task Lifecycle](task-lifecycle.md)
- [Agent Interoperability](agent-interoperability.md)
