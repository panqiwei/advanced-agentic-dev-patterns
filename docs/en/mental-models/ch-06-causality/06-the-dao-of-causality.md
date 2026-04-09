# The Dao of Causality

<div class="mm-article" markdown>

Five articles in, the structure of causal discipline is clear.

Back to the beginning: Hume proved we've never observed causation itself — only constant conjunction and habit. LLMs face the same predicament, taken to an extreme — their entire experience is statistical co-occurrence in text. Pearl's ladder quantified the predicament: first-rung data is mathematically almost always insufficient for second-rung answers. Causal discipline — evidence grading, temporal constraints, hypothesis verification, reasoning provenance — is the engineering response to this predicament.

If that structure is right, certain deeper insights surface naturally.

## Feedback loops are causal bets

The second chapter of this series was about cybernetics — the feedback loop at the heart of agent systems: observe → judge → act → observe. The focus then was on the loop's structure and stability.

Now look at that loop through the lens of causation.

"Observe" implies: I assume my observations reflect the world's true state. This is a causal claim — that observational data and world state are causally linked.

"Judge" implies: I assume my reasoning correctly identifies causal structure in the observed data. This is a stronger causal claim — I'm not just seeing data, I'm inferring causation from it.

"Act" implies: I assume my intervention will produce the expected outcome. This is a second-rung causal claim — if I do(X), Y will follow.

Every step of the feedback loop contains a causal assertion. It's not merely an "architectural pattern" — it's a stack of causal bets. Each iteration of the loop, the system wagers: my observations are accurate, my inferences are correct, my actions are effective.

Most of the time, these bets win. But when they lose — observations are inaccurate, inferences rest on spurious correlations, actions produce unintended consequences — the loop's behavior becomes unpredictable. This is what "instability" means at the causal level: not that parameters are mistuned, but that causal assumptions are wrong.

Causal discipline's role within the feedback loop is to make each causal bet explicit — so that at minimum, you know what you're wagering and how much you've staked.

## Entropy increase is a symptom of absent causal discipline

The third chapter was about entropy — information decay in long reasoning chains. The focus then was the thermodynamic analogy: disorder naturally increases.

Now that analogy can be given a more precise interpretation.

Information decay in long-chain reasoning has a specific source: **the silent substitution of correlation for causation.**

Step one of the chain observes "A and B frequently co-occur" — an associational claim. Step two says "A causes B" — silently sliding from the first rung to the second, without the system flagging the transition. Step three derives "therefore controlling A will control B" — an interventional conclusion, built on an unverified causal assumption.

Each "substitution" injects a bit of noise into the reasoning chain. Uncertainty shifts from "how reliable is the correlation I observed?" to "how reliable is the causal relationship I assumed?" — and the latter is strictly more uncertain than the former (the Causal Hierarchy Theorem guarantees this).

The longer the chain, the more noise accumulates. This is entropy increase in the reasoning chain — not an abstract metaphor, but an information-theoretic increase in uncertainty.

One of causal discipline's core jobs is to force a signal-quality check at every link — annotating "this step is a correlational observation" versus "this step is a causal inference," and "this hypothesis is verified" versus "this hypothesis is unconfirmed." It can't eliminate uncertainty, but it can prevent uncertainty from amplifying silently.

## Causal discipline is another fractal

The fifth chapter was about fractals — self-similar structure repeating across scales.

Causal discipline has this property too.

At the level of a single inference: each inference needs evidence-level annotation and a link to its justification.

At the level of a single agent: each output needs a confidence level and a justification chain. The agent's internal reasoning must maintain hypothesis states and temporal consistency.

At the level of multi-agent orchestration: each agent's output becomes input for downstream agents — evidence levels must propagate across agent boundaries. A "hypothesis" output by one agent must not transform into "confirmed fact" when received by another. Provenance chains must extend across agents — you need to trace "this final conclusion originated from which agent's which observation."

At the system audit level: the entire decision chain's causal discipline must be inspectable. From trigger to decision to execution, every step's evidence level and reasoning justification must be completely recorded.

Four scales, same structure. Evidence grading, temporal constraints, hypothesis verification, reasoning provenance — needed at every level, manifesting differently but addressing the same core requirement.

This is no coincidence. The self-similarity of causal discipline and the self-similarity of agentic system architecture (the fifth chapter's central argument) share the same root: the quality management problem that information faces when passing between scales is structurally identical.

---

## The open question of the carrier

At this point, we know the four components of causal discipline, when it's needed, what it costs, and how it resonates structurally with the preceding chapters of this series.

But one fundamental question remains untouched.

Causal discipline needs a carrier — a form of computation capable of expressing causal structure, enforcing causal constraints, and maintaining causal chains.

Logic systems are natural fits for the job. Causal graphs can encode causal direction, the do-operator can distinguish observation from intervention, counterfactual reasoning has precise mathematical definitions. Pearl's entire framework is built on symbolic causal models. But logic systems have a critical weakness: they need humans to encode the causal structure in advance. You have to tell them what causes what — they won't discover it from data.

Neural networks are natural fits for discovering patterns from data. They can extract the statistical association between "rain" and "slippery" from billions of text passages, and even express that association in causal language. But we've spent five articles establishing that what they discover is correlation, not causation.

One excels at structure but not discovery. The other excels at discovery but not structure.

??? info "A convergence already underway"

    In 2024–2025 research, a clear trend is emerging: using LLMs as a knowledge prior in combination with traditional causal algorithms. The LLM provides "guesses" about possible causal relationships between variables; traditional algorithms (like the PC algorithm) verify whether those guesses are statistically consistent with the data. The combination significantly outperforms either approach used alone.

    This is not "getting the LLM to do causal reasoning." It's letting the LLM do what it's good at (extracting linguistic expressions of causal knowledge from text), then using formal tools to do what it's not good at (verifying whether those expressions are consistent with actual causal structure in the data).

The engineering implementation of causal discipline ultimately has to answer this question: how do structure and discovery — symbolic systems and neural networks — collaborate?

That question's answer doesn't belong in this chapter. It belongs to an older divide — one that artificial intelligence has faced since the day it was born: symbolism versus connectionism.

That's the next chapter's story.

</div>

---

## Further reading

- Shantanu Yanagihara et al., "Failure Modes of LLMs for Causal Reasoning on Narratives" (2024) — Identifies three systematic failure modes in LLM causal reasoning (temporal ordering bias, long-range reasoning collapse, over-reliance on parametric knowledge over context) and finds that forcing the model to extract an explicit causal graph before reasoning significantly mitigates all three. A microcosm of the carrier question in empirical form.
