# Error cascade

<div class="mm-article" data-card="assets/error-cascade.png" data-card-alt="Error cascade — super-linear decay from coupled multi-step execution" markdown>

Here is a math problem.

An agent succeeds at each step with 95% probability. Ten steps in a row. If each step is independent, the overall success rate is $0.95^{10} \approx 60\%$.

That alone should set off alarms — a system that looks rock-solid on any single step drops to a coin-flip-plus-change over ten. But the number assumes something very specific.

In the real world, the number is lower than 60%. Sometimes much lower.

## Compound interest in reverse

Let's make the assumption explicit. The $0.95^{10}$ calculation treats each step as independent: whether step three succeeds has nothing to do with what happened at steps one and two. Like coin flips: the last toss doesn't know about the one before it.

Under this model, multi-step reliability decays geometrically. Each additional step multiplies the running total by the same factor. Compound interest grows wealth exponentially; geometric decay shrinks reliability at the same relentless rate.

Even this "optimistic" model is sobering. At 95% per step: 20 steps gives you $0.95^{20} \approx 36\%$. Fifty steps, $0.95^{50} \approx 7.7\%$.

But geometric decay is the *gentle* scenario. It is the mildest possible multi-step decay curve, because it assumes zero information transfer between steps. Each step faces a clean slate, uncontaminated by its predecessors.

In real agent tasks, that assumption almost never holds.

## Beyond probability multiplication

The independence assumption says each step encounters a problem state untouched by prior results. But in multi-step agent work, the output of one step *is* the input of the next. Steps are not independent dice rolls — they share state.

This coupling breaks independence through at least three channels.

**Interface contamination.** A code-modification agent changes a function signature at step one. The change is wrong: the parameter types pass static checks, but the semantics have shifted. Step two calls that function and sees a perfectly legal-looking interface with silently incorrect behavior. Nothing signals a problem. Step two's failure probability is no longer an independent 5%; it has been inflated, invisibly, by step one's error.

**Test signal masking.** A prior step introduces a regression. Subsequent steps run the test suite and see failures. But the agent cannot distinguish which failures it just caused from which were already there. The test signal — the primary error-correction mechanism — is drowned in noise. This is not merely "harder to succeed." It is "the correction machinery itself has been degraded."

**Context drift.** In long-running sessions, flawed reasoning from earlier steps gets written into the context window. Later steps reason on top of that contaminated context. The model does not spontaneously question things "it said earlier." It tends to continue along the established trajectory rather than stepping back to audit the entire chain. Once a false assumption enters the context, it replicates into every downstream step like a mutation copying through cell division.

Three channels, one shared consequence: a prior step's error does not simply add an independent failure probability to the next step. It *changes the problem the next step is solving*.

## What the benchmarks show

Theory says "worse than geometric." How much worse?

SWE-EVO (2025) extends code repair from single issues to multi-step software evolution: consecutive modifications to the same repository, spanning multiple PRs, cross-file dependencies, and escalating complexity. The results speak plainly: task difficulty scales with PR count (averages of 1.67, 3.57, 6.71, and 14.84 PRs across difficulty tiers), even the strongest model-framework combination solves only 25%, and 64% of tasks defeat every combination tried. These same model families score above 70% on single-step fixes (SWE-Bench Verified). Same code-editing capability, stretched across more steps, and performance falls off a cliff.

Beyond pass@1 (2026) quantifies this super-linear decay from a different angle. They directly measure inter-step error correlation and find $\rho > 0$, meaning once an agent drifts onto the wrong path, it tends to stay there rather than self-correcting. Qwen3 30B posts a short-task pass@1 of 75.8%; geometric decay predicts roughly 33% on long tasks; the actual figure is 22.2%, a 1.5x gap. Mistral Nemo's gap is sharper: predicted 28.6%, actual 12.1%, a 2.4x shortfall. Formally, positively correlated errors push task failure probability from $e^{-\epsilon T}$ to $e^{-\epsilon T - \rho \epsilon^2 T^2/2}$, a super-exponential function of $T$.

| Model | Short-task pass@1 | Geometric prediction | Actual long-task | Gap |
|-------|-------------------|---------------------|-----------------|-----|
| Qwen3 30B | 75.8% | ~33% | 22.2% | 1.5x worse |
| Mistral Nemo | — | 28.6% | 12.1% | 2.4x worse |

