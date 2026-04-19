# 认知系统性（Systematicity）

**定义：** 认知能力在结构上相互关联的必然属性——能够思考 P 的生物，必然能够思考 P 的结构邻项。这种关联不是训练的偶然结果，而是认知架构的结构保证。

---

## 核心现象

正常成人的认知能力呈现特征性的**系统性模式**：

- 能理解"John loves Mary"的人，必然能理解"Mary loves John"
- 能推理 R(a, b) 的人，必然能推理 R(b, a)
- 能处理"大红球"的人，必然能处理"红的大球"

这种模式的关键性质是**必然性**：你无法让一个人学会某个命题却让他无法理解其结构变体——不是因为任务难，而是因为拥有相关概念在构成上就足以赋予这种能力。

---

## 为什么系统性重要

Fodor & Pylyshyn（1988）将系统性确立为**区分认知架构的决定性试验**：

> 任何使系统性成为偶然的架构，都是错误的架构。

这把球抛给了联结主义：若一个神经网络训练于"John loves Mary"后，能否处理"Mary loves John"是**偶然的**（取决于训练数据和权重），那么该架构就无法解释人类认知的系统性。

---

## 经典架构如何解释系统性

[物理符号系统](physical-symbol-system.md) / [思维语言](language-of-thought.md) 架构通过**组合句法结构**自动解释系统性：

- "John loves Mary"的心理表征包含 JOHN、LOVES、MARY 作为**组成部分**
- 具备该表征就具备了形成"Mary loves John"所需的全部成分
- 系统性是[组合性](compositionality.md)的**结构性推论**，不需要额外解释

---

## 联结主义的困难

标准联结主义网络中：
- "John loves Mary"的分布式表征不必然包含可分离的 JOHN / LOVES / MARY 成分
- 在该表征上训练后，能否处理"Mary loves John"依赖权重配置——是**暴力偶然性**（brute contingency）
- 网络可能被训练成能处理一句却不能处理另一句，而这种情况在人类认知中不会发生

Fodor & Pylyshyn 将此称为：联结主义将一个**非偶然的认知事实**变成了**偶然的工程事实**。

---

## 联结主义的应对策略

### 实现层应对（Smolensky 1988）
联结主义系统在**行为层面**表现出组合性（功能性组合性），即使底层没有显式的符号组成部分。系统性通过调和函数（harmony function）的全局优化涌现，不需要显式组合结构。

批评：功能性系统性依赖训练分布，不能保证在新颖案例上的一致性。

### 张量积表征（Smolensky 1990）
用向量张量积构造具有"真实"组成部分的分布式表征：JOHN ⊗ role_agent + LOVES ⊗ role_verb + MARY ⊗ role_patient。这是否满足 Fodor & Pylyshyn 的"真实组合性"要求仍有争议。

---

## 当代 LLM 中的系统性

[Dhar & Søgaard 2024](../sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md) 对四个 LLM 家族的实证研究：

- **规模提升组合能力**：大模型在系统性任务上表现更好，说明规模确实带来某种结构泛化
- **指令微调降低系统性**：RLHF 优化的代理目标与组合结构对齐不一致，导致系统性退化
- **系统性仍是部分的**：LLM 的系统性远未达到人类认知的程度，且依赖训练分布

这些结果在 40 年后为 Fodor & Pylyshyn 的预测提供了定量验证：大型联结主义系统确实表现出**一些**系统性，但系统性的**可靠性**和**分布外泛化**仍是弱点。

---

## 关联概念

- [思维语言](language-of-thought.md) — 系统性的架构解释基础
- [组合性](compositionality.md) — 系统性的逻辑前提：部分-整体的意义函数关系
- [物理符号系统假说](physical-symbol-system.md) — 经典架构对系统性的解释机制
- [神经符号 AI](neurosymbolic-ai.md) — 试图在联结主义基础上恢复系统性的研究纲领
- [命题固着](propositional-fixation.md) — 系统性失败的另一角度：联结主义无法表达完整命题
- [轨迹偏差](trajectory-bias.md) — 实证案例：符号约束与联结生成的系统性摩擦
- [线性表征假说](linear-representation-hypothesis.md) — LLM 内部的结构化表征，或为系统性的神经基础

---

## References

- Fodor, J. A., & Pylyshyn, Z. W. (1988). Connectionism and cognitive architecture: A critical analysis. *Cognition*, 28(1–2), 3–71. → [`sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md`](../sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md)
- Dhar, R., & Søgaard, A. (2024). From words to worlds: Compositionality for cognitive architectures. *arXiv:2407.13419*. → [`sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md`](../sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md)
- Smolensky, P. (1988). On the proper treatment of connectionism. *Behavioral and Brain Sciences*, 11(1), 1–23. → [`sources/smolensky-1988-proper-treatment-connectionism.md`](../sources/smolensky-1988-proper-treatment-connectionism.md)
