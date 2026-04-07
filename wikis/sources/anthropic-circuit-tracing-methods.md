# Circuit Tracing: Revealing Computational Graphs in Language Models

- **来源**: `sources/anthropic_official/circuit-tracing-methods.md`
- **URL**: https://transformer-circuits.pub/2025/attribution-graphs/methods.html
- **作者**: Anthropic (Transformer Circuits team)
- **发布**: 2025

## 摘要

提出用于揭示语言模型内部计算机制的方法论。核心思路：构建"可解释替代模型"（replacement model），用跨层转码器（cross-layer transcoder, CLT）替换原模型的 MLP 层，然后追踪稀疏激活特征之间的线性因果链路，生成"归因图"（attribution graph）。

## 方法论要点

1. **跨层转码器（CLT）**：每个特征从某一层的残差流读入，可向所有后续层的 MLP 输出写入。最大 CLT 在 50% 的 prompt 上匹配底层模型的 top-1 token。
2. **局部替代模型**：固定特定 prompt 的注意力模式和归一化分母，加入误差调整项，使替代模型在该 prompt 上精确还原原模型输出。
3. **归因图**：节点 = 活跃特征 + token embedding + 误差项 + 输出 logit；边 = 线性效应。前向传播中特征间的直接交互是线性的（因 MLP 被 CLT 桥接，注意力模式被冻结）。
4. **剪枝**：保留对目标 token 贡献最大的子图，典型压缩率 10x 节点、仅损失 20% 解释力。
5. **超节点（Supernode）**：将功能相近的特征手动分组，简化分析。
6. **验证**：通过扰动实验（抑制/注入特征，观察下游效应）检验归因图发现的可靠性。

## 关键局限

- **缺失注意力电路**：方法捕获 OV-circuits 的信息流，但不解释 QK-circuits（即"为什么注意该位置"）。
- **重建误差**：CLT 不完美重建 MLP 输出，误差可跨层累积。
- **抑制模式识别困难**：当特征的作用是"阻止"某输出时，归因图更难解读。
- **全局权重干扰**：跨 prompt 的全局权重分析比单 prompt 归因图更嘈杂。

## 核心概念贡献

本文为 [mechanistic interpretability](../concepts/mechanistic-interpretability.md) 领域提供了完整的从特征发现到电路追踪的工作流：SAE/CLT 提取特征 → 构建替代模型 → 生成归因图 → 剪枝简化 → 扰动验证。

## References

- `sources/anthropic_official/circuit-tracing-methods.md`
