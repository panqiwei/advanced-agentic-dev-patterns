# Where the Analogy Breaks

<div class="mm-article" data-card="assets/where-the-analogy-breaks.png" data-card-alt="Where the analogy breaks — each crack points to new design space" markdown>

Exact break points are more useful than vague similarities.

Assembled together, the cracks across four pillars are not random design problems. They point in a consistent direction — and that direction is more informative than any of the individual similarities.

## Six break points

| Dimension | OS | Agent Harness | Engineering consequence |
|:----------|:---|:-------------|:------------------------|
| **CPU trustworthiness** | Processes don't understand what they execute; they can't be argued into privilege escalation | LLM can be caused to exhibit out-of-bounds behavior by natural language inputs | Trust boundaries must extend to the CPU layer (Execute-Only) |
| **Page fault cost** | Adds latency only; retrieved data is bit-accurate | May add errors (distractor interference) | Memory management is not only "is it present?" but "is it correct?" |
| **Termination condition** | Time elapsed or exit code — deterministic signals | "Done" is a semantic judgment | Requires semantic termination conditions; OS toolbox has none |
| **Communication fidelity** | Byte-exact, checksum-verifiable | Natural language; no semantic checksum | Every transmission is a lossy transform; structured formats reduce but don't eliminate decay |
| **Determinism** | Same input → same output | Same input → variable output (temperature parameter) | Tests cannot rely on exact assertions; statistical validation required |
| **Identity stability** | PID cannot be altered by user-mode programs | System prompt can be rewritten by injection | Agent identity is an open problem; cryptographic signing approach not yet mature |

These six break points share a single common root: **the OS CPU is deterministic execution hardware; the agent CPU is a statistical language model**. Karpathy's 2026 definition — "LLM = CPU (dynamics: statistical and vague not deterministic and precise)" — embeds this distinction directly into the analogy itself.

## Breaks are not failures — they are landmarks

Each break point marks a design space that the OS paradigm has not covered:

**CPU trustworthiness** → Execute-Only Agents is one direction: separate the language understanding layer from the execution layer into distinct security domains, so the execution layer cannot be convinced by language. Hardware-attested execution is another direction: cryptographic proof that a code segment ran as intended. Both are active research areas without mature industrial answers.

**Page fault cost** → Semantics-aware memory management: not just LRU (least recently used), but also information quality. "Is this historical record still valid?" and "How recently was this record accessed?" are two independent dimensions. Current context management tooling primarily addresses the second.

**Termination condition** → AgenticOS Workshop named this a core research problem. Timeout is a coarse proxy: not "is the result satisfactory?" but "has too much time elapsed?" More precise solutions may require explicit goal-state definitions written into agent initialization — making "what counts as done" a first-class artifact — or convergence detection as an automatic heuristic.

**Communication fidelity** → Structured protocols (A2A's JSON-RPC) wrap non-deterministic semantics in a deterministic transport layer. A further direction: explicitly tagging critical information to distinguish "facts" (cannot be dropped by summarization) from "context" (lossy compression acceptable).

**Determinism** → Traditional software testing rests on a premise: same input, same output. Hard-code the assertion, CI goes green, ship it. When the CPU is statistical, that premise vanishes — the same prompt run twice may yield structurally different responses. Testing strategy must shift from exact matching to statistical validation: sample multiple runs, replace string equality with semantic similarity, replace hard-coded assertions with LLM-as-judge. "Pass" is no longer binary; it is a confidence interval.

**Identity stability** → The most open problem. Grimlock (ASPLOS 2026) uses eBPF at the kernel layer to monitor agent behavior, providing observability but not resolving system prompt integrity. Cryptographic signing of system prompts — analogous to code signing — is a theoretical direction; practical challenges remain unsystematized.

## What transfers, and what does not

OS engineers accumulated fifty years of design intuition about scheduling, memory, isolation, permissions, and communication. Why preemptive scheduling outperforms cooperative scheduling across most workloads. Why virtual memory is superior to manual physical memory management. Why the principle of least privilege is worth the complexity it introduces.

These intuitions are not abstract principles. They are backed by specific failure cases, by experimental data, by precise quantification of engineering costs. They were learned painfully. They are not available purely by reasoning from first principles — they required failure to generate.

When a harness engineer faces the question "multiple agents competing for LLM inference resources — how do I arbitrate?" they do not need to explore the design space from scratch. OS scheduling history already tells them that batch processing is sufficient but wastes CPU, that round-robin is fairer but incurs switching overhead, that priority scheduling risks starvation. These design intuitions transfer directly, without requiring new failure cases to accumulate.

The analogy gives the engineer a map — they know what tools to bring into a new design space. The break points tell the engineer where the map stops being accurate and original cartography begins.

## Four lenses, one system

This chapter is the fourth lens.

[Orthogonality](../ch-01-orthogonality/01-the-forces.md) gave the decomposition: model capability and harness engineering are orthogonal forces. Investment in directions orthogonal to model capability does not get erased by model iteration.

[Cybernetics](../ch-02-cybernetics/01-helmsman.md) gave the skeleton: the observer-controller-plant triangle, requisite variety constraints, feedback loop topology. Harness engineering is control system design.

[Entropy](../ch-03-entropy/01-what-is-entropy.md) gave the dynamics: why systems tend toward degradation without active maintenance, why sorting information has irreducible costs, why Maxwell's Demon cannot scale.

Operating systems (this chapter) gave the institutions: translate the Demon's individual judgments into rules, translate the cybernetic structure into four engineerable pillars, translate entropy management from intuition into a system with available tools. The four pillars — memory management, scheduling, trust boundaries, cooperation protocols — and the six break points are dimensions of the same framework, not independent engineering problems.

The four lenses together make the harness's structure legible: not just a force in the right direction, not just a feedback loop, not just an entropy-fighting mechanism, but a complete operating system — with memory, scheduling, trust boundaries, and communication protocols — running on a CPU that is probabilistic, that processes natural language as instruction, and that makes every OS abstraction need rethinking from its root assumptions.

Maxwell's Demon reads state, makes judgments, maintains order. The OS institutionalized that work. Harness engineers are reinventing the OS — this time, with a probabilistic CPU.

</div>

---

## Further reading

- AgenticOS Workshop. (2026). 1st Workshop on OS Design for AI Agents. ASPLOS 2026. (Six break points and their research frontiers: Execute-Only, semantic scheduling, Grimlock)
