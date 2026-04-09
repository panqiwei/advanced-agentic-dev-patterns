# Causality

A language model can fluently tell you "rain causes wet roads, wet roads cause brake failure, brake failure causes rear-end collisions." The causal chain is complete, plausible, and consistent with common sense.

But how does it "know" this?

Not by observing rainwater washing across pavement. Not by measuring the friction coefficient between tire rubber and wet asphalt. It learned that "rain" and "slippery" frequently co-occur across billions of texts, that "slippery" and "accident" frequently co-occur. It learned what tends to appear alongside what — not what causes what.

Most of the time, this is enough. Correlation and causation overlap heavily in everyday scenarios. But the gap between "most of the time" and "always" is wide enough for an entire agent system to fall through.

This chapter asks a structural question: when your reasoning engine learns from correlation but your application demands the reliability of causation, where in the system does the gap need to be bridged? The answer is not making the model "smarter" — it's making the entire system honest with itself. We call this causal discipline.

---

![Causality — LLM lives in an ocean of correlation, harness builds causal discipline](assets/causality-overview.png)

---

| # | Article | One-liner |
|---|---------|-----------|
| 01 | [Hume's Fork](01-humes-fork.md) | Humans themselves have never observed causation — Hume showed we rely on constant conjunction and habit, not rational proof |
| 02 | [The Ocean of Correlation](02-ocean-of-correlation.md) | Next-token prediction learns constant conjunction at the token level — surprisingly powerful, but with structural blind spots |
| 03 | [The Ladder](03-the-ladder.md) | Pearl's causal ladder quantifies the predicament: the three rungs are separated, and no amount of correlation data answers interventional questions |
| 04 | [Causal Discipline](04-causal-discipline.md) | Four structural requirements derived from the nature of causality: evidence grading, temporal constraints, hypothesis verification, reasoning provenance |
| 05 | [The Cost of Honesty](05-the-cost-of-honesty.md) | Causal discipline adds complexity, reduces speed, and shifts design burden — when is the price worth paying? |
| 06 | [The Dao of Causality](06-the-dao-of-causality.md) | How causal discipline resonates with feedback loops, entropy, and fractal structure. Coda: the carrier question points toward symbols and connectionism |

Read 01 through 06 in order. Each article assumes the previous ones.

Prerequisites: [ch-01 Orthogonality](../ch-01-orthogonality/index.md) (direction of forces), [ch-02 Cybernetics](../ch-02-cybernetics/index.md) (feedback loops), [ch-03 Entropy](../ch-03-entropy/index.md) (information decay).
