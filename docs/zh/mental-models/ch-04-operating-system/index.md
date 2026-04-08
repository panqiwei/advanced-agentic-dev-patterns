# 操作系统

熵告诉你 agent 系统的默认方向——无序积累，退化是自然趋势。但它没有告诉你怎么应对。

Maxwell's Demon 是一个答案：用主动判断对抗熵增。分拣信息，维护秩序，持续消耗认知代价。这个答案在概念上是完整的——Demon 能做到。但 Demon 靠的是个案判断，没有制度，不可扩展。

把分拣规则写成制度，你就有了一个操作系统。

Karpathy 在 2023 年说，LLM 是"正在涌现的操作系统的 kernel 进程"。三年之后他进一步精化：LLM 是 CPU，agent 是 OS kernel，harness 是完整的 OS。这不只是比喻——OS 工程师用 50 年的失败案例精炼出来的四根支柱，正在 agent harness 里被逐一重新发明。

这一章以 OS 为透镜，拆解 harness 的四个核心职责：内存管理、调度、信任边界、协作协议——每根支柱展开，然后当场指出 OS 类比在哪里断裂，断裂点指向的是 OS 范式没有覆盖的设计空间。

![操作系统：章节概览](assets/os-overview.png)

---

| # | 篇章 | 一句话 |
|---|------|-------|
| 01 | [从 Demon 到 OS](01-from-demon-to-os.md) | 把个案判断写成制度——Karpathy 的三层精化与 LLM=CPU 的工程含义 |
| 02 | [内存层次结构](02-memory-hierarchy.md) | 用有限快速存储模拟无限慢速存储——同一个设计模式在新计算层的重现，以及错误上下文比缺失上下文更危险的断裂点 |
| 03 | [调度](03-scheduling.md) | 编排决策与成本 ROI 是 harness 层的两个调度维度，OS 没有的是质量/成本比的目标函数和语义终止条件 |
| 04 | [信任边界](04-trust-boundary.md) | 权限隔离防止做错事，资源隔离防止看错数据——两层纵深防御，以及 CPU 可被语言说服的断裂点 |
| 05 | [协作协议](05-cooperation-protocol.md) | Human-agent 通过 ACI 间接委托，agent-agent 通过 A2A 直接通信——自然语言没有校验和 |
| 06 | [类比的边界与超越](06-where-the-analogy-breaks.md) | 六个断裂点共同指向一个根源：OS 的 CPU 是确定性的，agent 的 CPU 是统计性的 |
