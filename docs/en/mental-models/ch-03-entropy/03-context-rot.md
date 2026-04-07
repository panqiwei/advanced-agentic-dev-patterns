# Context rot

<div class="mm-article" data-card="assets/context-rot.png" data-card-alt="Context rot — attention dilution, distractor interference, and channel capacity" markdown>

In 2026, mainstream models offer context windows of 256K to 1M tokens. Capacity is no longer the bottleneck — a two-hour agent session's worth of tool call results, file contents, and conversation history fits comfortably. But the question was never about fitting. The question is: at token 500,000, how much does the model still "remember" about that critical instruction written back at token 1,000?

The intuitive answer is "as long as it hasn't hit the window limit, everything is fine."

That intuition is wrong.

## Not an overflow, a dilution

Most engineers carry a mental model of the context window as a bucket. Pour water in; when it overflows, you lose something. As long as the bucket isn't full, you're safe. Under this model the only context-management problem is capacity, so 128K is better than 32K, 256K is better than 128K, 1M solves everything.

Chroma Research's 2025 systematic study of 18 frontier LLMs tells a different story. They found that model performance degrades measurably as input token count grows. Not by hitting some cliff, but by declining continuously from the start. The window is nowhere near "full," and performance is already sliding.

A better mental model: a cup of tea. The first few thousand tokens are strong brew. High signal density, sharp attention on every token. Then you keep adding hot water without adding tea leaves. Total liquid volume goes up. Concentration goes down. The cup never overflows. The tea becomes too weak to taste.

Chroma named this phenomenon **context rot**. Not overflow. Decay.

## Three degradation mechanisms

Chroma's experimental methodology deserves attention: they held task difficulty constant and varied only input length, isolating "input length itself" as the variable driving performance degradation. This control allowed them to separate three independent mechanisms.

**Attention dilution.** The Transformer's self-attention mechanism has every token attend to every other token. When context grows from 1,000 to 100,000 tokens, the attention budget gets spread across 100x more positions. Experiments showed that when the semantic similarity between the needle (target information) and the question is low, this dilution becomes especially destructive. Not because the task got harder (the same needle-question pair performs well in short context), but because the model can no longer find its way through the sea of tokens.

**Distractor interference.** Tokens in the context that are topically related to the target but factually incorrect (distractors) actively mislead the model. Even a single distractor measurably degrades performance; four distractors make it worse. What caught Chroma's attention: different distractors interfere with unequal strength, and this unevenness amplifies as input length grows.

There is also a counterintuitive divergence in how different model families break. Claude-family models tend toward abstention: "I can't find a confident answer, so I won't answer." GPT-family models tend toward confident response, even when the answer comes from a distractor rather than the needle. One chooses false negatives; the other chooses false positives. Same degradation pressure, different failure modes.

**Structural interference.** This is the most counterintuitive of the three. The experiments found that a logically coherent, well-structured haystack (background text) actually damages needle retrieval performance *more* than a haystack with sentences randomly shuffled.

Why? One hypothesis: the attention mechanism gets "captured" by structured content. A coherent passage has stronger local correlations. Sentences reference each other, paragraphs build on one another, and these correlations siphon attention away from the needle. Shuffle the sentences, break the local coherence, and attention is freed up to find the needle more easily.

Think about what this means for agent systems. Your carefully formatted tool outputs, your cleanly structured file contents, your logically coherent conversation history. The "good engineering practices" that produce well-organized context may be competing with your core instructions for the model's attention at the mechanism level. The effort you spend making context more orderly might be making it harder for attention to find the one instruction that matters.

## Lost-in-the-Middle is only one facet

If you have followed long-context research, you have probably encountered Liu et al.'s 2024 "Lost in the Middle" finding: models retrieve information worst from the middle of their context, producing a U-shaped curve. Beginnings and endings are remembered, middles are forgotten.

That finding is real, but it describes only one slice of context rot: positional bias. Chroma's experiments, testing across 11 needle positions, found no significant positional effect. The degradation they observed depended not on *where* information was placed, but on *how long* the context was, *how many* distractors it contained, and *how structured* the content was.

