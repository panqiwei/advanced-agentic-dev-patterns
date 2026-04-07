# The first force: what is the model

<div class="mm-article" data-card="assets/what-is-the-model.png" data-card-alt="What is the model" markdown>

To decide where your force should point, you need to see what the other force looks like.

## A completer that has read everything

Strip a modern large language model down to its core, and it is doing one thing: **predicting the next token.**

You give it a sequence of text — a question, some code, half an article — and it returns a probability distribution: "Given everything I have seen in human text, which token is most likely to follow this sequence?" It appends that token, then predicts the next one. Over and over, until it decides to stop.

That is it. Nothing more.

If you were expecting a digital oracle pondering in silicon, this might be disappointing. But hold off on the disappointment — the interesting part comes right after "that is it."

## A simple objective, complex emergence

Next-token prediction is a plain, almost boring objective function. But put it in a large enough parameter space and train on nearly all of the text humans have produced, and unexpected things begin to happen.

The model starts writing code, solving math problems, analyzing complex business cases. It follows multi-step instructions, performs operations that look like reasoning, and generates text that human readers find insightful.

None of this was directly programmed in. The training objective was always the same — get the next token right. But in pursuing that objective, the model developed internal structures that the objective never explicitly asked for.

Mechanistic interpretability — a research field dedicated to reverse-engineering neural network internals — has started confirming this with experimental data. MIT Technology Review listed it among the 10 Breakthrough Technologies of 2026.

??? info "Early clues (2023)"

    - **Othello-GPT**: A model trained only on Othello game transcripts (character sequences of moves) spontaneously developed structured internal representations of the board state. It was not just predicting the next move symbol — in some meaningful sense, it "knew" what the board looked like.
    - **Space and time representations**: Gurnee and Tegmark found that LLM internal representations encode geographic spatial relationships between cities and temporal ordering of events. These structures were not required by the training objective, yet they exist in the model's parameters.

In 2025, Anthropic's circuit tracing research tracked computation paths inside Claude from input to output. A few findings are worth noting:

When asked for "the opposite of small," whether in English, French, or Chinese, the model activates the same set of concept features internally — first "smallness" and "opposition," then "largeness," then translates into the language of the question. It is not doing three separate translations. It has a cross-lingual semantic space.

When writing poetry, the model picks candidate rhyming words first, then works backwards to compose the preceding line. Not word-by-word guessing — planning the destination before paving the road.

When answering "What is the capital of the state Dallas is in?", the model first activates "Dallas → Texas," then jumps to "Texas capital → Austin." It is composing independent knowledge fragments, not recalling a pre-stored answer.

In June of the same year, another study showed that LLMs encode linear spatial world models internally — not just game board states, but general physical space representations.

## Does it "understand"?

Here we reach a fork in the road. On one side, Bender et al.'s "stochastic parrots" argument — language models are doing sophisticated statistical collage, and co-occurrence is not comprehension. On the other side, the empirical findings above suggest that under next-token prediction pressure, models develop internal encodings of world structure — something that at least resembles the beginnings of understanding.

The debate continues. Both sides have serious researchers and arguments that cannot be dismissed. There will be no resolution soon.

But as engineers, we do not need to wait for the referee's whistle.

!!! tip "The engineer's stance"

    Whatever you call these emergent behaviors — "understanding," "statistical emergence," or something else — the model's operating mechanism is known: it does next-token prediction, and its behavior is shaped by training data and parameter space. Your engineering decisions should be based on this mechanism's **operational characteristics**, not on whether there is a soul behind it that truly "gets it."

## Operational characteristics

Four characteristics that matter for engineers:

| Characteristic | What it means |
|------|------|
| **Probabilistic** | Same input does not guarantee same output. You get a sample drawn from a probability distribution, not the return value of a deterministic function. |
| **Stateless per inference** | Every call is a fresh computation. When it "remembers" something from the previous turn, that is because you (or your harness) fed the prior context back in. |
| **Context window bound** | There is a hard ceiling on how much information it can "see." Anything beyond that window does not exist, as far as the model is concerned. |
| **Capability scales predictably with compute** | More parameters, more data, more compute → lower prediction error → stronger emergent behaviors. Not faith — an empirical regularity verified over and over. |

These four constraints are what you actually need to care about when working with the model. It is strong, and getting stronger — but how it gets stronger has structure.

So: how strong is it? How fast is it getting stronger?

</div>

## Further Reading

- Anthropic. (2025). Tracing the Thoughts of a Large Language Model. [anthropic.com](https://www.anthropic.com/research/tracing-thoughts-language-model)
- Anthropic. (2025). Circuit Tracing: Revealing Computational Graphs in Language Models. [transformer-circuits.pub](https://transformer-circuits.pub/2025/attribution-graphs/methods.html)
- Anthropic. (2025). On the Biology of a Large Language Model. [transformer-circuits.pub](https://transformer-circuits.pub/2025/attribution-graphs/biology.html)
- Anthropic. (2025). Emergent Introspective Awareness in Large Language Models. [transformer-circuits.pub](https://transformer-circuits.pub/2025/introspection/index.html)
- Tehenan, M., Bolivar Moya, C., Long, T., & Lin, G. (2025). Linear Spatial World Models Emerge in Large Language Models. [arXiv:2506.02996](https://arxiv.org/abs/2506.02996)
- Li, K., Hopkins, A. K., Bau, D., Viégas, F., Pfister, H., & Wattenberg, M. (2023). Emergent World Representations: Exploring a Sequence Model Trained on a Synthetic Task. [arXiv:2210.13382](https://arxiv.org/abs/2210.13382)
- Gurnee, W. & Tegmark, M. (2023). Language Models Represent Space and Time. [arXiv:2310.02207](https://arxiv.org/abs/2310.02207)
- Bender, E. M., Gebru, T., McMillan-Major, A., & Shmitchell, S. (2021). On the Dangers of Stochastic Parrots: Can Language Models Be Too Big? [doi:10.1145/3442188.3445922](https://doi.org/10.1145/3442188.3445922)
- MIT Technology Review. (2026). Mechanistic Interpretability: 10 Breakthrough Technologies 2026. [technologyreview.com](https://www.technologyreview.com/2026/01/12/1130003/mechanistic-interpretability-ai-research-models-2026-breakthrough-technologies/)
