# Orthogonal decomposition: where should your force point

<div class="mm-article" data-card="assets/orthogonal-decomposition.png" data-card-alt="Orthogonal decomposition" markdown>

The force's direction is visible, and it may be turning. Back to the question [the first piece](01-the-forces.md) left open:

!!! question "The question"

    **Where should your force point?**

## Aligned forces

Picture two forces acting on the same object, pointing in the same direction. The resultant is large. But when one force keeps growing, the marginal contribution of the other shrinks.

If the engine already delivers 500 horsepower, strapping a small fan to the roof to blow forward does technically increase the resultant. But the fan barely matters. Worse, when the engine upgrades to 1,000 horsepower, the fan is not just useless — its weight becomes drag.

Map this to agentic systems: if what you do at the harness layer points in the same direction as model capability growth — compensating for a capability dimension the model currently lacks — then every time the model gets stronger along that dimension, your work erodes a little.

Remember the Anthropic line?

> "Assumptions about what Claude can't do need to be re-tested with each step change."

Translated into mechanics: **the shelf life of a force aligned with model capability depends on the interval between model upgrades.**

!!! info "Depreciating investment"

    This does not mean the work has no value — right now, with models not yet strong enough, it is necessary. But you should be clear-eyed about what it is: a **depreciating** investment, not a **compounding** one. Its value decays as the model gets stronger.

## Orthogonal forces

Now picture two forces at 90 degrees to each other.

In this configuration, each force does independent work along its own axis. Neither interferes with the other. No matter how strong one force becomes, the other's contribution is completely unaffected. The resultant is not a simple sum but a vector sum — the system gains an additional degree of freedom.

Map this to agentic systems: there are things you can build whose value **does not depend on how strong the model is today or how strong it will be tomorrow.** Whether reasoning capability increases tenfold, whether context windows expand to infinity, whether the architecture shifts from Transformer to energy-based models or world models — these things still have independent value.

They are orthogonal to model capability.

## A criterion, not an answer

I am not going to list "which things are orthogonal." The reason is simple: if I did, it would be another list with an expiration date.

What I will give you is a **criterion:**

For any harness engineering decision you are making or about to make, ask yourself one question —

!!! tip "The orthogonality test"

    **If the model suddenly became ten times stronger on this dimension tomorrow, would what I am doing today become more valuable, or unnecessary?**

    - If the answer is "unnecessary" — your force is aligned with the model's force. You are making a depreciating investment. Not wrong to do, but know its shelf life.
    - If the answer is "unaffected, or even more valuable" — your force is orthogonal to the model's force. This is a compounding investment. Every unit of effort adds a degree of freedom that the model cannot provide on its own.
    - If the answer is "I am not sure" — that is a useful discovery too. Go back to [the previous article](04-where-is-it-going.md) and look at the model capability evolution vector. Think about the projection of your work onto that vector. Large projection, be cautious. Projection near zero, you are in good shape.

</div>

---

Do not fight a force you cannot control. Find the direction perpendicular to it, and do what it cannot.

## Further Reading

- Anthropic. (2026). Harnessing Claude's Intelligence. [claude.com/blog](https://claude.com/blog/harnessing-claudes-intelligence)
