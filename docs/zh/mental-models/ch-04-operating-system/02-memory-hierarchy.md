# 内存层次结构

<div class="mm-article" data-card="assets/memory-hierarchy.png" data-card-alt="内存层次结构——用有限快速存储模拟无限慢速存储" markdown>

Context window 的有限性不是临时的工程限制，不会随着窗口扩大而消失。这是一个更古老的问题在新计算范式里的重现——OS 已经解决过一次了。

## 内存的物理现实

计算机的存储是分层的，原因只有一个：快速存储很贵，便宜的存储很慢。这个约束在每一代存储技术上都成立——从磁芯到 DRAM 到 SSD 到 NVMe，从未例外。

CPU 寄存器访问在 1 纳秒以内，但只有几十字节——多一个字节也放不下。L1/L2 cache 在几纳秒，几兆字节。RAM 在 100 纳秒，几十 GB。磁盘是毫秒级，但可以装下 TB。每跨一层，速度掉一个数量级，容量涨一个数量级，这个规律从没有被打破过。

这个金字塔的设计原则是**局部性**：程序倾向于反复访问同一批数据（时间局部性），以及访问相邻位置的数据（空间局部性）。把最近用过的、最常用的数据放在快速层，其余放在慢速层，整体性能接近最快的存储。

**虚拟内存**是这个金字塔的关键创新：程序以为自己有连续的大内存空间，OS 在背后把最活跃的页面放在 RAM，其余放在磁盘。程序访问一个不在 RAM 里的地址，硬件触发 page fault，OS 把对应的页从磁盘读进来，替换出一个最少用的页，然后继续执行——程序对这个过程一无所知。这叫透明性：底层的搬运不需要程序配合。

## Agent 系统的内存金字塔

对应关系是直接的：

| OS 内存层次 | Agent 系统对应 | 管理方 |
|:---|:---|:---|
| CPU cache | KV cache（推理加速）| 推理基础设施，自动管理 |
| RAM | Context window | Harness 的核心管理对象 |
| 磁盘 | 向量数据库 / 外部存储 | Harness 显式管理 |
| 网络存储 | 外部 API / 知识库 | Agent 按需调用 |

核心问题不变：**用有限的快速存储，模拟对无限慢速存储的访问**。Context window 是 RAM——容量有限，但推理时 LLM 直接访问；向量库是磁盘——容量大，但每次检索都需要额外操作。

## 虚拟内存的 agent 实现

UC Berkeley 的 MemGPT（2023）把这个问题做成了显式的系统设计。Main context = RAM（LLM 直接访问），archival memory = 磁盘（外部存储）。当 agent 需要历史记录，通过函数调用从 archival memory 读入 context——这是 page fault 的 agent 版本。Context 接近上限时，压缩摘要写回外部存储——这是 page eviction。

结构上，这是同一个设计模式："用有限快速存储模拟无限慢速存储"，在不同计算层的重现。

但有一个差异要指出：OS 的 page fault 对进程**完全透明**，由硬件在进程不知情的情况下触发和处理。MemGPT 的"page fault"则是 **LLM 主动生成的函数调用**——LLM 知道自己在做检索，并决定何时检索什么。透明性这一维度是倒置的。资源管理层的同构是真实的；透明度的设计哲学相反。

这个区别不是缺陷，是自然语言推理系统的结构性特征：LLM 必须主动参与自己的内存管理，因为它本身就是判断"什么信息现在需要"的那个系统。

## 基础设施下沉

MemGPT 是研究原型，Anthropic 的 Compaction API 把同样的思路变成了生产基础设施。当 context 接近上限，API 服务端自动执行摘要压缩，生成 compaction block，从压缩后的状态继续对话。

这是 OS 历史里一个熟悉的轨迹：研究里出现的虚拟内存概念，最终被下沉到 OS kernel，让应用程序不再需要手动管理物理内存。Compaction API 在做同样的下沉——把本来需要 harness 工程师自己搭建的分页系统变成基础设施层的标配。

## 断裂点：page fault 的代价不对称

OS 的 page fault 只加延迟，不改变计算结果。磁盘上的数据和 RAM 里的一模一样，搬运是精确复制，不引入错误。程序在 page fault 之前和之后的行为完全一致，只是慢了一点。

Agent 的"page fault"则不然。如果从外部存储检索到的信息不相关——哪怕它语义上接近，内容上不准确——它不只是让 agent 慢下来，它会**主动伤害推理质量**。Chroma 在 18 个前沿模型上的研究（包括 GPT-4.1、Claude 4、Gemini 2.5、Qwen3）量化了这一点：distractor interference 机制下，与目标语义相关但内容不正确的内容，对模型性能的损害超过了内容完全缺失的情况。

错误的上下文比缺失的上下文更糟——在 distractor interference 的实验条件下如此。OS 内存管理从来不用担心这个：磁盘上存的内容不会"不对"，只会"读不到"。Agent 系统的"内存管理"多了一个维度：不只是数据在不在，还有数据对不对。

## 窗口变长不消灭管理需求

一个自然的问题：context window 越来越长（从 4K 到 1M），管理的必要性会随之消失吗？

RAM 容量从 256MB 增长到 64GB，没有消灭虚拟内存——反而催生了更复杂的内存管理系统（更大的页表、更精细的页替换算法、NUMA 架构）。原因是局部性依然存在：程序并不均匀地访问所有内存，热点数据仍然需要优化。

Context window 同理。1M context 意味着可以放入更多信息，也意味着注意力稀释的问题更严重。Chroma 的数据是跨模型一致的：随着输入长度增加，模型性能下降——不是因为窗口不够大，而是因为**注意力是稀缺的**。更长的 context 里，信号被稀释得更厉害。

管理需求不会随容量扩展而消失；它随着系统复杂度的增长而增长。

---

调度解决的是另一个方向的问题：不是"什么信息在 context 里"，而是"谁在什么时候用 LLM"。多个 agent 共享一个推理引擎，仲裁机制是必要的——这是 OS kernel 的另一个核心职责。

</div>

---

## 延伸阅读

- Packer, C. et al. (2023). *MemGPT: Towards LLMs as Operating Systems*. arXiv:2310.08560. — 把 OS 虚拟内存的设计模式显式移植到 agent 系统的第一篇论文：main context = RAM，archival memory = 磁盘，函数调用 = page fault
- Chroma. (2025). *Context Rot: How Long Contexts Degrade LLM Performance*. research.trychroma.com. — 量化了本文的核心断裂点：错误的上下文比缺失的上下文更糟，跨 18 个前沿模型一致成立

## 概念与实体

本文涉及的核心概念与实体，在项目知识库中有更详细的资料：

- [Context Management](../../wiki/concepts/context-management.md) — 本文讨论的内存层次结构，在工程实践中对应的管理机制
- [Context Compression](../../wiki/concepts/context-compression.md) — 文中 Compaction API 所做的"page eviction"背后的压缩技术
- [Virtual Context Management](../../wiki/concepts/virtual-context-management.md) — MemGPT 式的虚拟内存方案在 agent 系统中的完整展开
- [Context Rot](../../wiki/concepts/context-rot.md) — Chroma 研究量化的"注意力稀释"现象的详细资料
- [MemGPT](../../wiki/entities/memgpt.md) — 本文引用的虚拟内存研究原型的项目资料
- [Anthropic](../../wiki/entities/anthropic.md) — Compaction API 的提供方，正在将虚拟内存机制下沉为基础设施
