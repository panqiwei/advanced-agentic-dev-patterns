# Google A2A Protocol — 官方文档

Agent2Agent (A2A) 协议官方文档完整摘要。A2A 是由 Google 主导开发、现捐赠给 Linux Foundation 的开放标准，定义 AI agent 之间的跨框架互操作通信协议。

## 基本信息

- **来源**：`sources/google-a2a-protocol.md`
- **原始 URL**：https://google.github.io/A2A/（重定向至 https://a2aproject.github.io/A2A/latest/）
- **作者**：Google / Linux Foundation
- **发布时间**：2024-04-09（首版），当前版本 1.0.0
- **摘录日期**：2026-04-07

## 核心定位

A2A 解决的是"多 agent 生态中，不同厂商、不同框架构建的 agent 无法直接通信"的问题。它处于 agent 技术栈的通信层：

```
模型（LLM）
  ↓ 推理能力
框架（ADK、LangGraph、CrewAI）
  ↓ agent 构建能力
MCP（连接 agent 与工具/数据）
  ↓ agent-工具接口
A2A（连接 agent 与 agent）
  ↓ agent-agent 接口
跨组织 agent 网络
```

**A2A 与 MCP 的关系**：互补而非竞争。MCP 标准化 agent 与工具/数据源的接口（agent-to-tool）；A2A 标准化 agent 与 agent 之间的通信（agent-to-agent）。核心区分：agent 不是工具——工具是无状态、执行固定函数的；agent 有自主性，需要多轮协商、委派、上下文传递。

## 五大核心概念

### 1. Agent Card
Agent 的"数字名片"，JSON 格式元数据文档，发布于 `/.well-known/agent-card` 端点。包含：
- 身份信息（名称、描述）
- 服务端点（URL）
- 能力声明（streaming 支持、push notification 支持）
- 技能列表（skills）
- 认证要求（securitySchemes）

Client agent 在与 remote agent 通信前必须先获取并解析 Agent Card。

### 2. Task（任务生命周期）
Task 是 A2A 的核心工作单元，有唯一 ID 和明确的状态机：

```
submitted → working → (input-required) → completed
                                        → failed
                                        → canceled
                                        → rejected
```

- `submitted`：已接收，待处理
- `working`：正在处理
- `input-required`：需要 client 提供更多信息（人类介入场景）
- `completed/failed/canceled/rejected`：终态

Task 天然支持长时运行操作（LRO）：client 可以断开连接后轮询状态，或通过 push notification 接收异步更新。

### 3. Message 与 Part
**Message**：一轮通信，包含 role（"user" 或 "agent"）和一组 Part。

**Part**：内容的原子容器，支持四种类型：
- `text`：纯文本
- `raw`：二进制文件内联数据
- `url`：外部文件 URI
- `data`：结构化 JSON

Part 设计使协议"模态无关"（modality agnostic）——agent 可交换文本、图片、音频、结构化数据等任意内容。

### 4. Artifact（产物）
Agent 在任务处理过程中生成的具体输出（文档、图片、结构化数据等）。与 Message 的区别：Artifact 是任务的可交付成果，不是通信中间态。Artifact 可以流式增量发送给 client。

### 5. Context（上下文 ID）
服务端生成的标识符，用于逻辑分组多个相关 Task，提供跨会话的上下文连贯性。

## 通信机制

A2A 基于 HTTPS + JSON-RPC 2.0，支持三种交互模式：

| 模式 | 机制 | 适用场景 |
|---|---|---|
| 请求/响应 + 轮询 | HTTP POST → 任务 ID → 客户端轮询 | 简单任务 |
| 流式传输 | SSE（Server-Sent Events） | 需要实时更新的长时任务 |
| Push Notification | Webhook 回调 | 超长时任务、断开连接场景 |

