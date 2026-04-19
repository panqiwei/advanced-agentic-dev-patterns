# 组合性（Compositionality）

**定义：** Frege（1892）提出的语义原则：**复杂表达式的意义是其组成部分的意义及其组合方式的系统性函数**。这是语言哲学和认知科学中组织表征能力的核心原则。

---

## 原则的形式表述

**Frege 原则**（也称"组合性原则"）：

> M(f(a, b)) = F(M(a), M(b), f)

其中 M 是意义函数，f 是句法结构，a、b 是组成部分，F 是语义组合规则。

意义的三个要素：
1. **部分的意义**：JOHN 表示约翰，LOVES 表示爱，MARY 表示玛丽
2. **句法结构**：LOVES(JOHN, MARY) 中，JOHN 是论元一，MARY 是论元二
3. **组合规则**：谓词-论元结构的语义解释规则

---

## 为什么组合性重要

### 可学习性论证
人类用有限的词汇和有限的规则，能理解和产生无限多从未见过的表达式。这只能通过组合性来解释——学会部分和规则，就能组合出任意新表达。

### 系统性论证
组合性是[系统性](systematicity.md)的逻辑基础：若系统具有真正的组合表征，则"John loves Mary"的表征必然包含 JOHN、LOVES、MARY 作为组成部分，从而**保证**了理解"Mary loves John"的能力。

### 可预测性
组合性使语义行为可以从部分预测整体，是语言理解**可解释性**的基础。

---

## 组合性与联结主义的张力

### 标准分布式表征的问题

联结主义的分布式表征（激活向量）通常**不具备组合性**：
- "John loves Mary"的激活模式中，没有可识别的 JOHN / LOVES / MARY 子部分
- 向量叠加（superposition）改变了整个激活模式，无法析出组成部分
- 语义组合无法通过对激活向量的代数运算来准确捕获

Fodor & Pylyshyn（1988）: 联结主义的"表征"是**全局的**，而非组合的；系统性因此成为偶然的训练结果，而非架构保证。

### Smolensky 的张量积解答（1990）

通过**张量积**构造：
```
JOHN ⊗ role_agent + LOVES ⊗ role_verb + MARY ⊗ role_patient
```

这种"分布式、张量积的组合性"可以数学地分解出角色绑定的成分。批评：这实际上在联结主义底层重新实现了符号结构，可能只是另一种"实现经典架构"的形式。

---

## 功能性组合性 vs 结构性组合性

| 类型 | 定义 | 代表立场 |
|------|------|---------|
| **结构性组合性** | 表征在结构上由组成部分构成，句法操作可以操纵这些部分 | Fodor & Pylyshyn，经典 AI |
| **功能性组合性** | 系统在行为上表现出组合性，但不要求底层表征具有显式组成部分 | Smolensky，联结主义 |

争论的核心：功能性组合性是否足以解释认知的系统性？

Fodor & Pylyshyn 的立场：**不足够**。功能性组合性依赖训练分布，无法保证新颖案例上的系统性——而人类认知中的系统性是**不依赖训练历史**的必然属性。

---

## LLM 时代的实证证据

[Dhar & Søgaard 2024](../sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md) 对 LLM 组合能力的系统测试：

### 测试的三个维度
- **可替换性**（Substitutivity）：同义词替换不改变意义——等价于最弱的组合性要求
- **系统性与全局性**（PLANE）：已知组合模式在新语境中的泛化
- **过度泛化**（COMPCOMB）：区分组合性化合物与非组合性化合物（turncoat ≠ 一种 coat）

### 关键发现
- 规模提升组合能力（与 Fodor & Pylyshyn 的预测部分相符——联结主义可以**接近**组合性）
- 指令微调**降低**组合性（RLHF 优化目标与组合语义结构不对齐）
- 形容词-名词组合（subsective adjectives）是持续的弱点——与儿童发展轨迹平行

---

## 工程层面的组合性

当代 LLM 工程中多处涉及组合性：

- **结构化输出**（[structured-outputs](structured-outputs.md)）：JSON Schema 是一种**规范组合性**——复杂 JSON 对象的结构由其字段的类型和嵌套关系确定
- **约束解码**（[constrained-decoding](constrained-decoding.md)）：上下文无关文法（CFG）是组合性的标准形式化——产生式规则定义了如何从部分组合成整体
- **轨迹偏差**（[trajectory-bias](trajectory-bias.md)）：将符号组合约束施加于联结主义生成时，会产生语义偏移——这正是结构性组合性与功能性组合性之间摩擦的工程表现

---

## 关联概念

- [系统性](systematicity.md) — 组合性最重要的认知推论
- [思维语言](language-of-thought.md) — 组合性在心理表征层面的实现假说
- [物理符号系统假说](physical-symbol-system.md) — 经典架构对组合性的结构保证
- [神经符号 AI](neurosymbolic-ai.md) — 试图在联结主义中实现组合性的研究纲领
- [约束解码](constrained-decoding.md) — 工程层面用 CFG 强制组合性的实践
- [上下文无关文法（LLM 中）](context-free-grammar-llm.md) — 约束解码的组合性形式化工具

---

## References

- Frege, G. (1892). Über Sinn und Bedeutung [On sense and reference]. *Zeitschrift für Philosophie und philosophische Kritik*, 100, 25–50.
- Fodor, J. A., & Pylyshyn, Z. W. (1988). Connectionism and cognitive architecture: A critical analysis. *Cognition*, 28(1–2), 3–71. → [`sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md`](../sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md)
- Smolensky, P. (1988). On the proper treatment of connectionism. *Behavioral and Brain Sciences*, 11(1), 1–23. → [`sources/smolensky-1988-proper-treatment-connectionism.md`](../sources/smolensky-1988-proper-treatment-connectionism.md)
- Dhar, R., & Søgaard, A. (2024). From words to worlds. *arXiv:2407.13419*. → [`sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md`](../sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md)
