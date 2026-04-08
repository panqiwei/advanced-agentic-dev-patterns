# Anthropic

AI 安全公司，Claude 系列模型的开发者。

## 与本 wiki 的关联

Anthropic 是本项目最主要的参考来源之一。其关于 agent 构建的官方文档定义了许多核心概念：

- [Agentic systems](../concepts/agentic-systems.md) 的 workflows vs agents 分类
- [Augmented LLM](../concepts/augmented-llm.md) 作为基础构建块
- 五种 workflow 模式的系统化梳理
- [ACI](../concepts/aci.md) 的概念和设计原则
- Harness engineering 的实践方法论

## 相关实体

- [Claude Agent SDK](claude-agent-sdk.md) — Anthropic 的 agent 开发框架
- [MCP](mcp.md) — Anthropic 主导的模型上下文协议

## 可解释性研究

Anthropic 在 mechanistic interpretability 方面是业界领先者：

- [Circuit Tracing](../sources/anthropic-circuit-tracing-methods.md) — 归因图方法论
- [Biology of a LLM](../sources/anthropic-biology-large-language-model.md) — Claude 3.5 Haiku 内部机制的系统性研究
- [Introspective Awareness](../sources/anthropic-emergent-introspective-awareness.md) — 模型内省能力研究
- MIT Technology Review 将此列为 [2026 年十大突破技术](../sources/mit-mechanistic-interpretability-2026.md)

## Claude Opus 4.6

[Opus 4.6](../sources/anthropic-introducing-claude-opus-4-6.md) 是截至 2026 年的旗舰模型，首个 Opus 级 1M token context，agent teams、adaptive thinking、effort 控制等产品特性。

## Claude Code

[Claude Code](claude-code.md) 是 Anthropic 的官方 AI 编码 agent CLI，将 Claude 嵌入开发工作流。其[权限系统](../concepts/claude-code-permission-system.md)是生产级 agent 权限管理的参考实现——三级工具分级审批、deny-first 规则语义、五级作用域层次、六种权限模式，以及与 OS 沙箱的双层纵深防御。

## Context Engineering

[Effective Context Engineering](../sources/anthropic-effective-context-engineering.md) 是 Anthropic 对 [context engineering](../concepts/context-engineering.md) 的系统性论述——从 prompt engineering 到 context engineering 的演进、注意力预算与 context rot、just-in-time context 策略、长时任务的三种策略（compaction、structured note-taking、sub-agent 架构）。

## References

- `sources/anthropic_official/building-effective-agents.md`
- `sources/anthropic_official/effective-harnesses-long-running-agents.md`
- `sources/anthropic_official/harness-design-long-running-apps.md`
- `sources/anthropic_official/building-agents-claude-agent-sdk.md`
- `sources/anthropic_official/tracing-thoughts-language-model.md`
- `sources/anthropic_official/introducing-claude-opus-4-6.md`
- `sources/anthropic_official/circuit-tracing-methods.md`
- `sources/anthropic_official/biology-large-language-model.md`
- `sources/anthropic_official/emergent-introspective-awareness.md`
- `sources/anthropic_official/harnessing-claudes-intelligence.md`
- `sources/anthropic_official/effective-context-engineering-for-ai-agents.md`
- `sources/anthropic_official/claude-code-permissions.md`
