# 先占（Preemption）

## 定义

先占是一类因果情景，其中存在一个备用的潜在原因 b，如果实际原因 c 没有发生，b 本来会导致结果 e。但 c 先占了 b，导致了 e 的发生，同时使 b 无法成为 e 的原因。先占案例是各种因果理论的核心测试场。

## 三种类型

### 早期先占（Early Preemption）

备用因果链在结果发生*之前*就被切断。

经典案例：Suzy 想报复邻居砸窗户，但 Billy 告诉她他来做。Suzy 留在家建立不在场证明，Billy 扔石头砸碎窗户。Suzy 的怨恨是备用原因——如果 Billy 没有动手，Suzy 会去砸。但一旦 Billy 说了他会做，Suzy 的因果链就被切断了。

用神经元图描述：c 发射 → 抑制 a（切断备用链）→ 激发 d → 激发 e。关键特征：在 e 发生前的某个时间点（t2），备用链已经失去了导致 e 的可能性。

许多[反事实理论](../concepts/counterfactual-theory.md)利用这一特征处理早期先占——因为在 d 没有发射的反事实情境中，e 确实不会发射。

### 晚期先占（Late Preemption）

备用因果链直到结果发生*之后*才被切断——备用过程被主过程"跑在前面"完成并带来结果后才失去机会。

经典案例（Hall 2004）：Billy 和 Suzy 同时向瓶子扔石头。Suzy 先扔，她的石头先到打碎了瓶子；Billy 的石头飞过瓶子原来所在的位置。如果 Suzy 没扔，Billy 的石头会打碎瓶子。Suzy 的扔石导致了瓶子破碎，Billy 的只是被先占的潜在原因。

Lewis 1973 年的因果链策略无法处理这个案例：瓶子破碎不反事实依赖于 Suzy 的扔石（因为 Billy 的石头也会打碎它），也找不到一个中间事件将它们串成因果依赖链——Suzy 的石头在空中飞行（中间事件）依赖于 Suzy 的扔石，但瓶子破碎不依赖于石头的飞行（因为 Billy 的石头也会打碎瓶子）。

Lewis 曾尝试两种解决方案：将事件解释为"脆弱事件"（fragile events）——Suzy 的石头导致的*那个特定方式的*破碎确实依赖于她的扔石；以及准依赖（quasi-dependence）——在没有 Billy 的对照世界中，相同内在特征的过程确实有反事实依赖。但两者都有缺陷。

**结构方程框架的解法**：冻结路径外变量 BH（Billy 的石头是否击中）在其实际值 0，则瓶子破碎确实反事实依赖于 Suzy 的扔石。这就是"活跃因果路线"技术——详见[因果模型](../concepts/causal-models.md)。

晚期先占对反事实理论构成严峻挑战。Lewis 对自己处理方案的不满直接导致了 2000 年"影响"理论的提出。

### 凌驾先占（Trumping Preemption）

Schaffer (2000a) 引入。即使备用因果过程完整无缺——没有被"切断"的部分——c 仍然凌驾了 b。

案例 1：魔法法则规定每天第一个咒语在午夜生效。Merlin 早上施咒将王子变成青蛙，Morgana 晚上施同样的咒语。午夜王子变成青蛙。Merlin 的咒语是原因，Morgana 的不是。

案例 2（Lewis 版本）：少校和中士同时对士兵喊"前进！"，士兵听到两者的命令并前进。因为士兵服从上级军官，他们前进是因为少校的命令而非中士的。少校是原因。

这些案例中，备用因果过程完整（Morgana 确实施了咒语，中士确实下了命令），但被凌驾了。Lewis 的准依赖方案在此也遇到困难：从中士命令到士兵前进的因果链在内在特征上与对照世界（只有中士没有少校）中的因果链完全相同——所以准依赖错误地判断中士的命令也是原因。Lewis 2000 年的"影响"理论处理了这一案例：改变少校的命令会改变士兵的反应，但改变中士的命令不会。

## 先占的哲学意义

### 原因不必是结果的必要条件

先占直接证明：即使 c 不发生，e 仍会发生（由于备用 b），但 c 仍然是 e 的原因。因果关系不等于反事实必要性。

### 过程连接的重要性

c 和备用 b 的关键区别在于：从 c 到 e 存在"正确类型"的连接过程，而从 b 到 e 不存在。这为[过程理论](../concepts/process-theories.md)提供了支持——过程理论天然擅长处理先占案例。

### 对不同理论的挑战程度不同

- [反事实理论](../concepts/counterfactual-theory.md)：早期先占可处理，晚期先占困难，凌驾先占极困难
- [规则性理论](../concepts/regularity-theory.md)：传统版本困难，但当代版本（Baumgartner 2013 的活跃因果路径、Strevens 2007 对 [INUS 条件](../concepts/inus-conditions.md)的重新诠释）已能处理早期和晚期先占
- [概率因果](../concepts/probabilistic-causation.md)：先占整体上构成困难
- [过程理论](../concepts/process-theories.md)：先占是其强项
- [干预主义理论](../concepts/interventionist-theory.md)：通过[因果模型](../concepts/causal-models.md)中的路径特定反事实来处理
- [推断性因果理论](../concepts/inferential-theories-of-causation.md)：Beckers & Vennekens (2018) 和 Andreas & Günther (forthcoming) 均能处理过决定、早期/晚期先占和开关案例

## References

- Stanford Encyclopedia of Philosophy, "The Metaphysics of Causation", `sources/sep-causation-metaphysics.md`
- Stanford Encyclopedia of Philosophy, "Regularity and Inferential Theories of Causation", `sources/sep-causation-regularity.md`
- Stanford Encyclopedia of Philosophy, "Counterfactual Theories of Causation" (2001/2024), `sources/sep-counterfactual-causation.md`
- Schaffer, Jonathan, 2000a, "Trumping Preemption", *The Journal of Philosophy*
- Hall, Ned, 2004, "Two Concepts of Causation", in *Causation and Counterfactuals*
- Paul, L.A. & Hall, Ned, 2013, *Causation: A User's Guide*, Oxford University Press
