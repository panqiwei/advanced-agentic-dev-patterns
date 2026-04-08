# Software 3.0

## 定义

Andrej Karpathy 提出的软件代际分类法中的第三代。三代软件的编程范式截然不同：

| 代际 | 编程介质 | 目标 |
|------|----------|------|
| Software 1.0 | 人类编写的代码 | 传统计算机 |
| Software 2.0 | 神经网络权重（通过数据+优化器生成） | 固定功能神经网络 |
| Software 3.0 | 自然语言 prompt | 可编程 LLM |

Software 2.0 的关键转变是从"人写指令"变为"人准备数据，优化器写指令（权重）"。Software 3.0 的关键转变是神经网络从固定功能变为**可编程**——LLM 不再只是一个图像分类器，而是一台通用计算机，prompt 就是它的程序。

## 与 Software 2.0 的"吞噬"效应

Karpathy 在 Tesla Autopilot 中观察到 Software 2.0 逐渐"吃掉" Software 1.0：神经网络接管了原本用 C++ 编写的多摄像头拼接等功能，大量 1.0 代码被删除。

同样的吞噬正在 3.0 对 1.0/2.0 发生——GitHub 代码库中出现大量自然语言和代码交织的内容。三种范式共存，开发者需要判断每个功能适合用哪种范式实现。

## 与编程语言的关系

Software 3.0 的"编程语言"是英语（或任意自然语言）。这带来一个前所未有的后果：**每个人都成为程序员**。过去需要 5-10 年专业训练才能编写的软件，现在可以通过自然语言描述来实现（参见 [vibe coding](../sources/karpathy-software-is-changing-again.md#6-vibe-coding)）。

## 与 wiki 其他概念的关系

- [LLM OS](llm-os.md) — Software 3.0 的运行平台就是 LLM OS，prompt 是程序，LLM 是处理器
- [Agentic Systems](agentic-systems.md) — agent 系统是 Software 3.0 应用的主要形态
- [Context Engineering](context-engineering.md) — 如果 prompt 是程序，context engineering 就是 Software 3.0 的软件工程
- [ACI](aci.md) — Software 3.0 程序（prompt）与外部世界的接口

## References

- `sources/karpathy-software-is-changing-again.md` — Karpathy 2025 YC 演讲，首次提出 Software 3.0 命名
