# Trust Boundaries

<div class="mm-article" data-card="assets/trust-boundary.png" data-card-alt="Trust boundaries — two dimensions of isolation: permissions and resource access" markdown>

An operating system does not trust the programs it runs.

This is not a cynical design choice — it is the only defensible starting point. User programs may contain bugs. They may be compromised by attackers. They may be outright malicious. The OS assumes worst-case behavior and limits the blast radius through two independent mechanisms: **permissions** (what a program is allowed to do) and **resource isolation** (what a program is allowed to see). One without the other is half a defense: permissions without isolation let programs read any accessible data, while isolation without permissions lets programs do anything they want with visible data.

Harness engineering faces the identical structural problem and has been independently reinventing both mechanisms.

## Permissions: the tool call as system call

An operating system's system call interface is the only legitimate entry point through which a user program can access privileged resources. A program cannot directly manipulate hardware, network stacks, or file systems — it can only request the kernel to perform operations on its behalf, and the kernel checks permissions before acting.

The structure in agent systems is identical. An agent cannot directly send email, modify a database, or execute shell commands. It can only request the harness to perform those operations through a tool call, and the harness checks authorization before acting. The system call is the tool call.

Production agent systems are already reinventing this structure. The core design principle mirrors OS security: **deny takes precedence over allow**. Rejection always outranks permission, and a deny rule set at any scope cannot be overridden by a more permissive rule at a lower scope.

Permission modes form a spectrum from fully manual confirmation to fully automatic execution — just as OS trust levels range from unprivileged user mode through root. The scope hierarchy is layered in the same architectural spirit as ring protection: organizational policy overrides project configuration, project configuration overrides user preferences, and deny is unidirectional. Ring 0 constraints are invisible to ring 3 code; a top-level deny is invisible to lower-level allow rules.

## The breakpoint: this CPU can be persuaded

An OS process cannot be "convinced" to violate its permission boundaries.

A process does not understand what it is executing. It runs binary instructions. You can inject malicious code, but even injected code operates within the OS permission system — it runs under the same user identity, with the same syscall constraints. Hardware enforcement is physics, not policy.

A carefully crafted prompt injection does not need to find a code vulnerability or escalate privileges through a system call. It needs only to cause the agent to exhibit behavior that violates its authorization boundaries — through whatever mechanism (instruction following, context hijacking, or something else), the observable effect is the same: the agent does something it was not supposed to do. There is no type system, no compiler, no mechanism equivalent to "this instruction is invalid." The permission boundary is architecturally enforced; the attack surface is semantic.

In an OS, you trust the kernel's logic and need not trust the CPU itself — the CPU is deterministic execution hardware. In an agent system, this assumption fails: the LLM is simultaneously the execution engine and the system that interprets inputs, and inputs can be attack vectors.

Execute-Only Agents (ASPLOS 2026, Tiwari & Williams) proposed a structural response: separate the planning layer from the execution layer into two distinct security domains. The execution layer receives only pre-approved operation specifications, not natural language instructions. A component that cannot be convinced by language is a genuine security boundary — not a patch on the permission system, but an architectural elimination of the attack surface.

## Resource isolation: data visibility layers

OS file system permissions stratify data into three visibility tiers through ownership and mode: kernel-exclusive data (`/proc`, `/lib` — user processes read-only or invisible), system-managed shared resources (`/etc` — controlled write access), and user-private space (`~/` — full read-write). The design principle across all three tiers is the same: **entities at different trust levels see different data, and write permissions increase strictly with trust level**.

Agent systems face the same layering requirement. Immutable platform foundations (base configuration, built-in capabilities) are read-only to agents. Cross-session shared state (global configuration, shared knowledge) is writable only through controlled interfaces. The current session's workspace belongs entirely to that session. This three-tier structure is isomorphic to the OS file system — not by coincidence, but because the same constraints (multi-tenancy, least privilege, audit requirements) drive the same solution.

OS engineers also perfected a strategy for efficient initialization across these tiers: `fork()` Copy-on-Write. Parent and child processes share the same physical pages; only when a process writes does the OS create a private copy. Agent session initialization can apply the same principle — shared-layer data is not bulk-copied at startup, but copied on demand when the agent needs to modify something. Defer allocation until a write actually happens; avoid unnecessary duplication at initialization.

## Defense in depth

The two mechanisms address different threat surfaces, and that complementarity is the point.

Permission enforcement prevents agents from *doing the wrong thing* — calling unauthorized tools, executing disallowed operations. Resource isolation prevents agents from *seeing the wrong data* — accessing information outside their scope, contaminating shared state.

When prompt injection bypasses the permission system, resource isolation is the second line of defense. When resource isolation is misconfigured, the permission system is the first line of defense. The two work together without depending on each other's perfection. This is defense in depth, not single-point protection.

---

Trust boundaries answer the question of what an agent can do when working alone. When agents need to collaborate — with humans, with other agents — the trust boundaries between them need communication channels. That is the next problem.

</div>

---

## Further reading

- Anthropic. (2026). Claude Code: Permissions. code.claude.com/docs/en/permissions. (Six permission modes, deny-first rule hierarchy, scope hierarchy)
- AgenticOS Workshop. (2026). Execute-Only Agents; Grimlock: eBPF-based Agent Monitoring. ASPLOS 2026.
- OpenAI. (2025). Unrolling the Codex Agent Loop. openai.com/engineering. (Independent sandboxing, network-off-by-default in production)
