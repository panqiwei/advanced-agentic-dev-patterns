# 物理符号系统假说（PSSH）

## 定义

**物理符号系统**（Physical Symbol System）是一种操纵符号结构的物理实体，具有以下组成部分：

- **符号**（Symbol）：能以物理方式出现于结构中的模式
- **符号结构**（Symbol Structure）：符号组成的表达式集合
- **过程**（Processes）：创建、修改、复制、销毁符号结构的操作

两个关键属性：

**指称**（Designation）：表达式通过使系统能访问或影响某对象，与该对象建立关系。

**解释**（Interpretation）：当一个表达式指称某个过程，且系统能执行该过程时，系统正在解释该表达式。

## 物理符号系统假说（PSSH）

Newell 与 Simon（1976）在图灵奖讲座中提出：

> "一个物理符号系统具备通用智能行为的充分必要条件。"

**必要性**：所有表现出通用智能的系统——包括人类大脑——经深入分析后将证明是物理符号系统。

**充分性**：足够大、适当组织的物理符号系统将表现出通用智能行为。

**通用智能行为**：在速度与复杂性限制范围内，对环境的适应性行为，类似于人类行为的广度。

## 历史定位

PSSH 是一个**定性结构律**（law of qualitative structure）——为学科提供最基本的概念框架，类比于：

| 学科 | 定性结构律 |
|------|-----------|
| 生物学 | 细胞学说 |
| 地质学 | 板块构造 |
| 医学 | 细菌学说 |
| 计算机科学 | **物理符号系统假说** |

## 历史发展脉络

符号系统概念经历了五个关键阶段：

1. **形式逻辑**（19世纪末）：弗雷格、罗素将数学表述为符号操作规则，符号被视为无意义标记
2. **图灵机**（1930s）：确立机器可计算性、普遍性，奠定执行符号操作的物理基础
3. **存储程序**（1940s）：程序即数据，使解释原理成为物理现实
4. **表处理/List Processing**（1956）：引入真正的指称关系——数据结构可指称其他结构
5. **LISP**（1959–60）：形式化 S 表达式，与具体机器结构解耦，完成抽象

## 对 PSSH 的证据

### 充分性证据（构造层面）

数百个任务域中构建的 AI 程序——国际象棋、定理证明、自然语言理解、视觉场景解析——每个都在其域内表现出智能行为。研究还发现了跨任务域的通用机制：目标表示方案、判别网、树搜索控制、模式匹配、语言解析。

### 必要性证据（认知层面）

信息处理心理学——特别是在问题求解、概念习得、长期记忆领域——大量证据支持人类认知运作于物理符号系统之上。

## 关键区分（来自 Wikipedia 的澄清）

使用 PSSH 时需要三个本质区分，避免常见误读：

1. **语义符号 vs 动态信号**：假说关注有指称意义的符号，而非原始比特或未解释的神经激活值
2. **通用智能 vs 专用能力**：PSSH 针对 AGI，不适用于评价专项 AI
3. **智能行为 vs 意识**：PSSH 关注行为层面的智能，不涉及主观体验或 Searle"强 AI"问题

## PSSH 与联结主义的争论

PSSH 是符号主义 AI（又称 GOFAI，Good Old-Fashioned AI）的理论基础。1980年代后，联结主义（神经网络）兴起，对 PSSH 提出根本挑战：

- 联结主义认为，智能可能涌现于亚符号层次的统计规律，无需显式符号操作
- PSSH 支持者反驳，神经网络在某种意义上仍是符号系统的实现

### Fodor & Pylyshyn 1988：系统性论证

PSSH 框架内最有力的批判联结主义论证来自 Fodor & Pylyshyn（1988）。他们的**[系统性论证](systematicity.md)**：正常成人能思考"John loves Mary"就必然能思考"Mary loves John"——这种能力关联是**必然的**，不依赖训练历史。

经典架构（PSSH）通过[组合性](compositionality.md)自动解释系统性：两个命题共享相同的[思维语言](language-of-thought.md)组成部分（JOHN、LOVES、MARY）。联结主义无法提供这种结构保证，使系统性成为暴力偶然性。

Fodor & Pylyshyn 建议联结主义最好理解为 PSSH 的**实现理论**，而非认知架构替代方案。

### Smolensky 1988：亚概念层应对

Smolensky（1988）通过[亚概念层](subconceptual-level.md)概念提供了回应：联结主义在亚概念层运作，符号规则是亚概念动力学的**涌现宏观描述**——类比于热力学之于统计力学。

当代 LLM 的涌现表征研究（如 [Othello 世界模型假说](othello-world-model-hypothesis.md)、[线性表征假说](linear-representation-hypothesis.md)）为这场争论提供了新的经验证据——LLM 内部自发形成可与符号对应的线性结构，但其操作机制仍根本不同于经典符号系统。

约束解码（[轨迹偏差](trajectory-bias.md)）的研究进一步揭示了符号规则与联结生成之间的张力：将符号约束强加于联结模型时，会产生系统性的语义偏移。

主要批评论点（来自 Wikipedia 综述和 Nilsson 2007）：

- **Dreyfus 批判**：人类专家依赖无意识直觉而非显式符号操作，显式推理只是冰山一角
- **具身认知**：Lakoff & Turner 认为抽象推理根植于无意识的具身技能
- **莫拉维克悖论**：感知运动技能对符号系统的挑战远大于抽象推理
- **Brooks 的机器人学**：行为主义机器人在没有符号推理的情况下展现更优运动能力
- **深度学习的成功**：联结方法在感知领域大幅超越符号系统
- **[符号接地问题](symbol-grounding.md)**：纯形式符号系统如何在内部建立真实的语义意义？

这些挑战并未证伪 PSSH（PSSH 的范围是通用智能，而非专项任务），但它们揭示了纯符号方法的局限。**神经符号 AI**（Neurosymbolic AI）是当代融合两派的主流方向。

## 关联概念

- [启发式搜索](heuristic-search.md) — PSSH 的配套假说，说明符号系统如何求解问题
- [问题空间](problem-space.md) — 符号系统搜索的表示框架
- [手段-目的分析](means-ends-analysis.md) — 启发式搜索的核心技术
- [符号接地问题](symbol-grounding.md) — PSSH 最根本的哲学挑战
- [世界模型](world-models.md) — 当代神经网络内部是否形成类符号表示的现代争论
- [轨迹偏差](trajectory-bias.md) — 符号约束与联结生成张力的实证
- [层级系统](hierarchical-systems.md) — Simon 的互补理论：复杂系统的结构规律

## References

- Newell, A., & Simon, H. A. (1976). "Computer Science as Empirical Inquiry: Symbols and Search." *Communications of the ACM*, 19(3), 113–126. 摘要: [`sources/newell-simon-computer-science-empirical-inquiry-1975.md`](../sources/newell-simon-computer-science-empirical-inquiry-1975.md)
- Wikipedia contributors. "Physical symbol system." *Wikipedia*. 摘要: [`sources/wikipedia-physical-symbol-system.md`](../sources/wikipedia-physical-symbol-system.md)
- Nilsson, N. J. (2007). "The Physical Symbol System Hypothesis: Status and Prospects." In *50 Years of Artificial Intelligence*, LNAI 4850, pp. 9–17. Springer.
