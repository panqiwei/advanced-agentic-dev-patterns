# An atypical state machine

<div class="mm-article" data-card="assets/atypical-fsm.png" data-card-alt="Atypical state machine" markdown>

Variety constrained, harness covering the residual space. What does this constrained system actually look like at runtime?

It is a state machine — formally, it fits the definition perfectly. But it has several unusual properties.

## The agent loop is a while loop

At the core of every agentic system sits a loop:

```
while not done:
    output = llm(context)
    if output.has_tool_calls:
        results = execute(output.tool_calls)
        context.append(results)
    else:
        done = True
```

Current state (context) + input (tool results) → transition function (LLM inference) → next state (updated context). Formally, that is a state machine.

Tell a computer scientist "the agent loop is a state machine," and they will nod. But if they try to verify your agent using the methods they use for finite state machines, they will run into trouble.

## Classical FSM vs. agent state machine

| Dimension | Classical finite state machine | Agent loop |
|-----------|-------------------------------|------------|
| State representation | Enumerated type, finite set | Natural language + structured data, combinatorial explosion |
| Transition function | Deterministic, lookup table | Non-deterministic, LLM inference |
| Input alphabet | Finite symbol set | Natural language + tool results, unbounded |
| Transition predictability | Fully predictable | Probabilistic — same input may yield different output |
| Number of states | Finite, enumerable | Effectively infinite |
| Termination condition | Reaching an accept state | Model decides to stop (or harness forces a stop) |
| Transition trigger | Synchronous — input arrives, transition fires | Mix of synchronous and asynchronous events |

## Three atypical properties

!!! abstract "Property one: natural-language states"

    A classical FSM's states look like `enum { IDLE, WORKING, DONE }` — finite, discrete, exactly comparable. The agent loop's "state" is the entire content of the context window — potentially tens of thousands of tokens of natural language.

    "Are two states identical?" is itself a fuzzy question. An extra sentence in the context, a missing sentence, a rephrasing — same state or different state? There is no precise answer. Context management (compaction, summarization) is, at its core, **state dimensionality reduction** — compressing an infinite state space into a subspace where approximate comparison becomes possible.

!!! abstract "Property two: the LLM as transition function"

    A classical FSM's transition function is deterministic: state A + input X → always state B. The agent loop's transition function is LLM inference — feed the same context and same tool results in twice, and you may get different next-step decisions.

    This is not a bug in the implementation. It is a property of the mechanism — [ch-01](../ch-01-orthogonality/02-what-is-the-model.md) covered this: probabilistic output is one of the LLM's operational characteristics.

!!! abstract "Property three: non-deterministic termination"

    A classical FSM halts when it reaches a predefined accept state. The agent loop halts when the model "believes the task is done" — and that judgment is itself probabilistic. The model may declare completion before the task is actually finished (false positive), or keep performing meaningless operations after the task is already done (false negative).

    Every production-grade harness has **external termination mechanisms** — max steps, timeouts, human interrupts. Not because the model cannot be trusted, but because probabilistic judgment needs a backstop.

## Beyond the while loop: event-driven execution

The synchronous loop described above is the agent loop's main path. But a production harness does not run just one while loop — it is an **event loop**.

Off the main path, asynchronous signals arrive continuously:

- **Hooks**: pre-tool-call and post-tool-call hooks fire at specific nodes on the main path, able to intercept, modify, or abort execution.
- **External interrupts**: user cancellation, timeout signals, CI status changes — events that can break into the main path at any moment.
- **Event-driven kickoff**: the agent's startup itself is not necessarily triggered by a human hand. State changes in the outside world (data arriving, upstream service pushes, scheduled triggers, output from another agent) can all serve as trigger conditions for agent execution. In production orchestration layers, event-driven agent kickoff is a common pattern — the state machine's very first transition is already asynchronous.

Classical FSMs do not face this dimension — their transitions are synchronous, one input per transition. The agent state machine's transitions are both synchronous (LLM output → tool execution → result injection) and asynchronous (external events injected at any time). This makes the harness's runtime model closer to an event-driven reactor than a simple while loop.

!!! example "Two constraint strategies"

    Facing this atypical state machine, the industry has developed two constraint strategies:

    **Explicit graph (LangGraph)**: overlay a deterministic graph structure on top of the non-deterministic LLM transitions — you define which nodes can transition to which; the LLM calls inside each node remain probabilistic. Deterministic skeleton + probabilistic muscle.

    **Implicit loop (Claude Agent SDK / OpenAI Codex harness)**: no predefined explicit graph. Instead, tool definitions + hooks + permission systems constrain the agent's available action space at each step. The loop itself is general-purpose; constraints are injected through runtime configuration.

    Neither is right or wrong — they serve different scenarios. When the workflow can be predefined, the explicit graph is more transparent. When the workflow demands flexible exploration, the implicit loop is more natural.

Near-infinite state space, non-deterministic transition function, probabilistic termination, a mix of synchronous and asynchronous drivers. This is still a state machine — you just cannot verify it with classical methods.

With the runtime shape understood, one dimension remains unexplored: the feedback loops on this state machine are not single-layered.

</div>

## Further Reading

- LangGraph Documentation. [langchain-ai.github.io](https://langchain-ai.github.io/langgraph/)
