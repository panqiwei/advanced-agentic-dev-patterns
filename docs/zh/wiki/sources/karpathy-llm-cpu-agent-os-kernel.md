# LLM = CPU, Agent = Operating System Kernel

## 来源信息

- **作者**: Andrej Karpathy
- **日期**: 2026-03-31
- **来源路径**: `sources/karpathy-llm-cpu-agent-os-kernel.md`
- **原始 URL**: https://x.com/karpathy/status/2039054981719089202
- **类型**: 推文（回复 Guido van Rossum）

## 背景

Guido van Rossum（Python 创始人）在推文中提问："I think I finally understand what an agent is. It's a prompt (or several), skills, and tools. Did I get this right?"

Karpathy 的回复没有直接确认或否定这个定义，而是给出了一个更底层的类比框架。

## 核心类比

| 传统计算 | Agent 系统 |
|----------|-----------|
| CPU | LLM |
| 操作系统内核 (OS Kernel) | Agent |
| 字节 (bytes) | Token |
| 确定性、精确的动态 | 统计性、模糊的动态 |

这个类比的力量在于它不是在描述 agent 的组件（prompt、skills、tools），而是在定位 agent 在系统架构中的**角色**——agent 之于 LLM，如同 OS kernel 之于 CPU：
- **CPU/LLM** 是原始计算能力——执行指令但不自主决策
- **OS Kernel/Agent** 是资源调度和任务编排层——管理进程、分配资源、协调 I/O

## 关键洞察

### 数据单元的转换

传统计算的原子数据单元是字节（byte），语义由程序赋予。Agent 系统的原子数据单元是 token——天然携带统计语义，但缺乏精确性。这不是量的差异，而是计算范式的根本转变。

### 动态特性的转变

传统 CPU 的行为是确定性的——同样的输入必然产生同样的输出。LLM 的行为是统计性的——同样的输入可能产生不同的输出。这意味着建立在 LLM 之上的 agent（"OS kernel"）必须处理一种全新的不确定性——不是来自外部环境，而是来自底层"硬件"本身。

## 与其他源的关联

- **[Agentic Systems](../concepts/agentic-systems.md)**：Karpathy 的类比提供了一种不同于 Anthropic workflows-vs-agents 分类的理解框架——不是按自主程度分类，而是按系统架构层次定位
- **[Augmented LLM](../concepts/augmented-llm.md)**：如果 LLM = CPU，那么 augmented LLM（检索 + 工具 + 记忆）对应的是 CPU + 协处理器/外设接口
- **[Implicit Loop Architecture](../concepts/implicit-loop-architecture.md)**：OS kernel 的核心就是一个事件循环（event loop）——gather events → dispatch → handle → repeat——这与隐式循环架构的 gather-act-verify-repeat 高度同构
- **[Harness Engineering](../concepts/harness-engineering.md)**：在这个类比中，harness 对应 OS 的系统调用接口（syscall）和安全机制——约束进程（agent）能做什么、不能做什么
- **[LLM-OS 类比](../concepts/llm-os-analogy.md)**：Karpathy 从 2023 年开始系统性地构建这个类比框架

## References

- `sources/karpathy-llm-cpu-agent-os-kernel.md`
