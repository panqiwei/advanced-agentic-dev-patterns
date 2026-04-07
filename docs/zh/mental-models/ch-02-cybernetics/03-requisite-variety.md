# 必要多样性

<div class="mm-article" data-card="assets/requisite-variety.png" data-card-alt="必要多样性" markdown>

Observer、Controller、Plant 三个角色，一个闭环回路——骨架有了。但这个骨架面临一个独特的挑战：它的 Plant 不是一台输出空间有限的电机，而是一个输出空间近乎无限的语言模型。

## Ashby 定律

1956 年，W. Ross Ashby 提出了一条被后人称为"控制论第一定律"的原理：

!!! abstract "Law of Requisite Variety"

    **只有多样性才能吸收多样性。** 控制器能处理的情况种类（variety），必须不小于它要对抗的扰动种类。

直觉：恒温器只有一种控制手段——开关加热器。所以它只能调节温度，不能调节湿度。如果你希望同时控制温度和湿度，你需要一个至少有两种独立控制手段的系统。控制能力的上限，由控制器的多样性决定。

映射到 agentic system：你的 harness 能处理的行为种类，必须覆盖模型可能产出的行为种类。覆盖不了的部分，就是你系统的盲区——在那里，模型的输出不受控制。

## LLM 是高多样性的 Plant

传统控制论的 plant 通常是低多样性的。一台电机的输出空间就是转速和扭矩。一个恒温器的输出就是温度。你可以枚举所有可能的输出状态，然后为每一种状态设计对应的控制策略。

LLM 不是这样。

LLM 的输出空间是自然语言——理论上是所有可能的 token 序列的集合。即使你把输出限制在 1000 个 token 以内，可能的输出组合也是一个天文数字。你不可能枚举所有可能的模型输出，然后为每一种输出设计一个处理分支。

Ashby 定律在这里直接给出了工程指导：既然你不可能让 harness 的多样性追上一个无穷的输出空间，那你必须**从 plant 端下手，降低需要处理的多样性**。

## 两种策略

=== "增加 harness 的控制能力"

    更多工具、更复杂的编排逻辑、更多检查点、更精细的 evaluator——让你的 harness 能识别和处理更多种类的模型行为。

    代价：harness 本身的复杂度上升。复杂的 harness 更难理解、更难调试、自身出 bug 的概率也更高。控制器的多样性有实际上限——它不能超过工程师能理解和维护的范围。

=== "降低 Plant 的有效多样性"

    约束模型输出格式（structured output），把输出从"任意自然语言"收窄到"符合某个 JSON schema 的文本"。限制可用工具，你不是在限制模型的能力，你是在限制**你需要处理的行为种类**。缩窄任务范围，把一个大任务拆成多个小任务，每个小任务的输出空间更小。

    OpenAI 在构建 Codex 的过程中总结了类似的经验——"give Codex a map, not a 1,000-page instruction manual"。用清晰的架构文档和约束规则来限定 agent 的行为空间，而不是用冗长的指令试图覆盖所有情况。这也是降低多样性的一种手段：不是通过代码约束输出格式，而是通过文档约束行为空间。

两种策略不是二选一。降低 plant 的有效多样性之后，harness 需要覆盖的剩余空间变小了——原本不可能的控制问题变成了可能的。先降噪，再控制。

顺便说一句——"降低 plant 的有效多样性"这件事，本身就是 [ch-01](../ch-01-orthogonality/05-orthogonal-decomposition.md) 说的累积性投入。无论模型变得多强，你约束输出格式、限定工具集合、用文档框定行为空间的工作都不会被模型能力的增长所替代。它正交于模型能力。

## 简单 harness 为什么经常赢

> Keep your agent framework simple. The sophistication should be in your tools and in your prompts, not in your agentic framework.
>
> — Anthropic, *Building Effective Agents*

换成 Ashby 的话说：别试图让 harness 变得跟 plant 一样复杂。反过来——把 plant 的有效多样性降下去，简单的 harness 就够了。

但"简单"是一个微妙的词。Ashby 定律有一个推论：控制器自身也是一个系统，也有自己的多样性。如果 harness 的多样性太高——超过了工程师能理解和调试的范围——它就从控制 LLM 的工具变成了另一个需要被控制的复杂系统。控制器在控制 plant 的同时失控了。

反过来，如果 harness 的多样性太低——少到覆盖不了 plant 约束后的剩余行为空间——它就是一个盲区遍布的系统。

"简单"的含义藏在 Ashby 定律的数学里：harness 的多样性恰好覆盖它需要处理的多样性，不多也不少。

多样性约束了，结构理清了，接下来的问题是：这个被约束的系统在运行时到底长什么样？它是一个状态机——但它是非典型的。

</div>

## 延伸阅读

- Ashby, W. R. (1956). *An Introduction to Cybernetics*. Chapman & Hall. [rossashby.info](http://www.rossashby.info/patron/An-Introduction-to-Cybernetics.pdf)
- Anthropic. (2024). Building Effective Agents. [anthropic.com](https://www.anthropic.com/research/building-effective-agents)
