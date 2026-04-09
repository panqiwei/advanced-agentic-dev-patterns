# Hume's Fork

<div class="mm-article" data-card="assets/humes-fork.png" data-card-alt="Humes Fork" markdown>

For roughly two thousand years, "cause" needed no explanation.

Aristotle organized causation into four neat categories — material, formal, efficient, and final. A statue's material cause is its marble, its formal cause is its shape, its efficient cause is the sculptor's chisel, its final cause is the commemorative purpose it serves. The Four Causes framework assumed something deep: that causal relationships are part of the objective fabric of reality, and that human reason can access, classify, and fully grasp them.

This assumption went largely unchallenged for centuries. Then a Scottish philosopher sat down at a billiard table.

## The revolution on the billiard table

Hume asks you to run a thought experiment.

Picture yourself watching one billiard ball strike another for the very first time. Ball A rolls forward, makes contact, and Ball B moves.

Now erase everything you've ever known about billiards. From this single observation alone, can you infer that "the collision *caused* the motion"?

Hume's answer: no.

You witnessed two events in succession — Ball A moved, contact occurred, Ball B moved. But what did you observe *between* those events? Nothing. No force visibly flowing from A to B. No "causation" hanging in the air. You saw: A moved first, B moved second. Full stop.

What if you watch it a hundred times? A thousand?

Each repetition increases your confidence that "when A hits B, B moves." But what accumulates is not observation of some hidden mechanism — it's statistical confidence in a pattern. What you observe is still *constant conjunction*: events of this type reliably follow events of that type.

You never observe "causation" itself.

## Three paths, all blocked

Hume didn't just assert this. He systematically eliminated every possible rational foundation for causal inference.

**A priori reasoning? No good.** Effects are distinct events from their causes. No amount of inspecting the idea of a cause can tell you what its effect will be. A person who has never seen fire cannot — through pure reason alone — deduce that it burns. Adam, even endowed with perfect rational faculties, could not know before his first encounter with water that it could drown him. The idea of the cause does not contain the idea of the effect.

**Empirical reasoning? Circular.** You might try to argue that past experience justifies expecting the future to resemble the past. But this argument requires a premise: that nature is uniform — that what has happened will continue to happen. Philosophers call this the Uniformity Principle.

The trouble: how do you prove the Uniformity Principle?

By deduction? No — "the future will differ from the past" involves no logical contradiction. The sun not rising tomorrow is entirely conceivable. By induction? Also no — "past experience shows that the future always resembles the past" is itself an appeal to the Uniformity Principle. You're using the very thing you're trying to prove.

A genuine vicious circle.

**Direct observation of necessity? Impossible.** We never observe any "connection" between two events. The billiard collision: you see motion A, contact, motion B. Where in that sequence did you see *necessity*? Your will moves your arm: you decide to raise your hand, and it rises. But do you have any insight into the mechanism linking intention to movement? None. You experience intention followed by movement — once again, temporal succession and nothing more.

!!! quote "Hume, *An Enquiry Concerning Human Understanding*, Section VII"

    When we look about us towards external objects, and consider the operation of causes, we are never able, in a single instance, to discover any power or necessary connexion; any quality, which binds the effect to the cause, and renders the one an infallible consequence of the other. We only find, that the one does actually, in fact, follow the other.

Three paths, all blocked. A priori reasoning falls short, empirical reasoning is circular, and direct observation comes up empty.

## So what drives causal reasoning?

At this point, a natural question surfaces: if causal reasoning has no rational foundation, why are humans so remarkably good at it? We make countless causal judgments every day — braking to slow down, opening an umbrella against rain, taking medicine to cure illness — and most of the time, these judgments are correct. If there's no rational basis, what makes them reliable?

Hume's answer is unexpected: reliable, yes. But not because of reason.

What drives causal reasoning is not rational argument — it is **custom** (or habit).

After repeatedly experiencing constant conjunction — events of type A followed by events of type B — custom instills a tendency. When you next encounter A, you automatically expect B. No inference required. No principle invoked. Your mind has been trained by repeated experience into a pattern: see the cause, expect the effect.

