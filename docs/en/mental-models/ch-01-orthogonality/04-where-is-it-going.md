# Is the force changing direction

<div class="mm-article" data-card="assets/where-is-it-going.png" data-card-alt="Is the force turning" markdown>

Knowing the model is getting stronger is not enough. If the force were just growing along the same direction, you could pick a fixed orthogonal direction and get to work.

But what if it is getting stronger **and** turning at the same time? That is a different engineering problem.

## The current mainstream: Transformer

The dominant architecture today — the Transformer — is built on one core mechanism: self-attention. Every token can "see" every other token in the context, and computes its representation accordingly. This is where your context window comes from: how much the model can see depends on how long a sequence the attention mechanism can cover.

An LLM built on the Transformer architecture is, at bottom, a statistical model over text sequences. Through next-token prediction it has learned the structure, knowledge, and reasoning patterns of human language. It is powerful — but "understanding the world by predicting text" is only one way to encode the world.

At least three other paths are evolving.

## Four ways to encode the world

| | Transformer | State space model (SSM) | Energy-based model (EBM) | World model |
|---|---|---|---|---|
| **In one line** | A completer that has read all text | A stream processor with finite memory | A judge scoring global compatibility | An imaginer that simulates physical consequences |
| **Modeling objective** | Given prior context, which next token is most likely | How to compress all history into a fixed-size state vector | How plausible is this entire configuration | If I take this action, what does the world become |
| **How it "understands" the world** | Extracts statistical regularities from text co-occurrence | Models sequence dynamics as state evolution | Searches for low-energy states in a global configuration landscape | Learns causal structure and state transitions |

??? note "State space models (SSM)"

    Represented by the Mamba family. Inspired by dynamical systems from control theory: a fixed-size hidden state evolves over time, and each new input determines how the state updates — what to keep, what to forget.

    The difference from Transformers is fundamental. Transformers store all past tokens in a structure called the KV cache (think of it as "conversation memory") and let every token randomly access any prior information. SSMs compress the full history into a fixed-size state vector — constant memory, but lossy. Faster and more memory-efficient on very long sequences, but weaker at precise retrieval.

    The Mamba-3 authors (2025) themselves acknowledged: "linear layers will predominantly be used in conjunction with global self-attention layers." The industry consensus is converging on **hybrid architectures** — for example, AI21's Jamba: 7 Mamba layers per 1 attention layer, 256K context on only 4GB of KV cache, 3x the throughput of comparable Transformers.

??? note "Energy-based models (EBM)"

    Represented by Yann LeCun's JEPA architecture. A completely different approach: instead of sequential prediction, define an energy function that scores entire input configurations — low energy means "compatible, plausible," high energy means "contradictory, unnatural."

    Inference is not "sample one token at a time" but "find low-energy states in the energy landscape" — fundamentally an optimization process, not a sampling process. JEPA variants operate in embedding space: they predict learned abstract representations rather than raw pixels or text, forcing the model to discard irrelevant detail and focus on structure.

    LeCun left Meta in late 2025 to found AMI Labs, which raised $1B at a $3.5B valuation in March 2026 — specifically to pursue energy-based world models.

??? note "World models"

    These aim to close the gap between *describing* causality and *modeling* causality. When an LLM says "gravity makes objects fall," it is because the training text contained that sentence and variations of it — what the model learned is a linguistic description of causality. A world model's goal is to learn the actual dynamics of physics: objects persist, gravity pulls down, collisions transfer momentum, actions have consequences.

    DeepMind's Genie 3 generates interactive 3D worlds through frame-by-frame prediction, and emergent intuitive physics (gravity, collisions, object permanence) appears within them. NVIDIA's Cosmos platform trains physical AI on over 20 million hours of real-world data. Short-horizon physical simulation works today — but long-horizon general planning and reasoning remains an open frontier.

## Not mutually exclusive

You might assume these are four diverging paths, and someday one will win. The actual picture is more interesting.

A late-2025 paper proved that autoregressive models and energy-based models have a **bijection** in function space — connected through the soft Bellman equation from maximum-entropy reinforcement learning. Every autoregressive model implicitly defines an energy function, and vice versa. This is a mathematical equivalence, not an engineering one — training methods, inference costs, and practical applications still differ widely. But it shows these paths share deeper theoretical roots than they appear to.

SSMs are converging with Transformers in practice, not replacing them. Current world model implementations are largely built on top of Transformer architectures. These paths are merging, not forking.

## What this means for harness engineering

But they do represent **different directions for the force.**

!!! warning "If these directions materialize"

    - If future models can natively simulate causal relationships (world models), the chain-of-thought scaffolding you build at the harness layer — where you are essentially doing the model's planning for it — may become unnecessary.
    - If future models can operate over lossless infinite context (the SSM limit case), the context window management strategies you carefully designed — compression, summarization, forgetting, retrieval — may become unnecessary.
    - If future models can globally evaluate the plausibility of an entire configuration (EBM), the step-by-step reasoning pipelines you built to make the model "think through" problems may become unnecessary.

These are "may," not "will." These architectures are still early — LeCun's AMI Labs just closed its round; pure SSMs still underperform Transformers on retrieval-heavy tasks; long-horizon reasoning and planning in world models remains a research frontier, not engineering reality.

But the trend is visible: models are trying to encode the world at a more fundamental level than next-token prediction.

This force is not just growing stronger. It may be **turning.**

</div>

## Further Reading

- Hounie, I., Dieng, A. B., & Dathathri, S. (2025). Autoregressive Language Models Are Secretly Energy-Based Models. [arXiv:2512.15605](https://arxiv.org/abs/2512.15605)
- Gu, A. & Dao, T. (2023). Mamba: Linear-Time Sequence Modeling with Selective State Spaces. [arXiv:2312.00752](https://arxiv.org/abs/2312.00752)
- Cartesia. (2025). Mamba-3: An Inference-First State Space Model. [blog.cartesia.ai](https://blog.cartesia.ai/p/mamba-3)
- AI21 Labs. (2024). Jamba: AI21's Groundbreaking SSM-Transformer Model. [ai21.com](https://www.ai21.com/blog/announcing-jamba/)
- Meta AI. (2023). I-JEPA: The First AI Model Based on Yann LeCun's Vision for More Human-Like AI. [ai.meta.com](https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/)
- NVIDIA Research. (2025). Energy-Based Diffusion Language Models for Text Generation. [research.nvidia.com](https://research.nvidia.com/publication/2025-01_energy-based-diffusion-language-models-text-generation)
- LeCun, Y. / AMI Labs. (2026). AMI Labs raises $1B at $3.5B valuation to build energy-based world models. [source](https://tech-insider.org/yann-lecun-ami-labs-1-billion-world-models-2026/)
- Introl. (2026). World Models Race 2026: LeCun, DeepMind, and Beyond. [introl.com](https://introl.com/blog/world-models-race-agi-2026)