In other words, Lost-in-the-Middle is a special case of context rot, not the whole picture. You can mitigate positional bias by placing critical information at the start or end. You cannot mitigate attention dilution, distractor interference, or structural interference by rearranging positions. These are deeper sources of decay.

## Maximum Effective Context Window

The three mechanisms point to a practical concept: **Maximum Effective Context Window (MECW)**, the actual context length at which a model can maintain reliable performance on a given task.

MECW is far smaller than the advertised window size. Paulsen's 2025 testing on real-world tasks showed that some frontier models begin failing at roughly 100 tokens of input, with most showing clear accuracy degradation by 1,000 tokens — far below their advertised limits. The gap between advertised and effective window can be orders of magnitude.

And MECW is not a fixed number. Multi-step reasoning is more sensitive to context quality than single-step retrieval, so the same model's MECW can vary by orders of magnitude across tasks. The signal-to-noise ratio in context keeps shifting; more noise, smaller MECW. Distractor density keeps shifting; topically related but incorrect content is the most lethal form of noise. Even the degree of structural organization matters. Structural interference means well-organized context is not necessarily friendlier than messy context.

Chroma's experiments used minimal tasks: find a fact in a text, answer a question. Real agent tasks involve multi-step reasoning, tool calls, state tracking, all far more complex than needle-in-a-haystack. In real agent scenarios, MECW is almost certainly smaller still.

## A channel-capacity lens

Attention dilution, distractor interference, structural interference. Three mechanisms that look independent, but they share an underlying structure. Shannon's channel capacity formula helps make it visible:

$$C = B \log_2(1 + S/N)$$

$C$ is channel capacity (the maximum rate at which information can be reliably transmitted), $B$ is bandwidth, and $S/N$ is the signal-to-noise ratio.

Think of the context window as a channel. $B$ is window size, how many tokens you can fit. $S/N$ is the ratio of signal tokens to noise tokens in the context. $C$ is the amount of useful information the model can actually extract.

This analogy is not a mathematical equivalence. A context window is not a memoryless Gaussian channel, and the attention mechanism is not a linear decoder. But the formula captures the structural essence of context rot:

**Increasing $B$ cannot raise $C$ without bound, because $S/N$ is falling in tandem.**

Every agent loop that dumps material into context (raw tool outputs, complete file contents, fragments of intermediate reasoning) is mostly noise or weak signal. The window gets bigger, but the signal-to-noise ratio deteriorates. The spirit of Shannon's formula: as $S/N$ approaches zero, $C$ approaches zero regardless of how large $B$ is.

This is why "solve context rot with a bigger context window" is a self-defeating strategy. You widen the pipe, but you pump more noise through it.

And it is why Chroma's three mechanisms feel natural under this framing: attention dilution is the passive decline of $S/N$ as $B$ grows; distractor interference is the active increase of $N$ (topically related but incorrect content is the most effective noise); structural interference is the special case where signal gets masked by structured noise.

---

Can context rot be "fixed"? It can — but the fix lives at the model layer, not the harness layer. How to maintain uniform attention across long sequences, how to reduce distractor interference, how to prevent structured content from hijacking attention — these are problems for model researchers, squarely within [the force described in ch-01](../ch-01-orthogonality/02-what-is-the-model.md). From Sparse Attention to Ring Attention to various long-context architectural innovations, model-level progress keeps pushing the MECW ceiling higher.

But harness engineers work with the models that exist today. Given a model's current attention characteristics, what the harness controls is signal-to-noise ratio — what enters the context, what stays out, when to compress, how to compress. This is channel engineering, not channel physics.

Recognizing which layer owns which problem saves you from pushing in the wrong place. The entropy story always has two halves: one about disorder growing, the other about what you can do within the constraints. While context decays, the agent keeps making decisions, calling tools, producing outputs. Every diluted instruction, every misdirected retrieval, can push the next step further off course. Degradation does not sit still. It flows.

</div>

---

## Further reading

- Chroma Research (2025). "Context Rot: How Increasing Input Tokens Impacts LLM Performance."
- Liu, N.F. et al. (2024). "Lost in the Middle: How Language Models Use Long Contexts." *TACL*.
- Paulsen (2025). "The Maximum Effective Context Window for Real World Tasks."
