# The dao of symbols and connectionism

<div class="mm-article" data-card="assets/the-dao.png" data-card-alt="The dao of symbols and connectionism" markdown>

Five articles in, a structure surfaces.

## Back to the feedback loop

[Chapter two](../ch-02-cybernetics/index.md) of this series introduced cybernetics — the feedback loop at the heart of every agent system: observe, judge, act, observe. The focus then was on the loop's structure and stability.

Now look at that loop through the lens of the translation layer.

What does the Observer do? It reads the LLM's output (a token stream), parses it into structured data (JSON, function calls, status flags), and updates the system's understanding of the current state. That is a connectionist-to-symbolic translation.

What does the Controller do? It takes the current state (structured data), makes a decision (what to do next), and encodes that decision as a prompt to send to the model. That is a symbolic-to-connectionist translation.

Every cycle of the feedback loop passes through two representation conversions. In the OCP triangle (Observer–Controller–Plant), Observer and Controller are not merely "processing information" — they are translating. Plant (the LLM) receives connectionist representation and produces connectionist representation; external systems consume symbolic representation and produce symbolic representation. Observer and Controller are the bidirectional translators between these two worlds.

This means the translation layer is not an add-on outside the feedback loop. It is a constituent part of the loop. The loop's quality — response speed, judgment accuracy, action effectiveness — depends in part on the quality of translation.

## Translation loss as an entropy source

[Chapter three](../ch-03-entropy/index.md) discussed entropy — information decay in long reasoning chains. The focus then was on the thermodynamic analogy of "disorder naturally increases."

The translation layer adds a previously unnamed source to the entropy mechanism.

Every connectionist-to-symbolic translation can inject noise: parsing errors (malformed JSON), semantic loss (what the model "meant to say" and what the schema can express do not perfectly overlap), information discard (tokens masked by constraints may have carried meaningful uncertainty signals).

Every symbolic-to-connectionist translation can also inject noise: instruction misinterpretation (gaps between what the prompt intends and what the model reads), context contamination (residual effects from earlier conversation turns), constraint dilution (system prompt rules fading over long contexts).

Why does long-chain reasoning degrade? Beyond the information-theoretic mechanisms discussed in chapter three, there is another reason: every additional reasoning step involves one or more representation conversions, and each conversion incurs translation loss. The longer the chain, the greater the accumulated translation noise.

## The fractal translation layer

[Chapter five](../ch-05-fractal/index.md) discussed fractals — self-similar structures repeating across scales.

The translation layer has this property too.

At the scale of a single tool call: a schema defines constraints (symbolic) → the model generates output (connectionist) → output is parsed into structured data (symbolic). One micro-translation cycle.

At the scale of a single agent: a prompt encodes the task (symbolic → connectionist) → the model reasons and outputs (connectionist) → the harness parses, validates, and decides (connectionist → symbolic) → the next prompt is assembled (symbolic → connectionist). One full translation cycle.

At the scale of multi-agent orchestration: an orchestrator decomposes a task into subtasks (symbolic operation) → distributes to individual agents (each containing its own translation cycle) → collects and aggregates results (symbolic operation) → potentially redistributes. Translation cycles nested inside translation cycles.

Three scales, same structure: the symbolic → connectionist → symbolic conversion repeats at every layer. This is not coincidence — it shares the same root as the self-similar architecture of agentic systems discussed in chapter five: at every scale, the system needs symbolic control logic and connectionist generative capability to interact, and the interface at every scale faces the same impedance mismatch.

## Causal discipline finds its framework

Return to this chapter's starting point — the carrier problem left open at the end of [chapter six](../ch-06-causality/06-the-dao-of-causality.md).

What does causal discipline need? It needs to express causal structure (causal graphs, directionality, the *do* operator) — this requires symbolic representation. It needs to discover candidates for causal relationships from data ("rain and slippery roads may be causally related") — this requires the connectionist system's pattern-finding capability. It needs to verify whether these candidates are consistent with causal structure in the data — this requires symbolic statistical testing again.

The carrier of causal discipline is not the symbolic system. It is not the neural network. It is the translation between them.

The LLM extracts linguistic expressions of causal knowledge from text — "rain causes slippery roads." That is the connectionist system doing discovery. The harness converts these expressions into formal causal hypotheses — a directed edge from "rain" to "slippery roads." That is the translation layer doing conversion. Formal tools verify whether the hypothesis is consistent with observational data. That is the symbolic system doing verification. The three work together; none completes the job alone.

The impasse from chapter six — "one excels at structure but cannot discover; the other discovers but cannot structure" — now has a precise framework. The answer is not to make either side good at both. It is to let each do what it does, connected by translation.

## The shape of the problem

This chapter has not provided answers.

What it has revealed is a structure.

Two representations — symbolic and connectionist — are irreducible to each other. Each covers a capability space the other cannot reach. The LLM is a strange hybrid of the two — a connectionist architecture manipulating a symbolic medium, developing symbol-like structures internally that are invisible at the engineering interface.

What harness engineers do every day is translate between these two representations. Translation has costs — five structural impedance mismatches. These costs are distributed along a tension axis: structural guarantees at one end, generative freedom at the other.

This is not a problem waiting to be solved. It is the shape of the problem itself.

Seeing this shape, when you face any specific engineering decision, you at least know what you are trading off. You know that adding strict mode gains you something (structural guarantees) and costs you something (trajectory bias). You know that giving the model more freedom gains you something (semantic quality) and risks something (format failures). You know that every line of harness code you write — every schema definition, every prompt rule, every parsing logic — is selecting a position on the tension axis.

There is no right or wrong position. Only whether you are clear about what you chose, and why.

</div>

---

## Further reading

- Fodor & Pylyshyn, "Connectionism and Cognitive Architecture: A Critical Analysis" (1988) — The most serious philosophical critique of connectionism, now over three decades old. Worth reading not for its conclusion (connectionist systems cannot explain systematicity) but for how it frames the question — "the way a system represents knowledge determines what computations it can perform." That insight is more powerful in the LLM era than it was in 1988.
