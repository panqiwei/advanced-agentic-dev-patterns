# 亚概念层（Subconceptual Level）

**定义：** Smolensky（1988）提出的认知描述层次：介于神经生物学层和符号/概念层之间，联结主义模型在这个层次上运作。该层次的基本单元是**微特征**（microfeature）——低于人类日常概念粒度的细粒度特征。

---

## 三层分析框架

Smolensky 将认知系统的描述划分为三个层次：

| 层次 | 基本单元 | 描述词汇 | 代表理论 |
|------|----------|---------|---------|
| 神经层 | 神经元、突触 | 膜电位、神经递质 | 神经科学 |
| **亚概念层** | 联结主义单元 | 激活模式、权重 | 联结主义认知科学 |
| 概念/符号层 | 符号、规则 | 命题、逻辑关系 | 经典 AI、语言学 |

**核心主张**：联结主义认知科学的正确分析单元是亚概念层，而非符号层。

---

## 什么是微特征

**微特征**是构成激活模式的基础特征，其特点：

1. **低于概念粒度**：每个单元不对应人类意识中的独立概念。"咖啡"不是一个节点，而是"热"、"液体"、"苦"、"刺激性"、"早晨仪式"等微特征的叠加。

2. **上下文敏感**：同一概念在不同上下文中激活不同的微特征模式——"morning coffee"（开始一天的仪式）vs "coffee-colored"（颜色描述）使用相同词却激活不同模式。

3. **分布式**：同一批微特征参与多个不同概念的表征（分布式编码，superposition）。

---

## 为什么亚概念层是"正确"的层次

### 1. 与神经科学的对接
亚概念层使用与神经科学相容的计算原语（并行、数值计算、连接权重），而不是符号层的离散符号操作。这使联结主义模型成为认知神经科学的桥梁。

### 2. 解释人类认知的弹性
符号系统在规则违反时**崩溃性失败**；亚概念层的约束满足（调和理论 / Harmony Theory）产生**优雅退化**（graceful degradation）——面对噪声输入或部分满足约束时，系统收敛到"最佳"可用状态，而非失败。

### 3. 统一能力与表现
经典语言学将能力（语法）与表现（实际产出）分离。亚概念层通过调和理论（Harmony Theory）的约束优化**统一**了两者：语法规则作为调和函数的吸引子涌现，表现模式直接从约束满足的动力学中产生。

---

## 亚概念层与符号层的关系

Smolensky 对符号模型的立场是微妙的：

> 符号规则不是字面上描述认知计算的机制，而是对联结主义计算的涌现行为的**近似宏观描述**。

类比于物理学：
- 热力学规律（宏观描述）← 统计力学（微观机制）
- 符号规则（宏观描述）← 联结主义亚概念动力学（微观机制）

这意味着：
- 符号认知科学的成果**不是错的**——它是在正确抽象层次上描述涌现行为
- 但它不是**认知机制的字面描述**——就像温度不是单个分子的属性一样
- 亚概念层是机制的正确层次，符号层是行为的正确描述层次

---

## 与[系统性](systematicity.md)批判的关系

Fodor & Pylyshyn（1988）认为联结主义无法解释系统性，因为分布式表征缺乏组合结构。

Smolensky 的亚概念层回应：
- 系统性是**涌现属性**：若调和理论正确编码了语言能力，结构相关的输入将得到系统相关的处理——因为调和函数将在结构相似的激活模式上泛化
- 不需要在亚概念层引入显式组合结构，也能在概念层观察到系统性行为（功能性组合性）

争议：功能性组合性能否保证 Fodor & Pylyshyn 所要求的**必然性**系统性，还是只能保证训练分布内的系统性？

---

## 当代 LLM 研究的共鸣

当代大型语言模型可被视为 Smolensky 亚概念层假说的大规模实现：

- **高维激活向量** ≈ 微特征的激活模式
- **注意力权重** ≈ 软约束的实时计算
- **层间变换** ≈ 约束满足的迭代精炼

[线性表征假说](linear-representation-hypothesis.md) 和 [时空世界模型](spatiotemporal-world-model.md) 的实证研究表明：LLM 内部确实形成了 Smolensky 所预期的那种亚概念结构——可解码但非显式的线性方向编码。

[Dhar & Søgaard 2024](../sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md) 的研究则在行为层面检验：亚概念层的学习是否产生符号层面的系统性组合能力？答案是：**部分是，但不稳定**。

---

## 关联概念

- 调和理论（Harmony Theory） — 亚概念层的计算原理：约束满足与全局一致性最大化（尚无独立页面）
- [系统性](systematicity.md) — Fodor & Pylyshyn 的核心批判，Smolensky 试图在亚概念层上回应
- [组合性](compositionality.md) — 亚概念层通过张量积表征尝试实现的属性
- [神经符号 AI](neurosymbolic-ai.md) — 亚概念层概念的现代继承与发展
- [线性表征假说](linear-representation-hypothesis.md) — LLM 内部亚概念结构的实证证据
- [约束解码](constrained-decoding.md) — 将符号约束强加于亚概念计算的工程实践，产生[轨迹偏差](trajectory-bias.md)

---

## References

- Smolensky, P. (1988). On the proper treatment of connectionism. *Behavioral and Brain Sciences*, 11(1), 1–23. → [`sources/smolensky-1988-proper-treatment-connectionism.md`](../sources/smolensky-1988-proper-treatment-connectionism.md)
- Fodor, J. A., & Pylyshyn, Z. W. (1988). Connectionism and cognitive architecture. *Cognition*, 28(1–2), 3–71. → [`sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md`](../sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md)
