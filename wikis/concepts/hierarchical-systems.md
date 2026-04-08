# 层级系统（Hierarchical Systems）

## 定义

层级系统是由相互关联的子系统组成的系统，每个子系统自身也具有层级结构——部件包含部件，结构嵌套结构。这不仅指组织架构中的上下级关系，而是更广义的"交互强度驱动的嵌套结构"。

## 核心特征

Herbert Simon 在 [The Architecture of Complexity](../sources/simon-architecture-of-complexity-notes.md)（1962）中指出层级结构是复杂系统最普遍的组织形式：

- **普遍性**：社会组织（公司、家庭）、生物系统（细胞、器官）、物理系统（粒子→原子→分子）、符号系统（章→节→段）都呈现层级结构
- **交互强度定义层级**：物理/生物系统中空间邻近性暗示强交互；社会系统中强交互不依赖空间距离。Simon 用"交互强度"统一两者——子系统内部交互强于子系统之间的交互
- **跨度（span）**：每一层的子系统数量。跨度影响系统的宽度和深度

## 演化优势

层级结构不是任意选择，而是演化压力的必然结果。Simon 的**钟表匠寓言**（Watchmaker Parable）揭示了核心机制：

> 两个钟表匠 Hora 和 Tempus 制造同样复杂的手表。Tempus 一次性组装所有零件，每次被打断就从头来过；Hora 将零件分成可独立完成的子组件。Hora 成功，Tempus 破产。

推论：**存在稳定中间形态的复杂系统，其通过演化涌现的速度远快于没有中间形态的系统**。层级结构提供了这些稳定中间形态。

这一原理同样适用于人类问题求解——部分进展（可识别的朝目标方向的进步）扮演着"稳定子组件"的角色，指引搜索方向。

## 近可分解性

层级系统天然具有[近可分解性](near-decomposability.md)——这是 Simon 理论的核心结构属性。子系统内部耦合强，子系统之间耦合弱但非零。这意味着：

- 短期内各子系统可近似独立分析
- 长期行为通过子系统间的聚合交互涌现
- 高频动态属于子系统内部，低频动态属于系统整体

## 描述的简化

层级结构的另一个关键优势在于**描述的可压缩性**。Simon 指出：

- 大纲形式是描述层级系统的自然方式
- 近可分解系统用大纲描述时信息损失极小
- 层级系统的子系统种类通常有限（冗余性），进一步压缩描述

"没有守恒定律要求复杂系统的描述和被描述对象一样庞大。"

## 在 Agentic 系统中的映射

层级结构思想在本 wiki 覆盖的多个领域有直接映射：

- **[Harness engineering](harness-engineering.md)**：agent harness 本身就是层级系统——system prompt 设定全局约束，工具定义规定局部能力，权限系统控制边界。好的 harness 设计遵循层级分解原则
- **[Agent OS](agent-os.md)**：操作系统的经典层级（硬件→内核→系统调用→用户态）映射到 agent 架构（LLM→harness→tools→用户交互）
- **[Context engineering](context-engineering.md)**：描述复杂性的"大纲形式"与 context 的结构化组织直接相关——正确的层级表示可以在有限 token 预算内传达更多信息
- **[Agent Skills](agent-skills.md)**：技能的可组合打包标准体现了层级组织原则——基础技能组合成复合技能，复合技能组合成工作流

## References

- Simon, H. A. (1962). "The Architecture of Complexity". *Proceedings of the American Philosophical Society*, 106(6), 467-482. 笔记: `sources/simon-architecture-of-complexity-notes.md`
