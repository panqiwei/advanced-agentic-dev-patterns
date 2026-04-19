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

## Kahneman 的自我批评（来自 arXiv:2501.05435）

2024 年系统综述援引了一个重要的认识论提醒：Kahneman 本人指出，System 1 和 System 2"并不真正存在于大脑中"——它们是对自动处理（automatic）与高唤醒处理（arousal-intensive）的**认知科学捷径**，而非独立的神经基底。

这一自我否定对 AI 设计有深刻影响：
- 将"System 1"和"System 2"字面工程化为两个独立子系统，可能误读了原始框架
- 真正的人类认知是"深度复杂、多层交织、密集互联的统一运作"
- 向 AGI 演化需要**元认知控制系统**（[meta-cognition-ai](meta-cognition-ai.md)）——一个能根据任务需求动态分配认知资源的调控层，而非硬性的 S1/S2 二分架构

**结论：** System 1/2 框架仍然是有用的启发式框架，但应作为设计的**方向性指导**而非**字面蓝图**。

## 神经符号 AI 视角（Garcez & Lamb 2020，Kautz 2020）

Kahneman 本人在 AAAI 2020 炉边谈话中澄清了这一框架在 AI 语境中的含义：

- **System 1（隐性/implicit）：** 直觉并行系统，能够理解语言——Kahneman 认为语言理解属于 System 1，而非 Bengio 主张的深度学习即 System 1
- **System 2（显性/explicit）：** 顺序的、有意识的符号操作系统

从神经符号 AI 的角度，System 1 对应神经网络的感知/学习能力，System 2 对应符号推理的逻辑/因果能力。[Kautz 六类分类法](neurosymbolic-ai-taxonomy.md)的目标之一，正是在 Type 6（Neuro[Symbolic]）层面实现 System 1 和 System 2 的完全集成——让神经引擎内部能够触发符号推理。

与 Karpathy 的"LLM 只有 System 1"诊断高度一致：纯深度学习在 Kautz 分类中最多是 Type 1，神经符号集成才能走向 System 2。这也是 [命题固着](propositional-fixation.md) 问题的另一种表述——一阶逻辑推理（System 2 的核心）超出了纯神经网络的表达边界。

## References

- `sources/karpathy-intro-to-large-language-models.md`
- d'Avila Garcez, A. & Lamb, L.C. (2023). Neurosymbolic AI: The 3rd Wave. [wikis/sources/2012.05876-neurosymbolic-ai-third-wave.md](../sources/2012.05876-neurosymbolic-ai-third-wave.md)
- arXiv:2501.05435 (2025). Neuro-Symbolic AI in 2024: A Systematic Review. [wikis/sources/2501.05435-neurosymbolic-ai-2024-systematic-review.md](../sources/2501.05435-neurosymbolic-ai-2024-systematic-review.md)
