# The Metaphysics of Causation (SEP)

- **来源**: `sources/sep-causation-metaphysics.md`
- **原始 URL**: https://plato.stanford.edu/entries/causation-metaphysics/
- **作者**: Stanford Encyclopedia of Philosophy
- **发表日期**: 2001-03-18
- **收录日期**: 2026-04-09

## 概述

斯坦福哲学百科全书关于因果关系形而上学的综述性条目。文章系统梳理了因果关系的核心哲学问题：因果关系项（relata）是什么？因果关系是几元关系？各种因果实例（先占、预防、开关案例）对不同理论的挑战是什么？

文章的关键框架是一个 2×2 分类：

|  | 个例（Tokens） | 类型（Types） |
|---|---|---|
| **常量（Constants）** | 个例因果 | 类型因果 |
| **变量（Variables）** | 个例影响 | 类型影响 |

这个分类区分了四种不同的因果声称，为后续讨论各种因果理论提供了坐标系。

## 核心内容

### 因果关系项问题

因果关系的"两端"是什么？主要候选者包括：

- **事件**（Events）：Davidson 的粗粒度观点（因果区分事件）、Kim 的细粒度观点（属性-对象-时间三元组）、Lewis 的属性论（事件是时空区域的类）
- **事实**（Facts）：Bennett、Mellor 等支持，尤其能处理缺席/遗漏作为原因的情况
- **变量值**（Variable Values）：因果建模传统（Hitchcock、Woodward、Halpern & Pearl），变量值如何打包成变量本身是独特的形而上学问题

### 五大因果理论传统

1. **[规则性理论](../concepts/regularity-theory.md)**：Hume 开创，因果 = 恒常连接。类型因果优先于个例因果。
2. **[反事实理论](../concepts/counterfactual-theory.md)**：Lewis 的核心贡献，因果 = 反事实依赖。在先占案例上遇到困难。
3. **[干预主义理论](../concepts/interventionist-theory.md)**：Woodward、Pearl，通过干预定义因果影响。结构方程模型是核心工具。
4. **[概率因果](../concepts/probabilistic-causation.md)**：Eells、Suppes，原因提高结果的概率。
5. **[过程理论](../concepts/process-theories.md)**：Salmon、Dowe，因果 = 能量/动量传递的物理过程。擅长处理先占，但在预防案例上困难。

### 关键测试案例

- **[先占](../concepts/preemption.md)**（Preemption）：早期先占、晚期先占、凌驾先占——原因不必是结果的必要条件
- **预防**（Prevention）：缺席作为原因的问题，双重预防更具挑战性
- **开关案例**（Switches）：因果传递性的反例，过程的内在特征不足以确定因果
- **常态性**（Normality）：原因 vs 背景条件的区分，Hall 的短路案例证明常态性不仅仅是语用选择

### 因果关系的元数

标准观点认为因果是二元关系，但对比论（Schaffer 2005）主张四元关系："c 而非 c* 导致 e 而非 e*"。对比论可以用粗粒度的事件本体论处理细粒度的因果差异。

### 类型因果与个例因果的关系

三种立场：
- 类型因果是个例因果的概括（Lewis）
- 个例因果通过类型因果获得成立条件（Hume、Mill、Davidson）
- 两者独立（Eells）

### 因果模型

[结构方程模型](../concepts/causal-models.md)编码变量间的影响关系。核心概念包括：内生/外生变量、模块性（modularity）、干预的形式化、因果反事实条件句的语义。

## 关键收获

1. **没有单一的因果理论能处理所有案例**：先占利于过程理论，预防利于反事实理论，开关案例挑战传递性
2. **因果关系项的粒度选择深刻影响理论承诺**：从时空区域到事件到事实到变量值，粒度越细越能区分因果差异，但也引入更多形而上学负担
3. **个例因果与类型因果的关系不是单向的**：不能简单地将一种还原为另一种
4. **常态性/默认状态不仅是语用因素**：Hall 的同构论证表明它可能是因果关系的客观组成部分
5. **因果模型提供了统一框架**：结构方程模型能编码多种因果理论的核心直觉

## 与 Wiki 其他页面的联系

- [因果模型](../concepts/causal-models.md)是 [harness engineering](../concepts/harness-engineering.md) 中理解系统行为的理论基础——harness 本质上是对 agent 行为施加因果约束
- [干预主义理论](../concepts/interventionist-theory.md)与 [评估器-优化器](../concepts/evaluator-optimizer.md) 模式有结构相似性：通过干预变量观察效果变化
- [先占](../concepts/preemption.md)与 [误差级联](../concepts/error-cascade.md) 相关：在多步 agent 任务中，一个错误可能先占其他潜在错误路径
- 因果关系的"常态性"讨论与 agent 系统中"正常行为" vs "异常行为"的区分有工程对应

## References

- Stanford Encyclopedia of Philosophy, "The Metaphysics of Causation", `sources/sep-causation-metaphysics.md`
