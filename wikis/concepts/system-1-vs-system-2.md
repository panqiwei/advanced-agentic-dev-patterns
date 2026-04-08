# System 1 vs System 2（快思考与慢思考）

## 定义

源自 Daniel Kahneman《Thinking, Fast and Slow》的双系统框架，被 [Karpathy](../entities/andrej-karpathy.md) 在 [2023 年演讲](../sources/karpathy-intro-to-large-language-models.md) 中引入 LLM 语境：

- **System 1**：快速、直觉、自动。"2 + 2 = ?" 不需要计算，答案直接可用
- **System 2**：缓慢、理性、有意识。"17 × 24 = ?" 需要分步推导

Karpathy 的核心判断：**截至 2023 年，LLM 只有 System 1**。每次 token 生成消耗的计算量大致相同（一次前向传播），无论问题简单还是复杂。LLM 没有"停下来认真想想"的能力。

## 在 LLM 语境中的意义

### System 1 的局限

LLM 以固定计算量处理每个 token——如同"铁路上的列车，chunk chunk chunk"。这意味着：
- 简单问题和困难问题分配相同的推理资源
- 没有自主的"停下来思考"机制
- 无法在答案不确定时主动投入更多推理时间

### System 2 作为进化方向

Karpathy 描述的理想状态："you should be able to come to ChatGPT and say here's my question, actually take 30 minutes, it's okay, I don't need the answer right away."

这预言了后来出现的：
- Chain-of-thought prompting（让模型"展示思考过程"）
- Tree-of-thoughts（探索多条推理路径）
- o1/o3 系列模型（显式分配更多推理时间给困难问题）

## 自我改进的类比

Karpathy 用 AlphaGo 的两阶段进化来类比 LLM 的发展路径：

1. **模仿阶段**（= 当前 LLM）：从人类数据学习，性能天花板 = 最佳人类标注者
2. **自我博弈阶段**（= 未来方向）：AlphaGo 用 40 天自我博弈超越人类

但 LLM 面临的根本挑战是：围棋有明确的奖励函数（赢/输），开放域语言没有。在窄域（数学证明、代码验证）可能可行，通用域仍是开放问题。

## 与 Wiki 已有概念的关系

- [LLM-OS Analogy](llm-os-analogy.md) — System 2 对应 OS 中的"后台复杂计算任务"，System 1 对应"中断响应"
- [Evaluator-Optimizer](evaluator-optimizer.md) — 生成-评估循环是一种工程化的 System 2 实现：通过外部循环弥补模型内部缺乏深度推理的不足
- [Harness Engineering](harness-engineering.md) — harness 提供的结构化约束可以视为外部化的 System 2——引导模型进行更深思考

## References

- `sources/karpathy-intro-to-large-language-models.md`
