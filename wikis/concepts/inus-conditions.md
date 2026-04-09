# INUS 条件

## 定义

INUS 条件是 [J. L. Mackie](../entities/john-mackie.md) 在 1965 年提出的因果分析框架。INUS 是 "Insufficient but Non-redundant part of an Unnecessary but Sufficient condition" 的缩写：一个原因是结果的不充分但非冗余的不必要但充分条件的组成部分。

INUS 分析的核心洞见在于：日常因果判断中，我们所称的"原因"通常既不是结果的充分条件，也不是必要条件，而是某个充分条件簇中不可缺少的一个因子。

## 形式化结构

### 复杂规律

对于一个结果 E，其完整的因果结构表示为一个析取-合取形式的复杂规律：

$(C_{1,1} \land \ldots \land C_{1,n}) \lor \ldots \lor (C_{k,1} \land \ldots \land C_{k,m}) \leftrightarrow E$

每个合取项是一个**最小充分条件簇**（minimally sufficient cluster）——其中每个因子都是该簇充分性不可或缺的。整个析取式是 E 的**必要且充分**条件，但任何单个簇都只是充分而非必要的。

### INUS 条件的位置

在上述结构中，单个因子 $C_{i,j}$ 就是一个 INUS 条件：
- **Insufficient**：单独不足以导致 E
- **Non-redundant**：不可从所属簇中移除而保持其充分性
- **Unnecessary**：所属簇本身不是 E 的必要条件（其他簇也能导致 E）
- **Sufficient**：所属簇整体足以导致 E

### 因果场

Mackie 引入"因果场"（causal field）概念来限定因果分析的背景。因果场是被固定的背景条件——它们不能被视为原因的一部分。例如，当分析某人的死因时，"此人曾经出生"属于因果场的一部分，不算作死亡的原因。因果场的选择影响哪些因子被识别为 INUS 条件。

## 与休谟规则性理论的关系

休谟规则性理论（HRT）要求原因与结果之间存在严格的[恒常连结](../concepts/constant-conjunction.md)：所有 C 类事件后随 E 类事件。INUS 分析突破了这一要求。在复杂规律中，C₁ 类事件有时后随 E（当 C₂ 也存在时），有时不后随 E（当 C₂ 不存在且没有替代簇被实例化时）。因此 INUS 条件允许在没有严格规则连结的情况下建立因果关系。

## 遗留问题

### 共因联合效应

INUS 分析无法排除虚假因果。经典案例：曼彻斯特工厂汽笛鸣响后，伦敦工人下班回家。两者的共因是下午五点钟。但在 Mackie 的框架中，汽笛鸣响可以构造为伦敦工人回家的 INUS 条件。Mackie 自己承认这表明规则性理论至多是不完备的，需要补充"因果优先性"概念。

### 因果优先性

Mackie 提出了一个近似的因果优先性定义：c 对 e 有因果优先性，当且仅当存在某个时刻 c 已固定而 e 尚未固定。这一概念带有[干预主义](../concepts/interventionist-theory.md)色彩——原因是主体可以用来操控结果的手段——但 Mackie 最终给出的定义不依赖能动者概念。

### 因果方向

复杂规律的逻辑形式是对称的——如果左侧蕴含右侧，右侧也蕴含左侧。这模糊了因果的不对称性。多数规则性理论者（包括 Mackie）回退到休谟式时间序约束：原因在时间上先于结果。

## 后续发展

- **NESS 条件**（Wright 1985）：因果法律领域中的 INUS 变体——原因是使一组条件具有因果充分性的必要元素。已成为法律因果理论的重要工具。
- **Baumgartner (2013)**：通过"最小必要析取"概念解决共因问题。要求效应的复杂规律是最小必要的——不能移除任何析取项而保持与效应的双条件关系。
- **Andreas & Günther (2024b)**：用直接非冗余规律进一步发展还原性规则性理论。
- **Bochman (2021)**：将 INUS/NESS 分析纳入产出推断关系框架，连接规则性传统与推断性传统。

## 与本 wiki 其他概念的关系

- **[规则性理论](../concepts/regularity-theory.md)**：INUS 条件是规则性传统的核心技术贡献
- **[恒常连结](../concepts/constant-conjunction.md)**：INUS 放松了恒常连结的严格性要求
- **[因果性（休谟）](../concepts/causation-hume.md)**：INUS 直接继承并精炼了休谟的因果分析
- **[先占](../concepts/preemption.md)**：当代 INUS 理论的后继者（Baumgartner 2013 等）能够处理先占案例
- **[因果模型](../concepts/causal-models.md)**：因果模型中的结构方程可视为 INUS 结构的形式化
- **[差异制造](../concepts/difference-making.md)**：INUS 条件的非冗余性要求实质上是差异制造的规则性版本

## References

- Mackie, J. L., 1965, "Causes and Conditions", *American Philosophical Quarterly*, 2(4): 245-264
- Mackie, J. L., 1974, *The Cement of the Universe: A Study of Causation*, Oxford: Clarendon Press
- Stanford Encyclopedia of Philosophy, "Regularity and Inferential Theories of Causation", `sources/sep-causation-regularity.md`
