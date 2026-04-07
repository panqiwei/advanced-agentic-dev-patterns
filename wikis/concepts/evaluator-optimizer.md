# Evaluator-Optimizer（评估器-优化器）

## 定义

一个 LLM 生成响应，另一个 LLM 提供评估和反馈，循环迭代。类似人类作家的反复修改过程。

## 适用场景

两个条件同时满足：
1. 有清晰的评估标准
2. 迭代改进能产生可衡量的价值提升

关键信号：人类给出反馈时 LLM 的输出确实能改善，且 LLM 本身能提供这种质量的反馈。

**典型用例**：
- 文学翻译：译者 LLM 可能遗漏细微之处，评估者 LLM 提供有用的批评
- 复杂搜索：需要多轮搜索和分析，评估者决定是否需要进一步搜索

## 在 agentic 系统中的位置

属于 [agentic systems](agentic-systems.md) 中的 workflow 模式。本质上是一个 GAN 式的生成-判别循环。与自主 agent 的区别：evaluator-optimizer 的角色（生成者、评估者）是固定的，agent 的行为是自主涌现的。

## GAN 式 Generator-Evaluator 的工程实践

Anthropic 在 [harness 设计实践](../sources/anthropic-harness-design-long-running-apps.md) 中将此模式推向了工程化：

### Self-evaluation problem

Agent 评估自己产出时天然偏向乐观——即使质量明显中等，也会自信地给予好评。这在主观任务（如设计）中尤为突出，但在有客观标准的任务中也存在。**将评估者分离为独立 agent 后，调校其严格程度远比让生成者自我批评更可行。**

### 评估标准操作化

将主观判断转化为可评分维度（design quality、originality、craft、functionality），用 few-shot 示例校准评估者的判断标准。关键：权重刻意偏向模型默认薄弱的维度（如 originality），而非已擅长的维度（如 craft）。

### Sprint contracts

Generator 和 Evaluator 在每轮工作前协商"完成标准"，将高层 spec 细化为可测试的具体条件。这在 [feature tracking](feature-tracking.md) 的基础上增加了双方协商的维度。

### 评估者的边际价值

Evaluator 的必要性取决于任务是否在当前模型能力边界上。模型越强，evaluator 的边际价值越集中在边界案例。但对于超出模型可靠范围的任务，evaluator 仍然是关键的质量保障。

## 相关概念

- [Harness engineering](harness-engineering.md) — evaluator-optimizer 是 harness 中的质量反馈回路
- [Feature tracking](feature-tracking.md) — sprint contracts 建立在 feature tracking 之上

## References

- `sources/anthropic_official/building-effective-agents.md`
- `sources/anthropic_official/harness-design-long-running-apps.md`
