# Agent Card — Agent 能力发现机制

A2A 协议中 agent 的"数字名片"，JSON 格式元数据文档，发布于标准化端点 `/.well-known/agent-card`。Agent Card 是 A2A 能力发现（discovery）机制的核心载体，让 client agent 在与 remote agent 通信前能够了解对方的身份、能力和认证要求。

## 问题背景

多 agent 系统中，一个 client agent 在委派任务给 remote agent 前需要知道：
- 这个 agent 能做什么？擅长什么？
- 向哪个 URL 发请求？
- 需要什么鉴权方式？
- 支持流式传输吗？支持 push notification 吗？

硬编码这些信息会导致紧耦合；Agent Card 提供了运行时可发现的标准化答案。

## Agent Card 的结构

Agent Card 是一个 JSON 文档，核心字段：

| 字段 | 描述 |
|---|---|
| `name` | agent 名称 |
| `description` | agent 描述 |
| `url` | A2A 服务端点（sendMessage 的目标 URL） |
| `capabilities` | 能力声明（streaming、pushNotifications 等布尔标志） |
| `skills` | 技能列表（每项描述 agent 擅长的具体任务类型） |
| `securitySchemes` | 认证要求（OAuth2、OpenID Connect、API Key 等） |
| `extensions` | 自定义协议扩展声明 |

## 发现流程

```
Client Agent
  │
  ├─ GET /.well-known/agent-card
  │    → Remote Agent 返回 Agent Card JSON
  │
  ├─ 解析 securitySchemes
  │    → 向 Auth Server 请求 token（若需要）
  │
  └─ 解析 url
       → 向该 URL 发送 sendMessage / sendMessageStream 请求
```

Agent Card 端点是协议规定的固定路径，client 无需预先知道 agent 的任何信息，只需知道 domain/host 即可完成发现。

## Skills：能力细粒度声明

Agent Card 中的 `skills` 字段允许 agent 声明自己擅长的特定任务类型。这与 [Agent Skills](agent-skills.md)（Anthropic 提出的单 agent 内部能力打包标准）处于不同层次：

- **Agent Skills（Anthropic）**：agent 内部的能力封装，供单个 agent 使用
- **Agent Card skills（A2A）**：agent 对外暴露的能力公告，供 client agent 决策路由

## Capabilities 字段的作用

`capabilities` 是 client 在选择交互模式时的依据：
- `streaming: true` → client 可以使用 `sendMessageStream` + SSE
- `pushNotifications: true` → client 可以注册 webhook，接收异步更新

这实现了运行时能力协商，避免了 client 使用 server 不支持的功能导致报错。

## 与 Agent Discovery 的关系

Agent Card 是 [A2A 协议](a2a-protocol.md) 能力发现（agent discovery）子系统的核心。更广义的发现机制还包括：
- DNS-based 发现（通过 well-known URI 推导）
- 注册表/目录服务（非 A2A 核心，属于生态扩展）

## 关联概念

- [A2A Protocol](a2a-protocol.md) — Agent Card 所属的协议体系
- [Task Lifecycle](task-lifecycle.md) — 发现后的交互流程
- [Agent Interoperability](agent-interoperability.md) — Agent Card 解决的跨框架发现问题
- [MCP](../entities/mcp.md) — 互补协议，MCP 工具发现用 JSON Schema 声明，A2A 用 Agent Card

## References

- `sources/google-a2a-protocol.md`
- [Google A2A 官方文档](../sources/google-a2a-protocol.md)
