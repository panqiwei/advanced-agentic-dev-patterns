# Context Rot：上下文腐化

<div class="mm-article" data-card="assets/context-rot.png" data-card-alt="Context Rot——上下文腐化的三种退化机制" markdown>

2026 年，主流模型的 context window 已经到了 256K 甚至 1M tokens。容量听起来够用了，两小时的 agent session 产生的工具调用结果、文件内容、对话历史，塞进去绰绰有余。但问题不在于能不能塞下。问题是：当 context 堆积到第 500,000 个 token 时，模型对第 1,000 个 token 处那条关键指令的"记忆"，还剩多少？

直觉回答是"只要没超窗口大小就没问题"。

这个直觉是错的。

## 不是杯子满了，是水变淡了

大多数人对 context window 的心理模型是一个杯子：往里倒水，倒满了就溢出来，没满就没事。在这个模型下，context 管理的唯一问题是"别让它溢出"，所以 128K 比 32K 好，256K 比 128K 更好，1M 解决一切。

但 Chroma Research 在 2025 年对 18 个前沿 LLM 的系统性实验讲述了一个不同的故事。他们发现：模型性能随输入 token 数增长而可测量地退化——不是到达某个阈值后突然崩塌，而是从一开始就在持续衰减。窗口还远未"满"，性能已经在下滑。

更准确的心理模型不是杯子，是冲茶。你有一杯浓茶：前几千个 token，信号强，模型对每个 token 都关注得很到位。然后你不断往里加水，但不加茶叶。液体的总量在增加，但浓度在稀释。杯子没满，茶已经淡得喝不出味道了。

Chroma 把这个现象命名为 **context rot**——上下文腐化。不是溢出，是衰变。

## 三种退化机制

Chroma 的实验方法论值得注意：他们保持任务难度不变，仅变化输入长度，从而隔离了"输入长度本身"作为性能退化的变量。这个控制让他们分离出三种独立的退化机制。

**注意力稀释（Attention Dilution）。** Transformer 的自注意力机制让每个 token 关注所有其他 token。当 context 从 1,000 tokens 增长到 100,000 tokens，注意力预算被摊薄到 100 倍的 token 上。实验表明，当 needle（目标信息）和 question（查询）的语义相似度较低时，这种稀释的杀伤力尤其大。不是因为任务变难了（同样的 needle-question 配对在短 context 下表现良好），而是因为模型在茫茫 token 海中"找不到路"了。

**干扰项干涉（Distractor Interference）。** Context 中与目标信息主题相关但内容不正确的 token（distractor）会主动误导模型。即使只有一个 distractor 也能拉低性能，四个 distractor 更严重。关键发现是：不同 distractor 的干扰强度不均匀，而且这种不均匀性随输入长度增长而放大。

这里还有一个反直觉的模型行为分化。面对 distractor 干扰，Claude 系列的策略是弃权，"找不到确定答案，我不回答"；GPT 系列的策略是自信回答，即使答案来自 distractor 而非 needle。一个选择了假阴性，一个选择了假阳性。同样的退化压力，不同的失败模式。

**结构干扰（Structural Interference）。** 这是三种机制中最违反直觉的。实验发现：逻辑连贯、结构完整的 haystack（背景文本）反而比随机打乱句子顺序的 haystack 更损害 needle 检索性能。

为什么？一种假说是注意力机制被结构化内容"吸引"了。一段逻辑连贯的文本内部有更强的局部关联（句子之间相互呼应、段落之间层层递进），这些关联吸走了本该分配给 needle 的注意力资源。打乱顺序后，局部关联被破坏，注意力反而更容易被 needle 捕获。

对 agent 系统来说这意味着什么？你精心格式化的工具输出、结构清晰的文件内容、逻辑连贯的对话历史。这些"好的工程实践"产生的结构化 context，在 attention 层面可能正在和你的核心指令抢夺注意力。工程师花力气让 context 更有条理，注意力机制却可能因此更难找到那条藏在里面的关键指令。

## Lost-in-the-Middle 只是冰山一角

如果你关注过长 context 的研究，大概听说过 Liu et al. 2024 年的 "Lost in the Middle" 发现：模型对 context 中间位置的信息检索能力最差，呈现一条 U 型曲线：开头和结尾的信息被记住，中间的信息被遗忘。

这个发现是真实的，但它只描述了 context rot 的一个切面：位置效应。Chroma 的实验在 11 个 needle 位置上未发现显著的位置效应。他们观察到的退化不依赖于信息放在哪里，而是依赖于 context 有多长、里面有多少干扰项、内容的结构有多强。

