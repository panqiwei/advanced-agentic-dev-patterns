# Two roads

<div class="mm-article" data-card="assets/two-roads.png" data-card-alt="Two roads" markdown>

Causal discipline needs a carrier — some computational form that can express causal structure, enforce causal constraints, and maintain causal chains. The previous chapter ended with a structural impasse: logic systems are built for this, but they need humans to encode the structure upfront. Neural networks can discover patterns from data, but what they discover is correlation, not causation.

One is good at structure but cannot discover. The other discovers but cannot structure.

This impasse is not new. It is the oldest fork in artificial intelligence.

![two roads, irreducibly](assets/two-roads.png)

## What symbols promised

In 1975, Newell and Simon delivered their Turing Award lecture and articulated the Physical Symbol System Hypothesis: a physical symbol system has the necessary and sufficient means for general intelligent action.

Notice the force of that claim. Not "may be useful." Not "worth exploring." Necessary *and* sufficient. Symbol manipulation is not merely one path to intelligence — it is, the hypothesis asserts, the only path.

In closed domains, the promise was kept. Expert systems delivered expert-level judgment within well-defined knowledge boundaries. Theorem provers derived formal proofs that human mathematicians struggled with. Planning systems searched for legal action sequences given initial and goal states.

These were not toys. They demonstrated the genuine, enduring strengths of symbolic computation:

**Structure is guaranteed.** Every step in a symbolic derivation can be inspected, verified, traced. A logical inference chain is either valid or it is not — there is no "probably valid."

**Composition is predictable.** Symbols combine according to precise syntactic rules. If A and B are each well-formed expressions, the semantics of A ∧ B is uniquely determined by the rules of combination. No surprises from putting two valid pieces together.

**Constraints are enforceable.** You can declare "X must be an integer," "Y ranges over [0, 1]," "if A then not B," and the system will obey. Constraints are not suggestions — they are hard rules.

## What symbols cost

Outside closed domains, symbolic systems hit a wall.

**The knowledge acquisition bottleneck.** Expert systems required knowledge engineers to extract what domain experts knew and encode it as rules. But most expertise is tacit — experts know what to do without being able to articulate why. A doctor can diagnose in seconds, but ask her to write the complete decision rules and she will find that much of her judgment resists formalization.

**Combinatorial explosion.** Search spaces grow exponentially with problem dimensions. Chess has roughly 35 legal moves per position; looking 10 moves ahead means 35^10 ≈ 2.7 × 10^15 possibilities. Heuristic search can prune the space, but the heuristics themselves depend on hand-coded domain knowledge — circling back to the acquisition bottleneck.

**Perception and common sense.** Recognizing what is in a photograph, understanding the implicit common sense in an everyday conversation — tasks humans handle effortlessly — proved brutally hard in the symbolic framework. Not because they are impossible in principle, but because the volume and fuzziness of the knowledge involved exceed what anyone can encode by hand.

The "sufficiency" half of the PSSH can be debated in narrow domains. But its "necessity" — that symbol manipulation is the *only* route to intelligence — has been empirically undermined. Systems that use no explicit symbol manipulation now demonstrate genuine intelligent behavior across a widening range of tasks.

!!! info "A debate that continues"

    The necessity of symbols is a minority view today, but it retains serious defenders — particularly in formal verification and explainable AI. Their argument is not "neural networks cannot do these things" but rather "in safety-critical settings, you need verifiable reasoning guarantees, and only symbolic systems provide those." The weight has shifted from "intelligence requires symbols" to "trustworthy intelligence requires symbols."

## What connectionism promised

The other road started from a fundamentally different place.

In 1986, Rumelhart, McClelland, and the PDP Research Group published *Parallel Distributed Processing*, laying out the connectionist program: cognitive processes can be modeled as activation patterns in networks of simple units, with knowledge stored not in explicit rules but distributed across connection weights.

No rules, no symbols, no hand-coded knowledge structures. Just a vast parameter space, a simple learning objective, and lots of data. The network learns its own internal representations from the data.

The core strengths of connectionist systems cover precisely the gaps that symbolic systems leave open:

**Generalization and pattern recognition.** You do not need to tell the network "cats have pointed ears, whiskers, and vertical pupils." Give it enough labeled images and it extracts the features that distinguish cats from dogs on its own — features that are often unnamed combinations of low-level textures and high-level structures that no human engineer would have specified.

**Noise tolerance and graceful degradation.** Symbolic systems tend toward brittle failure when inputs violate preconditions — one unsatisfied rule premise and the entire inference chain collapses. Connectionist systems degrade smoothly — output quality declines gradually rather than dropping to zero.

