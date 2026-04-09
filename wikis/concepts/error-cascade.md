# Error Cascade（误差级联）

## 定义

多步任务中，前一步的小错在后续步骤中被放大，导致整体成功率远低于单步成功率的预期乘积。这不是简单的独立错误累积（那只是概率相乘），而是步骤之间存在耦合放大效应——一步的错误改变了下一步的输入条件，使后续步骤面对的不再是原始问题。

## 量化证据

[SWE-EVO](../sources/swe-evo.md) 提供了最直接的实证：

- GPT-5.2 在 SWE-Bench Verified（单步修复）上达到 72.8%
- 同系列最强模型 GPT-5.4 在 SWE-EVO（多步演进，平均涉及多个 PR）上仅 25%
- 任务涉及的 PR 数量与难度强相关：平均 PR 数从易到难为 1.67 → 3.57 → 6.71 → 14.84
- 64% 的任务在所有模型-框架组合中都未被解决

如果每步独立且成功率 72.8%，三步任务应约 38.6%，五步约 20.3%。实际表现比这更差，说明步骤之间存在额外的耦合放大。

## 机制

### 为什么不是简单的概率相乘

独立概率模型假设每一步面对的都是"正确的前置状态"。但在代码修改中：

1. **接口污染**：第一步改了函数签名但改错了，第二步调用这个函数时面对的是一个"看起来合理但语义错误"的接口
2. **测试遮蔽**：前一步引入的回归错误可能让后续步骤的测试信号变得混乱——agent 分不清哪些失败是自己造成的、哪些是前一步遗留的
3. **上下文偏移**：在 [长时运行](long-running-agents.md) 场景中，前序步骤的错误信息被写入 context，后续推理在污染的上下文上运行

### 与失败模式的关系

SWE-EVO 的 failure mode 分析显示，强模型的主要失败原因是 *指令遵循*（理解歪了需求）。这暗示级联的放大机制之一是：multi-step 需求的语义复杂度本身就比单 issue 高，不只是"多做几步"的问题。

## 对 Harness 设计的意义

误差级联的存在直接决定了 [harness engineering](harness-engineering.md) 中几个关键设计选择：

- **增量推进**：Anthropic 的"每个 session 只做一个 feature"不是保守，是对抗级联的必要策略
- **Checkpoint + rollback**：[Feature tracking](feature-tracking.md) 的价值不只是"记住做了什么"，更是在错误传播前提供恢复点
- **中间验证**：每步之后跑测试，不只是确认"这步对了"，更是在级联形成前截断错误

## 复杂度作为级联放大器

[ReliabilityBench](../sources/reliabilitybench.md) 从另一个角度验证了级联效应：在故障注入条件下，更复杂的 Reflexion 架构（反思→重试）反而比简单的 ReAct 架构退化更快——故障恢复率 67.3% vs 80.9%。机制是：反思层试图从错误的工具返回中提取"教训"，这个教训本身就是错误的，然后用错误教训指导下一步。这与 SWE-EVO 中的"上下文偏移"是同一种模式：推理链越长，链上任意一环被扰动击穿后的放大效应越强。

可靠性曲面的退化梯度也印证了这一点：容错维度（∂R/∂λ）的退化比鲁棒性维度（∂R/∂ε）更陡，说明基础设施故障比输入扰动更容易触发级联。

## 因果模型视角

误差级联的结构可以用 [结构因果模型](structural-causal-model.md) 精确描述：多步任务中每一步的输出作为下一步的输入，形成 [因果 DAG](causal-dag.md) 的链式结构 Step₁ → Step₂ → Step₃ → ...。级联的放大效应来自链条中的非线性耦合——前一步的错误不仅改变下一步的输入值，还可能改变下一步面对的问题结构本身。

[do 演算](do-calculus.md) 的后门准则提供了理解中间验证价值的另一个视角：在级联链条中的某个节点施加 do 操作（checkpoint + 修正），等价于切断该节点之前所有错误的因果传播路径。

## 相关概念

- [Long-running agents](long-running-agents.md) — 最容易遭遇误差级联的场景
- [Harness engineering](harness-engineering.md) — 对抗级联的系统性手段
- [Feature tracking](feature-tracking.md) — 提供级联截断点
- [Evaluator-optimizer](evaluator-optimizer.md) — 中间验证回路
- [Context management](context-management.md) — 防止上下文被错误信息污染
- [可靠性曲面](reliability-surface.md) — 测量级联导致的多维退化
- [Agent 混沌工程](chaos-engineering-for-agents.md) — 人为制造级联起点，观察传播路径
- [结构因果模型](structural-causal-model.md) — 级联的形式化框架
- [因果 DAG](causal-dag.md) — 级联传播路径的图论表示

## References

- `sources/arxiv_papers/2512.18470-swe-evo.md`
- `sources/arxiv_papers/2601.06112-reliabilitybench.md`
- `sources/wikipedia-causal-model.md`
