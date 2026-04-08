# Google

AI 研究与产品公司，Agent2Agent (A2A) 协议的原始开发者，Google DeepMind、Agent Development Kit (ADK) 的背后推动者。

## 在本 Wiki 中的角色

Google 是 [A2A 协议](../concepts/a2a-protocol.md)的发起方。A2A 于 2024 年由 Google 主导开发，随后捐赠给 [Linux Foundation](linux-foundation.md) 以中立化治理，确保生态多方参与。

## 主要贡献

- **A2A Protocol**：开放的 agent 跨框架通信标准，处理 agent-to-agent 通信层
- **Agent Development Kit (ADK)**：Google 的 agent 开发工具包，与 A2A 配合使用（A2A 是协议层，ADK 是框架层）
- **Gemini**：底层大语言模型，ADK 默认优化目标

## 在 Agent 技术栈中的布局

Google 在 agent 技术栈的多个层次都有布局：

| 层次 | Google 产品 |
|---|---|
| 模型层 | Gemini |
| 框架层 | ADK（Agent Development Kit） |
| 工具层 | MCP 生态兼容 |
| 通信层 | A2A Protocol |

这是 Google 构建完整 agent 基础设施的战略布局，同时通过开放 A2A 标准吸引生态参与。

## 相关概念

- [A2A Protocol](../concepts/a2a-protocol.md) — Google 主导开发的跨框架通信标准
- [Agent Interoperability](../concepts/agent-interoperability.md) — A2A 解决的核心问题
- [Agent Card](../concepts/agent-card.md) — A2A 的能力发现机制

## References

- `sources/google-a2a-protocol.md`
- [Google A2A 官方文档](../sources/google-a2a-protocol.md)
