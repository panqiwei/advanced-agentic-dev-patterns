# 非典型状态机

<div class="mm-article" data-card="assets/atypical-fsm.png" data-card-alt="非典型状态机" markdown>

多样性约束住了，harness 覆盖了剩余空间。这个被约束后的系统在运行时到底长什么样？

它是一个状态机——形式上完全符合定义。但它有几条不寻常的性质。

## Agent loop 是一个 while 循环

任何 agentic system 的核心都是一个循环：

```
while not done:
    output = llm(context)
    if output.has_tool_calls:
        results = execute(output.tool_calls)
        context.append(results)
    else:
        done = True
```

当前状态（上下文）+ 输入（工具结果）→ 转移函数（LLM 推理）→ 下一个状态（更新后的上下文）。形式上，这就是一个状态机。

如果你告诉一个计算机科学家"agent loop 是一个状态机"，他会点头。但如果他试图用验证有限状态机的方法来验证你的 agent，他会发现问题。

## 经典 FSM vs Agent 状态机

| 维度 | 经典有限状态机 | Agent Loop |
|------|---------------|------------|
| 状态表示 | 枚举类型，有限集合 | 自然语言 + 结构化数据，组合爆炸 |
| 转移函数 | 确定性，查表 | 非确定性，LLM 推理 |
| 输入字母表 | 有限符号集 | 自然语言 + 工具结果，无穷 |
| 转移可预测性 | 完全可预测 | 概率性，同输入可能不同输出 |
| 状态数量 | 有限，可枚举 | 实际无限 |
| 终止条件 | 到达接受状态 | 模型决定停止（或 harness 强制停止） |
| 转移触发 | 同步，输入到达即转移 | 同步 + 异步事件混合 |

## 三条非典型性质

!!! abstract "性质一：自然语言状态"

    经典 FSM 的状态是 `enum { IDLE, WORKING, DONE }` 这样的东西——有限、离散、可精确比较。Agent loop 的"状态"是整个上下文窗口的内容——一个可能包含几万个 token 的自然语言文本。

    "两个状态是否相同"这个问题本身就是模糊的。上下文里多了一句话、少了一句话、换了一种说法——是同一个状态还是不同的状态？没有精确答案。Context management（compaction、summarization）本质上就是在做**状态降维**——把无限的状态空间压缩到一个可近似比较的子空间里。

!!! abstract "性质二：LLM 作为转移函数"

    经典 FSM 的转移函数是确定性的：状态 A + 输入 X → 一定到状态 B。Agent loop 的转移函数是 LLM 推理——同样的上下文 + 同样的工具结果，喂进去两次，可能得到不同的下一步决策。

    这不是实现上的 bug，是机制上的特性——[ch-01](../ch-01-orthogonality/02-what-is-the-model.md) 说过，概率性是 LLM 的操作特性之一。

!!! abstract "性质三：终止的非确定性"

    经典 FSM 在到达预定义的接受状态时停止。Agent loop 在模型"认为任务完成了"的时候停止——而这个判断本身是概率性的。模型可能在任务实际完成之前就宣布完成（false positive），也可能在任务已经完成之后还在继续做无意义的操作（false negative）。

    所以每一个生产级 harness 都有**外部终止机制**——最大步数、超时、人类中断——不是不信任模型，是给概率性判断兜底。

## 不只是 while 循环：事件驱动

上面描述的同步循环是 agent loop 的主路径。但生产级 harness 不只跑一个 while 循环——它是一个**事件循环**。

主路径之外，还有异步信号在不断到达：

- **Hooks**：pre-tool-call、post-tool-call 钩子在主路径的特定节点触发，可以拦截、修改或中止执行。
- **外部中断**：用户中止、超时信号、CI 状态变更——这些事件随时可能打断主路径。
- **事件驱动的 kickoff**：agent 的启动本身就不一定是人手动触发的。外部世界的状态变更（数据到达、上游服务推送、定时调度、另一个 agent 的输出）都可以作为 agent 执行的触发条件。在生产级编排层中，事件驱动的 agent kickoff 是常见模式——状态机的第一步转移，就已经是异步的了。

经典 FSM 不需要面对这个维度——它的转移是同步的，一个输入对应一次转移。Agent 状态机的转移既有同步的（LLM 输出 → 工具执行 → 结果回注），也有异步的（外部事件随时注入）。这使得 harness 的运行时模型更接近一个事件驱动的 reactor，而不是一个简单的 while 循环。

!!! example "两种约束策略"

    面对这个非典型状态机，业界有两种约束策略：

    **显式图（LangGraph）**：在非确定性的 LLM 转移之外，叠加确定性的 graph 结构——哪些节点可以转移到哪些节点，由你定义；每个节点内部的 LLM 调用，是概率性的。确定性骨架 + 概率性肌肉。

    **隐式循环（Claude Agent SDK / OpenAI Codex harness）**：不预定义显式图，而是用 tool definitions + hooks + 权限系统来约束 agent 在每一步的可选行为空间。循环本身是通用的，约束通过运行时配置注入。

    两者不是对错之分，是适用场景之分。流程可预定义时，显式图更透明；流程需要灵活探索时，隐式循环更自然。

状态空间近乎无限，转移函数非确定性，终止条件概率性，驱动方式是同步和异步的混合。这仍然是一个状态机，只是你没法用经典方法验证它。

理解了运行时的形态，还剩一个维度没拆开：这个状态机上的反馈回路不只有一层。

</div>

## 延伸阅读

- LangGraph Documentation. [langchain-ai.github.io](https://langchain-ai.github.io/langgraph/)
