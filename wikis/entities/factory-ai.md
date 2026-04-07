# Factory.ai

AI 编码 agent 公司，专注于软件工程自动化。

## 与本 wiki 的关联

Factory 在 [上下文压缩](../concepts/context-compression.md) 评估领域提供了重要的实证研究：

- 构建了 probe-based 功能质量评估框架，直接衡量压缩后 agent 的任务继续能力
- 提出**锚定式迭代摘要**（Anchored Iterative Summarization）——通过结构化 section 和增量合并防止信息丢失
- 在 36,000+ 条生产 session 消息上对比了三种压缩策略（Factory、[OpenAI](openai.md)、[Anthropic](anthropic.md)）
- 揭示了 artifact tracking 是所有压缩方法的普遍弱点

## 相关实体

- [OpenAI](openai.md) — 压缩策略对比对象
- [Anthropic](anthropic.md) — 压缩策略对比对象

## References

- `sources/factory-evaluating-context-compression.md`
