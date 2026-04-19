# Bitter Lesson（苦涩的教训）

## 定义

Rich Sutton 2019 年提出的 AI 研究元原则：利用通用计算的方法（搜索和学习）最终总是以巨大优势胜出，而试图将人类领域知识内建到系统中的方法虽然短期有效，但长期会停滞甚至阻碍进展。

这是一个关于"元方法 vs 具体知识"的命题：不要内建你发现了什么，要内建发现的过程。

## 在 Agent Engineering 中的体现

Bitter Lesson 原本描述的是模型训练层面的规律（搜索 vs 手工特征），但在 agent 工程中，它在另一个层面复现：**harness 中编码的"模型做不到什么"的假设会随模型能力提升而过时**。

[Managed Agents](../sources/anthropic-managed-agents.md) 给出了一个具体案例：Sonnet 4.5 在接近 context 上限时表现出 "context anxiety"（过早收尾），harness 中加入 context reset 来缓解。但 Opus 4.5 上这个行为消失了——context reset 变成了死重。

这正是 Sutton 描述的模式：
1. 研究者观察到模型的局限（短期有效的领域知识）
2. 在 harness 中内建补偿机制（人类知识编码）
3. 模型升级后，补偿机制成为瓶颈（知识过时）

## "What Can I Stop Doing?"

[Harnessing Claude's Intelligence](../sources/anthropic-harnessing-claudes-intelligence.md) 将 Bitter Lesson 在 agent 工程中的实践凝缩为一个问题：**"我可以停止做什么？"** 这是 Bitter Lesson 的逆向操作化——不是"加什么知识"，而是"删什么假设"。

三个维度的权力转移：
- 编排权：从 harness 控制工具调用 → 让模型自主编排
- 上下文管理权：从预加载所有指令 → 让模型按需披露
- 持久化权：从外部检索系统 → 让模型自主管理

## Meta-Harness 作为 Bitter Lesson 的架构回应

如果 harness 中的具体假设注定会过时，那么正确的架构不是设计"完美的 harness"，而是设计一个**能容纳所有未来 harness 的平台**。

[Meta-harness](meta-harness.md) 正是这种回应：对接口有主张，对实现无主张。session、harness、sandbox 的接口是稳定的"元方法"，具体的 harness 实现是可替换的"领域知识"。

这与 Sutton 的结论同构："要内建能找到和捕捉复杂性的元方法"——meta-harness 是 agent 基础设施层的元方法。

## 与 OS 设计的类比

操作系统的持久性验证了 Bitter Lesson 在系统设计中的适用性：`read()` 系统调用不对底层存储介质做假设——它是一个"元接口"，从 1970 年代的磁盘组到现代 SSD 都适用。`read()` 之所以存活了 50 年，正是因为它没有内建关于硬件的具体知识。

## 与 Kautz 框架的对话

Kautz 的 [AI 三个夏天历史框架](ai-summers-history.md) 与 Bitter Lesson 形成有趣的张力：

- **Sutton** 强调：通用计算方法（搜索+学习）总是胜出，将人类领域知识内建是短视的
- **Kautz** 强调：神经与符号的历史是共同演化，符号方法从未真正"失败"，只是等待与神经方法的正确集成

两者并非矛盾：Sutton 批判的是静态知识内建（"将已知答案编码进去"），而 Kautz 的神经符号集成是将符号推理作为**过程**（而非内容）集成——即在神经基底中实现符号推理的能力，符合 Bitter Lesson 的精神。Kautz [六类分类法](neurosymbolic-ai-taxonomy.md) 中的 Type 6 目标正是让搜索/推理过程本身神经化，而非内建特定知识。

## 相关概念

- [Harness engineering](harness-engineering.md) — Bitter Lesson 在 agent 工程中的主要应用场景
- [Meta-harness](meta-harness.md) — Bitter Lesson 的架构级回应
- [LLM-OS 类比](llm-os-analogy.md) — OS 接口持久性验证 Bitter Lesson
- [Scaling laws](scaling-laws.md) — Bitter Lesson 的定量基础
- [ai-summers-history](ai-summers-history.md) — Kautz 的历史框架，与 Bitter Lesson 形成对话

## References

- `sources/sutton-bitter-lesson.md`
- `sources/anthropic-managed-agents.md`
- `sources/anthropic-harnessing-claudes-intelligence.md`
