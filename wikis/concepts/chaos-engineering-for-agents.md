# Chaos Engineering for Agents（Agent 混沌工程）

## 定义

将混沌工程（Chaos Engineering）的故障注入方法论应用于 LLM agent 评估：在工具调用层系统性地注入生产环境常见故障（超时、限流、部分响应、schema 漂移），测量 agent 在基础设施不稳定条件下的可靠性退化。

## 来源

灵感来自 Netflix 的 Chaos Monkey 和 Site Reliability Engineering 实践。[ReliabilityBench](../sources/reliabilitybench.md) 首次将这一方法论系统化应用于 agent 评估。

## 故障分类

| 类别 | 故障类型 | 可恢复 | 现实来源 |
|------|---------|--------|---------|
| 网络 | TransientTimeout | 是 | API 延迟尖峰 |
| 网络 | ConnectionReset | 是 | 负载均衡器 |
| 限流 | SoftRateLimit | 是 | 429 响应 |
| 限流 | HardRateLimit | 否 | 账户暂停 |
| 数据 | PartialResponse | 是 | 截断 payload |
| 数据 | SchemaDrift | 否 | API 版本不匹配 |
| 数据 | StaleData | 否 | 缓存不一致 |

## 故障注入机制

故障注入器包裹工具执行层。每次工具调用时，按故障概率 λ 决定是否注入故障：
- 可恢复故障：返回错误信息，agent 可重试
- 不可恢复故障：返回被篡改的响应数据，agent 看不出出了问题

强度分级：λ=0.1（5-10% 失败），λ=0.2（15-20%），λ=0.3（25-30%）。

## 关键实验发现

1. **Rate limiting 杀伤力最大**：在消融实验中，纯限流故障的通过率（93.75%）比混合故障基线（96.25%）低 2.5%，说明 agent 普遍缺乏退避重试逻辑
2. **瞬态超时处理良好**：98.75% 通过率，说明基本的重试机制有效
3. **容错退化比鲁棒性更陡**：∂R/∂λ 的绝对值大于 ∂R/∂ε
4. **简单架构容错更好**：ReAct 故障恢复率 80.9%，Reflexion 仅 67.3%——反思机制在错误观察上建立的"教训"反而误导后续行为

## 与其他概念的关系

- 是 [guardrails](guardrails.md) 的测试对偶：guardrails 防御故障，混沌工程主动制造故障来验证防御是否有效
- 结果支持 [harness engineering](harness-engineering.md) 的核心主张：容错逻辑应放在 harness 层（重试、降级、超时兜底），而非 agent 的推理链
- 提供 [可靠性曲面](reliability-surface.md) λ 维度的测量方法
- 与 [error cascade](error-cascade.md) 呼应：故障注入本质是人为制造级联的起点，观察级联如何展开

## References

- Gupta, A. (2026). ReliabilityBench: Evaluating LLM Agent Reliability Under Production-Like Stress Conditions. arXiv:2601.06112.
