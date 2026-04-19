# The tension axis

<div class="mm-article" data-card="assets/tension-axis.png" data-card-alt="The tension axis" markdown>

The five costs look distinct — schema violation is a format problem, semantic drift is an attention problem, tool hallucination is a comprehension problem, trajectory bias is a probability problem, boundary penetration is a security problem.

But look at their structures side by side and a pattern emerges.

## One axis

Schema violation happens when constraints are not strict enough. Add strict mode — compile the schema into a formal grammar, mask illegal tokens at every step — and violation rates drop from 8–12% to below 0.1%. Problem solved, apparently.

But trajectory bias is precisely what strict mode introduces. The stricter the constraints, the more tokens are masked, the more the probability landscape is deformed, and the greater the risk that the model gets steered toward paths that are grammatically easy but semantically wrong.

Semantic drift happens when symbolic constraints (system prompt, tool definitions) get "diluted" over long contexts. The instinctive response is to add more reminders — restating constraints mid-conversation. But more constraint tokens mean more attention competition — you are using more symbols to fight the dilution of symbols, and attention is zero-sum.

Tool hallucination happens when the model's "understanding" of symbolic interfaces is not precise enough — it treats schemas as ordinary text rather than exact contracts.

Boundary penetration happens when the data/control distinction fundamental to symbolic systems simply does not exist in the neural system — and no amount of constraint can create it, because constraints themselves are tokens.

The five costs are symptoms at different positions on the same axis.

!!! question "The tension axis"

    Strictness of symbolic constraints ←——————→ Freedom of neural generation

    Stricter constraints mean stronger structural guarantees — output format is always valid, types are always correct, values are always in range. But the neural system's capability space is compressed: more tokens masked, fewer paths available, trajectory bias more pronounced.

    Looser constraints mean greater neural freedom — the model can fully exploit its probability distribution to find the optimal semantic path. But structural reliability drops: schema violation, tool hallucination, and format errors become more likely.

    The two ends of this axis are not "good" and "bad" — they are two different costs.

## Not a problem to be solved

A natural expectation: as models get stronger, this axis will disappear. Future models will simultaneously produce correct format and correct content, with no tradeoff.

Stronger models do widen the "usable zone" on this axis. Three years ago, getting GPT-3.5 to output valid JSON required heavy prompt engineering and retry logic. GPT-4o's strict mode brought schema violation below 0.1%. That is real progress — the usable zone is genuinely expanding.

But the tension axis itself does not disappear.

The reason is not that models are not powerful enough. The reason is that the source of the tension is the structural difference between two kinds of representation. Symbolic representation is discrete — a JSON field is either a valid enumeration value or it is not. Connectionist representation is continuous — the probability distribution does not know where the boundary between "valid" and "invalid" lies. As long as you need to sample output conforming to discrete constraints from a continuous probability space, you are performing a representation conversion. As long as you convert, there is loss.

Trajectory bias is the clearest evidence of this irreducibility. It is not a "capability shortcoming" of the model — it is the inevitable mathematical consequence of modifying a probability distribution at inference time. The moment you mask any token, you change conditional probabilities, and you change the generation path for all subsequent tokens. This is not fixable by training a better model — it is the mathematical structure of constrained decoding.

Stronger models will make trajectory bias's impact smaller (because the model's "correct path" starts with higher probability, so masking unlikely tokens has less redistributive effect). But "smaller" is not "gone." As long as constraints exist, the path is altered.

## Orthogonality on another dimension

This tension axis does not contradict the orthogonal decomposition revealed in the first chapter of this series — it operates on a different dimension of analysis.

The first chapter said: an agentic system's output is the resultant of two forces — model capability and harness capability. The two forces are orthogonal; harness is the direction you can control, the direction that will not be swallowed by model improvement.

This chapter says: inside the harness — within the direction you can control — there is another structural tradeoff. Every decision you make in designing the translation layer selects a position on the tension axis: how strict a schema? How tight the constrained decoding? How much freedom for the model to organize its output?

The two analyses do not conflict, because they describe different things. The first chapter's orthogonal decomposition answers "where should your force point?" This chapter's tension axis answers "what does the terrain look like in that direction?"

</div>

---

## Further reading

- Chroma Research, "Context Rot" (2025) — A systematic context degradation test across 18 frontier models. What it reveals is not a flaw in any particular model, but a structural limitation of the attention mechanism itself — the empirical foundation for the "semantic drift" end of the tension axis.
