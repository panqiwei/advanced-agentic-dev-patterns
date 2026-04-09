# 贝叶斯归纳

## 定义

贝叶斯归纳（Bayesian induction）是用贝叶斯概率框架重新表述归纳推理的方案。核心思想：为假说赋予先验概率，观察证据后通过贝叶斯规则更新为后验概率，再据此做出预测。这提供了从观察到预测的数学精确路径——但先验概率的选择引入了不可消除的假设。

## 贝叶斯规则与归纳推理

**贝叶斯规则**：

$$p(H \mid E) = \frac{p(E \mid H) \cdot p(H)}{p(E)}$$

- $p(H)$：先验概率——观察证据前对假说的信念
- $p(E \mid H)$：似然——假说为真时观察到证据的概率
- $p(H \mid E)$：后验概率——观察证据后对假说的更新信念
- $p(E)$：证据的边际概率

**预测分布**：

$$p(E' \mid E) = \sum_{H} p(E' \mid H) \cdot p(H \mid E)$$

这给出了在已有证据 E 的条件下，未来观察 E' 的概率。

## Laplace 的继承规则

经典案例：从瓮中抽球。假设均匀先验，观察到 N 次抽取中 $n_w$ 次为白球，则下一次为白球的概率为：

$$p(w \mid n_w) = \frac{n_w + 1}{N + 2}$$

这就是 Laplace 的"继承规则"（rule of succession, 1814）。即使观察到 100 次中 100 次为白球，下一次为白的概率也只是 101/102 ≈ 0.99——不是 1。归纳结论永远是概率性的。

## 三个核心问题

### 1. 先验概率的地位

先验概率的选择是否是先验的（a priori）？

- **无差别原则**（Principle of Indifference）：无理由偏好时赋予等概率。Laplace 的辩护基础。但 Bertrand 悖论表明，不同的"等概率"划分方式给出矛盾的结果。
- **主观主义**（Ramsey/de Finetti/Savage）：先验反映个人意见或背景知识，没有先验是先天不合理的。放弃了先验辩护的追求。
- **结论**：先验概率的选择正是经验假设进入归纳推理的地方——贝叶斯方案不是纯粹先验的解。

### 2. 概率模型的假设

Bayes-Laplace 论证基于特定的概率模型（如二项分布）。这要求：观察是独立的、存在描述未知比例的参数。这些假设是否适用于"自然的瓮"——即一般的归纳推理？

de Finetti 的交换性定理提供了部分辩护：如果无限观察序列满足交换性（顺序不影响概率），则可表示为仿佛独立抽样。交换性可视为[齐一性原则](../concepts/uniformity-principle.md)的形式化。

### 3. 与 No Free Lunch 定理的关系

机器学习中的 No Free Lunch 定理是[休谟](../entities/david-hume.md)第一角的数学化身：在所有逻辑可能的序列上取均匀分布，任何学习算法的泛化误差期望值为 1/2。

但这不排除**模型相对的**（model-relative）学习保证——给定特定先验和模型假设，贝叶斯算法的收敛性可以被证明。这就是"部分解"：我们无法普遍地辩护归纳，但可以在特定假设下辩护特定的归纳方法。

## 与 LLM/Agent 工程的映射

贝叶斯归纳是理解 LLM 泛化的最精确哲学框架：

- **先验概率 = 归纳偏置**：模型架构（Transformer vs SSM）、预训练数据、超参数选择——都是先验概率的工程化身。没有"无偏"的模型，正如没有"无先验"的贝叶斯推理。
- **后验更新 = 微调/上下文学习**：RLHF、SFT 是对先验的后验更新；in-context learning 是在推理时的实时更新。
- **No Free Lunch = 模型选择的不可回避**：没有在所有任务上最优的模型。[缩放定律](../concepts/scaling-laws.md)给出的规律只在特定分布假设下成立。
- **Laplace 的继承规则 = 模型置信度校准**：观察到的成功率不等于真实可靠性，需要适当的贝叶斯矫正。

## 与本 wiki 其他概念的关系

- **[归纳问题](../concepts/induction-problem.md)**：贝叶斯归纳是最精确的回应方案，但承认只能给出"部分解"
- **[齐一性原则](../concepts/uniformity-principle.md)**：交换性假设是 UP 的概率论形式化
- **[证伪主义](../concepts/falsificationism.md)**：贝叶斯方案量化确认程度，证伪主义只关心否定——两种互补的认识论态度
- **[经验主义](../concepts/empiricism.md)**：先验概率的选择暴露了纯经验主义的局限——某种超经验的假设不可避免
- **[grue 问题](../concepts/grue-problem.md)**：先验概率的选择隐含了对可投射谓词的判断
- **[缩放定律](../concepts/scaling-laws.md)**：缩放定律是一种经验归纳，其可靠性依赖于分布假设的稳定性
- **[可靠性曲面](../concepts/reliability-surface.md)**：多维评估框架可视为对 agent 能力的后验概率估计

## References

- Bayes, Thomas, 1764, "An Essay Towards Solving a Problem in the Doctrine of Chances", *Philosophical Transactions*, 53: 370–418.
- Laplace, Pierre-Simon, 1814, *Essai philosophique sur les probabilités*.
- de Finetti, Bruno, 1964, "Foresight: its logical laws, its subjective sources", in *Studies in subjective probability*, New York: Wiley.
- Sterkenburg, Tom and Peter Grünwald, 2021, "The no-free-lunch theorems of supervised learning", *Synthese*, 199: 9979–10015.
- Stanford Encyclopedia of Philosophy, "The Problem of Induction", Sections 3.3-3.5, https://plato.stanford.edu/entries/induction-problem/
