# Task Lifecycle — A2A 任务状态机

A2A 协议中 Task 的状态机定义。Task 是 A2A 最核心的工作单元——有唯一 ID、明确的状态转移路径、对长时运行操作（LRO）的原生支持。

## 状态机

```
                 ┌─────────────┐
      初始提交    │  submitted  │ ← 任务已接收，排队等待处理
                 └──────┬──────┘
                        │
                 ┌──────▼──────┐
                 │   working   │ ← agent 正在处理
                 └──────┬──────┘
                        │
           ┌────────────┼────────────┐
           ▼            ▼            ▼
   ┌───────────────┐  ┌───────────┐  ┌──────────────┐
   │input-required │  │ completed │  │    failed    │
   └───────┬───────┘  └───────────┘  └──────────────┘
           │  ↑ client 提供更多信息
           │
     ┌─────▼──────┐
     │  canceled  │ ← client 主动取消
     └────────────┘

   ┌────────────┐
   │  rejected  │ ← server 拒绝接受任务（权限、能力不匹配等）
   └────────────┘
```

**终态**（terminal states）：`completed`、`failed`、`canceled`、`rejected`

进入终态后，Task 不再接受新的 message；对已完成 Task 发送 message 会返回 `UnsupportedOperationError`。

## 状态含义

| 状态 | 含义 | 行动方 |
|---|---|---|
| `submitted` | 任务已接收，等待处理 | server |
| `working` | agent 正在执行 | server |
| `input-required` | 需要 client 提供更多信息 | 转交 client |
| `completed` | 任务成功完成，artifacts 可用 | — |
| `failed` | 执行过程中出现不可恢复错误 | — |
| `canceled` | 因 cancelTask 请求而取消 | — |
| `rejected` | server 拒绝接受该任务 | — |

## input-required：人类介入场景

`input-required` 是 A2A 原生支持人类介入（human-in-the-loop）的机制。当 agent 在执行过程中需要澄清、确认或额外信息时，进入此状态并等待 client 发送新 message。

这与 [long-running-agents](long-running-agents.md) 中讨论的"中途挂起"模式直接对应——在 A2A 中，状态机有明确的 `input-required` 状态而不是隐式等待。

## Task 的组成

每个 Task 包含：
- `id`：唯一标识符
- `contextId`：可选，所属会话分组
- `status`：当前状态（含 timestamp）
- `history`：消息历史（可配置返回长度）
- `artifacts`：已生成的产物列表

`historyLength` 参数控制返回的历史消息数量，避免大 payload——这是 [context-management](context-management.md) 思路在协议层的体现。

## 三种状态追踪模式

### 1. 轮询（Polling）
```
POST /sendMessage → 返回 Task (submitted)
  → GET /getTask → 状态变化
  → GET /getTask → completed，artifacts 可用
```

适合简单任务或 client 不需要实时进度的场景。

### 2. 流式订阅（SSE Streaming）
```
POST /sendMessageStream → SSE 连接建立
  → TaskStatusUpdateEvent (working)
  → TaskArtifactUpdateEvent (artifact chunk)
  → TaskStatusUpdateEvent (completed)
  → 连接关闭
```

Server-Sent Events 是单向推送——server 持续推送事件，client 无需轮询。适合需要实时进度反馈的长任务。

### 3. Push Notification（Webhook）
```
POST /createPushNotificationConfig → 注册 webhook URL
  → Client 断开连接
  → 任务完成时，server POST → client webhook
```

适合超长时任务（分钟到小时级别）或 client 无法保持连接的场景。

## 与现有概念的关系

### Task vs. Feature Tracking

[Feature Tracking](feature-tracking.md) 是 harness 内部的状态追踪机制（JSON feature list，防止 premature victory）。Task Lifecycle 是 A2A 协议层的状态追踪，二者处于不同抽象层次，可以配合使用：harness 用 feature tracking 追踪内部进度，用 A2A Task 对外暴露粗粒度状态。

### Task vs. Context Management

[Context Management](context-management.md) 关注 context window 内的状态维护。Task 是跨会话、跨网络边界的状态单元——Task ID 是跨请求持久化的引用句柄，解决了"agent 完成任务后如何让 client 找回结果"的问题。

### Task 与 Long-Running Agents

[Long-Running Agents](long-running-agents.md) 面临的核心挑战：跨多个 context window 的状态持久化。A2A Task 提供了一个标准化的外部状态容器：Task ID 持久存在，agent 可以多次更新其状态和 artifacts，client 可以随时查询。

## References

- `sources/google-a2a-protocol.md`
- [Google A2A 官方文档](../sources/google-a2a-protocol.md)
- [A2A Protocol](a2a-protocol.md)
- [Long-Running Agents](long-running-agents.md)
- [Context Management](context-management.md)
