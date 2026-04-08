# 近可分解性（Near-Decomposability）

## 定义

近可分解性是[层级系统](hierarchical-systems.md)的核心结构属性：子系统**内部**的交互远强于子系统**之间**的交互，但跨子系统的交互并非零——是"弱但不可忽略"的。

这个"近"字至关重要。完全可分解意味着子系统之间零交互（各自孤立），完全不可分解意味着所有部件等强度交互（无法区分子系统边界）。现实中的复杂系统几乎都落在两者之间。

## 来源

Herbert Simon 在 [The Architecture of Complexity](../sources/simon-architecture-of-complexity-notes.md)（1962）中正式提出这一概念。他引用了自己在 *Econometrica*（1961）发表的 "Aggregation of Variables in Dynamic Systems" 作为数学基础。

## 两个推论

近可分解性产生两个直接推论：

### 短期独立性

各子系统的短期行为近似独立于其他子系统的短期行为。这意味着可以局部分析、局部修改、局部测试——不需要理解整个系统就能处理一个子系统。

### 长期聚合耦合

子系统之间的长期行为仅以**聚合方式**（aggregate way）相互影响。不需要知道另一个子系统内部的每个细节，只需要知道它的聚合输出。

## 频率分离

Simon 指出近可分解系统中存在动态过程的频率分离：

- **高频动态**：属于子系统内部（快速变化，局部影响）
- **低频动态**：属于更大系统层面（缓慢变化，全局影响）

笔记作者（Liz Voeller）注意到这与 Stewart Brand 的 **pace layers** 概念高度相似——不同层级以不同速率变化，快层创新，慢层稳定。

## 在 Agentic 系统中的映射

近可分解性为理解 agent 系统架构提供了精确的分析框架：

### Harness 的分层约束

[Harness engineering](harness-engineering.md) 的核心设计原则隐含了近可分解性：

- System prompt（低频）设定全局约束，不随每次工具调用而变
- 工具执行（高频）在局部快速迭代，不影响全局约束
- [Feature tracking](feature-tracking.md) 作为聚合状态在两个频率之间传递信息

### Context 的层级组织

[上下文管理](context-management.md)策略本质上是在利用近可分解性：

- [Compaction](context-compression.md) 将高频细节压缩为聚合摘要——这正是近可分解系统允许的操作
- [虚拟上下文管理](virtual-context-management.md)的分页/换出机制利用了短期独立性——不活跃的子系统可以移出 context window 而不影响当前工作

### Agent OS 的资源隔离

[Agent OS](agent-os.md) 和 [Agent 沙箱](agent-sandboxing.md)的设计利用了近可分解性的安全含义——子系统之间的弱耦合意味着可以在隔离边界处设置安全控制，而不需要审查每个内部交互。

### 团队协作与 A2A

[A2A 协议](a2a-protocol.md)和 [agent 互操作](agent-interoperability.md)的可行性前提就是近可分解性——不同 agent 之间只需要交换聚合级信息（Task 状态、Artifact），不需要共享内部推理过程。

## 与钟表匠寓言的关系

近可分解性解释了**为什么** Hora 的策略有效：子组件（10 个零件）构成近可分解的子系统，组件内零件强交互、组件间仅通过接口弱交互。被打断时只丢失一个子系统的进度，不影响已完成的其他子系统。

## References

- Simon, H. A. (1962). "The Architecture of Complexity". *Proceedings of the American Philosophical Society*, 106(6), 467-482. 笔记: `sources/simon-architecture-of-complexity-notes.md`
- Simon, H. A. (1961). "Aggregation of Variables in Dynamic Systems". *Econometrica*.