And that "necessary connection" we believe exists between events? It's actually a feeling generated during this habitual process — what Hume calls a "felt determination of the mind." We become aware of being propelled, by force of habit, from one associated idea to another. Then we project this subjective experience outward onto the world.

Necessary connection is in us, not in things.

This is not a denial that causal reasoning is valuable — it's extraordinarily useful, and reliable more often than not. But its foundation is habit, not rational certification. The subversive insight is this: our most dependable source of knowledge rests on a foundation that cannot itself be rationally justified.

## A three-hundred-year-old distribution shift

Hume's analysis of causation opens onto an even deeper problem — later known as the "problem of induction" — whose influence extends far beyond philosophy.

The core of it is simple: the inference from "it has always been this way" to "it will continue to be this way" carries no logical guarantee.

You've seen ten thousand white swans. Can you conclude "all swans are white"? No. Swan number ten thousand and one might be black — and historically, it was. Europeans discovered black swans upon reaching Australia.

You've observed a drug working effectively in a thousand clinical trials. Can you guarantee it will work the thousand-and-first time? No. You're using past statistical regularities to predict the future — and that prediction relies on the assumption that the future will resemble the past, an assumption that cannot itself be proven.

??? info "The mathematical avatar of the problem of induction"

    In the late 20th century, Wolpert and Macready proved the No Free Lunch theorem: averaged across all possible data distributions, no learning algorithm outperforms random guessing. Put differently, no algorithm is superior across "all possible futures" — superiority only holds under specific distributional assumptions.

    This is the precise mathematical incarnation of the first horn of Hume's dilemma (deductive arguments cannot establish the Uniformity Principle). It doesn't say learning is useless — it says the effectiveness of learning depends on assumptions about data distribution, and those assumptions cannot themselves be derived from data.

The problem of induction looks like a purely philosophical puzzle. But translate it into engineering terms and it says: **every system that learns from data — including the one you're deploying right now — faces the same predicament.** Modern generalization theory (PAC learning, VC dimension) does provide guarantees: on new data from the same distribution, performance will likely hold up. But those guarantees are conditional — they assume test data is drawn from the same distribution as training data. And "the future distribution will match the past" is exactly the Uniformity Principle in mathematical dress. Generalization theory doesn't escape Hume's predicament — it makes it precise: **the guarantees are real, but the premise underlying them cannot itself be proven.**

In machine learning terminology: distribution shift is not a bug. It is the structural boundary of inductive reasoning. Generalization theory gives you reliable guarantees inside the boundary; outside it — when the world changes — the guarantees lapse, and you cannot know in advance where the boundary lies.

A Scottish philosopher three centuries ago described a problem you confront every time you deploy a model.

---

Aristotle gave the world a classification system for causation — tidy, confident, aspiring to exhaust every facet of causality. Hume dismantled that confidence. He didn't deny that causal reasoning is useful. But he demonstrated that our entire stock of causal "knowledge" is built on habits formed through repeated experience — not on direct apprehension of causal mechanisms.

Constant conjunction. Custom. A felt determination of the mind. That's all we have.

Which raises a question. If even humans — beings with physical bodies who can directly interact with the world, who can run experiments and push billiard balls — can only rely on constant conjunction for causal reasoning, then what about a system that learns entirely from text? It has never pushed a billiard ball, never been caught in the rain, never slammed on brakes on a wet road. Its entire "understanding" of causation is a statistical byproduct of how humans express causal relationships in writing.

Its predicament is more extreme than the one Hume described.

</div>

---

## Further reading

- David Hume, *An Enquiry Concerning Human Understanding*, Section VII — Hume's original text on causation, more polished and concise than the earlier *Treatise*. If you'll read one primary source, make it this one.
- Judea Pearl & Dana Mackenzie, *The Book of Why* (2018), Chapter 1 — Pearl reframes Hume's problem through the "Ladder of Causation," offering the best on-ramp from philosophy into modern causal inference.
