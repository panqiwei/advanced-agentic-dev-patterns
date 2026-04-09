# The Ocean of Correlation

<div class="mm-article" markdown>

Hume proved something unsettling: even humans — equipped with physical bodies and the ability to directly manipulate the world — have never actually observed causation itself. All we have is constant conjunction and habit.

So what happens when you take a system that learns entirely from text?

## What next-token prediction actually learns

The training objective of a large language model fits in one sentence: given the preceding context, predict the probability distribution over the next token.

Elegant in its simplicity. But what does this objective function learn?

When the model repeatedly encounters "rain" followed by "slippery" and "slippery" followed by "accident" in its training data, it learns the statistical co-occurrence patterns of these token sequences. The probability of "slippery" following "rain" becomes higher than the probability of "sunny." This is a statistical fact about text distribution, not a causal judgment about the physical world.

In Hume's vocabulary: next-token prediction learns **constant conjunction at the token level**.

"Rain" is followed with high probability by "slippery" — because these two concepts appear in close proximity throughout the training corpus. The model develops a tendency — a *habit*, if we allow ourselves the word — to expect "slippery" upon encountering "rain."

The structural parallel to Hume's account of human causal reasoning is striking. Humans form habitual expectations from constant conjunction and mistake those expectations for causal knowledge. LLMs learn statistical regularities from token co-occurrence and output those regularities dressed in causal narrative.

The difference lies in the available channels. Humans have at least one escape route — you can intervene. You can push the billiard ball yourself and watch what happens. An LLM has no such channel. Its entire experience comes from text. It has never been rained on, never felt brakes lock on wet asphalt. Its entire "grasp" of causal relationships is a statistical byproduct of how humans have described those relationships in writing.

## The surprising power of constant conjunction

But honesty demands acknowledging something else: statistical co-occurrence is far more powerful than intuition suggests.

In natural language, causal relationships and statistical correlations overlap heavily. If two things frequently co-occur in human-authored text, there's a good chance some causal link does exist between them — because humans tend to put related things together when they're writing about meaningful relationships.

This is why a model that "merely" learns statistical co-occurrence can produce output that closely resembles causal reasoning. It doesn't need to understand causal mechanisms — it only needs to learn the linguistic patterns humans use when expressing causal relationships. And since humans get causation right most of the time, the model's "causal narratives" are also right most of the time.

This is not a coincidence, nor is it magic. It is the natural result of statistical co-occurrence operating on high-quality data. Constant conjunction is not a weak signal — in carefully organized human text, it is an extremely strong one.

## Where the signal distorts

But "most of the time" is not "always." And the failures are not random — they have structure.

**The rooster problem.** A rooster crows before sunrise. If all you can learn from data is correlation, the constant conjunction between crowing and sunrise is enough to suggest "the rooster's crow causes the sun to rise." Nobody actually believes this. But shift the scenario to a less intuitive domain — an API metric that always spikes before a service goes down — and the line between "correlated with" and "caused by" becomes much harder to draw.

**Simpson's paradox.** A drug appears effective in men and effective in women when tested separately, but ineffective — or even harmful — in the combined data. Or the reverse. This is not a data error — it happens when you fail to control for a confounding variable. Purely correlation-based reasoning will systematically give you the wrong answer in these situations.

**Collider structures.** Two independent causes both influence a single outcome. When you condition on that outcome (filter your data by it), a spurious correlation appears between the two originally independent causes. This is one of the most classical traps in causal reasoning.

??? info "Engineering intuition for colliders"

    Picture a hiring pipeline. Candidates who reach the final round are either technically exceptional, or exceptional communicators (or both). If you only look at final-round candidates, you'll observe a *negative* correlation between technical skill and communication skill — the highly technical ones seem to communicate poorly, and the strong communicators seem technically weaker.

    But this isn't real. In the full candidate pool, the two abilities may be completely independent. The negative correlation is a selection artifact created by the collider variable ("reached the final round").

    This isn't hypothetical. When LLMs face collider structures, they systematically get the wrong answer — the specific benchmark evidence is laid out in the next article.

These are not edge cases. They are structural blind spots of correlational reasoning — areas that no amount of statistical precision can cover. Not because the data is insufficient, but because correlation as a signal simply lacks the resolution.

## Looking at mechanism, not taking sides

Whether LLMs possess genuine causal reasoning ability is an open and active debate among serious researchers.

Some studies find that LLMs perform surprisingly well on certain causal reasoning benchmarks. Others argue that this performance reflects memorized causal knowledge from training data rather than genuine reasoning — pointing out that performance drops significantly when confronted with novel causal structures from after the training cutoff. A preliminary 2025 study used structural causal models to measure the causal structure of LLMs' internal reasoning, finding that standard LLMs fall substantially short of the ideal causal structure.

This debate is far from settled, and its conclusions will matter for engineering practice. But pending its resolution, one thing can be stated from the mechanism: the pretraining objective — next-token prediction — does not distinguish "B because of A" from "A and B frequently co-occur." Post-training stages (RLHF, RLVR) introduce additional signals — human preferences, reasoning correctness — that may implicitly encode some causal structure. The research mentioned above does find that RLVR training narrows the gap with ideal causal structure. But even then, the gap remains significant, and you have no mechanistic way to judge whether it's small enough in the specific case you care about.

In engineering terms: the system in front of you cannot be trusted by default on causal reliability. It may get many causal inferences right — pretraining captures causal signals in statistical co-occurrence, post-training may further sharpen those signals — but you lack a reliable way to tell whether any particular inference is causal reasoning or pattern matching.

## The ocean's edge

The ocean of correlation is vast and useful.

Most everyday tasks don't require rigorous causal reasoning. "Help me write an email" — the model gives you statistically appropriate phrasing. Good enough. "Complete this line of code" — the model gives you the most common pattern in similar contexts. Usually sufficient. "Summarize this document" — the model extracts the most salient information. No problem.

The reason correlation suffices is not that it equals causation — it's that in these scenarios, being wrong is cheap.

But the ocean has an edge. When you need to answer *why* rather than merely *what*, when you face irreversible decisions, when you need to distinguish "happens to co-occur" from "one causes the other" — you find the water growing shallow, correlation's resolution no longer sufficient.

You need a ladder — to climb from the ocean's surface to higher ground.

That ladder has already been built.

</div>

---

## Further reading

- Zhizhang Fu et al., "Correlation or Causation: Analyzing the Causal Structures of LLM and LRM Reasoning Process" (2025) — The first study to measure the causal structure inside LLM reasoning using structural causal models. Standard LLMs fall substantially short of the ideal causal structure, while RLVR-trained reasoning models close much of the gap. The methodology matters more than the specific numbers.
