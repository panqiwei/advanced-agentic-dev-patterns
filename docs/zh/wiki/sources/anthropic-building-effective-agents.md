# Building Effective AI Agents

- **来源**: `sources/anthropic_official/building-effective-agents.md`
- **URL**: https://www.anthropic.com/research/building-effective-agents
- **作者**: Erik Schluntz, Barry Zhang (Anthropic)
- **发布**: 2024-12-20

## 摘要

Anthropic 基于与数十个客户团队合作构建 LLM agent 的经验总结。核心论点：最成功的实现不依赖复杂框架，而是用简单、可组合的模式构建。文章区分了 **workflows**（预定义代码路径编排 LLM）和 **agents**（LLM 动态指挥自身流程），并系统梳理了五种 workflow 模式和一种 agent 模式。

## 关键要点

1. **从简单开始**。只在有证据表明复杂度能改善结果时才增加复杂度。单次 LLM 调用 + 检索 + 上下文示例通常已经够用。
2. **基础构建块是增强型 LLM**（augmented LLM）：检索、工具、记忆三项增强能力，通过 MCP 等协议标准化接口。
3. **五种 workflow 模式**：
   - [Prompt chaining](../concepts/prompt-chaining.md) — 任务分解为顺序步骤，中间可加检查门
   - [Routing](../concepts/routing.md) — 输入分类后导向专门化处理
   - [Parallelization](../concepts/parallelization.md) — 并行处理（sectioning 分段 + voting 投票）
   - [Orchestrator-workers](../concepts/orchestrator-workers.md) — 中央 LLM 动态分解任务、分发、综合
   - [Evaluator-optimizer](../concepts/evaluator-optimizer.md) — 生成-评估循环迭代
4. **Agent 适用场景**：开放式问题、步骤数不可预测、需要自主决策。代价是更高成本和错误累积风险。
5. **ACI（Agent-Computer Interface）设计**与 HCI 同等重要。工具定义要像写给初级开发者的文档一样清晰。

## 与其他 source 的关联

- 本文是 Anthropic 官方 agent 架构模式总览，后续的 [harness 系列文章](anthropic-effective-harnesses-long-running-agents.md) 深入讨论了长时运行场景下的 harness 设计。
- [Claude Agent SDK](../entities/claude-agent-sdk.md) 是本文推荐的实现框架。

## References

- `sources/anthropic_official/building-effective-agents.md`
