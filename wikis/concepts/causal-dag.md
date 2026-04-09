# 因果有向无环图（Causal DAG）

因果 DAG 是用有向无环图表示变量间因果关系的图形工具。每个节点代表一个变量，每条有向边表示一个直接因果影响。DAG 是 [结构因果模型](structural-causal-model.md) 的定性骨架。

## 核心结构

### 三种基本连接模式

DAG 中任意三个相邻节点只有三种连接方式，每种都有独特的统计含义：

**链（Chain）**: A → B → C
- B 是 A 对 C 影响的**中介**（mediator）
- 条件化 B 后，A 和 C 独立（信息流被阻断）
- 实例：吸烟 → 焦油沉积 → 肺癌

**叉（Fork）**: A ← B → C
- B 是 A 和 C 的**共同原因**（confounder）
- 条件化 B 后，A 和 C 之间的虚假相关消失
- 实例：夏天 → 冰淇淋销量；夏天 → 溺水率

**对撞（Collider）**: A → B ← C
- B 是 A 和 C 的**共同结果**
- 默认状态下 A 和 C 独立；条件化 B 后反而**产生**虚假相关（对撞偏差）
- 实例：才华 → 名校录取 ← 家境

### 关键节点类型

- **中介（Mediator）**: 传递因果影响的中间节点
- **混淆因子（Confounder）**: 同时影响原因和结果的变量，控制它可消除虚假相关
- **工具变量（Instrumental Variable）**: 仅通过原因变量间接影响结果，无直接路径和混淆

## d-分离

d-分离（d-separation）是 DAG 中判断条件独立性的图论准则。给定变量集 Z，如果 Z 阻断了 X 和 Y 之间的所有路径，则 X 和 Y 在给定 Z 下 d-分离（条件独立）。

d-分离规则：
- 链和叉中，条件化中间节点阻断路径
- 对撞中，条件化中间节点**打开**路径（反直觉）

## 去混淆

### 后门调整（Backdoor Adjustment）

后门路径是从 X 到 Y 的路径中，起始箭头指向 X 的路径。后门准则要求找到变量集 Z 使得：(1) Z 中没有 X 的后代；(2) Z 阻断所有后门路径。满足后门准则时：

P(Y|do(X)) = Σ_z P(Y|X, Z=z)P(Z=z)

### 前门调整（Frontdoor Adjustment）

当混淆变量不可观测时，如果所有从 X 到 Y 的正向路径都经过可观测的中介变量集 Z，可以通过前门调整估计因果效应。这提供了一种在无法消除混淆的情况下仍能进行因果推断的途径。

## Pearl 2010 的补充：图中缺失的箭头比存在的箭头更重要

Pearl 2010 综述强调了一个常被忽视的要点：在因果 DAG 中，因果假设编码在**缺失的连接**中，而非存在的连接中。一条箭头仅表示因果连接的*可能性*（其强度待数据确定）；一条缺失的箭头声称零影响；一条缺失的双箭虚线声称零协方差。

这意味着：
- 任何单个因果假设都不可从观测数据中检验
- 但所有假设的**总体**往往有可检验蕴含——通过 d-分离判据导出条件独立性预测
- 这些条件独立性蕴含是结构方程模型面对非实验数据审视的**主要窗口**

## 与 wiki 已有概念的关系

- **[结构因果模型](structural-causal-model.md)**: DAG 是 SCM 的图形表示，编码定性因果结构
- **[do 演算](do-calculus.md)**: 在 DAG 上操作的形式化规则系统
- **[因果之梯](ladder-of-causation.md)**: DAG 服务于因果之梯的第二级（干预）和第三级（反事实）
- **[层级系统](hierarchical-systems.md)**: DAG 的模块化分解与 Simon 的层级系统理论共享"近可分解性"的结构洞察
- **[后门准则](backdoor-criterion.md)**: DAG 上的图形化混淆消除判据
- **[前门准则](frontdoor-criterion.md)**: DAG 上利用中介变量的替代去混淆路径

## References

- Pearl, Judea; Mackenzie, Dana (2018). *The Book of Why*. Basic Books.
- Pearl, Judea (2009). *Causality: Models, Reasoning, and Inference*. Cambridge University Press.
- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- `sources/wikipedia-causal-model.md`
