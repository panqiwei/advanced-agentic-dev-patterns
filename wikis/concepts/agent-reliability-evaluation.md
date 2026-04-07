# Agent Reliability Evaluation（Agent 可靠性评估）

## 定义

Agent 可靠性评估是衡量 LLM agent 在重复运行、不同时长、不同领域任务上**一致表现**的方法论。与能力评估（pass@1）互补但独立——一个模型可以有很高的能力但很低的可靠性。

## 为什么 pass@1 不够

pass@1 衡量的是"在一次最佳尝试中能否完成"，这是**能力**问题。生产部署需要回答的是**可靠性**问题——agent 被反复调用、面对不同复杂度的任务时，能否一致地成功。

tau-bench 的经典数据：GPT-4o pass@1 = 61%，pass^8 = 25%。连跑 8 次全对的概率只有四分之一。

[Beyond pass@1](../sources/beyond-pass-at-1-reliability-framework.md) 进一步证明：pass@1 在所有 10 个测试模型上高估可靠性 20-40%，且差距随任务时长增大。

## 四指标框架

| 指标 | 衡量什么 | 层面 |
|------|---------|------|
| RDC（可靠性衰减曲线） | pass^k 随时长怎么变 | 群体级可靠性 |
| VAF（方差放大因子） | 时长是否放大结果波动 | 群体级可靠性 |
| GDS（优雅退化评分） | 失败时完成了多少 | 个体失败质量 |
| MOP（熔断起始点） | 何时行为崩溃 | 轨迹动态 |

四个指标互补：RDC 和 VAF 刻画模型在任务群体上的可靠性轮廓，GDS 刻画单次失败的质量，MOP 刻画失败轨迹的动态特征。

### VAF 的反直觉解读

高 VAF（>= 2.37）是**能力标志**：模型在长任务上有时成功有时失败，产生高方差。低 VAF（<= 1.26）意味着模型在长任务上稳定地失败——方差反而小。

实践意义：选择长时部署的模型时，应优先选择**同时具备高 pass@1 和高 VAF** 的模型。

### MOP 悖论

前沿模型熔断率最高（DeepSeek V3 超长任务 19%，MiniMax M2.5 13%），因为它们尝试更激进的多步策略。弱模型走保守路线，不会熔断但也完不成任务。

MOP 的正确用法：不是终止信号，而是 **context reset 触发器**。检测到熔断时保存进度、重置 context、从检查点继续——这样既中断了失控的探索，又保留了已完成的部分。

## 与先行工作的关系

| 工作 | 模型数 | 时长维度 | 方差 | 部分得分 |
|------|--------|---------|------|---------|
| tau-bench | 6 | 无 | pass^k | 无 |
| ReliabilityBench | 2 | 无 | 有 | 无 |
| METR | 3 | 有 | 无 | 无 |
| Beyond pass@1 | 10 | 有 | 有 | GDS |

Beyond pass@1 是首个同时覆盖多模型、多时长、方差感知、部分得分的可靠性评估框架。

## 记忆脚手架的反面教训

论文的一个重要实践发现：给 agent 加 episodic memory（便签本）在长任务上**全线失败**——10 个模型中 6 个变差、4 个中性、0 个改善。便签占步数、占 context，代价超过收益。

这挑战了"长任务就该加记忆"的默认假设。记忆不应该作为默认配置，而应该在校准 overhead-vs-benefit 后按需启用。

## 与其他概念的关系

- [可靠性衰减](reliability-decay.md) — 评估框架的核心对象
- [长时运行 agent](long-running-agents.md) — 可靠性评估在长时场景下最关键
- [Harness engineering](harness-engineering.md) — 评估结果指导 harness 设计（任务分解、MOP 检测、记忆策略）
- [Guardrails](guardrails.md) — MOP 可作为运行时 guardrail
- [Evaluator-optimizer](evaluator-optimizer.md) — GDS 可作为 evaluator 的评估维度

## References

- `sources/arxiv_papers/2603.29231-beyond-pass-at-1-reliability-science-framework.md`
