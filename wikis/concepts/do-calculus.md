# do 演算（do-Calculus）

do 演算是 [Judea Pearl](../entities/judea-pearl.md) 提出的一套完备的形式化规则系统，用于在 [因果 DAG](causal-dag.md) 上将包含干预算子 do(·) 的因果表达式转换为纯观察表达式。这使得因果效应可以从观察数据中估计，而无需实际进行实验干预。

## do 算子

do(X=x) 表示对变量 X 的外部干预——将 X 的值强制设为 x。与条件化（观察 X=x）的根本区别在于：

- **条件化 P(Y|X=x)**: "在观察到 X=x 的情况下，Y 的分布是什么？"——被动观察
- **干预 P(Y|do(X=x))**: "如果我将 X 的值设为 x，Y 的分布会怎样变化？"——主动操作

在 [结构因果模型](structural-causal-model.md) 中，do(X=x) 等价于修改模型：删除所有指向 X 的箭头，将 X 固定为 x，然后计算 Y 的分布。Pearl 称之为对模型的"微型手术"（mini-surgery）。

## 三条规则

do 演算包含三条规则，分别处理不同的图结构：

### 规则 1：观察的添加/删除

P(Y|do(X), Z, W) = P(Y|do(X), Z)

条件：在删除所有指向 X 的箭头后，Z 阻断了 W 到 Y 的所有路径。

含义：在干预 X 的情况下，如果 W 对 Y 的信息被 Z 完全屏蔽，则 W 可以安全忽略。

### 规则 2：干预与观察的互换

P(Y|do(X), Z) = P(Y|X, Z)

条件：Z 满足后门准则（即 Z 阻断了 X 到 Y 的所有后门路径）。

含义：当混淆已被控制时，干预等价于观察。这是后门调整公式的理论基础。

### 规则 3：干预的删除

P(Y|do(X)) = P(Y)

条件：不存在从 X 到 Y 的因果路径。

含义：如果 X 对 Y 没有因果影响，干预 X 不改变 Y 的分布。

## 完备性

do 演算是**完备的**——它可以推导出所有为真的因果等式。存在多项式时间算法可以判断给定模型中某个因果查询是否可以从观察数据中估计（即 do 表达式是否可以被完全消除）。

## 应用场景

- **流行病学**: 在无法进行随机对照试验时（如研究吸烟对健康的影响），从观察数据中估计因果效应
- **政策评估**: 预测干预措施（如价格变动、政策实施）的效果
- **数据融合（可迁移性）**: 将不同研究的数据整合，利用 do 演算判断哪些结论可以在不同群体间迁移

## Pearl 2010 的技术深化

Pearl 2010 综述展示了 do 演算在 SCM 框架中的更多技术细节：

### 截断因式分解（Truncated Factorization）

在 Markovian 模型中，do(X=x) 的效果可以通过截断因式分解直接计算——从联合分布的因子分解中删除被干预变量的条件概率因子，然后边际化得到因果效应。这使得因果效应可以"逐图检视"而非代数推导。

### 识别性的一般条件

Tian 和 Pearl (2002) 证明：P(y|do(x)) 可识别的充分条件是 X 到其每个子节点的每条路径至少经过一条来自已观测变量的箭头。Shpitser 和 Pearl (2006) 进一步给出了完全的充要条件，并将结果扩展到任意反事实表达式。

### 超越单变量干预

截断因式分解公式不限于单变量干预——它天然支持同时或序贯干预（如时间变化的治疗策略），与 Robins (1987) 的 G-computation 公式等价。

## 与 wiki 已有概念的关系

- **[结构因果模型](structural-causal-model.md)**: do 演算在 SCM 的图结构上操作
- **[因果 DAG](causal-dag.md)**: do 演算的三条规则依赖 DAG 的图论性质（d-分离、后门准则等）
- **[因果之梯](ladder-of-causation.md)**: do 算子是因果之梯第二级（干预）的数学语言
- **[后门准则](backdoor-criterion.md)**: 后门调整公式是 do 演算规则 2 的特例
- **[前门准则](frontdoor-criterion.md)**: 前门调整是 do 演算三条规则的组合应用
- **[中介分析](mediation-analysis.md)**: 控制直接效应可用 do 表达式定义；自然直接/间接效应超出 do 表达能力

## References

- Pearl, Judea; Mackenzie, Dana (2018). *The Book of Why*. Basic Books.
- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press.
- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- `sources/wikipedia-causal-model.md`
