# Cooperation Protocols

<div class="mm-article" data-card="assets/cooperation-protocol.png" data-card-alt="Cooperation protocols — communication across trust boundaries" markdown>

Isolation creates safety. It also creates islands.

Two processes cannot directly read each other's memory — that is the trust boundary design working correctly. IPC exists precisely because the OS needed to maintain process isolation while still allowing processes to communicate. The solution it arrived at is precise: pipes, message queues, shared memory, sockets. One defining property across all of them: **byte-exact**. Whatever process A sends, process B receives, without a single bit changed.

Agent systems have two fundamentally different collaboration modes: **human-agent** (a human delegates to an agent) and **agent-agent** (agents communicating with each other). Both share the same break from the OS model, but the break happens at different points.

## Human-agent: indirect delegation via ACI

An operating system translates user intent into hardware operations. The user clicks "Save." The OS converts that click into a sequence of IO system calls — buffer flush, file system metadata update, disk write. The translation chain is precise: a user action, captured as a deterministic GUI event, becomes a typed API call, reaches hardware unchanged.

An agent performs the same translation, but the medium is different.

The user says "help me clean up this report." The agent translates that into a sequence of tool calls — read file, analyze structure, reorganize sections, output result. The translation chain starts with natural language, not a typed API call.

**ACI — Agent-Computer Interface — is the interface design discipline for this translation chain.** Anthropic's work on SWE-bench agents found that the time spent optimizing tool interfaces exceeded the time spent optimizing prompts. Tool names should be self-explanatory. Error messages should be interpretable by the model. Parameter design should prevent predictable classes of mistakes — forcing absolute paths over relative ones, for example, eliminates a category of systematic errors that arise when an agent loses track of its working directory.

ACI is the system call interface design discipline applied to agents: design from the LLM's perspective, the way OS engineers once designed syscall APIs from the programmer's perspective. The structural difference is not in the design process but in the medium — one side is type-safe function signatures, the other is natural language.

Karpathy framed the broader direction in 2025: "make infrastructure actively adapt to LLMs" — websites offering llm.txt alongside HTML, documentation shipped as plain markdown rather than rendered pages. This extends ACI from individual tool interfaces to the entire infrastructure layer. The aim is not to make LLMs better at reading human-designed interfaces; it is to redesign the interfaces so that LLMs can use them directly.

The breakpoint in the human-agent chain is **intent interpretation uncertainty**. "Clean up the report" is ambiguous: preserve the original meaning and reformat, or rewrite for clarity, or reduce length by half? The OS equivalent — "save the file" — is a deterministic API call with no interpretation space. An agent's starting point is different. The user's intent is expressed in natural language; the agent's execution is discrete and specific; the mapping between them is probabilistic. This is not a solvable engineering problem in the way that byte-accurate transmission is solvable. It is a structural property of natural language as an interface medium.

## Agent-agent: direct communication via A2A

Inter-process communication in an OS is symmetric: two processes are both processes under the same OS, using the same IPC mechanisms on equal terms.

Agent-to-agent communication is less symmetric. Agents built on different frameworks, in different languages, deployed by different organizations — how do they communicate?

Google's Agent-to-Agent protocol (A2A, April 2025) is the first serious attempt at standardization. Three core components:

- **Agent Card**: each agent publishes a capability declaration (JSON) describing what it can do and what communication patterns it supports — analogous to `/proc` entries in a file system, letting callers discover at runtime what a counterparty is capable of
- **HTTPS + JSON-RPC**: a deterministic transport layer with a unified message format, using mature web infrastructure rather than inventing a new network protocol
- **OAuth authentication**: identity verification for cross-organization agent communication, answering the question "how do I know who I'm talking to?"

What A2A is doing structurally resembles what TCP/IP did: taking fragmented, private, framework-local communication into a cross-implementation standard. Different OSes could then talk to each other. Different agent frameworks can now talk to each other.

## The breakpoint: no semantic checksum

OS IPC is byte-exact. The A2A transport layer can also be byte-exact. But the breakpoint in agent communication is not at the transport layer.

Agent A generates a summary and sends it to Agent B. That summary is Agent A's lossy compression of the original information: A retained what it judged important and discarded what it judged peripheral. But A's judgment is probabilistic. B reasons from that summary, potentially discarding further detail, potentially shifting semantics. The longer the chain, the more cumulative drift — what arrives at agent D may bear only a family resemblance to what started with agent A.

!!! warning "Natural language has no checksum"

    An OS process can send 1024 bytes through a pipe and the receiver can verify data integrity with a CRC or hash. Agent communication has no equivalent mechanism for semantic content — no "semantic integrity check," no way to confirm that B understood what A intended to express.

The problem exists in both collaboration modes, but through different mechanisms:

- Human-agent: ambiguity introduces interpretation divergence when the user's intent is translated into agent actions
- Agent-agent: compression introduces information loss when an agent's output is passed to the next agent

A2A wraps natural language content in a deterministic protocol (HTTPS/JSON-RPC), reducing transport-layer loss. It cannot eliminate semantic-layer decay: the natural language content inside the messages is still lossy, and the protocol layer has no mechanism for verifying semantic fidelity. Structured message formats — JSON schemas that constrain specific fields rather than permitting free text — reduce the decay, but agents often need to pass inherently unstructured judgments and reasoning that cannot be fully structured.

This is the signal-channel noise from the entropy chapter instantiated in a cooperation chain: natural language has no error-correcting code. Every transmission is a lossy semantic transform.

## Communication complexity is orthogonal to model capability

Stronger processes did not eliminate the need for IPC — they still needed to communicate with other processes, still needed to call system resources.

Stronger LLMs do not eliminate the need for cooperation protocols. A more capable model can handle more complex tasks, and more complex tasks typically require more agent collaboration — more human-agent delegation chains, more agent-agent communication hops. Communication complexity scales with task complexity; model capability improvements do not reduce it.

The protocol design space is orthogonal to inference capability.

---

Each pillar cracked at a specific point. Those cracks, assembled together, are not random — they point in a consistent direction.

</div>

---

## Further reading

- Google. (2025). Agent2Agent Protocol (A2A). a2aproject.github.io.
- Anthropic. (2025). Building Effective Agents. anthropic.com/engineering. (ACI principles: design tool interfaces from the model's perspective)
- Karpathy, A. (2025). Software Is Changing (Again). YC AI Startup School. (ACI extended to infrastructure: llm.txt, Docs for LLMs)
- Factory.ai. (2025). Evaluating Context Compression for AI Agents. (Empirical measurement of information decay)
