# Second-order cybernetics

<div class="mm-article" data-card="assets/second-order.png" data-card-alt="Second-order cybernetics" markdown>

What are you doing when you tune a prompt?

Observing the model's output, judging how far it lands from where you want it, modifying the system prompt, observing the new output. The cycle might run for hours. You are a controller operating at the session-level timescale.

But you are also part of the system. Your design decisions shape the system's behavior, and the system's behavior shapes your next design decision. You are inside.

In 1974, Heinz von Foerster drew a line through this phenomenon.

## First order and second order

=== "First-order cybernetics"

    The cybernetics of the observed system. You stand outside, studying how it works. Plant over there, observer over here, clean boundary. The first five articles — from OCP structure to feedback layers — all took this vantage point.

=== "Second-order cybernetics"

    The cybernetics of the observing system. You recognize that the observer is inside the system, and that the act of observing changes the system being observed. Not "I am watching how it runs," but "I am watching how it runs, and my watching changes how it runs next."

The first-order view handles most engineering problems. But some phenomena only come into focus through the second-order lens.

## You are the adaptive controller

The iterative process of tuning a prompt has a name in control theory: **adaptive control** — a controller that adjusts its own strategy in real time based on the behavior of the controlled system.

In classical adaptive control, the controller is an algorithm. In the development of an agentic system, the controller is you — a human engineer, observing behavior, judging outcomes, and adjusting strategy on a session-level timescale. The process of designing the harness is itself a feedback loop, just one that closes far more slowly than the turn level.

Second-order cybernetics describes exactly this structure: no one-way arrow between observer and observed system, only a loop.

## When the system observes itself

More interesting than you tuning a prompt: the model can do something similar on its own.

An agent generates, checks its own work, corrects itself — generator and evaluator are the same model.

??? note "Constitutional AI: self-observation, engineered"

    Constitutional AI pushes this logic into the training layer: the model critiques its own output using a set of principles, generates preference data from its own judgments, and uses that data to train its own reward model. Observer and observed collapse into one.

    Papers, code, quantifiable results all exist — but the approach rests on one premise: the system's self-assessment is reliable enough.

!!! warning "Engineering boundary"

    Self-correction depends on a premise: the model's judgment in the target domain is strong enough to evaluate its own output. If it is not, self-correction can turn correct output into incorrect output — a bad self-assessment is more dangerous than no self-assessment at all.

    Anthropic's circuit-tracing research has found that models sometimes exhibit introspective awareness — they can report what they are doing, and the reports sometimes align with internal computation paths. Whether this constitutes some form of "self-awareness" is a question serious researchers are still debating. For engineering, what matters is not the philosophical verdict but an operational question: on your specific task, is the model's self-assessment accurate?

## Separation principle meets second-order view

[02](02-ocp.md) said the responsibilities of controller and observer should be separated. This article says observer and observed can collapse into one. No contradiction — they speak at different layers.

The separation principle is an engineering guideline internal to the harness: within the same codebase, control components and observation components each do their own job, optimized independently. A first-order view.

The second-order view concerns something else. No matter how you design the harness, you (as the designer) and the system always form a loop — your design affects behavior, behavior affects your next design. This loop cannot be eliminated, only recognized. And recognizing it is understanding why "getting the harness design right" is not a task with an endpoint but an ongoing iterative process.

The perspectives that cybernetics can offer agentic-system engineering are mostly laid out now. One question remains: all these perspectives together — where exactly is the line they draw?

</div>

## Further Reading

- Von Foerster, H. (1974). *Cybernetics of Cybernetics*. University of Illinois.
- Bai, Y. et al. (2022). Constitutional AI: Harmlessness from AI Feedback. [arXiv:2212.08073](https://arxiv.org/abs/2212.08073)
- Anthropic. (2025). Circuit Tracing: Revealing Computational Graphs in Language Models. [transformer-circuits.pub](https://transformer-circuits.pub/2025/attribution-graphs/methods.html)
