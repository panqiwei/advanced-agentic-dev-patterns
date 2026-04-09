# 差异制造（Difference-Making）

## 定义

差异制造（difference-making）是当代因果理论中的核心概念：如果一个因子的存在或缺席会改变结果是否发生，这个因子就是结果的差异制造者。差异制造的思想跨越了[规则性理论](../concepts/regularity-theory.md)、[反事实理论](../concepts/counterfactual-theory.md)和[推断性理论](../concepts/inferential-theories-of-causation.md)的边界，是多种因果理论的共同内核。

## 差异制造在不同理论中的体现

### 在规则性理论中

[INUS 条件](../concepts/inus-conditions.md)的非冗余性要求本质上就是差异制造：一个因子是 INUS 条件，当且仅当它对所属充分条件簇的充分性不可或缺——移除它，该簇就不再充分。Baumgartner & Falk (2023) 明确以"Boolean difference-making"为题发展了基于布尔差异制造的现代规则性理论。

Graßhoff & May (2001) 的最小必要析取概念也是差异制造的体现：效应的复杂规律中，每个析取项的实例化独立于其他析取项对效应的发生构成差异。

### 在反事实理论中

[反事实理论](../concepts/counterfactual-theory.md)是差异制造思想最直接的表达：如果 C 没有发生，E 就不会发生——C 的存在对 E 的发生构成了差异。Lewis (2000) 的"影响"修订版更进一步：C 的变化（时间、方式、程度）会导致 E 的相应变化。

### 在推断性理论中

Strevens (2004, 2008) 的 kairetic 账户将差异制造置于中心：解释核心中的每个成员必须对效应的产生构成差异。一般性最优化确保核心不包含不构成差异的因子，凝聚性最优化确保核心不包含仅在部分情况下构成差异的析取因子。

Strevens 的差异制造概念比简单的反事实依赖更精细。他区分了三种非差异制造者：
1. 完全不参与因果产生过程的因子
2. 参与了过程但影响可忽略的因子
3. 参与了过程但描述过于精细的因子（如"四千克的砖头"vs"超过阈值的刚性物体"）

### 在干预主义中

[干预主义理论](../concepts/interventionist-theory.md) 中的差异制造通过干预定义：C 对 E 构成差异，当且仅当存在某种对 C 的干预会改变 E 的值。Woodward (2003) 将这一思想发展为完整的因果解释理论。

## 差异制造与因果方向

差异制造本身是对称的——如果 C 的变化导致 E 的变化，那么 E 的变化在某种意义上也"伴随"C 的变化。要从差异制造中提取因果方向，需要额外约束：
- 规则性理论依赖时间序
- 反事实理论依赖可能世界的相似性排序
- 干预主义依赖干预的不对称性

## 与本 wiki 其他概念的关系

- **[INUS 条件](../concepts/inus-conditions.md)**：差异制造的规则性版本——非冗余性 = 差异制造
- **[反事实理论](../concepts/counterfactual-theory.md)**：差异制造的反事实版本——反事实依赖 = 差异制造
- **[推断性因果理论](../concepts/inferential-theories-of-causation.md)**：Strevens 的 kairetic 账户将差异制造与推断性方法结合
- **[因果干预](../concepts/causal-intervention.md)**：干预语义中的差异制造——干预改变原因以检测对结果的影响
- **[先占](../concepts/preemption.md)**：先占案例挑战了简单的差异制造分析——先占者被移除后，备用者会接手，结果不变

## References

- Strevens, Michael, 2004, "The Causal and Unification Approaches to Explanation Unified-Causally", *Noûs*, 38(1): 154-176
- Strevens, Michael, 2008, *Depth: An Account of Scientific Explanation*, Harvard University Press
- Baumgartner, Michael & Falk, Christoph, 2023, "Boolean Difference-Making: A Modern Regularity Theory of Causation", *The British Journal for the Philosophy of Science*, 74(1): 171-197
- Stanford Encyclopedia of Philosophy, "Regularity and Inferential Theories of Causation", `sources/sep-causation-regularity.md`
