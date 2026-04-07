# Jamba: AI21's SSM-Transformer Hybrid Model

- **来源**: `sources/ai21-jamba.md`
- **URL**: https://www.ai21.com/blog/announcing-jamba/
- **作者**: AI21 Editorial Team
- **发布**: 2024-03-28

## 摘要

AI21 发布 Jamba，首个生产级 Mamba-Transformer 混合架构模型。通过将 SSM 层（Mamba）与 Transformer 注意力层和 MoE（混合专家）层结合，在吞吐量、内存效率和质量之间同时优化。

## 架构创新

- **块-层结构**：每 8 层中 1 层为 Transformer attention，其余为 Mamba 层
- **MoE 集成**：总参数 52B，推理时仅激活 12B，活跃参数效率高于同规模纯 Transformer
- **长上下文**：256K context window，单 80GB GPU 可容纳 140K context

## 性能亮点

- 长 context 场景下吞吐量为 Mixtral 8x7B 的 3 倍
- 在同规模模型的多个基准测试上达到或超越 SOTA
- Apache 2.0 开源

## 与其他架构源的关联

Jamba 是 [Mamba-3](cartesia-mamba-3.md) 论文中"混合架构优于纯模型"判断的早期验证。Mamba-3 进一步预测混合架构将成为主流。

## 对 Agent 工程的意义

混合 SSM-Transformer 架构的长 context + 高吞吐特性直接利好 [long-running agents](../concepts/long-running-agents.md) 和 [context management](../concepts/context-management.md)——更长的有效 context 意味着更少的 compaction 需求，更高的吞吐意味着更低的运行成本。

## References

- `sources/ai21-jamba.md`
