# 中介分析（Mediation Analysis）

中介分析是因果推理中将总效应分解为直接效应和间接效应的方法论框架。其核心问题是：X 对 Y 的影响有多少是通过中介变量 Z 传递的？这个问题在法律（歧视诉讼）、政策（效果分解）和科学（机制识别）中普遍存在。

## 三种效应

### 总效应（Total Effect）

X 对 Y 的全部因果影响，包括所有路径：

TE_{x,x'}(Y) = E(Y_{x'}) - E(Y_x)

### 控制直接效应（Controlled Direct Effect, CDE）

将中介变量 Z 通过干预固定在特定值 z 后，X 对 Y 的效应：

CDE = E(Y|do(x'), do(z)) - E(Y|do(x), do(z))

CDE 依赖于 z 的选择——不同的固定值可能产生不同的直接效应大小。在线性系统中，CDE 等于路径系数，与 z 无关。

### 自然直接效应（Natural Direct Effect, NDE）

保持中介变量在"自然"基线水平——即 X 改变前 Z 本应达到的值——时，X 对 Y 的效应：

NDE_{x,x'}(Y) = E(Y_{x', Z_x}) - E(Y_x)

NDE 使用嵌套反事实 Y_{x', Z_x}，不能用 [do 算子](do-calculus.md) 表达，因此原则上无法仅从实验研究中识别。但在无混淆条件下可化简为 do 表达式的加权平均：

NDE = Σ_z [E(Y|do(x',z)) - E(Y|do(x,z))] P(z|do(x))

### 自然间接效应（Natural Indirect Effect, NIE）

保持 X 在 x 不变，仅让中介变量 Z 从 do(x) 下的值变到 do(x') 下的值所产生的 Y 的变化：

NIE_{x,x'}(Y) = E(Y_{x, Z_{x'}}) - E(Y_x)

NDE 和 NIE 的关系：TE = NDE - NIE_{reverse}。在线性系统中简化为标准的加法分解 TE = NDE + NIE。

## 中介公式（Mediation Formula）

Pearl 2010 给出的适用于任意非线性系统的间接效应通用公式：

IE_{x,x'}(Y) = Σ_z E(Y|x,z) [P(z|x') - P(z|x)]

这个公式的优点：
- 适用于任意非参数模型——不要求线性或特定分布假设
- 只需要标准的两步回归即可估计
- 提供了一个客观的目标量，使得参数化近似的误差可以被分析评估

## 为什么中介分析困难

中介分析的核心困难在于"禁用直接路径"的操作无法用 do 算子表达。do(X=x) 可以固定变量的值，但不能选择性地切断某条路径而保留其他路径。Pearl 因此提出：**信号感知比操纵更基本**——因果关系的本质操作是选择哪些信号被感知和传递，而非哪些变量被固定。

另一个困难来自混淆：在条件化中介变量 Z 后，可能因对撞偏差（collider bias）产生 X 和 Y 之间的虚假关联，即使 X 对 Y 没有直接效应。这意味着"控制中介变量后看关联"不等于"测量直接效应"。

## 与 wiki 已有概念的关系

- **[do 演算](do-calculus.md)**: CDE 可以用 do 表达式定义和识别；NDE/NIE 超出 do 表达能力，需要嵌套反事实
- **[因果之梯](ladder-of-causation.md)**: CDE 属于第二级（干预），NDE/NIE 属于第三级（反事实）
- **[因果 DAG](causal-dag.md)**: 中介变量对应链结构 X → Z → Y 中的中间节点
- **[后门准则](backdoor-criterion.md)**: NDE 的识别需要后门准则应用于 Z→Y 路径
- **[结构因果模型](structural-causal-model.md)**: 中介公式的推导依赖 SCM 的反事实"手术定义"
- **[误差级联](error-cascade.md)**: 中介分析量化了"效应沿路径传播"的程度——误差级联是一种中介传播的退化形式

## References

- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- Pearl, Judea (2001). "Direct and Indirect Effects." *Proceedings of the Seventeenth Conference on Uncertainty in Artificial Intelligence*.
- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press.
