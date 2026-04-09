# Causal Model（因果模型）— Wikipedia

- **来源**: [Causal model - Wikipedia](https://en.wikipedia.org/wiki/Causal_model)
- **类型**: 百科全书条目
- **抓取时间**: 2026-04-09

## 摘要

本条目系统介绍因果模型（又称结构因果模型，Structural Causal Model）的定义、历史、核心机制和应用。因果模型是表示系统内因果机制的概念模型，使用有向无环图（DAG）和结构方程来描述变量间的因果关系，从而超越纯粹的统计相关性。

## 核心内容

### Pearl 的形式化定义

Judea Pearl 将因果模型定义为有序三元组 ⟨U, V, E⟩：
- **U** — 外生变量集合（由模型外部因素决定）
- **V** — 内生变量集合（由模型内部因素决定）
- **E** — 结构方程集合，表达每个内生变量作为其他变量的函数

### 因果之梯（Ladder of Causation）

Pearl 提出因果推理的三级抽象：
1. **关联（Association）** — 观察层：发现数据中的规律和相关性，P(Y|X)
2. **干预（Intervention）** — 行动层：预测刻意行动的效果，P(Y|do(X))
3. **反事实（Counterfactual）** — 想象层：构建解释因果机制的理论，推演未发生的情景

### do 演算

do 演算是一套完备的规则系统，用于将包含 do 算子的表达式转换为不含 do 的表达式（从而可以从观察数据中估计因果效应）。三条规则分别处理：
1. 观察变量的添加/删除
2. 干预与观察的互换（后门准则满足时）
3. 无因果路径时干预的删除

### 因果图结构

三种基本连接模式：
- **链（Chain）**: A → B → C（B 是中介）
- **叉（Fork）**: A ← B → C（B 是混淆因子）
- **对撞（Collider）**: A → B ← C（条件化 B 产生虚假相关）

### 去混淆技术

- **后门调整（Backdoor Adjustment）**: 控制满足后门准则的变量集合，阻断所有非因果路径
- **前门调整（Frontdoor Adjustment）**: 当混淆变量不可观测时，通过前门路径上的中介变量估计因果效应

### 反事实推理

三步法：溯因（Abduct）→ 行动（Act）→ 预测（Predict）。可区分直接效应和间接（中介）效应。

### 可迁移性（Transportability）

因果模型允许跨数据集整合数据，解决外部效度问题——即一项研究的结论能否应用于不同情境。

## 历史脉络

从 Wright 1921 年路径分析 → Pearson 的反因果实证主义 → 1960s 路径分析重新发现 → Lewis 1973 反事实 → Rubin 1974 潜在结果 → Pearl 的因果革命。关键转折：因果推理从被统计学排斥，到最终获得严格的数学形式化。

## 与 wiki 已有概念的关系

- **[误差级联](../concepts/error-cascade.md)**: 因果模型的链式结构（A→B→C）正是误差级联的形式化基础——前序节点的错误通过因果路径传播到后续节点
- **[机制可解释性](../concepts/mechanistic-interpretability.md)**: 归因图（attribution graphs）本质上是神经网络内部的因果图，追踪特征间的因果影响
- **[层级系统](../concepts/hierarchical-systems.md)**: Simon 的近可分解性与 DAG 中的条件独立性在结构上同构——都描述子系统间的弱耦合

## References

- Pearl, Judea; Mackenzie, Dana (2018). *The Book of Why: The New Science of Cause and Effect*. Basic Books.
- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press.
- Greenland, S.; Pearl, J.; Robins, J.M. (1999). "Confounding and Collapsibility in Causal Inference". *Statistical Science*.
- Hernán, M.A.; Robins, J.M. (2020). *Causal Inference: What If*. Chapman & Hall/CRC.
- Stanford Encyclopedia of Philosophy, "Causal Models" (2018).
- `sources/wikipedia-causal-model.md`
