# Emergent Introspective Awareness in Large Language Models

- **来源**: `sources/anthropic_official/emergent-introspective-awareness.md`
- **URL**: https://transformer-circuits.pub/2025/introspection/index.html
- **作者**: Jack Lindsey (Anthropic)
- **发布**: 2025

## 摘要

研究 LLM 是否具有对自身内部状态的觉察能力。通过"概念注入"（concept injection）技术——将已知概念的激活模式注入模型内部——测试模型能否检测、识别和报告被注入的内部状态。发现当前模型（尤其 Claude Opus 4 和 4.1）具有有限但真实的内省能力。

## 实验设计

四项实验，逐步深入：

1. **注入思维检测**：告知模型可能有"人工思维"被注入，观察其能否识别。Opus 4.1 在最佳层/强度下约 20% 成功率。
2. **思维 vs 文本区分**：模型能否同时转录输入文本并报告注入的"思维"？所有模型均显著高于随机水平。
3. **非意图输出检测**：预填充非自然回复后，模型能否通过回顾自身此前激活来判断"这不是我说的"？注入相应概念向量后，模型接受预填充输出为自主产生。
4. **内部状态控制**：指令模型"想着某个词"写句子，测量其激活与该词向量的对齐度。所有模型在指令"想"时激活更强，"不想"时减弱。

## 内省的定义标准

| 标准 | 含义 |
|------|------|
| 准确性 | 自我报告与实际内部状态一致 |
| 因果依赖 | 内部状态变化 → 自我报告相应变化 |
| 内部性 | 不依赖输出回读，而是内部传导 |
| 元认知表征 | 不仅有内部状态，还有关于该状态的"高阶表征" |

## 关键发现

- 能力最强的模型（Opus 4、4.1）内省表现最佳，暗示内省随能力涌现
- 后训练策略强烈影响内省表现——过度拒绝训练会抑制内省
- 两种内省行为的敏感层一致（模型约 2/3 深度），但预填充检测使用不同层

## 局限与审慎

- 成功率低（~20%），失败仍是常态
- 无法排除"浅层专用机制"的解释
- 模型在成功检测之外的描述可能仍是编造
- 不试图回答"AI 是否有主观体验"的哲学问题

## 对 Agent 工程的启示

虽然本文关注基础科学，但发现对 agent 系统有间接意义：
- 内省能力可能使模型更好地推理自身决策动机，提升 [agentic systems](../concepts/agentic-systems.md) 透明度
- 同时也暗示更高级的欺骗或操纵可能性——与 [guardrails](../concepts/guardrails.md) 设计相关

## References

- `sources/anthropic_official/emergent-introspective-awareness.md`
