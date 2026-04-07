# Reliability Surface（可靠性曲面）

## 定义

可靠性曲面 R(k, ε, λ) 是一个三维评估框架，将 agent 的可靠性从单一数字（pass@1）拓展为一张"地形图"。三个维度分别对应：

- **k（一致性）**：同一任务重复执行 k 次，全部成功的概率（pass^k）
- **ε（鲁棒性）**：任务描述被语义等价但语法不同的方式扰动后的成功率
- **λ（容错性）**：在基础设施故障（超时、限流、数据异常）下的成功率

曲面上每个点 (k, ε, λ) 对应一个通过率。曲面越平坦、越高，agent 越适合生产部署。

## 直觉

想象给一个 agent 做体检。pass@1 只是量了血压——看起来正常（96.9%），但可能血糖（鲁棒性）已经爆表。可靠性曲面是全身体检：三个探针同时扎进去，画出完整的健康画像。

## 派生指标

从曲面可以提取多个实用指标：

- **Surface Volume**：曲面下的体积，单一数字概括整体可靠性
- **Degradation Gradient**：∇R 指向退化最快的方向——告诉你哪个维度最脆弱
- **Critical Threshold**：R 降至可接受水平 θ 以下的临界点

## 实证发现

[ReliabilityBench](../sources/reliabilitybench.md) 的实验（1,280 episodes）显示：

| 条件 | pass^2 率 |
|------|----------|
| Baseline (ε=0, λ=0) | 96.88% |
| 扰动 (ε=0.2, λ=0) | 88.12% |
| 故障 (ε=0, λ=0.2) | 91.0% |
| 双重压力 (ε=0.2, λ=0.2) | 84.0% |

两个维度的退化不是简单相加——双重压力下的退化（12.88%）大于单独退化之和（8.76% + 5.88% = 14.64%），暗示维度之间存在交互效应。

## 与 pass@1 的对比

pass@1 隐含的假设是：跑一次过了就代表这个 agent 靠谱。可靠性曲面直接挑战这个假设——τ-bench 已经证明 pass@1 = 60% 的 agent 可能 pass^5 只有 25%，ReliabilityBench 进一步表明即使 pass@1 ≈ 97%，加压后也可能掉到 84%。

## 与其他概念的关系

- 与 [error cascade](error-cascade.md) 互补：error cascade 解释*为什么*多步任务可靠性下降（耦合放大），可靠性曲面提供*测量*这种下降的框架
- 可用于评估 [harness engineering](harness-engineering.md) 的设计决策：不同 harness 配置在曲面上的表现差异，揭示哪些设计在哪个压力区间先崩溃
- [guardrails](guardrails.md) 的目标是让曲面更平坦——减少压力下的退化

## References

- Gupta, A. (2026). ReliabilityBench: Evaluating LLM Agent Reliability Under Production-Like Stress Conditions. arXiv:2601.06112.
