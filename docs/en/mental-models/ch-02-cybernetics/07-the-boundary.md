# The boundary with traditional software

<div class="mm-article" data-card="assets/the-boundary.png" data-card-alt="The boundary" markdown>

The question left open by 06: where is the line?

## Three dividing lines

!!! abstract "Non-deterministic execution"

    Traditional software: `f(x) = y` holds every time. Same input, same output. Tests can assert exact values.

    Agentic systems: `f(x)` may differ each run. [Ch-01](../ch-01-orthogonality/02-what-is-the-model.md) established that probabilistic behavior is an operational characteristic of LLMs. You cannot verify an agent's behavior with `assertEqual` — you need statistical methods.

!!! abstract "Natural language as control signal"

    Traditional software uses APIs, type systems, and compilers for enforcement. Wrong parameter type? The build fails.

    Agentic systems use natural language as their control signal — the prompt. "The prompt is ambiguous" and "the API parameter type is wrong" are errors from two different universes. The first has no compiler to catch it.

!!! abstract "Emergent behavior"

    A traditional system's behavior = the union of all code paths, theoretically enumerable.

    An agentic system's behavior set cannot be enumerated — the model may do anything within its capability range. The requisite-variety problem discussed in [03](03-requisite-variety.md) has its root here.

## Different plant, different engineering

The three lines converge: traditional software's plant is deterministic, low-variety, and driven by typed interfaces. An agentic system's plant is non-deterministic, high-variety, and driven by natural language.

Different plant, different harness design principles.

| Dimension | Traditional software | Agentic system | Cybernetics concept |
|-----------|---------------------|----------------|---------------------|
| Verification | Unit tests, integration tests (deterministic assertions) | Statistical validation, adversarial testing | [04](04-atypical-fsm.md) non-deterministic transitions |
| Observability | Logs, metrics, traces | + reasoning-path tracing, context auditing | [02](02-ocp.md) observer variety |
| Safety | Input validation, access control | + sandbox isolation, least-privilege tools, output auditing | [03](03-requisite-variety.md) constraining plant variety |
| Debugging | Breakpoints, stack traces | + prompt replay, context snapshots | [04](04-atypical-fsm.md) natural-language state |
| Iteration | Change code, run tests | + tune prompts, watch for behavior drift | [06](06-second-order.md) second-order feedback |

You would not debug a jet engine the way you debug a compiler. They are different systems with different failure modes.

</div>

## What stays, what changes

The core of engineering discipline does not move: rigor, repeatability, verifiability.

What changes is the concrete form that discipline takes. What does "repeatable" mean when execution is non-deterministic — exact reproduction, or statistical stability? What counts as "verified" — asserting an exact value, or checking a distribution? And "observable" — tracing code paths, or tracing reasoning paths?

---

[Orthogonality](../ch-01-orthogonality/index.md) was about where to point your force. Cybernetics is about the mechanism — a multi-layered feedback control system running on an atypical state machine, with you as part of it.

The mechanism is clear. Next question: what happens to this system over long runs?

## Further Reading

- Schneier, B. & Raghavan, B. (2025). On the OODA Loop and Agentic AI. [schneier.com](https://www.schneier.com/)
