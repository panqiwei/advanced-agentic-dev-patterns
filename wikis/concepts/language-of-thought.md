# 思维语言（Language of Thought / Mentalese）

**定义：** Fodor（1975）提出的认知架构假说：思维是对句法结构化符号表达式的计算，这些表达式构成一种"心理语言"（Mentalese），具有与自然语言类似的组合句法和语义结构。

---

## 核心主张

思维语言假说（Language of Thought Hypothesis, LOTH）包含三个相互关联的承诺：

### 1. 表征是句法结构化的
心理状态的内容由心理表征携带，这些表征像自然语言句子一样具有**组成部分**——概念对应于 Mentalese 的"词汇"，命题对应于 Mentalese 的"句子"。

### 2. 过程对句法形式敏感
心理计算过程对表征的**句法形式**而非语义内容直接作用。意义通过句法结构间接发挥作用——这是计算的**形式性原则**（Formality Condition）。

### 3. 语义由组合性确定
复杂心理表征的语义内容由其组成部分的语义内容及其组合方式**系统性地**决定（参见[组合性](compositionality.md)）。这是意义的构成性解释。

---

## 为什么需要 LOTH

### 解释系统性
最强的论据来自[系统性](systematicity.md)：能思考"John loves Mary"的生物必然能思考"Mary loves John"。

在 LOTH 框架下，这是必然的：两个思想共享相同的 Mentalese 组成部分（JOHN、LOVES、MARY），只是排列不同。拥有组成部分就意味着拥有形成两者的能力。

### 解释生产力
人类能理解和产生无数从未遇到过的命题。LOTH 用有限词汇+有限规则的组合机制解释这一点——与自然语言形式语法的解释方式相同。

### 解释推理的保结构性
逻辑上有效的推理在系统内有效，跨语境有效。LOTH 解释了为什么推理能力也具有系统性（[推理一致性](systematicity.md)）。

---

## 与经典架构的关系

思维语言假说与[物理符号系统假说](physical-symbol-system.md)（PSSH）的关系：

| 维度 | PSSH（Newell & Simon 1976） | LOTH（Fodor 1975） |
|------|---------------------------|-------------------|
| 主要关切 | 符号系统的充分必要性论证 | 思维的句法结构化 |
| 出发点 | 计算机科学 + 认知心理学 | 语言哲学 + 认知语言学 |
| 核心命题 | 物理符号系统是通用智能的充要条件 | 思维是 Mentalese 上的计算 |
| 对神经实现的态度 | 认为符号层与神经层兼容 | 同上 |

两者相互支撑：PSSH 提供了符号操作的物理实现理论，LOTH 提供了为什么这种操作必须在**语言样结构**上进行的语义动机。

---

## 联结主义的挑战与 LOTH 的回应

### 联结主义的挑战（1980s–1990s）

Smolensky（1988）提出联结主义系统可以在**亚概念层**（subconceptual level）表征认知内容，无需显式的 Mentalese 句子结构。系统性可通过调和函数优化的涌现行为来解释。

### Fodor & Pylyshyn 的回应（1988）

即使联结主义系统在行为上表现出组合性，若这种组合性是通过训练偶然获得而非架构保证，它就无法解释系统性的**必然性**。

实现解释：若联结主义系统通过实现经典组合结构来达到系统性，那么 LOTH 在认知层面仍然成立——联结主义只是实现底层，不是认知架构层。

---

## 当代争论

### LLM 是否是 Mentalese 的连续近似？

一种温和立场：LLM 的高维激活向量或许是"连续 Mentalese"——具有功能性组合结构但不具有离散句法结构的表征。[线性表征假说](linear-representation-hypothesis.md)和[时空世界模型](spatiotemporal-world-model.md)的研究表明 LLM 内部确实形成了线性、可分离的结构表征。

### 组合性是否可以浮现？

[Dhar & Søgaard 2024](../sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md) 的实证研究显示 LLM 规模增大确实提升组合能力，但指令微调会降低组合性。这与 LOTH 的预测（组合性应当是结构保证而非训练偶然）存在部分对立。

---

## 关联概念

- [系统性](systematicity.md) — LOTH 最强的支持论据
- [组合性](compositionality.md) — LOTH 的核心语义原则
- [物理符号系统假说](physical-symbol-system.md) — 经典架构的计算理论基础
- [神经符号 AI](neurosymbolic-ai.md) — 试图调和 LOTH 与联结主义的研究纲领
- [命题固着](propositional-fixation.md) — 联结主义对 LOTH 所需命题结构的表达局限
- [线性表征假说](linear-representation-hypothesis.md) — LLM 内部结构化表征的实证证据

---

## References

- Fodor, J. A. (1975). *The Language of Thought*. Harvard University Press.
- Fodor, J. A., & Pylyshyn, Z. W. (1988). Connectionism and cognitive architecture: A critical analysis. *Cognition*, 28(1–2), 3–71. → [`sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md`](../sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md)
- Smolensky, P. (1988). On the proper treatment of connectionism. *Behavioral and Brain Sciences*, 11(1), 1–23. → [`sources/smolensky-1988-proper-treatment-connectionism.md`](../sources/smolensky-1988-proper-treatment-connectionism.md)
