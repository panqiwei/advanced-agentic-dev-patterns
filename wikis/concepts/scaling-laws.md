# Scaling Laws（缩放定律）

## 定义

LLM 的性能是参数量（N）和训练数据量（D）的可预测、平滑函数。这个关系在对数尺度上近似线性，且目前未见饱和迹象。Scaling laws 是当前 AI 基础设施"军备竞赛"的理论基础——它将模型能力提升从"研究突破"转变为"工程投入"。

## 核心特征

[Karpathy](../entities/andrej-karpathy.md) 在 [2023 年演讲](../sources/karpathy-intro-to-large-language-models.md) 中指出两个关键性质：

1. **可预测性**：给定 N 和 D，可以以极高置信度预测下一词预测精度——算法进步是锦上添花，不是必要条件
2. **无饱和**：到 2023 年为止，性能曲线未出现 plateau，更大的模型 + 更多数据 = 更好的性能

这解释了为什么"Gold Rush"发生在计算层面——不需要研究突破，只需更大的 GPU 集群和更多数据。

## 从下一词预测到涌现能力

Scaling laws 的形式定义基于下一词预测损失。但经验上，这一指标的改善与下游任务表现强相关——从 GPT-3.5 到 GPT-4 的升级中，几乎所有基准测试的表现同步提升。

这种关联不是理论保证，而是经验观察。它暗示下一词预测可能是一种"通用目标"——足够好的下一词预测器需要编码足够多的世界知识。

## 与 Wiki 已有概念的关系

- [LLM-OS Analogy](llm-os-analogy.md) — scaling laws 对应"硬件"层面的摩尔定律类比：计算能力的可预测增长驱动整个生态系统演进
- [LLM Training Pipeline](llm-training-pipeline.md) — scaling laws 主要描述 pretraining 阶段的行为
- [Error Cascade](error-cascade.md) — 即使单步性能随 scale 提升，多步任务中的误差级联效应可能抵消收益

## References

- `sources/karpathy-intro-to-large-language-models.md`
