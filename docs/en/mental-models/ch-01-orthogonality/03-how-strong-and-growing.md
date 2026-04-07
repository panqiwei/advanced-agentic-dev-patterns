# How strong is this force, and is it still growing

<div class="mm-article" data-card="assets/concentric-capabilities.png" data-card-alt="Concentric capabilities" markdown>

The mechanism is clear now, but knowing "it does next-token prediction" is not enough. You need a feel for the magnitude of this force, and how fast it is increasing.

## Not a line — concentric rings

If you only look at benchmark score charts, model capability growth looks like a steep line going up. But that line hides a more interesting structure: **capability is not just climbing on one dimension. It keeps unlocking new dimensions.**

Think of it as concentric rings expanding outward — each new capability layer stacks on top of all previous ones. Earlier rings do not disappear; they become the foundation for the next.

| Period | Capability dimension unlocked | Landmarks |
|------|------|------|
| 2020–2022 | Text fluency and knowledge | GPT-3 showed that scale alone produces emergent capabilities; PaLM confirmed it |
| 2022–2023 | Instruction following and alignment | ChatGPT used RLHF (reinforcement learning from human feedback) to make models usable; Claude 1 was designed around safety alignment |
| 2023 | Reasoning + multimodal (unlocked in parallel) | GPT-4 brought a reasoning leap and vision input at the same time; Gemini 1.0 was natively multimodal; Claude 2 pushed context to 200K |
| 2023–2024 | Tool use and structured output | Function calling, Claude tool use, JSON mode — note that this came **before** extended reasoning |
| 2024–2025 | Test-time compute / deep thinking | o1 introduced the "thinking tokens" paradigm; DeepSeek-R1 proved open source could do it too; Claude extended thinking lets the model "think before answering" |
| 2025–2026 | Model's agentic capabilities | Claude Code supports agent teams working in parallel; OpenAI Codex runs autonomously in cloud sandboxes; Claude Opus 4.6 leads GPT-5.2 by ~144 Elo on GDPval-AA (economic knowledge work evaluation) |

!!! note "Stacking, not replacing"

    Each row does not replace the row above it — it **stacks** on top. A 2026 model is not just "more agentic." It is simultaneously more fluent, more aligned, better at reasoning, more multimodal, better at tool use, and better at deep thinking. All six dimensions are growing at once; each period just happens to be the one where a new dimension gets unlocked.

## Three years, one product line

Let us make this growth concrete with a single product line.

=== "March 2023: Claude 1"

    Context window: 9K tokens — roughly enough for one medium-length article. Capabilities: conversational, could write text, some reasoning ability but nothing you would call reliable. No vision, no tool use, no deep thinking.

=== "February 2026: Claude Opus 4.6"

    Context window: 1M tokens — **111 times** Claude 1. Output ceiling: 128K tokens. Supports adaptive thinking (the model decides on its own when deep reasoning is needed). In agent teams mode, multiple agent instances collaborate in parallel on complex tasks. Top score on Terminal-Bench 2.0 for agentic coding. Industry-leading on knowledge work evaluations in finance and law.

Three years. Same company, same product line. From "can chat" to "can assemble a team and autonomously complete complex software engineering tasks."

## Cautious optimism

The force is still growing — current evidence supports this. But the sources of growth are diversifying:

- Pre-training scale continues to advance, but has hit a bottleneck in high-quality data. The industry response: synthetic data, aggressive data curation, and multi-epoch training.
- **Test-time compute** has become a new scaling axis. Letting the model "think longer" sometimes matches the effect of a 10–100x increase in model size — and this path has a long way to go.
- The model's own agentic capabilities keep improving — better planning, longer autonomous execution, more reliable self-correction.

The direction is roughly visible — deeper reasoning, longer context, more modalities, more reliable autonomous execution. But the timeline is anyone's guess.

Anthropic, in a blog post about how to build well with Claude, wrote:

> "The frontier of Claude's intelligence is always changing. Assumptions about what Claude can't do need to be re-tested with each step change."

Remember that line. We will translate it into the language of mechanics shortly.

This force is not just getting stronger — might its **direction** also be changing?

</div>

## Further Reading

- Kaplan, J., McCandlish, S., Henighan, T., et al. (2020). Scaling Laws for Neural Language Models. [arXiv:2001.08361](https://arxiv.org/abs/2001.08361)
- Hoffmann, J., Borgeaud, S., Mensch, A., et al. (2022). Training Compute-Optimal Large Language Models. [arXiv:2203.15556](https://arxiv.org/abs/2203.15556)
- Anthropic. (2026). Introducing Claude Opus 4.6. [anthropic.com](https://www.anthropic.com/news/claude-opus-4-6)
- OpenAI. (2025). Introducing Codex. [openai.com](https://openai.com/index/introducing-codex/)
- Anthropic. (2026). Models Overview. [platform.claude.com](https://platform.claude.com/docs/en/docs/about-claude/models)
