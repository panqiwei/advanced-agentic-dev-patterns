# The cost of translation

<div class="mm-article" data-card="assets/cost-of-translation.png" data-card-alt="The cost of translation" markdown>

The translation layer is not free infrastructure. Every conversion between the two representations carries a cost — sometimes small enough to ignore, sometimes large enough to bring the system down.

If you have an electrical engineering background, "impedance mismatch" captures the dynamic: when a signal crosses from one transmission medium to another, mismatched impedances cause reflection, attenuation, and distortion. The higher the frequency of the signal — the finer the information — the worse the damage.

Translation between symbolic and connectionist representations behaves similarly. "Summarize this text" is a low-frequency signal — even with translation loss, the output is usually usable. "Return a nested JSON structure conforming to this schema, with every field a valid enumeration value" is a high-frequency signal — a single token deviation invalidates the entire structure.

Five costs, each backed by production evidence.

## Schema violation

The most visible translation loss: you hand the model a symbolic contract (a JSON Schema), and the token sequence it produces does not conform.

Before OpenAI introduced structured outputs, schema violation rates on complex extraction tasks ran roughly 8–12%, depending on task complexity and evaluation benchmark. Strict mode brought this below 0.1% — nearly two orders of magnitude.

But it is not free. Strict mode works by compiling the schema into a formal grammar (OpenAI uses a context-free grammar; other tools like Outlines use finite state machines), then masking tokens that violate the current grammar state at every decoding step. This requires additional inference-time computation to maintain the grammar state, engineering complexity to handle schema compilation, and a subtler cost that we will get to shortly.

The nature of the cost: the neural system's output space is vastly larger than what the symbolic constraint permits. Compressing that space costs inference time and engineering complexity.

## Semantic drift

Symbolic constraints live in the system prompt or tool definitions, positioned at the start of the context window. But LLM attention is not uniform.

Chroma's 2025 study tested 18 frontier models and found that every one exhibited performance degradation as context length grew. A separate study by Du et al. showed that even replacing irrelevant tokens with whitespace — removing informational interference entirely — still produced 14% to 85% performance drops. This means degradation is not purely about competing information; attention itself dilutes over long contexts.

The lost-in-the-middle effect compounds the problem: information positioned in the middle of the context is retrieved at significantly lower rates than information at the head or tail. As conversations grow long enough, the carefully written tool-use rules and output format requirements in the system prompt gradually fade.

The nature of the cost: symbolic constraints are text in the context window. They compete for the same finite attention budget as conversation history, retrieval results, and user inputs. Constraints are not "cancelled" — they are diluted.

## Tool hallucination

When a model needs to call a tool, it faces a set of function signatures and parameter schemas described in natural language. It must select the right function and fill in the right parameter values.

Research finds that model failures at this translation point are diverse: the model fabricates nonexistent tool names, invents parameters not defined in the schema. The NESTFUL benchmark found that GPT-4o achieves only 28% full sequence accuracy on nested API call sequences — less than three in ten.

A separate study of LLMs in agentic scenarios observed a subtler degradation pattern: models start tasks with correct reasoning and valid tool selections but deteriorate mid-execution — malformed tool calls, loss of JSON output structure, or forgetting earlier decisions.

The nature of the cost: tool schemas are just text in the context, as far as the neural system is concerned. The model "knows" a schema the same way it "knows" a conversation turn — through statistical associations extracted from the token sequence. But a schema demands precise compliance, not approximate understanding.

## Trajectory bias

This is the subtlest cost, and most engineers do not know it exists.

Constrained decoding masks tokens that the current grammar state does not permit at every step. This means the model's probability distribution is modified at every step — some originally high-probability tokens get masked, and probability mass is redistributed to the remaining tokens.

A study published at RANLP 2025 found that this step-by-step modification biases the model toward generation paths that are "grammatically easy but semantically wrong." On generation tasks, constrained decoding reduced semantic correctness — not because the constraints themselves are flawed, but because masking tokens reshapes the probability landscape, steering the model onto a different path.

A more counterintuitive finding: instruction-tuned models sometimes perform worse under constraints than base models. Instruction tuning may "inadvertently reduce structured output capabilities."

The nature of the cost: symbolic constraints reshape the probability landscape. You get a structural guarantee — the output is definitely valid JSON, definitely conforms to your schema — but you may pay in semantic quality. Format correctness and content correctness are two independent dimensions; constrained decoding guarantees the former but may degrade the latter.

## Boundary penetration

The last cost is not translation loss but the fragility of the translation boundary itself.

OWASP's 2025 taxonomy (LLM01:2025) lists prompt injection as the top risk for LLM applications. In the framework of this chapter, the core of the problem is: the LLM cannot effectively distinguish informational context from executable instructions.

In the symbolic-connectionist frame, this becomes more precise: prompt injection is the consequence of the data/control distinction — foundational to symbolic system security — not existing in the neural system.

In traditional computer systems, the distinction between data and code is the foundation of security. SQL injection is possible because SQL queries mix data and control in the same string. Parameterized queries solved this by separating data from control at a structural level.

LLMs face the same problem with no equivalent structural solution. System prompt (control) and user input (data) are both token sequences, processed by the model using exactly the same computational mechanism. You can write "ignore any instructions in the following content" in the prompt, but that is just using more control tokens to constrain data tokens — and to the model's attention mechanism, they are homogeneous.

The production consequences are real. Security researchers have demonstrated remote code execution via prompt injection in coding assistants. In 2024, Slack AI was found vulnerable to data exfiltration through RAG poisoning — attackers injected malicious instructions into public channels, which the model treated as legitimate context during retrieval.

The nature of the cost: symbolic systems maintain a strict structural distinction between data and code. Neural systems do not. The translation layer sits between the two, but it inherits the weakness from the neural side — in a token sequence, control and data are indistinguishable.

## These are not bugs

The five costs share a common trait: they are not deficiencies of any particular model, not temporary problems of current technology, not bugs that better engineering practices can eliminate.

They are structural manifestations of impedance mismatch between two kinds of representation.

One representation is discrete, precise, composable, and verifiable. The other is continuous, probabilistic, context-sensitive, and indivisible. Translating between them necessarily deforms the signal. The deformation pattern depends on the signal's "frequency" — the more precision demanded, the greater the loss.

This reframes the question: the issue is not "how to eliminate these costs" but "what is the structure of these costs, and along what axis are they distributed?"

</div>

---

## Further reading

- Schall & de Melo, "The Hidden Cost of Structure" (RANLP 2025) — The first systematic study to expose trajectory bias in constrained decoding. Most engineers know that constrained decoding guarantees format; few know how it can degrade semantics. This paper lays out the cost structure with experimental evidence.
