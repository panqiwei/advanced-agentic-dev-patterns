# The translation layer

<div class="mm-article" data-card="assets/translation-layer.png" data-card-alt="The translation layer" markdown>

The symbol-like structures inside the LLM are invisible to you. Your system needs structured, verifiable, composable outputs.

What happens in between?

Translation happens.

## You are already translating

Take apart a typical LLM agent system and trace the signal flow.

You write a prompt template — encoding a structured task description (variable names, conditional logic, formatting requirements) into natural language text and feeding it to the model. That is a translation: from symbolic representation to the sequence representation the neural network can process.

The model finishes processing and outputs a stream of tokens. You parse them with a JSON parser, extract structured data, validate field types and value ranges, then pass the result to downstream systems. That is another translation: from the neural network's sequence output back to symbolic representation.

Two translations, one in and one out, on every single call.

But that is only the surface layer. Look deeper, and nearly everything a harness engineer does is a conversion between these two kinds of representation:

**Tool schemas.** When you define a JSON Schema for a function — specifying parameter names, types, enumerations, required fields — you are writing a symbolic contract. OpenAI's strict mode compiles that contract into a context-free grammar, masking non-conforming tokens at every generation step. Anthropic's structured outputs compile the schema into a grammar that "actively restricts token generation during inference." This is not metaphor — it is literally a symbolic grammar governing neural output at the token level.

**Structured output and constrained decoding.** Outlines, Guidance, XGrammar, llguidance — these tools all do the same thing: impose a formal grammar (regular expressions, context-free grammars, JSON Schema) onto the neural network's probability distribution. At each decoding step, they compute which tokens the current grammar state permits and mask the rest. Formal language theory — a product of the symbolic world — is directly embedded in the inference process — the connectionist world's territory.

**Prompt templates.** A prompt template with variable slots, conditional branches, and loop unrolling is essentially a symbolic program that generates natural language text. Its input is structured data; its output is the neural network's input sequence. The Jinja2 template engine does not care about semantics — it performs pure string manipulation. Pure symbolic processing.

**Code generation and execution.** When an LLM generates Python code and runs it in a sandbox, that is the most explicit neural-to-symbolic pipeline. The model uses connectionist computation to produce a symbolic artifact (source code), which then executes in a fully deterministic environment (the interpreter). The two worlds meet most cleanly here: the model's nondeterminism lives in the code generation phase, but once code is written, subsequent execution is exact.

**Orchestration state machines.** LangGraph models agent control flow as a directed graph: nodes are processing steps, edges carry predicates on global state, and global state is a structured dictionary. This is textbook symbolic control flow wrapping neural computation.

**Retrieval-augmented generation.** Query construction, index lookup, filtering — these are symbolic operations. Results get injected into the prompt — entering neural computation. The final output is parsed back into structured data — returning to the symbolic world. Three-phase translation.

## A pattern classified but unnamed

In 2020, Henry Kautz delivered the AAAI Engelmore Memorial Lecture and proposed a six-type taxonomy of neuro-symbolic integration, ordered from loosest to tightest coupling:

| Type | Name | Description |
|------|------|-------------|
| Type 1 | Symbolic Neural | Standard neural net with symbolic I/O (tokens in, tokens out) |
| Type 2 | Symbolic[Neural] | Symbolic system orchestrates neural components |
| Type 3 | Neural \| Symbolic | Neural perception feeds symbolic reasoner |
| Type 4 | Neural: Symbolic → Neural | Symbolic system generates training data for neural nets |
| Type 5 | Neural{Symbolic} | Symbolic rules embedded in neural architecture |
| Type 6 | Neural[Symbolic] | Symbolic reasoning embedded inside the neural network |

Production environments are dominated by Type 2 and Type 4. Type 2 is exactly the harness engineering described above — symbolic systems (schemas, state machines, grammar constraints) orchestrating neural components (the LLM). Type 4 is synthetic data pipelines — using symbolic rules to generate training data that shapes neural network behavior.

Types 5 and 6 — embedding symbolic reasoning directly inside the neural architecture — remain primarily academic. The core bottleneck is the joint training problem: how do you perform gradient descent through discrete symbolic operations? There is no general solution.

This means that current practice, and foreseeable future practice, is Type 2: two systems maintain their respective computational modes, interacting through an interface layer.

That interface layer is the harness.

## The translation layer

This pattern has many names in the literature. Framework developers call it orchestration. Middleware engineers call it middleware. Academic papers call it symbolic scaffolding.

But nobody has unified these labels, and nobody has stated the most direct description: everything you do at the harness layer — defining tool schemas, writing prompt templates, parsing structured outputs, managing conversation state, validating execution results — is the same kind of work.

You are translating between two kinds of representation.

From symbolic to connectionist: encoding structured constraints, task descriptions, and tool definitions into token sequences that the neural network can process.

From connectionist to symbolic: parsing the neural network's token output into structured data that deterministic systems can consume.

The harness is not "glue code." It is not "a pipeline that strings API calls together." It is the translation layer between two fundamentally different modes of representation — one that excels at structure but cannot discover, and one that discovers but cannot structure — a bidirectional converter between the two.

This role is structural, not incidental. As long as you use a connectionist model (a neural network) and your system requires symbolic guarantees (structural correctness, type safety, constraint satisfaction), you need a translation layer. Stronger models will not eliminate this need — they change the difficulty and reliability of translation, but they do not eliminate translation itself.

</div>

---

## Further reading

- Henry Kautz, "The Third AI Summer" (AAAI 2020 Engelmore Memorial Lecture) — The six-type taxonomy of neuro-symbolic integration. Re-examine your harness code through this lens and you will find that you have been doing Type 2 integration all along — nobody just called it that.
