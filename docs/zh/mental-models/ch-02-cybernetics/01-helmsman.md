# 舵手

<div class="mm-article" data-card="assets/helmsman-feedback.png" data-card-alt="正负反馈" markdown>

Agentic system 的输出是两股力的合成——模型能力和你在 harness 层做的一切。[正交性](../ch-01-orthogonality/index.md)告诉你力该往哪使。但"使力"的具体机制是什么？你的 harness 到底在做什么类型的工作？

1948 年，一个数学家给这类工作起了名字。

Cybernetics 这个词来自希腊语 κυβερνήτης——舵手。不是哲学家，不是建筑师，是舵手。一个在风浪中实时调整航向的人。

![舵手](assets/helmsman.png)

Norbert Wiener 用这个词命名了一个学科：研究系统如何通过反馈来实现控制——无论这个系统是一台蒸汽机、一只猫，还是一个社会组织。

???+ quote "Wiener 的核心洞察（意译）"

    一个系统的功能，取决于它内部信息流的质量。信息被噪声污染了，系统就失去稳态。反馈回路断了，控制就是一句空话。

    — 意译自 *Cybernetics: Or Control and Communication in the Animal and the Machine* (1948)

写过 agentic system 代码的人，读到这里应该觉得眼熟。

## 反馈：一个被过度使用、被过少理解的词

日常语言里的"反馈"是别人告诉你做得好不好。控制论里的反馈是一个精确的机制：**系统的输出被回送为输入，影响系统的后续行为。**

这个机制有两种模式。注意：这里的"正"和"负"不是"好"和"坏"的意思——正反馈往往是危险的，负反馈往往是你想要的。名字反直觉，但逻辑很清楚：

**负反馈**修正偏差，趋向稳态。恒温器是经典例子——温度高了就关加热器，低了就开，系统围绕设定值振荡。你的 agent 调用工具、拿到结果、据此调整下一步决策——这是负反馈在工作。

**正反馈**放大偏差，走向失控。麦克风靠近音箱时的啸叫就是正反馈——声音被拾取、放大、再被拾取、再放大，直到系统饱和。你的 agent 产生了一个"幻觉"（hallucination）——模型自信地输出了事实上错误的内容——这个错误信息进入上下文，模型基于错误的上下文产生更多错误。正反馈，只是失控的不是声音，是语义。

Agent 系统里两种反馈同时存在。负反馈让系统趋向目标，正反馈让系统偏离目标——而且偏得越来越快。

## 你已经在做控制论了

如果你写过 agent 代码，你已经在做控制论——只是可能没人告诉过你。

| 你在 harness 里写的东西 | 控制论里叫什么 |
|------------------------|-------------|
| System prompt、tool definitions | 控制信号的初始条件与接口定义 |
| Output parser、evaluator | 观察器（Observer） |
| 自动拼接 tool results 并再次调用模型的循环 | 闭环反馈回路 |
| 上下文管理（compaction、summarization） | 信号滤波与降噪 |
| 权限系统、沙箱隔离 | 执行器的约束边界 |
| 最大步数、超时 | 正反馈失控的安全阀 |

这些组件加在一起，就是你的 **harness**——包裹 LLM 的整个反馈控制系统。这个系统不需要人在每一轮介入；harness 代码自动完成闭环。人的角色在设计时，不在运行时。

!!! tip "为什么要给直觉一个名字"

    给这些实践一个理论框架，不是为了在简历上多写一行。是为了看清一件事：你凭直觉做出的哪些设计选择有理论依据，哪些只是碰运气——以及碰运气的那些，理论能不能帮你碰得更准。

Harness 是一个整体，但它内部有职责分工。控制论用三个角色来描述这种分工——Observer、Controller、Plant。

</div>

## 延伸阅读

- Wiener, N. (1948). *Cybernetics: Or Control and Communication in the Animal and the Machine*. MIT Press. — 控制论的原点；第一部分关于信息、熵、反馈的讨论，至今是理解"为什么系统需要闭环"的最清晰框架

## 概念与实体

本文涉及的核心概念与实体，在项目知识库中有更详细的资料：

- [Harness Engineering](../../wiki/concepts/harness-engineering.md) — 本文将 harness 定义为包裹 LLM 的整个反馈控制系统，这里有更完整的工程视角
- [Agentic Systems](../../wiki/concepts/agentic-systems.md) — 本文讨论的反馈机制是 agentic system 运行的核心结构
- [Context Management](../../wiki/concepts/context-management.md) — 文中将上下文管理类比为"信号滤波与降噪"，这里展开了具体机制
- [Guardrails](../../wiki/concepts/guardrails.md) — 文中提到的权限系统、沙箱隔离等约束边界的详细资料
