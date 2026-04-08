# 传统软件的边界

<div class="mm-article" data-card="assets/the-boundary.png" data-card-alt="传统软件的边界" markdown>

那条线到底在哪？

## 三条分界线

!!! abstract "非确定性执行"

    传统软件：`f(x) = y` 恒成立。同样的输入，同样的输出。测试可以断言精确值。

    Agentic system：`f(x)` 每次可能不同。[Ch-01](../ch-01-orthogonality/02-what-is-the-model.md) 说过，概率性是 LLM 的操作特性。你不能用 `assertEqual` 验证一个 agent 的行为，你得用统计的方式。

!!! abstract "自然语言作为控制信号"

    传统软件用 API、类型系统、编译器做 enforcement。参数类型错了，编译就不过。

    Agentic system 用自然语言做控制信号——prompt。"Prompt 写得有歧义"和"API 参数类型不对"是两个不同宇宙里的错误。前者没有编译器帮你兜底。

!!! abstract "涌现行为"

    传统系统的行为 = 所有代码路径的并集，理论上可穷举。

    Agentic system 的行为集合无法穷举——模型可能做出任何在其能力范围内的事。[03](03-requisite-variety.md) 讨论的必要多样性问题，根源就在这里。

## 不同的 Plant，不同的工程

三条线收拢起来：传统软件的 Plant 是确定性的、低多样性的、用类型化接口驱动的。Agentic system 的 Plant 是非确定性的、高多样性的、用自然语言驱动的。

Plant 不同，harness 的设计原则就不同。

| 维度 | 传统软件 | Agentic System | 对应的控制论概念 |
|------|---------|---------------|----------------|
| 验证 | 单元测试、集成测试（确定性断言） | 统计验证、对抗测试 | [04](04-atypical-fsm.md) 非确定性转移 |
| 可观测性 | 日志、metrics、traces | + 推理路径追踪、上下文审计 | [02](02-ocp.md) Observer 的多样性 |
| 安全 | 输入验证、权限控制 | + 沙箱隔离、最小权限工具、输出审计 | [03](03-requisite-variety.md) 约束 Plant 多样性 |
| 调试 | 断点、栈追踪 | + prompt replay、上下文快照 | [04](04-atypical-fsm.md) 自然语言状态 |
| 迭代 | 改代码、跑测试 | + 调 prompt、观测行为漂移 | [06](06-second-order.md) 二阶反馈 |

你不会用调试编译器的方法去调一台发动机。不是因为发动机不如编译器，而是因为它们是不同的系统，有不同的失败模式。

## 保留什么，更新什么

工程纪律的内核不变：严谨、可重复、可验证。

变的是纪律的具体形式。"可重复"是精确重现还是统计稳定？"可验证"是断言精确值还是检验分布特征？"可观测"是追踪代码路径还是追踪推理路径？

---

[正交性](../ch-01-orthogonality/index.md)告诉你力该往哪使。控制论告诉你这股力的运作机制——一个非典型状态机上的多层反馈控制系统，而你自己也是这个系统的一部分。

机制清楚了。下一个问题：这个系统在长时间运行中会自发走向什么方向？上下文在腐烂，错误在级联，意图在漂移。

</div>

## 延伸阅读

- Schneier, B. & Raghavan, B. (2025). On the OODA Loop and Agentic AI. [schneier.com](https://www.schneier.com/). — 从安全研究者视角审视 agentic system 的控制回路，OODA 框架与本章的 OCP 回路形成有趣对照

## 概念与实体

本文涉及的核心概念与实体，在项目知识库中有更详细的资料：

- [Reliability Surface](../../wiki/concepts/reliability-surface.md) — 非确定性执行带来的验证挑战，在可靠性曲面上的具体展现
- [Context Rot](../../wiki/concepts/context-rot.md) — 文末预告的"上下文在腐烂"，下一章的核心主题
- [Error Cascade](../../wiki/concepts/error-cascade.md) — 文末预告的"错误在级联"，涌现行为不可穷举的后果之一
- [Software 3.0](../../wiki/concepts/software-3-0.md) — 传统软件与 agentic system 的分界线在软件演化史中的位置
