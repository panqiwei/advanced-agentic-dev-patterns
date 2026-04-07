# 二阶控制论

<div class="mm-article" data-card="assets/second-order.png" data-card-alt="二阶控制论" markdown>

你调 prompt 的时候在做什么？

观察模型的输出，判断离期望有多远，修改 system prompt，再观察新的输出。这个循环可能持续几个小时。你就是一个在 session 级运行的控制器。

但同时，你也是系统的一部分。你的设计决策影响系统行为，系统行为影响你的下一个设计决策。你不是站在系统外面调参数的旁观者——你在里面。

1974 年，Heinz von Foerster 给这个现象划了一条线。

## 一阶与二阶

=== "一阶控制论"

    被观察系统的控制论。你站在系统外面，研究它怎么运作。Plant 在那边，observer 在这边，泾渭分明。前五篇的讨论——从 OCP 结构到反馈层次——都是一阶视角。

=== "二阶控制论"

    观察系统的控制论。你意识到观察者本身就在系统里面，观察行为在改变被观察的系统。不是"我在看它怎么跑"，而是"我在看它怎么跑，而我的看法会改变它下一步怎么跑"。

一阶视角足以解决大部分工程问题。但有些现象只有二阶视角才能看清。

## 你就是那个 adaptive controller

调 prompt 的迭代过程，控制论里有一个名字：**adaptive control**——控制器根据被控对象的行为实时调整自身策略。

经典 adaptive control 里，控制器是一段算法。在 agentic system 的开发过程中，控制器是你——一个人类工程师，在 session 级的时间尺度上观测行为、判断效果、调整策略。你设计 harness 的过程本身就是一个反馈回路，只是闭合速度比 turn 级慢得多。

二阶控制论描述的正是这个结构：观察者和被观察系统之间没有单向箭头，只有环路。

## 当系统观察自己

比你调 prompt 更有意思的是：模型自己也能做类似的事。

Agent 自己生成、自己检查、自己修正——generator 和 evaluator 是同一个模型。

??? note "Constitutional AI：自我观察的工程化"

    Constitutional AI 把这个逻辑推到了训练层面：模型用一组原则批评自己的输出，用自己的判断生成偏好数据，再用这些数据训练自己的奖励模型。观察者和被观察者合一了。

    论文、代码、可量化的效果都有——但它依赖一个前提：系统的自我评估足够可靠。

!!! warning "工程边界"

    Self-correction 依赖一个前提：模型在目标领域的判断力足以评估自己的输出。如果判断力不够，self-correction 可能把对的改成错的——错误的自我评估比没有自我评估更危险。

    Anthropic 的 circuit tracing 研究发现模型有时会表现出 introspective awareness——能报告自己在做什么，且报告有时与内部计算路径一致。这是否意味着某种"自我意识"，是一个严肃研究者仍在争论的问题。对工程来说，重要的不是这个哲学判断，而是一个操作性问题：在你的具体任务上，模型的自我评估准不准？

## 分离原理与二阶视角的关系

[02](02-ocp.md) 说过，controller 和 observer 的职责应该分离。这里又说观察者和被观察者可以合一。并不矛盾——它们在不同层次上说话。

分离原理是 harness 内部的工程原则：同一个代码库里，控制组件和观测组件各司其职，独立优化。一阶视角。

二阶视角关注的是另一件事。无论你怎么设计 harness，你自己（作为设计者）和系统之间始终构成一个环路——你的设计影响行为，行为影响你的下一个设计。这个环路无法消除，只能意识到。而意识到它的存在，就是理解为什么"把 harness 设计好"不是一个有终点的任务，而是一个持续的迭代过程。

控制论能给 agentic system 工程的视角到这里基本展开了。还剩一个问题：这些视角加在一起，画出的那条线到底在哪？

</div>

## 延伸阅读

- Von Foerster, H. (1974). *Cybernetics of Cybernetics*. University of Illinois.
- Bai, Y. et al. (2022). Constitutional AI: Harmlessness from AI Feedback. [arXiv:2212.08073](https://arxiv.org/abs/2212.08073)
- Anthropic. (2025). Circuit Tracing: Revealing Computational Graphs in Language Models. [transformer-circuits.pub](https://transformer-circuits.pub/2025/attribution-graphs/methods.html)
