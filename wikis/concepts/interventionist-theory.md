# 干预主义理论（Interventionist Theory of Causation）

## 定义

干预主义理论主张因果关系应通过干预来理解：X 对 Y 有因果影响，当且仅当存在一种对 X 的干预，在保持其他变量不变的情况下，会改变 Y 的值。因果不是静态的关系，而是关于"如果你操控 X 会怎样"的系统性回答。

## 核心思想

[James Woodward](../entities/james-woodward.md) 在 *Making Things Happen* (2003) 中给出了最完整的干预主义因果理论。[Judea Pearl](../entities/judea-pearl.md) 在 *Causality* (2000) 中独立发展了基于干预的形式化框架。

Woodward 的定义链（非还原性但非恶性循环）：

1. **直接影响**：X 对 Y 有直接影响（相对于变量集 **V**），当且仅当存在对 X 的干预，在固定 **V** 中其他变量后，会改变 Y
2. **干预**：I=i 是对 X 的干预（相对于 Y），当且仅当 I 是 X 的干预变量，且 I=i 是 X 取值的个例原因
3. **干预变量**：I 是 X 相对于 Y 的干预变量，当：(a) I 影响 X；(b) I 使 X 的值不受 **V** 中其他影响 X 的变量控制；(c) I 到 Y 的所有影响路径都经过 X；(d) I 与不经过 X 的 Y 的直接影响因素统计独立

这些定义不是还原性的——它们用影响来定义影响——但不是恶性循环的，因为它们用 X 和 Y *之外*的变量之间的影响关系来刻画 X 和 Y 之间的影响。

## 形式化工具

干预主义的核心形式化工具是[因果模型](../concepts/causal-models.md)（结构方程模型）：

- **结构方程** $D \coloneqq C$ 是非对称的——表达 C 对 D 的因果影响方向
- **内生变量**出现在方程左侧，**外生变量**只出现在右侧
- **干预的形式化**：删除被干预变量的结构方程，将该变量视为外生变量，设定其值，求解剩余方程
- **模块性**（Modularity）：系统中每个方程可以独立被干预破坏，而不影响其他方程

## 因果反事实条件句

干预主义为反事实条件句提供了一种替代语义。"如果 X=x，Y 会怎样"不是通过最近可能世界来评估，而是通过对 X 进行干预来评估：固定所有因果上独立于 X 的因素，只让因果下游的因素自由变化。

这种语义与 Lewis 的可能世界语义不同：它持有前因的因果独立因素不变，而不是试图找到总体上"最近"的可能世界。

## 面临的挑战

- **非还原性**：定义中使用了因果概念（"影响"、"个例原因"），不能将因果完全还原为非因果概念
- **模块性争议**：Cartwright (2002) 质疑模块性要求在实际系统中是否成立
- **嵌套反事实**：在因果模型语义中，导出（exportation）原则不普遍有效——$\phi \boxto (\psi \boxto \chi)$ 不总能从 $(\phi \wedge \psi) \boxto \chi$ 得出

## 与工程实践的联系

干预主义的核心直觉——通过主动操控来理解因果——与工程实践高度吻合：

- A/B 测试就是一种干预：固定其他变量，改变一个变量，观察效果
- [harness engineering](../concepts/harness-engineering.md) 中的约束设计本质上是对 agent 行为变量的干预
- [评估器-优化器](../concepts/evaluator-optimizer.md)循环：生成→评估→调整，就是反复对生成参数进行干预

## 结构方程框架与反事实语义的两条路径

干预主义和[反事实理论](../concepts/counterfactual-theory.md)在结构方程框架（SEF）中交汇。关于结构方程的解释存在两种路径：

1. **反事实优先**（Hitchcock 2001, 部分 Woodward）：结构方程是反事实依赖关系的表示，其真值条件是 Lewis 式的[可能世界语义学](../concepts/possible-world-semantics.md)
2. **因果优先**（Pearl 1998, Woodward & Hitchcock 2003, Briggs 2012）：结构方程表示因果依赖关系，由此*推导*反事实的真值条件

这一选择连接着更深层的形而上学问题：因果应该用反事实来分析（Lewis 的 Humean 议程），还是反过来反事实应该用因果来分析？

## 与其他因果理论的关系

- [反事实理论](../concepts/counterfactual-theory.md)：干预主义使用反事实条件句，但给予它们不同的语义（干预语义 vs [可能世界语义](../concepts/possible-world-semantics.md)）
- [因果语境主义](../concepts/causal-contextualism.md)：干预主义的"干预目的决定变量选择"天然带有语境主义倾向
- [规则性理论](../concepts/regularity-theory.md)：干预主义主动操控，规则性理论被动观察
- [概率因果](../concepts/probabilistic-causation.md)：干预主义可以处理确定性和概率性两种系统

## References

- Stanford Encyclopedia of Philosophy, "The Metaphysics of Causation", `sources/sep-causation-metaphysics.md`
- Stanford Encyclopedia of Philosophy, "Counterfactual Theories of Causation" (2001/2024), `sources/sep-counterfactual-causation.md`
- Woodward, James, 2003, *Making Things Happen*, Oxford University Press
- Pearl, Judea, 2000, *Causality*, Cambridge University Press
