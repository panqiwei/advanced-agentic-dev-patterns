# OpenHands

## 简介

OpenHands 是一个开源多 agent 编码平台，使用 CodeActAgent 架构，支持在多个 benchmark 上评估 AI 编码 agent。由 All Hands AI 团队开发和维护。

## 在 SWE-EVO 中的角色

OpenHands 是 [SWE-EVO](../sources/swe-evo.md) 评估中使用的两个 agent 框架之一（另一个是 SWE-agent），配置为 CodeActAgent，最多 100 次迭代。

一个值得注意的发现：某些模型在不同框架上表现差异极大。GLM-5 在 SWE-agent 上 37.5%，在 OpenHands 上仅 8.33%。这说明 agent 能力是模型 x 框架的函数——框架的 prompt 风格和交互模式会显著影响模型表现。

## 与其他框架的对比

| 框架 | 架构 | 特点 |
|---|---|---|
| OpenHands | CodeActAgent | 多 agent 平台，统一行动空间 |
| SWE-agent | 单 agent | 强调 agent-computer interface 设计 |
| [Codex](codex.md) | 隐式循环 | 云端沙箱，双向 JSON-RPC |
| [LangGraph](langgraph.md) | 显式图编排 | StateGraph 定义节点和边 |

## 相关概念

- [Agentic systems](../concepts/agentic-systems.md) — OpenHands 所属的系统类型
- [Implicit loop architecture](../concepts/implicit-loop-architecture.md) — CodeActAgent 的架构范式
- [Harness engineering](../concepts/harness-engineering.md) — 框架即 harness

## References

- `sources/arxiv_papers/2512.18470-swe-evo.md`
