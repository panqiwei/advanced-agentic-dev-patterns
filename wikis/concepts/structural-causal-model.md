# 结构因果模型（Structural Causal Model）

结构因果模型（SCM）是 [Judea Pearl](../entities/judea-pearl.md) 提出的因果推理形式化框架。它将因果关系从哲学直觉提升为严格的数学对象，使"原因"可以被定义、计算和验证。

## 定义

SCM 是一个有序三元组 ⟨U, V, E⟩：

- **U（外生变量）** — 模型边界之外的因素，其值由外部决定。对应系统的"输入"或"背景条件"。
- **V（内生变量）** — 模型内部的变量，其值由 U 和 V 中其他变量通过结构方程决定。
- **E（结构方程）** — 每个内生变量 Vᵢ 对应一个方程 Vᵢ = fᵢ(PAᵢ, Uᵢ)，其中 PAᵢ 是 Vᵢ 的父节点集合。

结构方程不是统计回归方程——它声称的是因果机制，而非数据拟合。改变方程意味着改变世界的运作方式（干预），而非仅仅观察到不同的数据。

## 与因果 DAG 的关系

每个 SCM 自然诱导一个 [因果 DAG](causal-dag.md)：变量是节点，结构方程中的依赖关系是有向边。DAG 是 SCM 的定性骨架——它编码了因果方向和条件独立性，但不包含方程的具体函数形式。

反过来，同一个 DAG 可以对应多个不同的 SCM（不同的函数形式），但它们共享相同的定性因果结构。

## 三级因果推理

SCM 框架统一了 Pearl [因果之梯](ladder-of-causation.md) 的三个层级：

1. **关联** — 从 SCM 的联合分布中读取，P(Y|X)
2. **干预** — 通过修改结构方程实现，P(Y|[do(X)](do-calculus.md))
3. **反事实** — 在个体层面回答"如果当初不同，会怎样"

## 与统计模型的根本区别

统计模型描述数据的联合分布——它回答"观察到 X 时，Y 的概率是多少"。SCM 在此之上增加了因果方向和干预语义——它能回答"如果我改变 X，Y 会怎样变化"以及"如果 X 当初不同，Y 是否会不同"。

这个区别不是学术游戏。在实际场景中：
- 观察到吸烟者肺癌率高（关联）不等于吸烟导致肺癌（因果）
- 只有 SCM 能区分"冰淇淋销量与溺水率正相关"（共同原因：夏天）和"疫苗导致免疫"（真实因果）

## 与 wiki 已有概念的关系

- **[误差级联](error-cascade.md)**: SCM 的链式结构方程 A→B→C 形式化了误差如何沿因果路径传播——SWE-EVO 观察到的级联效应在 SCM 框架下可以精确建模
- **[层级系统](hierarchical-systems.md)**: Simon 的近可分解性与 SCM 中的条件独立性结构同构——子系统边界对应 DAG 中的 d-分离集
- **[机制可解释性](mechanistic-interpretability.md)**: 神经网络内部的归因图本质上是一种因果图，追踪特征激活间的因果传播路径

## Pearl 2010 综述的补充视角

Pearl 在其 2010 年权威综述中进一步阐明了 SCM 的统一地位。SCM 不仅是一种因果分析工具，更是一个**元框架**——它将以下六种独立发展的因果分析路径统一为同一框架的特例：

1. 图模型路径（Wright 路径分析、贝叶斯网络）
2. 潜在结果框架（Neyman-Rubin）
3. 结构方程模型（计量经济学传统）
4. 决策分析路径（Dawid 影响图）
5. [干预主义](interventionist-theory.md)路径（Woodward）
6. [概率因果](probabilistic-causation.md)路径（Suppes）

Pearl 特别强调了 SCM 与潜在结果框架的关系：潜在结果框架中的原始未定义量 Y_x(u) 在 SCM 中是可推导的——它是子模型 M_x 中 Y 的解。SCM 不仅"兼容"潜在结果框架，而且为其提供了形式基础和语义解释。

Pearl 还提出了因果分析的四步方法论——Define、Assume、Identify、Estimate——其中 SCM 在每一步都扮演关键角色：定义阶段提供计算 Q(M) 的程序性定义，假设阶段提供编码因果知识的图语言，识别阶段提供从图到估计式的推导工具。

## References

- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press.
- Pearl, Judea; Mackenzie, Dana (2018). *The Book of Why*. Basic Books.
- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- Stanford Encyclopedia of Philosophy, "Causal Models" (2018).
- `sources/wikipedia-causal-model.md`
