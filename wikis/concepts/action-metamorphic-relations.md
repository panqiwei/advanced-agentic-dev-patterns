# Action Metamorphic Relations（动作蜕变关系）

## 定义

Action Metamorphic Relations (Action-MR) 是一种 agent 鲁棒性测试方法：对任务描述施加语义等价的变换，判断 agent 是否产生等价的系统终态。与传统蜕变测试不同，判等的锚点不是输出文本，而是世界状态。

形式化：一个 Action-MR 是一个元组 (φ, ψ)，其中 φ 变换任务描述，ψ 指定期望的状态关系（通常是恒等——终态应该一样）。

## 直觉

"订纽约飞洛杉矶的机票" 和 "我要从纽约出发，目的地洛杉矶" 是同一个任务。agent 走的中间步骤可以完全不同（不同航线到同一目的地），但最终系统里应该有一张确认状态的机票。判等从"你说了什么"下沉到"世界变成了什么样"。

## 扰动类型

[ReliabilityBench](../sources/reliabilitybench.md) 实现了三类扰动：

| 类别 | 变换类型 | 示例 |
|------|---------|------|
| 语言层 | 同义词替换、改写、主被动语态 | "book" → "reserve" |
| 结构层 | 约束重排、指令拆分/合并 | 先说时间后说地点 → 反过来 |
| 上下文层 | 干扰信息注入、中途改口 | 加入无关偏好再取消 |

扰动强度分级：ε=0.1（轻：同义词+日期格式），ε=0.2（中：+干扰+改口+改写）。

## 为什么重要

这个概念把"鲁棒性"从一个模糊的形容词变成了可测量的指标。实验证据：ε=0 时 96.88% 的通过率在 ε=0.2 时降至 88.12%——8.8% 的退化完全由说法变化引起，任务本身没变。

## 与传统蜕变测试的区别

传统蜕变测试（DeepTest、CheckList）判等靠输出一致——图片分类器对旋转后的图片应给出同样标签。Agent 任务的输出是一串工具调用序列，中间路径高度可变，所以锚点必须下沉到终态。这是蜕变测试从分类任务向序列决策任务迁移的关键适配。

## 与其他概念的关系

- 与 [guardrails](guardrails.md) 互补：guardrails 防御异常输入，Action-MR 检验合法输入变体的鲁棒性
- 可用于 [可靠性曲面](reliability-surface.md) 的 ε 维度测量
- 与 [tool design](tool-design.md) 间接相关：工具接口越健壮（防误设计），扰动对终态的影响越小

## References

- Gupta, A. (2026). ReliabilityBench: Evaluating LLM Agent Reliability Under Production-Like Stress Conditions. arXiv:2601.06112.