**Discovery from data.** This is the most fundamental advantage. Symbolic systems need humans to discover structure first, then encode it. Connectionist systems discover structure from raw data on their own — or at least discover something operationally equivalent to structure.

## What connectionism costs

But connectionist systems have their own wall.

**Interpretability.** Why did this neural network make this judgment? Because a particular combination of billions of parameters produced this activation pattern for this input. That is not an "explanation" in any human-useful sense.

**Compositional reliability.** A core strength of symbolic systems is systematicity — as Fodor and Pylyshyn argued in their landmark 1988 paper, any system that can think "John loves Mary" must be able to think "Mary loves John." This compositionality is a structural guarantee of symbolic systems. Whether connectionist systems genuinely possess it remains debated three decades later. Empirical work in 2024 found that LLM compositionality improves with scale but can actually be weakened by instruction tuning — compositionality in connectionist systems is an emergent property, not a structural guarantee.

**Formal constraints.** You cannot declare "the output must be valid JSON" or "this value must be non-negative" in a standard neural network and expect it to comply the way a symbolic system would. The network's output is a sample from a probability distribution, not the exact solution of a constraint satisfaction problem.

## What the Bitter Lesson actually says

In 2019, Rich Sutton wrote a short essay — "The Bitter Lesson." He surveyed seventy years of AI research and identified a recurring pattern:

In chess, researchers invested heavily in encoding strategic understanding — center control, pawn structure weaknesses, king safety. But the system that defeated Kasparov in 1997, Deep Blue, still relied on expert-crafted evaluation functions yet owed its decisive advantage to massive search — evaluating 200 million positions per second. The power of search overwhelmed the power of knowledge encoding.

In Go, the same story replayed two decades later. AlphaGo initially learned from human game records, but its decisive edge came from self-play and Monte Carlo tree search — pouring massive compute into learning. By AlphaGo Zero, even the human game records were no longer needed.

In speech recognition and computer vision, the same pattern. Careful encoding of human knowledge worked in the short term, but was overtaken in the long run by general methods that could absorb more compute.

The pattern is real. Yousefi and Collins's 2024 retrospective of twenty years of CVPR papers further validated its persistence in computer vision.

But Sutton's argument is frequently reduced to a slogan: "never encode human knowledge, brute-force scaling crushes everything." That is a straw man.

What Sutton actually argued is that in the domains he examined, methods that could absorb more compute *eventually* outperformed methods that could not. This is a historical observation about scaling trajectories. He did not say human knowledge is worthless — he said that under exponential compute growth, approaches anchored to fixed human knowledge get caught and surpassed by approaches that scale with compute.

!!! info "The boundary of the Bitter Lesson"

    Whether this pattern generalizes to all domains — safety-critical systems, scientific discovery — remains an open question with serious researchers on both sides. A 2025 synthesis on OpenReview ("From Bitter to Better Lessons in AI") proposed a middle ground: expert knowledge should be treated not as a rival to scaling, but as data that can be injected into learning systems. This dissolves the "knowledge vs. scaling" binary into a continuum.

## Irreducibility

Each road has irreplaceable strengths and irreparable blind spots. The key insight is not "which is stronger" but "they are not doing the same thing."

The structural guarantees, compositional predictability, and constraint enforceability of symbolic systems are not stopgaps needed only because neural networks are not yet powerful enough. They are a specific computational capability: precise manipulation of discrete structures. No matter how powerful neural networks become, you cannot "sample" a formal proof's correctness guarantee from a probability distribution.

The pattern discovery, generalization, and autonomous learning of neural networks are not substitutes needed only because symbolic systems are not yet comprehensive enough. They are a different computational capability: extracting statistical structure from high-dimensional continuous spaces. No matter how sophisticated a symbolic system becomes, you cannot "derive" unforeseen patterns from a set of hand-coded rules.

The two capabilities are irreducible to each other.

Minsky and Papert tried in 1969 to show that connectionist systems were fundamentally limited — they proved mathematical limitations of single-layer perceptrons, but their conjectures about multi-layer networks turned out to be wrong. Searle argued in 1980 with the Chinese Room that symbol manipulation does not equal understanding — the argument still has serious defenders and critics, but the real dispute is about the definition of "understanding," not about the operational capabilities of either system.

These philosophical debates matter. But for engineers, there is a more pressing question.

If two kinds of representation each cover a capability space the other cannot reach, then what about the thing sitting at their intersection today — the large language model? Which side does it belong to?

</div>

---

## Further reading

- Rich Sutton, "The Bitter Lesson" (2019) — The most controversial three pages in seventy years of AI research. Worth reading not just for the argument itself, but for the responses it provoked — especially those that try to dissolve the "knowledge vs. compute" binary into a continuum.
