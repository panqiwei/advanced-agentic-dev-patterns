# Feedback layers

<div class="mm-article" data-card="assets/feedback-layers.png" data-card-alt="Feedback layers" markdown>

Feedback is the mechanism that routes a system's output back as input — negative feedback corrects deviation, positive feedback amplifies it. But feedback does not happen in just one place. Pull the camera back from a single tool call to the full lifecycle of an AI system, and at least four nested feedback loops come into view.

## Four layers

| Layer | Timescale | Feedback signal | Trigger | Corrects |
|-------|-----------|----------------|---------|----------|
| Token | Milliseconds | Preceding tokens → next-token probability | Autoregressive; fires every step | Token distribution randomness |
| Turn | Seconds to minutes | Tool result → next-round prompt | Event-driven; fires on tool-call completion | Single-step decision deviation |
| Session | Minutes to hours | Task outcome evaluation → strategy adjustment | Mixed timing + events (CI results, user interrupt) | Cross-turn accumulated drift |
| Alignment | Weeks to months | Human preferences → model weight update | Training cycle | Systematic bias in model weights |

??? info "Token level"

    The model's autoregressive mechanism: every token it generates becomes part of the input for the next token. This loop closes on a millisecond timescale. You cannot intervene here directly — unless you are doing inference-time intervention research. It is feedback internal to the plant, outside the harness's control surface.

??? info "Turn level"

    The core feedback of the agent loop. Model calls a tool → tool returns a result → result gets spliced back into context → model makes the next decision. **This is the harness engineer's primary operating theater.** Your system prompt, tool definitions, output parsing — they all live at this layer. Each closure of the [Observer-Controller-Plant](02-ocp.md) loop is one turn-level feedback cycle — and one step through the [atypical state machine](04-atypical-fsm.md).

??? info "Session level"

    The execution cycle of a complete task. The evaluation that follows — did tests pass? is the user satisfied? — may trigger strategy adjustments: a different prompt template, a different tool combination, a revised context-management approach. Human-in-the-loop intervention mainly happens here.

    As harnesses mature, session-level feedback is shifting from manual to automated. In Anthropic's long-running agent architecture, the handoff between initializer agent and coding agent, the automatic updates to feature tracking — these are automated session-level feedback. No human standing at every session boundary pressing buttons.

??? info "Alignment level"

    Human preference signals get aggregated and, through training, alter the model's weights. Unless you are a model provider, this is not your direct control surface — but it determines the baseline behavior of your plant. [Ch-01](../ch-01-orthogonality/03-how-strong-and-growing.md) noted that capability grows predictably with scale; alignment-level feedback is one of the mechanisms that shapes the direction of that growth curve.

## Nested loops

Each layer is a complete Observer-Controller-Plant circuit. Inner layers run fast, outer layers run slow — but the outer layer sets the boundary conditions under which the inner layer operates.

Training changes the model's weights, so every token-level probability distribution shifts. You revise the system prompt, so every turn-level model behavior shifts. The slow layer determines what the fast layer can and cannot do.

Harness engineers mainly operate at the turn and session levels. But knowing which layer your control signal actually takes effect in — and which behaviors are not yours to change at your layer — that boundary awareness matters.

## The danger of positive feedback

!!! warning "Hallucination as a positive feedback loop"

    At the turn level, hallucination is a textbook positive-feedback process: the model generates incorrect information → incorrect information enters the context → the model generates based on the corrupted context → errors accumulate and amplify. Each turn-level feedback cycle does not correct the deviation — it widens it.

    One of the core responsibilities of harness engineering: **intervene before positive feedback runs away.** Observers that validate tool results, controllers that run sanity checks, termination mechanisms that cap autonomous execution steps — all of them are negative-feedback devices, counteracting the turn-level tendency toward positive feedback. The microphone-squeal analogy from [01](01-helmsman.md) gets a more concrete anatomy here.

This also gives another angle on the separation principle from [02](02-ocp.md): why the evaluator needs to be independent from the generator. If the generator is responsible for checking its own output (controller doubling as observer), positive feedback can quietly accumulate in the generator's blind spots — it cannot see its own errors, so it cannot correct them. An independent evaluator provides negative feedback from outside, breaking the loop.

Up to this point, the perspective has been from outside the system. But one question has gone unasked: when you are tuning a prompt, are you part of the system?

</div>

## Further Reading

- Christiano, P. et al. (2017). Deep Reinforcement Learning from Human Preferences. [arXiv:1706.03741](https://arxiv.org/abs/1706.03741)
