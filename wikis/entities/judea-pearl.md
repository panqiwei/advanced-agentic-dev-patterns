# Judea Pearl

Judea Pearl（1936—）是以色列裔美国计算机科学家、哲学家，UCLA 计算机科学教授，2011 年图灵奖获得者。他是现代因果推理理论的奠基人，创立了 [结构因果模型](../concepts/structural-causal-model.md)、[do 演算](../concepts/do-calculus.md) 和 [因果之梯](../concepts/ladder-of-causation.md) 等核心框架。

## 核心贡献

### 因果革命

Pearl 的核心贡献是将因果推理从哲学思辨提升为严格的数学学科。在他之前，主流统计学将因果视为"不可证明的关联特例"（Pearson 的实证主义传统）。Pearl 证明因果关系可以被形式化定义、操作和计算。

关键成果：
- **结构因果模型（SCM）**: 将因果关系编码为有序三元组 ⟨U, V, E⟩，统一了因果图和结构方程
- **[do 演算](../concepts/do-calculus.md)**: 完备的规则系统，将因果查询转换为可从观察数据估计的表达式
- **[因果之梯](../concepts/ladder-of-causation.md)**: 关联→干预→反事实的三级抽象，揭示因果推理的不可还原层次
- **后门准则和前门准则**: [因果 DAG](../concepts/causal-dag.md) 上的去混淆判据

### 贝叶斯网络

Pearl 在因果推理之前的工作是贝叶斯网络（1980s），为概率推理提供了高效的图模型框架。因果模型可以视为贝叶斯网络加上因果方向的增强。

### 图灵奖

2011 年图灵奖表彰 Pearl "通过概率和因果推理的发展，对人工智能做出的基础性贡献"。

## 代表作品

- *Causality: Models, Reasoning, and Inference* (2000, 2009) — 因果推理的技术专著
- *The Book of Why: The New Science of Cause and Effect* (2018, 与 Dana Mackenzie 合著) — 面向大众的因果革命叙事

## 与 wiki 已有概念的关系

- **[机制可解释性](../concepts/mechanistic-interpretability.md)**: Pearl 的因果推理框架为理解神经网络内部机制提供了理论工具——归因图可以视为一种因果图
- **[误差级联](../concepts/error-cascade.md)**: 因果模型的链式传播直接描述了多步任务中错误的放大机制

## 因果形而上学中的 Pearl

在 SEP "The Metaphysics of Causation" 综述中，Pearl 的贡献主要体现在：

1. **[因果模型](../concepts/causal-models.md)的形式化**：结构方程模型编码变量间的影响关系，干预通过删除方程来形式化，模块性保证干预的局部性
2. **Halpern-Pearl 框架** (2005)：与 Halpern 合作给出个例因果（actual causation）的形式化定义，成为当代最有影响力的个例因果分析之一
3. **反事实条件句的干预语义**：替代 Lewis 的可能世界语义，为[反事实理论](../concepts/counterfactual-theory.md)提供了基于操控的替代基础
4. **开关案例的处理**：Pearl (2000) 提出的灯泡开关案例成为讨论因果传递性的标准案例

Pearl 的框架与[干预主义理论](../concepts/interventionist-theory.md)（[Woodward](../entities/james-woodward.md) 2003）独立发展但高度互补——Pearl 提供形式化工具，Woodward 提供哲学解释。

## Pearl 2010 综述：框架的自我总结

Pearl 2010 年发表的"An Introduction to Causal Inference"是他对自己框架最权威的单篇综述。这篇论文的独特价值在于它是 Pearl 本人以统一视角呈现 SCM 完整工具链的尝试，涵盖：

- **方法论**: 四步流程（Define-Assume-Identify-Estimate）
- **基础工具**: 截断因式分解、[后门准则](../concepts/backdoor-criterion.md)、[前门准则](../concepts/frontdoor-criterion.md)、do 演算完备性
- **高级应用**: [中介分析](../concepts/mediation-analysis.md)（中介公式）、[因果概率](../concepts/probability-of-causation.md)（PN/PS/PNS）、处理效果的效应（ETT）
- **框架统一**: SCM 如何包含潜在结果框架并为其提供形式基础

这篇论文还包含 Pearl 对潜在结果阵营最尖锐的方法论批评：ignorability 条件对经验研究者不透明、缺乏图模型导致无法系统选择调整变量、以及"没有操纵就没有因果"口号的局限。

## References

- Pearl, Judea; Mackenzie, Dana (2018). *The Book of Why*. Basic Books.
- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press.
- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- Wikipedia, "Causal model" (2026).
- `sources/wikipedia-causal-model.md`
- Stanford Encyclopedia of Philosophy, "The Metaphysics of Causation", `sources/sep-causation-metaphysics.md`
