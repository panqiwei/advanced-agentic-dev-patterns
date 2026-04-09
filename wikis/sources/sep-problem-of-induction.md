# SEP: The Problem of Induction

## 来源信息

- **标题**: The Problem of Induction
- **来源**: Stanford Encyclopedia of Philosophy
- **路径**: `sources/sep-problem-of-induction.md`
- **URL**: https://plato.stanford.edu/entries/induction-problem/
- **发表**: 2018-03-21（2022-11-22 修订）

## 结构化摘要

这篇 SEP 条目系统梳理了归纳问题的完整哲学版图——从休谟 1739 年的原始论证到 21 世纪的元归纳策略。

### 休谟的原始论证

归纳推理的形式：「所有观察到的 A 都是 B → 下一个 A 也将是 B」。休谟论证这种推理无法获得理性辩护：

- **第一角**（演示性论证失败）：归纳结论的否定不构成矛盾——自然进程完全可能改变。先验推理无法建立[齐一性原则](../concepts/uniformity-principle.md)。
- **第二角**（概率论证循环）：任何经验论证都预设了齐一性原则本身，构成恶性循环。

休谟的解答：归纳推理不由理性驱动，而由[习惯](../concepts/custom-and-habit.md)驱动——一种自然本能，可能比理性更可靠。

### 主要回应路线

**攻击第一角——先验辩护方案：**

1. **康德的综合先验**：经验本身依赖于因果范畴，可通过先验论证获得因果知识
2. **法则-解释方案**（Armstrong/BonJour/Foster）：最佳解释推理（IBE）可先验辩护归纳——观察到的规则性需要法则性解释
3. **[贝叶斯方案](../concepts/bayesian-induction.md)**：概率论提供从证据到预测的先验计算，但先验概率的选择引入经验假设
4. **组合方案**（Williams/Stove）：比例三段论 + 大数定律，但最后一步犯了概率推理谬误

**攻击第二角——经验辩护方案：**

5. **归纳的归纳辩护**：规则循环可能并非恶性循环——[演绎推理同样无法非循环地自我辩护](../concepts/rule-circularity.md)
6. **无规则方案**（Norton/Okasha）：归纳推理没有共同规则，各自依赖不同的经验预设——循环变为回归

**替代辩护标准：**

7. **维特根斯坦的铰链**：齐一性原则是探究的"铰链"，不需要进一步辩护
8. **日常语言消解**（Strawson）：符合归纳标准就是"合理"的意思
9. **实用辩护**（Reichenbach）：即使不知归纳是否可靠，它是成功的必要条件——值得一试
10. **形式学习理论**：目的-手段认识论，奥卡姆剃刀可被证明是最高效的收敛策略

**接受归纳怀疑论：**

11. **[证伪主义](../concepts/falsificationism.md)**（[Popper](../entities/karl-popper.md)）：科学不依赖归纳而依赖证伪，但"佐证"概念暗中重引归纳
12. **[元归纳](../concepts/meta-induction.md)**（Schurz）：不在对象层面辩护归纳，而在元层面证明追随最成功方法的策略是最优的

### [古德曼的新归纳之谜](../concepts/grue-problem.md)

即使承认归纳有效，哪些归纳是合法的？「绿蓝」谓词表明：同一组观察数据可支持互相矛盾的归纳结论。这揭示了休谟论证的一个空白——他从未解释我们为何投射某些谓词而非其他谓词。

### No Free Lunch 定理

机器学习中的形式化版本：在所有逻辑可能的序列上取均匀分布，任何学习算法的泛化误差期望值为 1/2——不比随机猜测好。这是休谟第一角的数学化身。但模型相对（model-relative）的学习保证仍然可能。

## 关键洞见

1. **归纳问题是 300 年前版本的「模型泛化问题」**：你的 LLM 在训练数据上发现了模式——为什么它应该在生产环境中成立？休谟的论证结构与 No Free Lunch 定理完全同构。
2. **先验概率 = 归纳偏置**：贝叶斯方案中先验概率的选择，等价于机器学习中归纳偏置（inductive bias）的选择——没有免费午餐，必须做出某种假设。
3. **模型相对辩护 = 部分解**：我们无法证明学习算法在所有情况下可靠，但可以证明它在特定模型假设下收敛。这正是贝叶斯定理的意义。
4. **证伪主义的工程化身是测试驱动开发**：不试图证明代码正确，而是试图证伪它。

## 与现有来源的交叉引用

- **[sep-david-hume](sep-david-hume.md)**：本条目深度展开休谟在该综述中简述的归纳问题论证
- **[sep-aristotle-causality](sep-aristotle-causality.md)**：亚里士多德的四因说提供了前休谟的因果性框架，归纳问题正是对这种框架的根本质疑
- **[sep-causation-metaphysics](sep-causation-metaphysics.md)**：因果关系形而上学的五大理论都以不同方式回应归纳问题——规则性理论直接继承休谟，干预主义试图绕过

## References

- Stanford Encyclopedia of Philosophy, "The Problem of Induction", https://plato.stanford.edu/entries/induction-problem/