换句话说，Lost-in-the-Middle 是 context rot 的一个特例，不是全貌。你可以通过把关键信息放在开头或结尾来缓解位置效应，但你无法通过调整位置来对抗注意力稀释、干扰项干涉和结构干扰。这些是更深层的退化源。

## Maximum Effective Context Window

这些退化机制共同指向一个实用概念：**Maximum Effective Context Window（MECW）**，即模型在特定任务上能维持可靠性能的实际 context 长度上限。

MECW 远小于标称窗口大小。Paulsen（2025）对真实世界任务的测试表明，部分前沿模型在输入仅约 100 tokens 时就开始出现任务失败，多数模型在 1,000 tokens 时已有明显的准确率退化，远低于它们宣称的上限。标称窗口不等于有效窗口，两者之间的差距可能是数量级的。

而且 MECW 不是一个固定数字。多步推理比单步检索对 context 质量更敏感，所以同一个模型在不同任务上的 MECW 可以差出几个数量级。context 里的信噪比在变化，噪声越多，MECW 越小。干扰项密度在变化，与目标相关但不正确的内容是最致命的噪声源。甚至内容的结构化程度也在起作用：结构干扰效应意味着组织良好的 context 未必比杂乱的 context 更友好。

Chroma 的实验使用的是极简任务：从文本中找到一个事实并回答一个问题。实际 agent 任务涉及多步推理、工具调用、状态追踪，复杂度远超 needle-in-a-haystack。合理的推断是：在真实 agent 场景中，MECW 比实验测得的还要小。

## 信道容量的视角

注意力稀释、干扰项干涉、结构干扰。三种机制看起来各自独立，但它们共享一个底层结构。Shannon 的信道容量公式可以帮忙看清这个结构：

$$C = B \log_2(1 + S/N)$$

$C$ 是信道容量（单位时间内能可靠传输的最大信息量），$B$ 是带宽，$S/N$ 是信噪比。

把 context window 想象成一条信道。$B$ 对应窗口大小，即你能塞进多少 token。$S/N$ 对应 context 中信号 token 与噪声 token 的比率。$C$ 对应模型实际能从这个 context 中提取的有效信息量。

这个类比不是数学等价——context window 不是无记忆高斯信道，注意力机制不是线性解码器。但它捕捉到了 context rot 的结构性本质：

**增大 $B$ 不能无限提高 $C$，因为 $S/N$ 在同步下降。**

每一轮 agent 循环往 context 里加入的东西（工具调用的原始输出、文件的完整内容、中间推理的碎片）大部分是噪声或弱信号。窗口在变大，但信噪比在恶化。Shannon 公式的 spirit 告诉我们：当 $S/N$ 趋向 0 时，无论 $B$ 多大，$C$ 都趋向 0。

这就是为什么"用更大的 context window 解决 context rot"是一个自我击败的策略。你加宽了管道，但泵入了更多的噪声。

也是为什么 Chroma 的三种退化机制在这个框架下显得自然：注意力稀释是 $B$ 增大时 $S/N$ 的被动下降；干扰项干涉是 $N$ 的主动增大（相关但错误的内容是最有效的噪声）；结构干扰是信号被结构化噪声掩盖的特殊情况。

---

Context rot 能被"修复"吗？不是不可能，但修复的主战场不在 harness 层。注意力机制的退化是模型架构的性质：怎么让 transformer 在长序列上维持均匀的注意力分配、怎么减轻 distractor 的干扰、怎么让结构化内容不"吸走"注意力。这些是模型研究者的课题，是 [ch-01 里讲的那股力](../ch-01-orthogonality/02-what-is-the-model.md)的范畴。从 Sparse Attention 到 Ring Attention 到各种长 context 架构创新，模型层面的进展一直在推高 MECW 的天花板。

但 harness 工程师面对的是当下已经部署的模型。在模型能力给定的约束下，harness 能做的是管理信噪比——决定什么进入 context、什么不进入、什么时候压缩、怎么压缩。这是信道工程，不是信道物理。

认清两层的分界，才不会在错误的层面用力。entropy 的故事从来都有两半：一半是无序在增长，另一半是你在约束内能做什么。当 context 在腐化的同时，agent 还在持续做决策、调用工具、产生输出——每一个被稀释的指令、每一次被干扰的检索，都可能让下一步偏离更远。退化不是静止的，它会流动。

</div>

---

## 延伸阅读

- Chroma Research (2025). "Context Rot: How Increasing Input Tokens Impacts LLM Performance."
- Liu, N.F. et al. (2024). "Lost in the Middle: How Language Models Use Long Contexts." *TACL*.
- Paulsen (2025). "The Maximum Effective Context Window for Real World Tasks."
