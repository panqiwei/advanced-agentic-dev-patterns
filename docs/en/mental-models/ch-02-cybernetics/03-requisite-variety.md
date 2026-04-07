# Requisite variety

<div class="mm-article" data-card="assets/requisite-variety.png" data-card-alt="Requisite variety" markdown>

Observer, Controller, Plant — three roles, one closed loop. The skeleton is in place. But this skeleton faces a challenge unlike anything in classical control: its plant is not a motor with a bounded output space. It is a language model whose output space is practically infinite.

## Ashby's Law

In 1956, W. Ross Ashby proposed a principle that would later be called "the first law of cybernetics":

!!! abstract "Law of Requisite Variety"

    **Only variety can absorb variety.** The number of distinct situations a controller can handle (its variety) must be no less than the number of distinct disturbances it needs to counteract.

The intuition: a thermostat has exactly one control lever — switching the heater on and off. So it can regulate temperature, but not humidity. If you want to control both temperature and humidity, you need a system with at least two independent control levers. The ceiling on control capability is set by the controller's variety.

Map this to an agentic system: the range of behaviors your harness can handle must cover the range of behaviors the model might produce. Whatever falls outside that coverage is a blind spot — and inside that blind spot, the model's output goes uncontrolled.

## The LLM is a high-variety plant

Classical control theory usually deals with low-variety plants. A motor's output space is speed and torque. A thermostat's output is temperature. You can enumerate every possible output state and design a control strategy for each one.

An LLM is nothing like that.

The LLM's output space is natural language — in theory, the set of all possible token sequences. Even if you cap output at 1,000 tokens, the number of possible combinations is astronomical. You cannot enumerate every possible model output and write a handling branch for each.

Ashby's Law cuts straight to an engineering directive here: since you cannot make your harness's variety catch up to an infinite output space, you have to **work from the plant side — reduce the variety that needs handling**.

## Two strategies

=== "Increase the harness's control capacity"

    More tools, more complex orchestration logic, more checkpoints, more granular evaluators — expanding the range of model behaviors your harness can recognize and handle.

    The cost: the harness itself grows more complex. A complex harness is harder to understand, harder to debug, and more likely to have its own bugs. The controller's variety has a practical ceiling — it cannot exceed what engineers can comprehend and maintain.

=== "Reduce the plant's effective variety"

    Constrain output format. Limit available tools. Narrow task scope. Each of these shrinks the space of behaviors the harness needs to cover — not by restricting what the model *can* do, but by restricting **what you need to handle**.

    OpenAI distilled a similar lesson while building Codex — "give Codex a map, not a 1,000-page instruction manual." Use clear architecture docs and constraint rules to bound the agent's behavior space, rather than sprawling instructions trying to cover every case. This is variety reduction by a different means: not constraining output format through code, but constraining behavior space through documentation.

The two strategies are not either-or. Once you reduce the plant's effective variety, the residual space the harness needs to cover shrinks — a control problem that was previously impossible becomes tractable. Reduce noise first, then control.

And by the way — "reducing the plant's effective variety" is itself one of the cumulative investments [ch-01](../ch-01-orthogonality/05-orthogonal-decomposition.md) talked about. No matter how capable the model becomes, the work of constraining output format, bounding the tool set, and framing behavior space through documentation does not get replaced by model capability growth. It is orthogonal to model capability.

## Why simple harnesses often win

> Keep your agent framework simple. The sophistication should be in your tools and in your prompts, not in your agentic framework.
>
> — Anthropic, *Building Effective Agents*

In Ashby's terms: do not try to make the harness as complex as the plant. Go the other way — bring the plant's effective variety down, and a simple harness is enough.

But "simple" is a slippery word. Ashby's Law has a corollary: the controller is itself a system with its own variety. If the harness's variety grows too high — past the point where engineers can understand and debug it — it stops being a tool for controlling the LLM and becomes another complex system that needs controlling. The controller spirals out of control while trying to control the plant.

Go too far the other direction, and the harness's variety drops below what is needed to cover the plant's residual behavior space. Now you have a system riddled with blind spots.

The meaning of "simple" hides in the math of Ashby's Law: the harness's variety matches exactly the variety it needs to handle.

Variety constrained, structure clarified — the next question is: what does this constrained system actually look like at runtime? It is a state machine. But not a typical one.

</div>

## Further Reading

- Ashby, W. R. (1956). *An Introduction to Cybernetics*. Chapman & Hall. [rossashby.info](http://www.rossashby.info/patron/An-Introduction-to-Cybernetics.pdf)
- Anthropic. (2024). Building Effective Agents. [anthropic.com](https://www.anthropic.com/research/building-effective-agents)
