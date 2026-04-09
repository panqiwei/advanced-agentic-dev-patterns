# Causal Discipline

<div class="mm-article" markdown>

The ladder made the situation clear: LLMs naturally inhabit the first rung — association. Many valuable engineering problems require second- or even third-rung reasoning.

But there's a subtle pivot here.

The question is not "how do we get the LLM to climb to the second rung." Maybe that will be possible someday — RLVR training and related approaches are being explored — but it's not a solved problem today. The more actionable question is: **what does a system that *knows* its reasoning engine can only do first-rung work need in order to remain honest with itself?**

The answer doesn't come from surveying specific engineering practices. It's derived from the nature of causality itself — from Hume's analysis, Pearl's framework, and the mechanistic limitations of the reasoning engine.

## Evidence must be graded

Not all "knowing" is equally reliable.

An agent investigating a technical incident reports: "The database latency spike caused the API timeouts." This statement contains a causal assertion. But what supports it?

If the evidence is "database latency and API timeouts both increased during the same time window" — this is first-rung evidence, an associational observation. Both might be effects of a third cause (network congestion). The causal direction could be entirely backwards.

If the evidence is "we injected artificial database latency in a staging environment and observed API timeouts appear" — this is second-rung evidence, an interventional experiment. Causal direction is now controlled.

If the evidence is "the database team confirmed that a query optimizer regression caused the latency and explained how it propagated to the API layer" — this is expert judgment, typically grounded in understanding of internal mechanisms.

These three forms of "knowing" are not on the same level. The causal ladder directly implies: **a system that conflates evidence levels is using the reliability of a correlational observation to bear the weight of a causal assertion.**

A system without evidence grading will deliver correlational observations in the tone of causal assertions. The word "caused" sounds identical whether it comes from that system or from a researcher who ran an RCT — but the weight behind the word is entirely different.

## The arrow of time must not be violated

Causal relationships have one structural property guaranteed by physics: causes precede effects.

This sounds too obvious to mention. But in the LLM's world, it's far from automatic. A model can weave a narrative in any direction — it can say "API timeouts caused the database latency spike" as long as that phrasing is linguistically plausible. Language does not enforce temporal direction.

Among the three elements Hume identified in his analysis of causation, temporal priority is the only purely objective one — it's not projected by the mind, not produced by habit. It's a structural constraint of the physical world.

This constraint directly implies: **a causal chain in which a cause's timestamp is later than its effect's is physically impossible.** This is not an optional consistency check — it's a basic constraint that physics imposes on any causal narrative.

A causal assertion that violates temporal ordering isn't "possibly wrong" — it's structurally impossible. An honest system won't let such assertions pass.

## Hypotheses must not skip verification

The core cycle of the scientific method: observation → hypothesis → prediction → verification → accept or reject.

There's a critical status distinction embedded in this cycle: hypotheses and verified conclusions are not the same thing. The distance between "I suspect database latency caused the timeouts" and "experiments confirmed that database latency caused the timeouts" might be one staging experiment — but it is not zero.

LLMs do not make this distinction. They express hypotheses and conclusions with the same tone, the same certainty. The difference in output probability between "database latency may have caused the timeouts" and "database latency caused the timeouts" is far smaller than the difference in epistemic status.

Epistemic honesty implies: **a system that doesn't distinguish hypotheses from verified conclusions is driving downstream decisions with untested guesses — without knowing it.** Hypotheses can exist, can be recorded, can await verification. But the distance between a hypothesis and a conclusion is not zero.

This is not over-engineering. Consider an agent conducting long-chain reasoning that treats an unverified hypothesis as fact, derives conclusions from it, makes decisions based on those conclusions, and takes actions based on those decisions. Every step looks individually reasonable, but the entire chain hangs from an untested hook. This is entropy increase in the reasoning chain — a specific symptom of absent causal discipline.

## Reasoning chains must be traceable

Every conclusion should be able to answer the question: "how do you know?"

This is not a rhetorical requirement. In long-chain reasoning, a plausible-looking conclusion may rest on a correlational observation from five steps back — an observation whose causal reliability is limited. If you can't trace the chain, you can't evaluate the conclusion's credibility.

The citation system of scientific publishing is a form of reasoning provenance. Every claim links to its evidence; evidence links to deeper evidence. You can follow the citation chain all the way to original data. This isn't academic red tape — it's the structural requirement for making a knowledge system auditable.

Reasoning provenance matters especially for agentic systems. When an agent makes a decision, you need to answer: what did it observe? What inferences did it draw? What was the evidence level at each step? Which links in the chain are strong causal reasoning (experimentally verified) and which are weak (correlational observation) or mere pattern matching?

Without this trace, you're facing a black box — one that can say "the answer is X" but cannot explain "why X." For low-risk scenarios, this might be acceptable. For high-risk scenarios, it is not.

## The unity of the four disciplines

Step back, and these four are not an independent checklist.

Evidence grading is honesty about *how reliable the knowledge is*. Temporal ordering is honesty about *causal direction*. Hypothesis verification is honesty about *the degree of confirmation*. Reasoning provenance is honesty about *the chain of justification*.

They are all facets of a single core need — keeping the system honest about *what it knows* and *how it knows it*.

This is causal discipline.

Causal discipline is not causal reasoning ability itself — it doesn't make the system better at inferring causation. It does something more fundamental: it compels the system, when wielding its limited causal reasoning capacity, to remain transparent about the quality of its evidence.

A system without causal discipline presents the most plausible narrative as a factual report. A system with causal discipline annotates: this is a hypothesis based on temporal co-occurrence, evidence level is "associational observation," causal direction is unverified, reasoning chain is as follows.

The difference is not that the second system is smarter. It's that the second system is more honest.

</div>

---

## Further reading

- Judea Pearl, "An Introduction to Causal Inference" (2010) — Pearl's own most accessible summary of his framework. Covers SCMs, the do-operator, backdoor and frontdoor criteria, and mediation analysis in about 30 pages. If you want to understand what "causal discipline" looks like in formal terms, start here.
