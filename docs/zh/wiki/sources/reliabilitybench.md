# ReliabilityBench: Evaluating LLM Agent Reliability Under Production-Like Stress Conditions

- **来源**: `sources/arxiv_papers/2601.06112-reliabilitybench.md`
- **URL**: https://arxiv.org/abs/2601.06112
- **作者**: Aayush Gupta
- **发表**: arXiv, 2026-01-03
- **参考笔记**: [reliabilitybench.org](reliabilitybench.org)

## 摘要

ReliabilityBench 是首个系统性评估 LLM agent 在生产级压力下可靠性的基准。核心创新是三维评估框架——[可靠性曲面](../concepts/reliability-surface.md) R(k, ε, λ)，同时捕获一致性（重复执行）、鲁棒性（任务扰动）和容错性（基础设施故障）三个维度的退化特征。

## 关键发现

1. **扰动造成 8.8% 退化**：baseline 96.88% pass@1 在 ε=0.2 扰动下降至 88.12%。这些扰动对人类几乎无感（同义词替换、语序调整、干扰信息注入）
2. **简单架构更抗压**：ReAct 的可靠性曲面体积（0.900）高于 Reflexion（0.875），差距在压力下扩大。Reflexion 的反思机制在故障场景下反而放大错误——恢复率 67.3% vs ReAct 80.9%
3. **容错性退化比鲁棒性更陡**：λ 维度的退化梯度高于 ε 维度。Rate limiting 是杀伤力最大的单一故障类型（比混合基线低 2.5%）
4. **成本与可靠性脱钩**：GPT-4o 成本是 Gemini 2.0 Flash 的 82 倍，可靠性仅差 0.6%

## 方法论创新

### 可靠性曲面 R(k, ε, λ)

将 agent 可靠性从单一数字拓展为三维评估曲面。详见 [可靠性曲面](../concepts/reliability-surface.md)。

### Action Metamorphic Relations

借鉴蜕变测试，将判等锚点从输出文本下沉到系统终态（[动作蜕变关系](../concepts/action-metamorphic-relations.md)）。

### Chaos Engineering for Agents

将混沌工程引入 agent 评估：超时、限流、部分响应、schema 漂移等故障注入（[agent 混沌工程](../concepts/chaos-engineering-for-agents.md)）。

## 实验规模

- 4 个领域（日程、旅行、客服、电商），25+ 工具
- 2 个模型（Gemini 2.0 Flash、GPT-4o），2 个架构（ReAct、Reflexion）
- 1,280 episodes 覆盖完整 3D 可靠性曲面
- 状态验证基于确定性断言，非 LLM 判分

## 与其他来源的联系

- 扩展了 τ-bench 的 pass^k 概念至多维度框架
- "复杂度在压力下是负债"的发现与 [error cascade](../concepts/error-cascade.md) 中的耦合放大效应一致
- 容错逻辑应放在 harness 层而非 agent 推理链——与 [harness engineering](../concepts/harness-engineering.md) 的核心主张呼应
- fault injection 可视为 [guardrails](../concepts/guardrails.md) 的测试对偶：guardrails 防御故障，chaos engineering 主动制造故障以验证防御

## References

- Gupta, A. (2026). ReliabilityBench: Evaluating LLM Agent Reliability Under Production-Like Stress Conditions. arXiv:2601.06112.
