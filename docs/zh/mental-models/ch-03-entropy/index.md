# 熵

控制论告诉你系统长什么样——反馈回路、OCP 三角、状态机。但它没告诉你一件事：**这个系统在运行过程中会发生什么。**

答案是：无序积累。

跟你做对了什么、做错了什么无关。在一个非确定性系统中，熵增是默认方向。这是热力学第二定律的信息论版本，它同样适用于 agent 系统。

这一章从 Boltzmann 和 Shannon 的同一个公式出发，拆解 agent 系统中熵增的具体形态，追问它的因果结构，最终抵达一个设计哲学：不是对抗自然规律，而是在规律之内找到工程的操作空间。

![熵：章节概览](assets/entropy-overview.png)

---

| # | 篇章 | 一句话 |
|---|------|-------|
| 01 | [熵是什么](01-what-is-entropy.md) | Boltzmann 的桌面直觉与 Shannon 的信道噪声——同一个公式，两个世界，一个洞察 |
| 02 | [Agent 系统里的熵](02-entropy-in-agents.md) | 三种退化现象的因果拆解——intent drift 是 context rot 和 error cascade 的涌现效应 |
| 03 | [Context Rot](03-context-rot.md) | 信道容量视角下的注意力稀释——context 不是免费的，每多一个 token 都在稀释信号 |
| 04 | [错误级联](04-error-cascade.md) | 95% × 95% × 95% 不等于你以为的那个数字——步间耦合让退化超线性 |
| 05 | [Maxwell's Demon](05-maxwells-demon.md) | 分拣信息、维护秩序——但每一次分拣都有代价 |
| 06 | [热力学第二定律的工程启示](06-engineering-under-entropy.md) | Shannon 证明了：在约束之内，仍然有大量的工程操作空间 |
