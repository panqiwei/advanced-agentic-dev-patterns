# 这股力有多强，还在变强吗

<div class="mm-article" data-card="assets/concentric-capabilities.png" data-card-alt="同心圆：能力维度叠加" markdown>

机制搞清楚了，但光知道"它做的是 next-token prediction"还不够。你得感受一下这股力的量级，以及它变大的速度。

## 不是一条直线，是同心圆

如果你只看基准测试分数的折线图，模型能力的增长看起来像一条陡峭的直线。但这条直线掩盖了一个更有趣的结构：**能力不是在同一个维度上持续拔高，而是在不断解锁新的维度。**

更像是一圈一圈向外扩展的同心圆——每一圈新能力叠加在所有前序能力之上，前一圈不会消失，而是成为下一圈的地基。

| 时期 | 解锁的能力维度 | 标志性事件 |
|------|--------------|-----------|
| 2020–2022 | 文本流畅度与知识 | GPT-3 证明了规模本身能催生涌现能力；PaLM 进一步验证 |
| 2022–2023 | 指令遵循与对齐 | ChatGPT 通过 RLHF（基于人类反馈的强化学习）让模型变得"可用"；Claude 1 以安全对齐为核心设计 |
| 2023 | 推理 + 多模态（并行解锁） | GPT-4 同时带来了推理跃升和视觉输入；Gemini 1.0 从设计之初就是多模态的；Claude 2 将上下文窗口推到 100K |
| 2023–2024 | 工具使用与结构化输出 | Function calling、Claude tool use、JSON mode——注意，这发生在 extended reasoning **之前** |
| 2024–2025 | 推理时计算 / 深度思考 | o1 引入"思考 token"范式；DeepSeek-R1 证明开源也能做到；Claude extended thinking 让模型在回答前"想一想" |
| 2025–2026 | 模型的 agentic 能力 | Claude Code 支持 agent teams 并行协作；OpenAI Codex 在云端沙箱中自主编码；多家模型在 agentic coding 评测中刷新纪录 |

!!! note "叠加，不是替代"

    每一行不是替代了上一行，而是**叠加**在上一行之上。2026 年的模型不只是"更 agentic"——它同时也更流畅、更对齐、更能推理、更多模态、更擅长使用工具、更会深度思考。六个维度同时在增长，只是每个时期有一个维度是新解锁的。

## 三年，一条产品线

让我们用一条产品线来具象化这个增长。

=== "2023 年 3 月：Claude 1"

    上下文窗口 9K tokens——大约够放一篇中等长度的文章。能力范围：能聊天，能写文字，有一定的推理能力，但谈不上可靠。没有视觉，没有工具调用，没有深度思考。

=== "2026 年 2 月：Claude Opus 4.6"

    上下文窗口 1M tokens——是 Claude 1 的 **111 倍**。输出上限 128K tokens。支持 adaptive thinking（模型自主决定何时需要深度推理）。在 agent teams 模式下，多个 agent 实例可以并行协作完成复杂任务。在多项 agentic coding 和知识工作评测中达到行业领先水平。

三年。同一家公司，同一条产品线。从"能聊天"到"能组队自主完成复杂软件工程任务"。

## 谨慎乐观

这股力还在增长——这一点，目前的证据是支持的。但增长的来源在多元化：

- 预训练规模仍在推进，但遇到了高质量数据的瓶颈——行业的应对方式是合成数据、数据精选和多轮训练。
- **推理时计算**成为了新的 scaling 轴线。让模型"多想一会儿"的效果，有时等价于模型规模扩大 10–100 倍——而且这条路还远没走到头。
- 模型自身的 agentic 能力在持续增长——更好的规划、更长的自主执行、更可靠的自我纠错。

方向大致看得见——推理更深、上下文更长、模态更多、自主执行更可靠。但什么时候到，没人说得准。

Anthropic 在一篇关于怎么用好 Claude 的博文里写了一句话：

> "The frontier of Claude's intelligence is always changing. Assumptions about what Claude can't do need to be re-tested with each step change."

记住这句话。后面会把它翻译成力学语言。

这股力光是变强也就罢了——它的**方向**会不会也在变？

</div>

---

## 延伸阅读

- Kaplan, J., McCandlish, S., Henighan, T., et al. (2020). *Scaling Laws for Neural Language Models*. [arXiv:2001.08361](https://arxiv.org/abs/2001.08361) — "能力随规模可预测增长"不是口号，这篇论文给出了幂律公式和实验曲线；理解了它，你就能自己判断每一代模型升级的期望收益
- Hoffmann, J., Borgeaud, S., Mensch, A., et al. (2022). *Training Compute-Optimal Large Language Models*. [arXiv:2203.15556](https://arxiv.org/abs/2203.15556) — Chinchilla 论文修正了 Kaplan 的结论：数据和参数要同步放大；这篇解释了为什么"高质量数据瓶颈"是真问题而不是借口

## 概念与实体

本文涉及的核心概念与实体，在项目知识库中有更详细的资料：

- [Scaling Laws](../../wiki/concepts/scaling-laws.md) — 本文"同心圆"叙事的理论基础：能力随规模幂律增长的经验规律
- [LLM Training Pipeline](../../wiki/concepts/llm-training-pipeline.md) — 从预训练到 RLHF 到推理时计算，本文时间线上每个阶段对应的训练范式
- [Agentic Systems](../../wiki/concepts/agentic-systems.md) — 2025-2026 同心圆最外层解锁的能力维度
- [Anthropic](../../wiki/entities/anthropic.md) — Claude 产品线的缔造者，本文用三年 Claude 演进具象化模型增长
- [OpenAI](../../wiki/entities/openai.md) — o1 推理范式和 Codex 的推出者，本文时间线中的关键节点