ReliabilityBench (2026) surfaces a counterintuitive finding: under fault injection, the more sophisticated Reflexion architecture (reflect-then-retry) degrades *faster* than plain ReAct, with a fault recovery rate of 67.3% versus 80.9%. The mechanism: Reflexion's reflection layer tries to extract "lessons" from erroneous tool returns, but those lessons are themselves built on bad data. Applying a false lesson to the next step is context drift instantiated at the architecture level. The longer the reasoning chain, the greater the amplification when any single link in that chain is compromised.

The data converge on a single conclusion: multi-step agent reliability decays super-linearly, rooted in positive inter-step error correlation.

## The positive feedback loop

Error cascade does not operate in isolation. It forms a positive feedback loop with context rot.

One step's error contaminates the context — bad reasoning traces, incorrect intermediate results, false assumptions. The contaminated context weakens subsequent steps' ability to self-correct; the model reasons through noise and is more likely to err. More errors produce more context contamination. More contamination further degrades correction capacity.

These are not two independent degradation processes that happen to coincide. They feed each other. Error cascade accelerates context rot; context rot accelerates error cascade. Positive feedback means that past a certain tipping point, degradation becomes self-sustaining. No external perturbation required, the system drifts on its own.

GLM-4.5 Air's data is a direct fingerprint of this loop: on short tasks, only 1% of episodes terminate before the first subtask even begins. On extra-long tasks, that figure rises to 25%. Early-termination rate increases monotonically with task length, meaning the cumulative errors from prior steps are not just making later steps "harder." They are eroding the system's capacity to even *begin attempting* the next step.

## Complexity as amplifier

The severity of cascade is not a constant. It depends heavily on the degree of coupling between steps.

Beyond pass@1 stratified their measurements by task domain, and the differences are stark:

| Domain | Short-task success | Extra-long success | Decay |
|--------|-------------------|--------------------|-------|
| Code editing (SE) | 0.90 | 0.44 | -0.46 |
| Web research (WR) | 0.80 | 0.63 | -0.17 |
| Document processing (DP) | 0.74 | 0.71 | -0.03 |

Code editing is catastrophic, from 90% down to 44%, nearly halved. Document processing barely moves: 74% to 71%, within noise.

The difference is coupling.

Code modification is a tightly dependent multi-step process. Every line changed can affect the correctness of every subsequent step. Alter a function signature and every call site must follow; restructure a data type and all read/write logic must synchronize. A single error propagates along the dependency graph to every downstream step. This is fertile ground for interface contamination and test signal masking.

Document processing is weakly dependent. Extracting a table from page three and a paragraph from page seven share almost no state. Getting one wrong does not affect the other. Steps exchange minimal information, and errors have no propagation path.

Same model. Same number of steps. Radically different decay curves. What determines cascade severity is not the step count itself, but the coupling between steps. Step count merely provides *opportunity* for cascade; coupling determines how thoroughly each opportunity is exploited.

ReliabilityBench's reliability surface confirms this from another dimension: the degradation gradient along the fault-tolerance axis ($\partial R / \partial \lambda$) is steeper than along the robustness axis ($\partial R / \partial \epsilon$). Infrastructure faults (timeouts, rate limits) trigger cascade more readily than input perturbations like phrasing changes, because infrastructure faults attack the state-transfer channels between steps directly. They are assaults on the coupling itself.

---

Error cascade is a thermodynamic-grade force. It is the default direction — you do not need to do anything wrong for it to operate. You only need enough steps and enough coupling between them.

Is there any way to push against this default direction? Physics has a classic thought experiment for that question: Maxwell's Demon — a tiny guardian who can observe the state of every molecule and intervene with precision. But Maxwell himself knew the demon does not work for free. Opposing entropy has a price. The structure of that price is worth examining.

</div>

---

## Further reading

- SWE-EVO (2025). *Can LLM Agents Maintain a Clean Codebase?* arXiv:2512.18470.
- Beyond pass@1 (2026). *A Reliability Science Framework for LLM Agent Systems.* arXiv:2603.29231.
- ReliabilityBench (2026). *Evaluating LLM Agent Reliability Under Production-Like Stress Conditions.* arXiv:2601.06112.
