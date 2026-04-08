# 从 Demon 到制度

<div class="mm-article" data-card="assets/from-demon-to-os.png" data-card-alt="从 Demon 到制度——系统机制的诞生" markdown>

Maxwell's Demon 做的事，和 harness 工程师做的事，结构上是同一件事：读取系统状态，做出判断，维持局部有序。观测 context，过滤噪声，控制信息注入。分拣逻辑本身是成立的。

但 Demon 靠的是持续在场的个案判断。一个 Demon，手动判断，不可复制，出故障没有接替者，出错了也不知道是哪一步出了问题。这不是实现不够好——是"个案判断"模式本身的结构性上限。

**把分拣规则写成制度，你就有了一个操作系统。**

什么走哪个通道，什么触发什么操作，异常情况如何处理——这些本来在 Demon 脑子里的判断，一旦编码成规则，就可以复制、可以审计、可以在 Demon 不在时继续运行。从个案判断到制度化机制，这是一次跃迁。也是 harness 工程正在发生的事。

## Karpathy 的直觉

2023 年 11 月，Andrej Karpathy 在一场 LLM 入门演讲里提出了一个框架：

> "I think it's a lot more correct to think about it as the kernel process of an emerging operating system."

他的映射：context window 是 RAM，互联网是磁盘，代码解释器和浏览器是外设。这是一个系统论直觉——LLM 是这个新计算系统的中心进程，像 OS kernel 那样协调所有资源。

方向对，但层次还没有分开。这个直觉把执行层和编排层压缩在同一个"kernel process"里，没有说清楚谁是 CPU、谁是 kernel。

两年之后，这个直觉被拆开了。

## 从直觉到两层映射

2025 年，Karpathy 在 YC AI 创业学校的演讲里用一个历史类比说清楚了当前的位置：我们处在 LLM 的 1960 年代——算力昂贵，集中在云端，ChatGPT 像大型机的终端界面，用完断开连接。个人算力时代还没到来。

2026 年 3 月 31 日，Python 之父 Guido van Rossum 问：什么是 agent？Karpathy 用两行回答：

!!! quote "Andrej Karpathy, 2026-03-31"

    LLM = CPU (data: tokens not bytes, dynamics: statistical and vague not deterministic and precise)  
    Agent = operating system kernel

这不是推翻 2023 年的说法，是给它加了一层精度。2023 年的直觉：LLM 是这个新兴 OS 的"kernel process"——那个协调所有资源的中心进程。2026 年把这个整体直觉分成两层：**执行层**（LLM 是 CPU，跑 token 计算）和**编排层**（Agent 是 kernel，做所有策略决策）。一个系统论直觉，拆成了两个可以独立工程化的层次。

这个精化过程本身就是论点：即使是提出这个类比的人，也用了三年才把它说清楚。类比在工程实践中成熟，不是在一次顿悟里完成的。

## 补完第三层

Karpathy 给了 LLM（CPU）和 Agent（kernel）。还缺一层。

OS 不只是 kernel。Kernel 是 OS 的核心，但 OS 是一个完整的栈：kernel 管理资源，驱动连接硬件，系统调用层暴露接口，用户态工具让外部程序可以使用这一切。去掉任何一层，OS 都不能独立运行。

Harness 是完整的 OS：

| OS 层次 | Agent 系统对应 | 核心性质 |
|:---|:---|:---|
| CPU | LLM | 统计性的，而非确定性的 |
| OS kernel | Agent | 编排资源，协调进程 |
| 完整 OS | Harness | 所有组件、策略、抽象 |

架构关系保留了。CPU 执行指令，不决定执行什么。Kernel 编排资源、调度进程、执行边界——执行层之上的决策层。完整 OS 把这些都包在里面：内存子系统、调度算法、权限模型、进程间通信，五十年工程积累让硬件变得可用的全部机制。

OS 用 50 年打磨出四根支柱：内存管理、调度、信任边界、协作协议。同样的工程问题在 agent harness 里重现，形状略有不同——有时候是直接的结构映射，有时候类比在某一点断裂，而断裂处指向的正是 OS 50 年里没走到的设计空间。

---

四根支柱里，最直觉的是内存——因为 context window 的有限性是 harness 工程师每天都在感受的约束。

</div>

---

## 延伸阅读

- Karpathy, A. (2023). *Intro to Large Language Models*. YouTube. — 本章 OS 类比的源头：Karpathy 在这场演讲里第一次把 LLM 定位为"新兴操作系统的 kernel process"，从 context window = RAM 到代码解释器 = 外设，系统论直觉的完整版本

## 概念与实体

本文涉及的核心概念与实体，在项目知识库中有更详细的资料：

- [LLM-OS Analogy](../../wiki/concepts/llm-os-analogy.md) — 本文的核心论点：从 Karpathy 2023 到 2026 的三层映射演化
- [LLM-OS](../../wiki/concepts/llm-os.md) — "LLM 作为操作系统"这一概念的技术展开
- [Harness Engineering](../../wiki/concepts/harness-engineering.md) — 本文将 harness 定位为"完整 OS"，这里有更完整的工程视角
- [Agentic Systems](../../wiki/concepts/agentic-systems.md) — Agent = kernel 这一层映射的工程实体
- [Andrej Karpathy](../../wiki/entities/andrej-karpathy.md) — 本文多处引用其 OS 类比的演化过程
