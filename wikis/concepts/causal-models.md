# 因果模型（Causal Models）

## 定义

因果模型是编码变量间因果影响关系的形式化工具。确定性关系用结构方程模型（Structural Equations Models）表示，非确定性关系用概率模型表示。因果模型不仅是计算工具，也承载关于世界因果结构的形而上学承诺。

## 结构方程模型

### 基本构成

- **变量**：内生变量（出现在方程左侧，值由模型内其他变量确定）和外生变量（只出现在右侧，值由模型外因素确定）
- **结构方程**：形如 $D \coloneqq C$ 的非对称方程。"$\coloneqq$"强调方向性：C 对 D 有因果影响，但反之不然。区别于数学等式 $D = C$ 的对称性。
- **无环性**：如果变量间没有影响环路，外生变量的赋值可以唯一确定所有内生变量的值

### 干预的形式化

给定一个因果模型，对变量 V 的**干预**的形式化操作是：

1. 删除 V 的结构方程（使 V 不再被模型内其他变量决定）
2. 将 V 视为外生变量，设定为指定值
3. 保持所有其他方程不变
4. 求解剩余变量的值

这为[干预主义理论](../concepts/interventionist-theory.md)提供了精确的形式化基础。

### 模块性（Modularity）

模块性要求系统中的每个结构方程可以独立被干预破坏，而不影响其他方程。这是干预可行的前提条件。

例：在方程组 $A \coloneqq B \wedge \neg C$, $D \coloneqq C$, $E \coloneqq A \vee D$ 中，模块性要求存在某种方式只破坏 $D \coloneqq C$ 而保持其他两个方程不变。

Cartwright (2002) 对模块性提出质疑，Hausman & Woodward (1999, 2004) 进行了辩护。

## 因果反事实的语义

因果模型提供了反事实条件句的干预语义：评估"如果 X=x 会怎样"，就是在模型中对 X 进行干预——固定所有因果上独立于 X 的因素，让因果下游因素自由变化。

这与 Lewis 的最近可能世界语义不同。模型语义中，嵌套反事实和导出原则（exportation）需要特别小心——$\phi \boxto (\psi \boxto \chi)$ 不总能从 $(\phi \wedge \psi) \boxto \chi$ 得出。

## 模型准确性的形而上学

什么使一个因果模型"正确"？

- **反事实充分性**（Hitchcock 2001a）：模型正确当且仅当它蕴含的反事实族都为真。有弱版本（基本干预反事实）和强版本（所有可推导反事实）。
- **过程充分性**（Handfield et al. 2008）：模型中的影响边必须对应某种可能状态下的"连接过程"
- **常态性信息**（Hall 2007, Halpern 2016a）：模型还需要编码哪些变量值比其他值更"正常"或"默认"
- **实用主义**（Halpern 2016a）：可能不存在"正确"的模型，只有更有用或更好地表示现实的模型

## 与个例因果的关系

许多当代因果理论使用因果模型来分析个例因果（Hitchcock 2001a, Halpern & Pearl 2005, Woodward 2003 等）。基本思路：如果变量值 C=c 是 E=e 的个例原因，则必须存在从 C 到 E 的影响路径 $C \to D_1 \to \cdots \to D_N \to E$。不同理论在额外条件上存在分歧，但多数同意反事实依赖是充分条件。

### 活跃因果路线

Hitchcock (2001) 提出的关键概念。路线 ⟨X, Y₁, ..., Yₙ, Z⟩ 是**活跃的**，当且仅当：在将路线外的所有中间变量固定在实际值后，Z 反事实依赖于 X。

Billy-Suzy 案例中：路线 ⟨ST, SH, BS⟩ 是活跃的——冻结 BH=0 后，BS 依赖于 ST。路线 ⟨BT, BH, BS⟩ 不活跃——冻结 SH=1 后，BS 不依赖于 BT。

对于对称过度决定（两块石头同时击中瓶子），Hitchcock 将"活跃路线"弱化为"弱活跃路线"——允许将路径外变量冻结在*非实际*值来恢复反事实依赖。

### 模型适当性

什么样的因果模型算"适当"（apt）？这关系到因果结论的可靠性：

- 变量值不应代表逻辑/形而上学上互相关联的事件（Hitchcock 2001）
- 变量值应是内在刻画（Blanchard & Schaffer 2017）
- 不应分配"你不愿认真考虑的"变量值——这排除了"女王浇花"之类的荒谬替代
- **稳定性**约束（Halpern & Hitchcock 2010）：添加额外变量不应推翻既有因果判断
- 模型应"包含足够的变量来捕捉被建模情景的本质结构"

## 与 Wiki 其他概念的联系

- [Judea Pearl](../entities/judea-pearl.md) 是因果模型理论的核心人物
- 因果模型的变量选择问题与[因果关系项](../concepts/causal-relata.md)的本体论问题直接相关
- 结构方程模型在工程实践中广泛应用——[harness engineering](../concepts/harness-engineering.md) 的约束设计可以视为一种非形式化的因果建模

## References

- Stanford Encyclopedia of Philosophy, "The Metaphysics of Causation", `sources/sep-causation-metaphysics.md`
- Stanford Encyclopedia of Philosophy, "Counterfactual Theories of Causation" (2001/2024), `sources/sep-counterfactual-causation.md`
- Pearl, Judea, 2000, *Causality*, Cambridge University Press
- Halpern, Joseph, 2016a, *Actual Causality*, MIT Press
- Woodward, James, 2003, *Making Things Happen*, Oxford University Press
- Hitchcock, Christopher, 2001, "The Intransitivity of Causation Revealed in Equations and Graphs", *Journal of Philosophy*
