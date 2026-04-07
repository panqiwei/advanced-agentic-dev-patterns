# Entropy in agent systems

<div class="mm-article" data-card="assets/entropy-in-agents.png" data-card-alt="Entropy in agent systems — three degradations, causal structure, and the information-theoretic view" markdown>

Say your agent has been running for two hours. You come back and check the results. What it produced isn't *wrong*, exactly — but it's off. The direction shifted. Details warped. Some decisions are baffling.

You try to trace backward: where did it go sideways? There's no clean turning point. No single catastrophic mistake. It's more like a river that quietly changed course while you weren't watching — each meter of drift negligible, and two kilometers later you're in a different valley.

This isn't a one-off. It's the shared fate of every long-running agent system.

Understanding why it happens requires pulling apart three distinct phenomena.

## Three degradations

**Context rot** — the signal is drowning.

The longer an agent runs, the more its context window accumulates: prior conversations, tool call returns, intermediate reasoning traces, file content summaries. As context grows, the model's attention to any single piece of information thins out. Chroma's experiments measured this precisely: the same critical fact, accurately retrievable from 100 tokens of context, starts losing fidelity at 10,000 tokens. The task didn't get harder. The signal got buried.

Worse, not everything in the context is useful. Abandoned approaches, early wrong hypotheses, stale intermediate states. They sit in the context like noise, interfering with retrieval of what actually matters. Chroma's data shows this interference is uneven, and the unevenness amplifies as context length grows.

**Error cascade** — mistakes are compounding.

In multi-step tasks, a small error in step one changes the input conditions for step two. A wrong function signature in the first step means the second step sees an interface that looks plausible but is semantically broken. It doesn't know the interface is wrong. It reasons forward from a false premise, producing output built on a rotten foundation.

If steps were independent, 95% per-step success over ten steps gives you roughly 60% end-to-end. Geometric decay, unpleasant but predictable. Observed decay is faster. The SWE-EVO benchmark extends single-issue code fixes into multi-step software evolution: same kind of task, but the step count climbs from under 2 PRs to nearly 15. Even the strongest model-framework combinations solve only 25%, and 64% of tasks defeat every combination tried. These same model families score above 70% on single-step fixes. ReliabilityBench data confirms the super-linear pattern from another angle: inter-step errors are positively correlated. One step failing makes the next step more likely to fail, not less.

This isn't the trivial explanation of "do more, break more." It's coupled amplification: each error doesn't just fail on its own terms; it poisons the input to whatever comes next.

**Intent drift** — behavior detaches from purpose.

You ask it to refactor a module; midway through, it starts adding comments to unrelated files. You ask it to fix a bug; it starts "incidentally optimizing" surrounding code. There's no visible fracture. Each individual step has a certain logic to it. But the overall heading is quietly rotating, and the final output sits at a strange distance from what you originally asked for.

Three degradations, three names. At first glance, three independent problems calling for three independent solutions.

It isn't that simple.

## Not three problems

Run a counterfactual.

**Start by removing context rot.** The model's attention over 100,000 tokens is as uniform and precise as over 100. No signal dilution at all. Does error cascade vanish? No. A wrong output in step one still corrupts step two's inputs; coupled amplification still happens. And as long as error cascade is present, the agent's behavior will gradually diverge from intent through accumulated errors. Drift remains.

**Now remove error cascade.** Every step runs on fully correct preconditions, with zero inter-step coupling. Does context rot vanish? No. Context still accumulates, attention still thins, interference still interferes. And as long as context rot is present, the model's ability to retrieve what matters degrades over time, and its grasp on "what am I actually supposed to be doing" gets fuzzier. Drift remains.

**Finally, suppose intent drift itself were perfectly eliminated.** The agent's behavior stays laser-locked on the original intent, zero deviation. Context rot does not vanish; context is still bloating, attention still diluting. Error cascade does not vanish; coupled amplification in multi-step tasks has nothing to do with whether intent stayed aligned.

Three counterfactuals, one clear conclusion:

- Eliminate context rot → drift is reduced, not eliminated
- Eliminate error cascade → drift is reduced, not eliminated
- Eliminate drift → context rot and error cascade proceed unchanged

Context rot and error cascade each independently produce drift. Drift's elimination doesn't touch either of them. Drift is effect, not cause.

## Causal structure

The relationship between the three isn't parallel. It has direction:

```
Context rot ──────→ Intent drift ←────── Error cascade
     ↑                                        │
     └────────────────────────────────────────┘
                  positive feedback loop
```

Context rot and error cascade are two independent degradation mechanisms, each driving intent drift through a different pathway. Drift is their emergent effect — once context signal is sufficiently diluted, or errors have sufficiently accumulated, the agent's behavior *must* diverge from intent.

But there's a loop in the diagram.

Errors from the cascade — wrong tool call results, wrong intermediate reasoning, wrong code edits — all get written into the context. They become the most dangerous category of noise in context rot: information that is *highly relevant* to the current task but *factually wrong*. In subsequent steps, the model works inside a context contaminated by its own mistakes. Attention isn't merely thinned; it's actively misdirected.

This loop couples the two independent mechanisms into a positive feedback system: cascade errors accelerate rot, worsening rot makes the model more error-prone on the next step, and the additional errors further contaminate the context. ReliabilityBench data offers indirect evidence for this feedback loop: the more sophisticated Reflexion architecture (reflect-then-retry) actually degrades *faster* than plain ReAct under fault injection, with failure recovery rates of 67.3% vs. 80.9%. The mechanism is the loop: the reflection layer extracts "lessons" from a poisoned context, the lessons themselves are wrong, and then wrong lessons guide the next action. The intent behind reflection is sound, but it adds an extra iteration to the feedback loop.

## The information-theoretic view

These three phenomena have different names and different surface behaviors, but they share a common underlying language: information theory.

Model the agent system as a communication channel. The user's intent is the signal source. The agent's final behavior is the receiver. Every processing step in between (context retrieval, reasoning, tool invocation) is part of the channel.

**Context rot is rising channel noise.** Longer context means a lower signal-to-noise ratio. The original intent signal is diluted by growing volumes of irrelevant information and active interference. This is the fundamental problem in communication engineering: the longer the channel and the more noise it accumulates, the weaker the receiver's ability to reconstruct the original signal.

**Error cascade is noise compounding across cascaded channels.** A multi-step task is a series of channels chained end-to-end. Each channel introduces some noise. That noise doesn't simply stack; it compounds super-linearly, because each channel's output noise becomes part of the next channel's input noise. The perturbation amplifies as it propagates. The empirical evidence (positively correlated inter-step errors, success rates decaying faster than geometric models predict) is the statistical fingerprint of noise compounding.

**Intent drift is the observable signal distortion.** It isn't a separate degradation mechanism. It's the measurement at the receiver: the discrepancy you see when you compare the agent's final behavior against your original intent. Channel noise (rot) and cascaded compounding (cascade) are the causes of distortion. Drift is the distortion itself.

This unification isn't just rhetorical analogy. It carries a substantive implication: since all three phenomena are fundamentally noise problems in an information channel, the analytical framework for confronting them is the same. Understand how information degrades inside an agent system, and you hold a single lens for examining every form of degradation.

---

The full landscape is in view: two independent mechanisms, one emergent effect, one positive feedback loop. But a landscape is not a map of the terrain underfoot. To understand how each mechanism actually unfolds inside an agent, you need to go closer.

What are the specific degradation modes of context rot? How does attention dilution progress, step by step, toward signal loss? That's the next question. And how exactly does error cascade's coupled amplification work, why is it worse than what independent probability models predict? That's the one right after.

</div>
