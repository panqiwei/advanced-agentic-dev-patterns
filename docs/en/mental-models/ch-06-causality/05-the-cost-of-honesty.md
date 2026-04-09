# The Cost of Honesty

<div class="mm-article" markdown>

Causal discipline sounds eminently reasonable — evidence grading, temporal constraints, hypothesis verification, reasoning provenance. Who would object to "making the system more honest"?

But reasonable and free are not the same thing.

## Complexity

Every plank of causal discipline adds system complexity.

Evidence grading demands a classification scheme — what counts as "observational" evidence, what counts as "interventional," what counts as "expert judgment." These categories must be encoded as types, annotated at every data write, and filtered at every query.

Temporal constraints require timestamp management. Not just "when was this data produced" — but "when did the event this data claims to describe actually occur." Production time and event time are different. You need two timestamps, consistency checks, and temporal ordering validation whenever a causal chain is assembled.

Hypothesis lifecycle tracking requires a state machine. Every assertion carries a cognitive status — hypothesis, verification-in-progress, confirmed, refuted — with transitions requiring trigger conditions and audit records. Who moved this from "hypothesis" to "confirmed"? Based on what evidence? When?

Reasoning provenance requires graph structures. Each inference links to its premises; premises link to deeper premises. This is not a flat table — it's a directed acyclic graph. You need to store it, traverse it, and walk it backwards on demand.

A system without causal discipline only needs to store answers. A system with causal discipline needs to store answers, evidence levels, timestamps, cognitive states, reasoning chains, and the update history of all of the above. The data volume and structural complexity are not in the same league.

## Speed

Causal discipline slows system response.

Each inference, when produced, needs evidence-level annotation — a classification judgment. Temporal consistency needs checking — a constraint validation. The reasoning chain needs recording — a write operation. Hypothesis status needs checking — a state query.

Each of these steps is fast individually. But they execute on every inference, and long-chain reasoning may involve dozens. Cumulative latency is non-trivial.

More subtly, there's decision latency. A system without causal discipline can output a conclusion after its first inference. A system with causal discipline may need to wait — because a premise the conclusion depends on is still stuck in "hypothesis" status and needs more evidence before it can be confirmed. The system knows it isn't sure enough yet, so it waits.

Waiting is the cost of honesty.

## Design burden

Causal discipline shifts substantial cognitive load from the model to the system designer.

Who defines the evidence-level taxonomy? How many levels? Where are the boundaries? What level does "the user said so" get? What about "the model inferred it"? Or "extracted from a temporal correlation in logs"?

Who decides when a hypothesis is sufficiently verified? What kind of evidence is enough to promote a hypothesis to a conclusion? How many independent pieces of evidence? At what evidence level? Do the criteria differ across domains?

These questions have no universal answers. Each requires domain expertise and engineering judgment. Causal discipline provides the structure — you need grading, you need verification, you need provenance — but the specific parameters within that structure are the designer's work.

This is an engineering tradeoff, not a moral judgment. Investing more design effort to achieve higher causal reliability — whether it's worthwhile depends on the scenario.

## When correlation is good enough

Not every scenario needs causal discipline.

"Help me write an email" — the model supplies statistically appropriate phrasing. Wrong? Edit two sentences.

"Complete this line of code" — the model offers the most common pattern for this context. Usually sufficient. Wrong? The compiler and tests will tell you.

"Summarize this document" — the model extracts the most salient information. Missed something? Ask again, or read the original.

These scenarios share a common trait: **errors are visible, cheap, and correctable.**

When errors are visible, you don't need causal discipline to ensure correctness — the feedback loop itself corrects mistakes. When errors are cheap, the engineering investment in causal discipline doesn't pay for itself. When errors are correctable, occasional mistakes carry no irreversible consequences.

In these scenarios, the efficiency advantage of correlational reasoning — fast, lightweight, no elaborate evidence management system required — far outweighs the cost of its occasional failures. Imposing causal discipline would be over-engineering.

## When causal discipline is essential

Three conditions push you past correlation's limits.

**Errors are invisible.** The agent makes a plausible-looking but incorrect causal judgment, and you have no rapid detection mechanism. The error propagates, compounds, and doesn't surface until the consequences are already irreversible. This is silent failure — the most dangerous consequence of absent causal discipline in a reasoning chain.

**Errors are expensive or irreversible.** Medical diagnostic suggestions, financial decision support, root-cause analysis of security incidents — in these scenarios, one wrong causal judgment can mean consequences that cannot be walked back. You cannot rely on "fix it if it's wrong" — because the cost of fixing dwarfs the benefit of being right.

**Reasoning chains are long.** This is the most overlooked category. Each reasoning step introduces a small amount of causal uncertainty. In short chains — one or two steps — cumulative error is negligible. But in long chains — ten, twenty, or more steps — uncertainty compounds.

This last point connects directly to the third chapter of this series (Entropy). Information decay in reasoning chains has a specific cause: the silent substitution of correlation for causation at each step. Causal discipline's core job is to force a signal-quality check at every link — compelling the system to honestly annotate, at each step, how causally reliable this particular inference is.

---

Three factors — visibility, cost, chain length — form a judgment framework.

| Factor | Low need | High need |
|--------|----------|-----------|
| Error visibility | Errors surface quickly | Errors may remain hidden |
| Error cost | Wrong is cheap, can redo | Wrong is expensive or irreversible |
| Chain length | One or two steps to conclusion | Multi-step reasoning, uncertainty compounds |

When all three columns sit on the left, correlation is good enough. When any column moves to the right, causal discipline starts becoming necessary. When multiple columns are simultaneously on the right — a long reasoning chain producing irreversible decisions where errors are hard to detect — causal discipline is not optional. It's a survival condition.

</div>

---

## Further reading

- Haoang Chi et al., "Unveiling Causal Reasoning in Large Language Models: Reality or Mirage?" (NeurIPS 2024) — Distinguishes LLM level-1 (parametric knowledge recall) from level-2 (genuine causal inference) ability, and shows that external scaffolding (G2-Reasoner) significantly improves level-2 performance. An empirical answer to the question of whether the cost of causal discipline is worth paying.
