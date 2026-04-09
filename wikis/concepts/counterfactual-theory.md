# 反事实理论（Counterfactual Theory of Causation）

## 定义

反事实理论主张因果关系的核心在于反事实依赖：c 是 e 的原因，当且仅当"如果 c 没有发生，e 就不会发生"。因果关系被还原为可能世界之间的关系。

## 核心思想

[David Lewis](../entities/david-lewis.md) 在 1973 年的经典论文 "Causation" 中奠定了现代反事实因果理论的基础。Lewis 的核心论证链：

1. **反事实条件句**有真值条件，可通过最近可能世界语义学分析
2. **因果依赖** = 反事实依赖：如果 c 没有发生，e 就不会发生
3. **因果关系** = 因果依赖链的传递闭包

Lewis 后来 (2000) 修订为"影响"（influence）理论：c 影响 e，当 c 的改变会导致 e 的改变（时间、方式、是否发生等）。

## 理论优势

- **处理预防和缺席**：即使没有物理过程连接原因和结果，反事实依赖仍可成立——Bond 射下导弹预防了 Blofield 的死亡，因为"如果 Bond 没有射下导弹，Blofield 就会死"
- **自然性**：日常因果推理大量使用"如果...就不会..."的反事实思考
- **精确性**：可能世界语义学提供了形式化工具

## 面临的挑战

### 先占问题

[先占](../concepts/preemption.md)是反事实理论最棘手的挑战。在先占案例中：

- **早期先占**：Billy 扔石头打碎窗户，Suzy 作为备用。Billy 导致了窗户破碎，但即使 Billy 没扔，Suzy 也会扔——反事实依赖不成立。Lewis 通过因果链的传递来处理。
- **晚期先占**：Patricia 死于吗啡过量，但她本来也会死于绝症。在死亡之前的任何时刻移除吗啡及其效应，她仍会因疾病而死。传递策略也不管用。
- **凌驾先占**（Trumping）：Schaffer (2000a) 的案例——Merlin 和 Morgana 都对王子施咒，但魔法法则规定只有当天第一个咒语生效。这里没有备用因果过程的"切断"。

### 开关案例

Filipa 拨动开关决定电流走左灯泡还是右灯泡，Phoebe 打开电源。Filipa 的行为改变了*如何*照亮房间，但没有改变*是否*照亮——反事实依赖不成立，但直觉上通过右灯泡的因果路径是完整的。

开关案例还威胁**传递性**：Filipa 导致右灯泡亮→右灯泡亮导致房间亮→但 Filipa 没有导致房间亮。

## Lewis 理论的形而上学基础

Lewis 的反事实因果理论依托[可能世界语义学](../concepts/possible-world-semantics.md)：反事实条件句"如果 c 没有发生，e 就不会发生"为真，当且仅当在最接近实际世界的 c 未发生的可能世界中，e 也未发生。"接近"由多维度的比较相似性关系决定——自然律的匹配程度和特定事实的匹配范围之间需要权衡。

Lewis 还通过"过度决定的不对称性"解释因果的时间方向：结果被其原因过度决定（原因留下大量痕迹），但原因很少被其结果过度决定。这意味着保持过去、改变未来只需一个小奇迹，而保持未来、改变过去则需要多个大奇迹——前者产生更接近实际世界的可能世界。Elga (2000) 对这一不对称性提出了有力质疑。

## 概率因果的扩展

Lewis (1986c) 将理论扩展到非确定性情境：e 因果依赖于 c，当且仅当如果 c 没有发生，e 发生的概率（chance）会大大低于其实际概率。这容纳了量子力学等领域中的概率因果过程。但普遍的非确定性削弱了"结果一般反事实依赖于原因"的直觉。

## 从反事实依赖到"影响"（2000 年修订）

Lewis 2000 年的修订理论用"影响"（influence）取代简单的反事实依赖。c 影响 e，当存在一系列 c 的变体（alteration），与之对应的 e 也会有一系列变体——c 的改变导致 e 在是否发生、何时发生、如何发生等方面的改变。因果关系 = 逐步影响链的传递闭包。

新理论处理了晚期先占和凌驾先占。但面临新问题：Bennett (1987) 的案例——十二月的雨推迟了森林火灾，雨影响了火灾的时间和方式，但我们不认为雨是火灾的"原因"（虽然它是"火灾延迟"的原因）。常识对"什么算原因"比 Lewis 的理论更有选择性。

## 因果的语境依赖性

反事实因果判断是否随语境变化，是一个活跃的哲学争论。详见[因果语境主义](../concepts/causal-contextualism.md)。

## 与因果模型的融合

许多当代反事实理论在[因果模型](../concepts/causal-models.md)框架内运作（Hitchcock 2001a, Halpern & Pearl 2005, Halpern 2016a）。[结构方程](../concepts/causal-models.md)提供干预语义，使反事实条件句的真值条件更加精确。在结构方程框架中，反事实"如果 X=x 则 Y 会怎样"通过删除 X 的方程、设定 X=x、求解剩余方程来评估。

结构方程框架处理先占的关键技术是"活跃因果路线"（active causal route）：冻结路径外的变量在实际值（或某些非实际值），然后检验反事实依赖。这与 Lewis 的准依赖（quasi-dependence）方案思路类似，但在操作上更精确——它使用"显式非前溯"（explicitly nonforetracking, ENF）反事实而非跨可能世界的推理。

## 与其他因果理论的关系

- [规则性理论](../concepts/regularity-theory.md)：规则性理论从正面模式出发，反事实理论从否定假设出发
- [过程理论](../concepts/process-theories.md)：过程理论擅长先占、反事实理论擅长预防——Hall (2004) 据此主张因果有"两个概念"
- [干预主义理论](../concepts/interventionist-theory.md)：干预主义使用因果反事实条件句，但给予它们操控性语义而非可能世界语义

## References

- Stanford Encyclopedia of Philosophy, "The Metaphysics of Causation", `sources/sep-causation-metaphysics.md`
- Stanford Encyclopedia of Philosophy, "Counterfactual Theories of Causation" (2001/2024), `sources/sep-counterfactual-causation.md`
- Lewis, David, 1973, "Causation", *The Journal of Philosophy*
- Lewis, David, 2000, "Causation as Influence", *The Journal of Philosophy*
- Halpern, Joseph, 2016a, *Actual Causality*, MIT Press
