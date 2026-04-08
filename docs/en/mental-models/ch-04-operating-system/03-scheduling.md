# Scheduling

<div class="mm-article" data-card="assets/scheduling.png" data-card-alt="Scheduling — arbitrating scarce resources among competing demands" markdown>

Scheduling solves an ancient problem: multiple claimants, one scarce resource, who goes first, for how long, and who takes over after.

Operating systems have been solving this problem for fifty years.

## A brief history of OS scheduling

The earliest systems had no scheduling at all. Programs ran sequentially — one completed before the next could start. CPUs sat idle during IO operations. The utilization reports from that era read like an apology letter.

**Round-robin** was the first real breakthrough: assign each process a fixed time slice, preempt when it expires, move to the next. CPU utilization climbed. Then the obvious problem surfaced — a real-time alarm process and a background log-compression job get the same time slice, regardless of urgency. Equal by clock, wrong by design.

**Priority scheduling** fixed that intuition and introduced a different pathology: if high-priority processes never stop arriving, low-priority processes wait indefinitely. A theoretically correct mechanism that could permanently strand real work. Systems running production priority schedulers accumulate "starved" processes the way a cluttered desk accumulates papers at the bottom of the pile.

Linux's **Completely Fair Scheduler** changed the question from "who has higher priority?" to "who has been most shorted?" Track how much CPU time each process has been owed, prioritize the most-owed process first. The fairness definition shifted from "equal slices" to "equal debt clearance" — a subtler and more defensible contract. **cgroups** added budget enforcement on top: each process group gets a maximum CPU allocation and gets throttled when the budget runs out.

Fifty years of scheduling evolution, driven almost entirely by the failures of the preceding approach. Each breakthrough was bought by a real system that misbehaved in production.

## Harness scheduling, dimension one: orchestration decisions

In agent systems, scheduling at the harness layer is not about which inference request enters the GPU queue first (that is a separate problem at the inference infrastructure layer, operating below and orthogonally to what harness engineers control). Harness scheduling is about **which tasks get executed, in what order, and whether to run them in parallel** — the orchestrator's core responsibility.

The mapping onto OS scheduling modes is direct:

| OS Scheduling Mode | Agent Orchestration Equivalent | Core Decision |
|:-------------------|:-------------------------------|:-------------|
| Batch processing | Sequential task chain | Strict serial execution, dependency guaranteed |
| Round-robin | Multi-agent turn-taking (GroupChat) | Fair rotation, prevents any one agent from monopolizing |
| Priority scheduling | Hierarchical delegation (primary → sub-agent) | High-value tasks get resources first |
| Preemptive interrupt | Event-driven interrupt (LangGraph interrupt) | Critical conditions pause current execution |
| Peer-to-peer | Agent teams | Decentralized, task self-organization |

The range of orchestration patterns in active use — from strict sequential pipelines to fully decentralized teams — covers a scheduling design space that closely parallels OS history. Different workloads call for different modes; the tradeoffs are structurally familiar.

## Harness scheduling, dimension two: cost ROI

Here is where agent scheduling diverges from the OS model in a way that matters.

The OS cgroups question is: "How much CPU can this process group consume?" CPU time is an internal cost — the system tracks and enforces it, but it is not priced per unit to the application. The accounting is real; the billing is not.

The harness question is: "How many tokens is this task worth spending?"

Tokens are explicitly and immediately priced. Every inference call produces a visible, attributable cost. This changes the scheduling objective function at a structural level: not just "can this resource complete the task?" but "is completing this task worth what it costs at this model tier?"

OS schedulers never had to ask that second question. CPU time is an internal accounting entry, not a per-decision bill. The cost of running a low-priority batch job is diffuse and shared. Token cost is exact and immediate.

That difference permeates every scheduling decision: task priority now has two dimensions — urgency *and* quality-per-token expectation. Model routing is no longer "use the strongest available" but "does this step's precision requirement justify the per-call cost differential?" Task cutoff is no longer a simple timeout but an expected-value calculation — at what point does the marginal token cost of continuing exceed the marginal probability of a better result?

OS scheduling optimizes for throughput and fairness. Harness scheduling must also optimize for **quality-per-cost** — a ratio OS schedulers never computed because CPU time was never billed per judgment call.

This is genuinely new engineering territory. Token budget management has a structural analogue in cgroups, but the objective is different enough that the design patterns do not transfer directly. How to set token budgets, how to route tasks to models of varying cost and capability, when to cut losses on a failing agent — these questions have no fifty-year-old answers waiting to be borrowed.

## The breakpoint: semantic termination

OS scheduling has reliable termination signals. A process runs to completion and exits. The exit code is non-zero if something went wrong. Time can serve as a fallback termination condition — a watchdog kills anything that has not finished by its deadline. These signals are precise, unambiguous, and machine-checkable.

Agent scheduling encounters a problem that OS scheduling never had to confront: "done" is a semantic judgment, not a machine state.

Consider this illustrative scenario: an editing agent reviews a document and annotates it with "the tone needs to be more professional." A writing agent revises accordingly and returns the document. The editing agent responds: "better, but now it's too dry — it needs more energy." Both agents are working. Both are consuming tokens. The system is not converging.

This is not a deadlock — no one is blocked waiting for anyone else. It is a livelock: sustained activity, zero progress, and the bill accumulating. An OS timeout can detect it; an OS scheduler has no concept of whether the activity is making semantic progress. The exit condition for "the document is good enough" is not a time or a state machine — it is a judgment about quality that requires understanding what "good" means in context.

AgenticOS Workshop (ASPLOS 2026) lists **semantic-aware scheduling** as a core research problem precisely because this is where the OS toolbox runs out. Timeout is a rough proxy: not "is the result satisfactory?" but "has too much time passed?" More precise solutions may require explicit goal-state definitions written into the agent's initialization logic — making "what counts as done" a first-class engineering artifact rather than an implicit assumption.

## Scheduling is orthogonal to model capability

Stronger CPUs did not eliminate the Completely Fair Scheduler. Cheaper disk did not eliminate virtual memory. The OS resources scaled, and so did the management systems built on top of them.

Stronger LLMs do not eliminate the harness scheduling problem — they make it more demanding in both dimensions. A more capable model can accept more complex tasks, which means more agent collaboration and higher-dimensional orchestration decisions. A more capable model typically commands higher pricing, which means the cost ROI calculus matters more, not less.

The scheduling design space is orthogonal to inference capability. It does not shrink as the models improve.

---

Scheduling determines who runs and when. Trust boundaries determine what they can do when they do run — which tools they can call, which data they can see, and what happens when something tries to exceed its authorization.

</div>

---

## Further reading

- Mei, K. et al. (2025). AIOS: LLM Agent Operating System. COLM 2025. arXiv:2403.16971. (System-layer LLM inference scheduling — FIFO/RR implementation, orthogonal to harness-layer scheduling)
- AgenticOS Workshop. (2026). 1st Workshop on OS Design for AI Agents. ASPLOS 2026. (Semantic-aware scheduling, AgentCgroup token budget management)
- Anthropic. (2026). Building Agents with the Claude Agent SDK. claude.com/engineering.
