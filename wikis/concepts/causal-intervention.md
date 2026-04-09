# 因果干预（Causal Intervention）

因果干预是 [因果之梯](ladder-of-causation.md) 第二级的核心操作：通过外部力量将变量固定为特定值，切断其原有的因果输入，观察对下游变量的影响。在 [结构因果模型](structural-causal-model.md) 中，干预等价于删除指向被干预变量的所有箭头——Pearl 称之为"微型手术"（mini-surgery）。

## 干预 vs 观察

两个看似相似的问题有根本不同的答案：

- **观察**: "吃药的人康复率是多少？" → P(康复|吃药)
- **干预**: "如果让所有人吃药，康复率是多少？" → P(康复|do(吃药))

差异来源：观察中，吃药的人可能本就更注重健康（混淆因子）。干预切断了这种选择偏差。

## 实现干预的两条路径

### 实验路径：随机对照试验（RCT）

随机分组使处理分配独立于所有混淆因子，直接估计 P(Y|do(X))。但 RCT 在很多场景中不可行（不道德、成本过高、物理不可能）。

### 形式化路径：[do 演算](do-calculus.md)

在 [因果 DAG](causal-dag.md) 上应用后门调整或前门调整，将 do 表达式转换为观察表达式：

**后门调整**: 找到满足后门准则的变量集 Z，控制这些变量：
P(Y|do(X)) = Σ_z P(Y|X, Z=z)P(Z=z)

**前门调整**: 当混淆变量不可观测时，通过因果路径上的中介变量间接估计因果效应。

## 干预查询

干预查询的一般形式为 P(Y|do(X=x))，含义是"如果我将 X 设为 x，Y 的分布是什么"。更复杂的查询可以同时对多个变量施加 do 操作。

图形化解读：do(X=x) 在 DAG 中等价于删除所有指向 X 的边，将 X 固定为 x。这将 X 从其原有原因中"解放"出来，使我们能隔离 X 对 Y 的纯因果效应。

## 与 wiki 已有概念的关系

- **[do 演算](do-calculus.md)**: 干预的形式化操作规则
- **[结构因果模型](structural-causal-model.md)**: 干预在 SCM 中的语义是修改结构方程
- **[因果 DAG](causal-dag.md)**: 干预在 DAG 中的图操作（删边、固定节点）
- **[因果之梯](ladder-of-causation.md)**: 干预是因果之梯的第二级

## Pearl 2010 的补充：信号感知比操纵更基本

Pearl 在 2010 综述的 [中介分析](mediation-analysis.md) 讨论中提出了一个重要的哲学修正：间接效应（通过选定路径传递的效应）涉及的操作是"选择哪些信号被感知"，而非"哪些变量被固定"。do(x) 算子只是一种粗糙的信号刺激方式。

因此，"没有操纵就没有因果"（No causation without manipulation）这一口号应被拒绝。因果关系的核心是信号的传递和感知，而非实验者的物理操纵能力。性别歧视案例中，"do(gender=male)"在物理上不可行，但"性别对雇佣的直接因果效应"作为一个良定义的量完全可以被形式化分析。

## References

- Pearl, Judea; Mackenzie, Dana (2018). *The Book of Why*. Basic Books.
- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press.
- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- Hernán, M.A.; Robins, J.M. (2020). *Causal Inference: What If*. Chapman & Hall/CRC.
- `sources/wikipedia-causal-model.md`