**请求生命周期**（四步）：
1. **Agent Discovery**：GET `/.well-known/agent-card` 获取 Agent Card
2. **Authentication**：解析 securitySchemes，获取 OAuth/JWT token
3. **sendMessage**：POST `/sendMessage`，返回 Task 或 Message
4. **sendMessageStream**：POST `/sendMessageStream`，通过 SSE 接收流式更新

## 核心操作（Protocol Operations）

| 操作 | 描述 |
|---|---|
| `sendMessage` | 发送消息，返回 Task 或 Message |
| `sendMessageStream` | 流式发送，SSE 推送增量更新 |
| `getTask` | 查询 Task 当前状态 |
| `listTasks` | 列出 Task（支持分页、按 contextId/status 过滤） |
| `cancelTask` | 请求取消 Task |
| `subscribeToTask` | 订阅已有 Task 的流式更新 |
| `createPushNotificationConfig` | 配置 Webhook push notification |

## 安全模型

- 传输层：强制 HTTPS
- 认证：OAuth 2.0 / OpenID Connect / API Key，由 Agent Card 的 `securitySchemes` 声明
- 授权：标准 Web 安全实践，Token 通过 HTTP Header 传递，不嵌入 A2A 协议消息本身
- **不透明执行**（Opaque Execution）：agent 协作时不暴露内部状态、记忆或工具实现

## 技术规范结构

协议分三层：
- **Layer 1 数据模型**：Task、Message、AgentCard、Part、Artifact、Extension（Protocol Buffer 定义，`.proto` 为规范源文件）
- **Layer 2 抽象操作**：Send/Stream/Get/List/Cancel/Subscribe（与绑定无关）
- **Layer 3 协议绑定**：JSON-RPC 2.0（主）、gRPC、HTTP+JSON/REST

当前版本（1.0.0）以 `spec/a2a.proto` 为单一权威规范源，JSON Schema 为构建时生成的非规范产物。

## 生态与 SDK

官方 SDK（多语言）：Python、JavaScript、Java、C#/.NET、Go

支持框架集成：LangGraph、CrewAI、Semantic Kernel、Google ADK

## 关键洞察

1. **agent 不是工具**：工具调用是单向、无状态的；agent 通信需要多轮协商、状态跟踪、异步委派。A2A 的设计哲学是让 agent 以"代理人"身份交互，而不是退化成工具调用。

2. **已有标准的组合**：A2A 不重新发明轮子——HTTP、JSON-RPC 2.0、SSE、OAuth 都是已有标准。协议价值在于定义 agent 交互的语义层，而不是底层通信机制。

3. **企业级设计**：push notification、断线重连、cursor-based 分页、opaque execution 都明确指向企业生产环境需求，而非研究原型。

4. **与 Agent OS 的关系**：A2A 可视为 agent 生态的"网络层"——类比 TCP/IP 使不同操作系统的计算机可以通信，A2A 使不同框架的 agent 可以通信。这与 [agent-os](../concepts/agent-os.md) 中讨论的 agent 基础设施层相呼应。

## 相关页面

- [a2a-protocol](../concepts/a2a-protocol.md) — 协议核心概念综述
- [agent-card](../concepts/agent-card.md) — Agent Card 能力发现机制
- [task-lifecycle](../concepts/task-lifecycle.md) — Task 状态机与生命周期
- [agent-interoperability](../concepts/agent-interoperability.md) — 跨框架 agent 互操作
- [google](../entities/google.md) — 协议原始开发者
- [linux-foundation](../entities/linux-foundation.md) — 当前协议托管方
- [mcp](../entities/mcp.md) — 与 A2A 互补的 agent-to-tool 协议
- [agentic-systems](../concepts/agentic-systems.md) — agent 系统总论
- [agent-os](../concepts/agent-os.md) — agent 基础设施层

## References

- `sources/google-a2a-protocol.md`
- https://a2aproject.github.io/A2A/latest/
- https://a2aproject.github.io/A2A/latest/topics/what-is-a2a/
- https://a2aproject.github.io/A2A/latest/topics/key-concepts/
- https://a2aproject.github.io/A2A/latest/specification/
