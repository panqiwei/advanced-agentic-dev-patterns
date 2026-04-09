# 齐一性原则

## 定义

齐一性原则（Uniformity Principle, UP）是归纳推理所预设的核心假设：「未来将与过去相似」，或者更一般地，「未经观察的事例将与已观察的事例相似」。休谟论证表明，这一原则既不能通过演示性推理证明（其否定不构成矛盾），也不能通过概率推理确立（会构成循环论证）。

## 在休谟论证中的角色

休谟的论证结构是一个二难推理，齐一性原则处于核心位置：

1. 归纳推理 I 预设 UP（前提 P2）
2. 演示性论证无法建立 UP——自然进程改变不构成矛盾（第一角）
3. 概率论证预设 UP 本身——循环（第二角）
4. 因此没有论证可以支持 UP（结论 C3）
5. 因此归纳推理没有理性基础（结论 C5）

## 对 UP 的质疑

多位哲学家质疑 UP 在休谟论证中是否真的不可或缺：

- **Okasha/Sober**：休谟犯了量词换位谬误——应该说"每个归纳推理有某个预设"，而非"存在一个所有归纳推理共享的预设"。不同的归纳推理依赖不同的经验前提。
- **Norton**：归纳推理是"实质的"（material），没有形式上的共同规则。
- **交换性**（de Finetti）：交换性假设——观察的顺序不影响概率分配——可视为 UP 的自然形式化。

## 与 LLM/Agent 工程的映射

齐一性原则在 AI 系统中的对应：

- **训练分布 = 测试分布**：机器学习的核心假设——训练数据的分布与生产数据相同。这就是 UP 的技术化身。
- **分布漂移**：当 UP 失效时——生产环境的数据分布偏离训练分布——模型性能崩溃。
- **[context rot](../concepts/context-rot.md)**：长 context 中早期信息的可靠性假设——假设早期 token 的语义在整个 context 中保持一致。

## 与本 wiki 其他概念的关系

- **[归纳问题](../concepts/induction-problem.md)**：UP 是归纳问题的核心预设
- **[因果性（休谟）](../concepts/causation-hume.md)**：因果推理依赖 UP 来桥接过去与未来
- **[恒常连结](../concepts/constant-conjunction.md)**：UP 是从恒常连结推向未来预测的桥梁
- **[习惯](../concepts/custom-and-habit.md)**：休谟的解答——UP 本身是习惯的产物
- **[grue 问题](../concepts/grue-problem.md)**：即使接受 UP，也需要决定沿哪个方向"统一"

## References

- Stanford Encyclopedia of Philosophy, "The Problem of Induction", Sections 1-2, https://plato.stanford.edu/entries/induction-problem/
