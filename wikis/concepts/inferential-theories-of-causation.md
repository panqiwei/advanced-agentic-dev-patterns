# 推断性因果理论

## 定义

推断性因果理论（Inferential Theories of Causation）主张因果关系可以通过推断关系来刻画：C 是 E 的原因，当且仅当 C 和 E 都实际发生，并且 E 可以在适当的背景理论和适当的逻辑中从 C 推出。推断性理论可视为[规则性理论](../concepts/regularity-theory.md)的继承者和精炼。

## 核心思想

规则性理论将因果关系归结为规律的瞬例化。推断性理论将这一思路推进一步：因果关系的标志不在于事件类型的恒常伴随，而在于从原因到结果的推断路径——这条路径必须通过适当的背景知识（法则、事实）和适当的推理规则。

推断性理论承诺解决规则性理论的两大顽疾：
1. **个例因果**：即使没有对应的普遍规律，也可能从丰富的背景理论中推断出个例因果关系（如陨石导致恐龙灭绝）
2. **虚假因果**：通过区分真正的推断路径和派生的推断路径来排除共因联合效应

## 主要理论

### 演绎-法则模型（DN 模型）

Hempel 与 Oppenheim (1948) 提出。效应从法则和前件条件中逻辑推出。DN 模型是推断性方法的原型，但 Hempel 本人犹豫将其作为因果分析。

主要问题是对称性：同一法则既允许从原因推出结果（预测），也允许从结果推出原因（回溯）。塔影案例是经典反例——可以从塔高推出影长，也可以从影长推出塔高，但只有前者是因果解释。

### 排名函数理论

Spohn (2006, 2012) 用排名函数（ranking function）表征认知状态。排名函数为每个可能世界分配一个非负整数——不信任度。在此框架中，C 是 E 的原因当且仅当 C 是 E 在给定背景下的理由（reason）——C 提升了 E 的认识地位。

推断性本质体现在条件化运算：对排名函数的条件化定义了一种推断关系——如果我们来信相信 A，那么理性上应该信相什么。Spohn 将这一认知分析与对排名函数的"客观化"结合，试图在认知理论与客观因果之间架桥。

### 加强版 Ramsey 测试

Andreas & Günther (forthcoming) 的核心工具。基本思路：暂悬对 C 和 E 的判断后，若能从 C 的假设推出 E，则 C 是 E 的理由。

他们给出两个因果分析——
1. **基于因果模型的分析**：因果路径通过活跃路径概念重构——推断路径的每一步都依赖于 C
2. **还原性分析**：在无因果/模态概念的认知状态中，C 是 E 的原因当且仅当存在一条从 C 到 E 的前向推断路径，且该路径上使用的法则都是演绎不可冗余的

演绎不可冗余性是排除虚假因果的关键：闪电到雷声的直接推断使用基本法则，而闪光到雷声的推断需要经过从更基本法则可推导出的冗余法则。

### Kairetic 账户

Strevens (2004, 2008) 的理论围绕[差异制造](../concepts/difference-making.md)概念。原因是解释核心（explanatory kernel）的成员——解释核心是因果模型的子集，它蕴含效应，且在一般性和凝聚性之间取得最优平衡。核心中的每个成员都对效应的产生构成差异：移除任何一个成员，剩余部分就不再足以产生效应。

### 因果模型内的推断性方法

Beckers & Vennekens (2018) 和 Bochman (2018, 2021) 在[结构方程模型](../concepts/structural-causal-model.md)框架内发展推断性因果分析。Bochman 使用产出推断关系（production inference relation）——一种以推断规则 $A_1 \wedge \ldots \wedge A_k \Rightarrow B_1 \vee \ldots \vee B_n$ 表示基本因果依赖的形式系统。

## 推断性理论与规则性理论的关系

推断性理论不是规则性理论的否定，而是其精炼和扩展。[INUS 条件](../concepts/inus-conditions.md)可以用推断关系重新表述——背景理论的逻辑形式（析取-合取双条件）决定了 INUS 结构。推断性视角的优势在于：

1. 推断关系可以非单调（允许例外），规律瞬例化不能
2. 推断路径携带方向性信息，规律的对称逻辑形式不携带
3. 推断系统可以区分基本法则和派生法则，纯规律不能

## 与本 wiki 其他概念的关系

- **[规则性理论](../concepts/regularity-theory.md)**：推断性理论的前驱和基础
- **[因果性（休谟）](../concepts/causation-hume.md)**：休谟本人已经暗示了推断性方向——因果关系与推断习惯密不可分
- **[INUS 条件](../concepts/inus-conditions.md)**：连接规则性传统和推断性传统的枢纽
- **[因果模型](../concepts/causal-models.md)**：当代推断性理论的主要形式化框架
- **[反事实理论](../concepts/counterfactual-theory.md)**：推断性理论的主要竞争者——两者在处理先占等案例上各有优劣
- **[差异制造](../concepts/difference-making.md)**：Strevens 的 kairetic 账户将差异制造与推断性方法结合

## References

- Hempel, C. G. & Oppenheim, P., 1948, "Studies in the Logic of Explanation", *Philosophy of Science*
- Spohn, Wolfgang, 2012, *The Laws of Belief*, Oxford University Press
- Andreas, Holger & Günther, Mario, forthcoming, *From Reasons to Causes*, Cambridge University Press
- Strevens, Michael, 2008, *Depth: An Account of Scientific Explanation*, Harvard University Press
- Bochman, Alexander, 2021, *A Logical Theory of Causality*, MIT Press
- Stanford Encyclopedia of Philosophy, "Regularity and Inferential Theories of Causation", `sources/sep-causation-regularity.md`
