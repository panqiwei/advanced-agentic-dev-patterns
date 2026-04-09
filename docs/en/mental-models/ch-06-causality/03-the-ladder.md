# The Ladder

<div class="mm-article" markdown>

How deep is the ocean of correlation? Put differently: if causal reasoning has *levels*, where does an LLM sit?

This question didn't get a precise answer until the 2000s. And the person who answered it wasn't a philosopher — it was a computer scientist named Judea Pearl.

## Three rungs

Pearl divided causal reasoning into three levels. He called it the Ladder of Causation.

A single scenario will make the structure clear.

**Rung one: Association (Seeing).** "Among people who took this drug, 70% recovered."

This is statistics. You've observed a correlation between drug use and recovery in the data. Mathematically, you're computing P(Y|X) — the probability of Y given that X was observed. No causal assumptions required. Just data and statistical tools. LLMs operate on this rung effortlessly — their entire training process is learning exactly this kind of conditional probability.

**Rung two: Intervention (Doing).** "If I *make* a patient take this drug, what is the probability they recover?"

This sounds like the same question. It isn't.

In the observational data, people who take the drug may already be healthier — they see doctors, fill prescriptions, follow treatment plans. Perhaps it's this health-consciousness that drives recovery, not the drug itself. This is confounding: a hidden variable simultaneously influences both drug use and recovery, manufacturing a false causal impression.

To answer an interventional question, you need to strip away the confounding. You need not P(Y|X) — the recovery rate among people *observed* taking the drug — but P(Y|do(X)) — the recovery probability when you *make* someone take it. Pearl's do-operator means: not passively observing X, but actively setting X, severing X from all its natural causes.

A randomized controlled trial is the physical realization of the do-operator: random assignment eliminates confounding.

**Rung three: Counterfactual (Imagining).** "This patient took the drug and recovered. Would they have recovered *without* the drug?"

This is the highest rung — reasoning about a world that never happened, starting from facts that did. You're not asking about population statistics. You're asking about one specific individual's alternative history.

The legal "but-for" test (would the harm have occurred *but for* the defendant's action?) is a counterfactual question. "Did this drug save this person's life?" is another. Pearl's framework provides precise mathematical tools for such questions — but it requires a causal model, not merely statistical data.

## Why the three rungs cannot substitute for each other

Intuitively, enough first-rung data ought to answer second-rung questions — surely with sufficient observational data, you can tease out causal relationships?

In 2022, Bareinboim, Correa, Ibeling, and Icard proved a theorem that says no.

!!! quote "The Causal Hierarchy Theorem (CHT)"

    The three levels of the causal ladder are, in a measure-theoretic sense, *almost always* separated. Complete knowledge at the first level — meaning knowledge of every statistical association among every variable — is almost always insufficient to determine the answer to a second-level (interventional) question. Similarly, complete knowledge at the first and second levels is almost always insufficient to determine a third-level (counterfactual) answer.

"Almost always" is the mathematical term meaning: exceptions occupy zero measure in the space of possible causal models — the way integers occupy zero measure on the real line. In principle, there exist special cases where first-rung data happens to suffice for a second-rung question. The probability that you encounter one is zero.

This is not an empirical finding. It is a theorem.

Its engineering implication is blunt: **no amount of correlational data can answer interventional questions.** You could feed every text ever written into a model, let it learn every statistical association among every variable — and those associations would, mathematically, almost always fail to determine what would happen if you *did* X rather than merely *observed* X.

## Where the LLM sits on the ladder

With this framework in hand, the LLM's position can be described precisely.

The LLM's pretraining objective — next-token prediction — structurally corresponds to a first-rung operation. It learns P(next token | context), the conditional probability of the next token given its context. This is an associational task. Post-training stages (RLHF, RLVR) introduce additional optimization signals, but they refine the statistical co-occurrence base that pretraining established — they don't replace it with a new causal reasoning engine.

Can LLMs, in some sense, "climb" the ladder?

??? info "What the benchmarks show"

    CLadder (2024, NeurIPS) was the first large-scale benchmark designed around Pearl's three rungs. 10,000 questions with ground-truth answers computed by a formal causal inference engine. Result: LLMs performed best on rung one (association), with significant degradation on rungs two (intervention) and three (counterfactual). A specialized "CausalCoT" prompting strategy helped but could not close the gap.

    CausalBench (2024) evaluated LLMs across different causal graph structures. The key finding: LLMs handle chain structures (A→B→C) well — because in chains, correlation and causation align. But they systematically fail on collider structures (A→C←B) — precisely the signature scenario where correlation and causation diverge.

    Chi et al. (NeurIPS 2024) drew a further distinction between "level-1 causal reasoning" (recalling causal relationships from parametric knowledge) and "level-2 causal reasoning" (performing genuine causal inference on novel scenarios). Their conclusion: LLMs can only do level-1 — essentially pattern recall, not reasoning. Performance drops markedly when facing causal structures unseen in training data.

Taken together, these findings paint a consistent picture. LLMs can impressively *mimic* causal language — because their training data is saturated with human expressions of causal relationships. But between mimicry and possession lies a mechanistic chasm, its width guaranteed by the Causal Hierarchy Theorem.

The model can say "rain causes slippery roads" not because it understands the physics of water reducing surface friction, but because it has encountered "rain" and "slippery" in close proximity enough times. Most of the time, the two approaches yield the same answer. But in collider structures, Simpson's paradox, and confounded scenarios, they part ways.

## The ladder and engineering

This is not a judgment about whether LLMs are "smart enough." It is a structural description of what kind of tool you're working with.

A screwdriver is not a hammer. That's not a slight against screwdrivers — it just means that if your task involves driving nails, you need a different tool. Similarly, if your application requires second- or third-rung causal reasoning — distinguishing correlation from causation, answering "what would happen if I did X," reasoning about counterfactuals — the model alone is insufficient. Something elsewhere in the system needs to bridge the gap.

The ladder tells us what's missing. But knowing *what* isn't enough. The next question is more practical: what does a system that *knows* its reasoning engine is stuck on the first rung actually need in order to stay honest with itself?

</div>

---

## Further reading

- Elias Bareinboim et al., "On Pearl's Hierarchy and the Foundations of Causal Inference" (2022) — The original paper proving the Causal Hierarchy Theorem. Technically demanding, but the engineering implications of the three-rung separation are profound.
- Zhijing Jin et al., "CLadder: Assessing Causal Reasoning in Language Models" (NeurIPS 2024) — The first benchmark designed around Pearl's three rungs. If you want concrete data on how LLMs perform at each level, this is the most systematic source.
