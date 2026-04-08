# Operating System

Entropy tells you the default direction: disorder accumulates, degradation is natural. It does not tell you how to push back.

Maxwell's Demon is one answer: active judgment against entropy increase. Classify information, maintain order, absorb the cognitive cost continuously. The answer is conceptually complete — the Demon can do it. But the Demon runs on individual case-by-case decisions. No policies. No rules. No system. It does not scale.

Write the sorting rules down as institutions, and you have an operating system.

In 2023, Andrej Karpathy described LLMs as "the kernel process of an emerging operating system." Three years later he made the intuition precise: LLM is the CPU, the agent is the OS kernel, the harness is the full OS. This is not a metaphor in the rhetorical sense. It is a structural isomorphism: the five pillars that OS engineers refined over fifty years — memory management, scheduling, trust enforcement, communication protocols — are being reinvented in agent harness, in slightly different shapes, with slightly different constraints.

This chapter uses the OS as a lens. Each pillar unfolds, and each article names the precise point where the OS analogy breaks — because those break points mark the design spaces that OS thinking has not yet covered.

![Operating System: chapter overview](assets/os-overview.png)

---

| # | Article | In one sentence |
|---|---------|----------------|
| 01 | [From Demon to OS](01-from-demon-to-os.md) | Institutionalizing individual judgment — Karpathy's three-layer precision and what LLM=CPU means for engineering |
| 02 | [The Memory Hierarchy](02-memory-hierarchy.md) | The same design pattern in a new computing layer — and why wrong context is more dangerous than missing context |
| 03 | [Scheduling](03-scheduling.md) | Orchestration decisions and cost ROI are two harness scheduling dimensions the OS never had to face |
| 04 | [Trust Boundaries](04-trust-boundary.md) | Permissions prevent doing the wrong thing; resource isolation prevents seeing the wrong data — and a CPU that can be persuaded is neither |
| 05 | [Cooperation Protocols](05-cooperation-protocol.md) | Human-agent via ACI, agent-agent via A2A — and natural language has no checksum |
| 06 | [Where the Analogy Breaks](06-where-the-analogy-breaks.md) | Six break points, one common root: the OS CPU is deterministic; the agent CPU is statistical |
