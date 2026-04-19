# The strange hybrid

<div class="mm-article" data-card="assets/strange-hybrid.png" data-card-alt="The strange hybrid" markdown>

If symbolic and connectionist systems represent two irreducible capabilities, which side does the large language model belong to?

Neither, entirely. And both, partially. This makes it the strangest artifact in the history of artificial intelligence.

## A connectionist architecture on a symbolic medium

LLMs train on natural language — humanity's oldest and most universal symbol system. Their inputs are token sequences. Their outputs are token sequences. At the interface level, they manipulate symbols.

But internally, the computation is purely connectionist: attention weighting, residual streams, nonlinear activations, distributed vector operations. No step involves "retrieve a symbol, look up a rule, execute a derivation." Every step is a matrix operation in high-dimensional continuous space.

This duality is not accidental. It follows from the training objective: predict the next token. To get better at this objective, the model must, in some sense, capture the structure of natural language — grammar, semantics, pragmatics, world knowledge. But the way it captures these structures is not symbolic manipulation. It is encoding, in parameter space, something that can statistically approximate these structures.

## Symbol-like structures emerge inside

Recent empirical work has begun to reveal what that "something" looks like. The findings below come from multiple independent research groups and have been replicated or published at peer-reviewed venues:

**Concepts correspond to directions.** The linear representation hypothesis — currently the most influential theoretical framework for LLM internal representations — holds that high-level concepts correspond to linear directions in activation space. Park, Choe, and Veitch formalized this in 2024 using counterfactual theory, identifying a non-Euclidean inner product under which causally separable concepts are naturally orthogonal. This is not a coincidence found by probing — it has mathematical structure.

**Space and time are encoded.** Gurnee and Tegmark found in Llama-2 that linear representations of geographic coordinates and historical dates are stably present across model sizes from 7B to 70B. The model develops "space neurons" and "time neurons" — parameters that encode world structure with robustness across different prompt wordings.

**Semantics are shared across languages.** Anthropic's 2025 circuit tracing research tracked computation paths inside Claude from input to output. Finding: asking "the opposite of small" in English, French, or Chinese activates the same concept features — first "smallness" and "opposition," then "largeness," then translation into the query language. Not three independent translations, but a shared semantic layer underneath.

**Millions of interpretable features.** Also from Anthropic, sparse autoencoders extracted millions of monosemantic features from Claude 3 Sonnet — including abstract concepts like deception, sycophancy, and bias. Multiple independent groups (Anthropic, Google DeepMind, EleutherAI) have replicated similar results using different methods on different models.

Taken together, these findings paint a picture: LLMs do form internally structured representations. Not random parameter noise. Not something dismissible as "statistical collage." They have geometric shape (linear directions), cross-modal stability (shared across languages), and hierarchical organization (from low-level features to high-level concepts).

## But it is not a symbolic system

To conclude from this that "LLMs have achieved the goals of symbolic AI" would be a mistake. These symbol-like structures have three critical limitations:

**They are inaccessible.** The API gives you tokens — a string of symbols. The model may internally "know" that Dallas is in Texas and Texas's capital is Austin, and it may arrive at this through a two-step knowledge composition — Anthropic's circuit tracing directly observed such multi-step reasoning paths. But all you see is the final token sequence. You cannot inspect intermediate steps for reliability. You cannot impose constraints on internal representations. You cannot use them for formal verification. This is not a limitation of current technology — it is an architectural fact. Internal activations are not part of the API contract.

**They are unstable.** The same concept's feature activation depends on context. The same factual query in different conversational backgrounds may activate different feature combinations, leading to different reasoning paths and different answers. Reproducibility studies (e.g., Shi et al. 2024) report accuracy fluctuations of up to 10% across identical inference runs on deterministically configured models. Symbolic systems do not have this problem — a rule behaves the same regardless of context.

**They do not compose reliably.** "The model has an internal direction representing concept X" does not mean "the model can reliably compose X with Y." Research in 2025 found that LLMs systematically fail at code translation tasks requiring formal compositional reasoning — precisely because they lack the structural compositionality guarantees of symbolic systems.

!!! warning "Methodological boundaries"

    These empirical findings come with their own caveats. Causal intervention experiments — used to verify that discovered representations actually participate in computation — may push model activations out of distribution, creating artifacts. This means some of the "structure" we observe may be partly introduced by the probing method itself, rather than being entirely native to the model. These findings are the best evidence we have, but not the final word.

## What the debate itself reveals

The Othello-GPT story illustrates the tension most clearly.

In 2022, Li et al. trained a GPT model exclusively on Othello move sequences — strings like "e3 d6 c4 f5..." with no board images, no rule descriptions. They discovered that the model developed nonlinear representations of board state internally. In 2023, Neel Nanda showed that a simpler linear representation also exists.

This looked like a connectionist triumph — the model discovered spatial board structure from pure sequence data on its own.

But in 2024, a MATS research team offered a different reading: the model's actual algorithm is not a unified board-state model but a collection of independent local heuristics — each rule attending to only a small region of the board.

In 2025, Yuan and Søgaard extended the experiments to seven LLMs of different architectures and found that all achieved up to 99% board-state identification accuracy — but performance dropped significantly when predicting complete game sequences.

This debate does not need to be resolved. It precisely characterizes the nature of LLM internal representations:

- **Real but local** — probes reliably detect representations that align closely with ground truth
- **Structured but incomplete** — the representations have geometric shape but do not form a globally coherent model
- **Detectable but not dependable** — research tools can find them, but engineering cannot rely on them as trustworthy computational units

??? info "Three meanings of 'world model'"

    The term "world model" carries three very different meanings depending on context:

    - **Strong sense:** A coherent, updateable causal model of the environment (what roboticists and planners mean)
    - **Representational sense:** Internal states that systematically covary with ground-truth state variables (what Li et al. and Gurnee & Tegmark test for)
    - **Functional sense:** The ability to predict consequences of hypothetical actions (what planning tasks require)

    Current evidence supports the representational sense — LLMs do develop internal representations that covary with world state. The strong and functional senses remain undemonstrated and face more counterexamples (notably, LLM failures on tasks requiring persistent state tracking). Conflating these three meanings makes "LLMs have world models" sound stronger than the evidence warrants.

## What this means for harness engineers

The model you work with is a strange hybrid: a connectionist architecture manipulating a symbolic medium, developing symbol-like structures internally that are invisible at the interface you can touch.

The only surface where you can impose constraints is the token boundary — where tokens go in and tokens come out.

The model may have an internal direction representing "the structure of this JSON," but you cannot use that direction to verify structural correctness. The model may have a multi-step reasoning path from question to answer, but you cannot inspect each step of that path for reliability.

What you can do is use one kind of representation (symbolic structural constraints) to shape the behavior of another kind of representation (the neural network's probability distribution) at the token boundary.

This is not a temporary engineering compromise. It is the structural relationship between two kinds of representation — and what you are doing is translation.

</div>

---

## Further reading

- Anthropic, "On the Biology of a Large Language Model" (2025) — Circuit tracing applied to ten behaviors inside Claude 3.5 Haiku. Not a benchmark of what the model can do, but an anatomy of how it does it. After reading it, your intuition about "LLMs have structure inside" will become very concrete.
