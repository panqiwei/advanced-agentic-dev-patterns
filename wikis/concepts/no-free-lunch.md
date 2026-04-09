# No Free Lunch 定理

## 定义

No Free Lunch（NFL）定理是机器学习中的一组基础性不可能性结果：在所有逻辑可能的数据序列上取均匀分布，任何学习算法的泛化误差期望值为 1/2——不比随机猜测好（Wolpert 1992, 1996, 1997）。换言之，不存在在所有问题上都优于其他算法的"通用"学习算法。

## 与归纳问题的关系

NFL 定理是[休谟](../entities/david-hume.md)[归纳问题](../concepts/induction-problem.md)第一角的精确数学化身：

- **休谟第一角**：归纳结论的否定不构成矛盾——存在自然进程改变的可能世界。因此先验推理无法建立归纳。
- **NFL 定理**：存在算法失败的数据序列（先验可能的情况）——因此无法先验地论证任何算法的泛化能力。

结构完全同构：两者都表明，在不排除任何可能性的前提下，无法建立从过去到未来的保证。

## 归纳偏置的不可回避

NFL 定理的直接推论：有效的学习算法必须具有"归纳偏置"（inductive bias）——关于问题域的先验假设，限制了搜索空间（Mitchell 1997）。

这在哲学上等价于承认：

- 归纳推理不可能是"纯数据驱动的"——必须有某种超经验的假设
- [贝叶斯方案](../concepts/bayesian-induction.md)中的先验概率选择 = 学习算法中的归纳偏置
- [齐一性原则](../concepts/uniformity-principle.md)的具体化 = 对训练分布与测试分布关系的假设

## 模型相对辩护

NFL 排除的是**普遍的、模型无关的**辩护。但**模型相对的**（model-relative）学习保证仍然可能：

- 给定特定先验和模型假设，贝叶斯算法的收敛性可被证明
- PAC 学习理论给出在特定假设类上的样本复杂度保证
- 形式学习理论证明特定方法在特定假设空间中最优收敛

这就是哲学上的"部分解"——不是证明归纳总是可靠，而是证明在特定假设下的特定归纳方法是最优的。

## 与本 wiki 其他概念的关系

- **[归纳问题](../concepts/induction-problem.md)**：NFL 是归纳问题的数学形式化
- **[贝叶斯归纳](../concepts/bayesian-induction.md)**：NFL 解释了为什么先验概率不可回避
- **[齐一性原则](../concepts/uniformity-principle.md)**：归纳偏置是 UP 的工程化身
- **[缩放定律](../concepts/scaling-laws.md)**：缩放定律的预测力依赖于特定的分布假设，NFL 提醒我们这些假设可能失效
- **[误差级联](../concepts/error-cascade.md)**：多步推理中每步的归纳偏置不匹配会被级联放大

## References

- Wolpert, D. H., 1996, "The lack of a priori distinctions between learning algorithms", *Neural Computation*, 8: 1341–1390.
- Wolpert, D. H., 1997, "No free lunch theorems for optimization", *IEEE Transactions on Evolutionary Computation*, 1: 67–82.
- Mitchell, Tom, 1997, *Machine Learning*, McGraw-Hill.
- Sterkenburg, Tom and Peter Grünwald, 2021, "The no-free-lunch theorems of supervised learning", *Synthese*, 199: 9979–10015.
- Stanford Encyclopedia of Philosophy, "The Problem of Induction", Section 3.4, https://plato.stanford.edu/entries/induction-problem/
