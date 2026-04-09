# 可能世界语义学（Possible World Semantics）

## 定义

可能世界语义学是为反事实条件句提供真值条件的形式化框架。其核心思想：反事实条件句"如果 A 发生，则 C 会发生"为真，当且仅当在最接近实际世界的 A 为真的可能世界中，C 也为真。"接近"由世界之间的比较相似性关系决定。

## 核心机制

### 比较相似性

[David Lewis](../entities/david-lewis.md) (1973a) 引入的核心概念。一个可能世界比另一个"更接近实际世界"，当前者与实际世界更相似。真值条件：

> "如果 A，则 C"为真，当且仅当：某个 A 且 C 为真的世界比任何 A 为真但 C 不为真的世界更接近实际世界。

### 相似性的多维权衡

评估非回溯反事实时，相似性涉及多个维度的权衡：

1. **自然律的相似性**：包含较少"奇迹"（违反实际自然律）的世界更接近
2. **特定事实的匹配**：与实际世界共享更大时空区域完全匹配的世界更接近
3. **权衡规则**：可以用一个小的局部奇迹换取大面积的事实匹配，但不能用大而多样的奇迹

### 非回溯解释

Lewis 要求使用"标准解释"（非回溯反事实）来评估因果依赖。非回溯反事实通常将过去固定到反事实前件被假设成立的时间（或略早）。这排除了通过"如果 c 没有发生，那么 d（c 的原因）就不会发生"来推导虚假因果依赖的推理。

## 时间不对称性

可能世界语义学如何解释因果的时间方向？Lewis (1979) 的论证：

1. **对称的相似性分析**：相似性规则本身不内置时间不对称性
2. **过度决定的不对称性**（contingent fact）：结果很少被其原因过度决定，但原因非常频繁地被其结果过度决定（因为原因留下大量痕迹）
3. **组合效果**：保持过去不变、插入一个小奇迹来改变未来，比保持未来不变、需要多个大奇迹来改变过去，产生更接近实际世界的世界

Elga (2000) 通过 Gretta 打鸡蛋的例子论证这个不对称性在许多情况下不成立——通过时间反演和热力学的统计性质，"汇聚奇迹"也可以很小。

## 与干预语义的对比

可能世界语义学与[干预主义理论](../concepts/interventionist-theory.md)中的干预语义提供了两种不同的反事实评估方案：

| 维度 | 可能世界语义学 | 干预语义（Pearl/Woodward） |
|------|--------------|--------------------------|
| 评估方式 | 寻找最接近的可能世界 | 在因果模型中执行手术干预 |
| 固定什么 | 总体上最相似的事实配置 | 因果上独立于前件的所有变量 |
| 形而上学承诺 | Lewis：可能世界是真实的具体实体 | 因果模型编码因果机制 |
| 还原性 | 可以不诉诸因果概念（Humean 议程） | 通常使用因果概念定义干预 |

两种语义在大多数简单案例中给出相同结果。差异出现在复杂的[先占](../concepts/preemption.md)和过度决定案例中——结构方程框架通过"冻结变量"技术提供了更精细的控制。

## 与 wiki 其他概念的关系

- [反事实理论](../concepts/counterfactual-theory.md)：可能世界语义学是 Lewis 反事实因果理论的形而上学基础
- [因果模型](../concepts/causal-models.md)：结构方程框架提供了替代的反事实评估方案
- [因果性（休谟）](../concepts/causation-hume.md)：Lewis 明确继承休谟的经验主义传统，可能世界语义学服务于 Humean supervenience 议程
- [因果之梯](../concepts/ladder-of-causation.md)：反事实推理是因果之梯的第三级，可能世界语义学为这一级提供了哲学基础

## References

- Lewis, David, 1973a, *Counterfactuals*, Oxford: Blackwell
- Lewis, David, 1979, "Counterfactual Dependence and Time's Arrow", *Noûs*
- Elga, Adam, 2000, "Statistical Mechanics and the Asymmetry of Counterfactual Dependence", *Philosophy of Science*
- Stanford Encyclopedia of Philosophy, "Counterfactual Theories of Causation" (2001/2024): `sources/sep-counterfactual-causation.md`
