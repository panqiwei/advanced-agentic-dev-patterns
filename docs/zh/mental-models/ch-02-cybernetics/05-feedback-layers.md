# 反馈的层次

<div class="mm-article" data-card="assets/feedback-layers.png" data-card-alt="四层嵌套反馈回路" markdown>

反馈是系统输出回送为输入的机制——负反馈修正偏差，正反馈放大偏差。但反馈不只发生在一个地方。把视角从一次 tool call 拉远到整个 AI 系统的生命周期，你会看到至少四层嵌套的反馈回路。

## 四层反馈

| 层次 | 时间尺度 | 反馈信号 | 触发方式 |
|------|---------|---------|---------|
| Token 级 | 毫秒 | 前序 token → 下一 token 概率 | 自回归，每步必触发 |
| Turn 级 | 秒 ~ 分钟 | 工具结果 → 下一轮 prompt | 事件驱动，tool call 完成时触发 |
| Session 级 | 分钟 ~ 小时 | 任务结果评估 → 策略调整 | 定时 + 事件混合（CI 结果、用户中断） |
| Alignment 级 | 周 ~ 月 | 人类偏好 → 模型权重更新 | 训练周期 |

??? info "Token 级"

    模型的自回归机制：每生成一个 token，它就成为下一个 token 的输入的一部分。这个循环在毫秒尺度上闭合。你无法直接干预这一层——除非你在做 inference-time intervention 之类的研究工作。它是 plant 内部的反馈，不属于 harness 的控制面。

??? info "Turn 级"

    Agent loop 的核心反馈。模型调用工具 → 工具返回结果 → 结果拼回上下文 → 模型做下一步决策。**这是 harness 工程师的主战场。** 你设计的 system prompt、tool definitions、output parsing 都在这一层运作。每一次 [02](02-ocp.md) 中描述的 Observer-Controller-Plant 闭环，就是一次 turn 级反馈的闭合——也是 [04](04-atypical-fsm.md) 描述的非典型状态机走过的一步。

??? info "Session 级"

    一个完整任务的执行周期。任务完成后的评估结果——测试通过了吗？用户满意吗？——可能触发策略调整：换一种 prompt 模板、换一套工具组合、调整上下文管理策略。Human-in-the-loop 主要在这一层介入。

    随着 harness 的演进，session 级反馈也在从人工走向自动化。Anthropic 的 long-running agent 架构中，initializer agent 和 coding agent 之间的交接、feature tracking 的自动更新，都是自动化的 session 级反馈——不再需要人在每个 session 边界手动介入。

??? info "Alignment 级"

    人类偏好信号经过聚合，通过训练改变模型的权重。除非你是模型提供商，否则这不是你的直接控制面——但它决定了你的 Plant 的基础行为。[Ch-01](../ch-01-orthogonality/03-how-strong-and-growing.md) 说过能力随规模可预测增长，alignment 级反馈正是塑造这条增长曲线方向的机制之一。

换一个角度看同一张图——每一层在纠正什么：

| 层级 | 时间尺度 | 纠错对象 |
|------|---------|---------|
| Token 级 | 毫秒 | token 分布的随机性 |
| Turn 级 | 秒 ~ 分钟 | 单步决策偏差 |
| Session 级 | 分钟 ~ 小时 | 跨 turn 累积的 drift |
| Alignment 级 | 周 ~ 月 | 模型权重的系统性偏向 |

## 嵌套的回路

每一层都是一个完整的 Observer-Controller-Plant 回路。内层快，外层慢——但外层设定了内层运行的边界条件。

训练改变模型权重，于是每一次 token 级的概率分布都变了。你调整 system prompt，于是每一次 turn 级的模型行为都变了。慢的那一层，决定了快的那一层能做什么、不能做什么。

Harness 工程师主要在 turn 级和 session 级操作。但知道自己的控制信号在哪一层生效，知道哪些行为不是你这一层能改的——这个边界感很重要。

## 正反馈的危险

!!! warning "幻觉的正反馈循环"

    在 turn 级，幻觉是一个典型的正反馈过程：模型生成错误信息 → 错误信息进入上下文 → 模型基于错误的上下文继续生成 → 错误累积放大。每一轮 turn 级反馈不但没有纠正偏差，反而在扩大偏差。

    Harness 工程的核心职责之一：**在正反馈失控之前介入。** 验证工具结果的 observer、设置 sanity check 的 controller、限制自主执行步数的终止机制——它们都是负反馈装置，用来对抗 turn 级的正反馈倾向。[01](01-helmsman.md) 中麦克风啸叫的类比，在这里有了更具体的解剖。

这也是 [02](02-ocp.md) 分离原理的另一个切面：为什么 evaluator 要独立于 generator。如果 generator 自己负责检查自己的输出（controller 兼任 observer），正反馈可能在 generator 的盲区里悄悄累积——它看不到自己的错误，自然无法纠正。独立的 evaluator 从外部提供负反馈，才能打破这个循环。

到这里为止，我们一直站在系统外面往里看——observer 在这边，plant 在那边，泾渭分明。但有一个问题一直没碰：你调 prompt 的时候，你自己算不算系统的一部分？

</div>

## 延伸阅读

- Christiano, P. et al. (2017). Deep Reinforcement Learning from Human Preferences. [arXiv:1706.03741](https://arxiv.org/abs/1706.03741)
