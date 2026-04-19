# World Models（世界模型）

## 定义

世界模型是学习物理现实表征的 AI 系统——不预测下一个 token，而是预测给定动作后环境的下一个状态。核心能力：规划（模拟结果后再行动）、物理推理（理解质量、动量、空间关系）、因果理解、持久记忆。

LeCun 的表述："你的心智模型，关于世界如何运转。你可以想象一系列可能采取的行动，世界模型让你预测这些行动对世界的影响。"

## LLM 的局限与世界模型的回应

[World Models Race 2026](../sources/introl-world-models-race-2026.md) 综述了核心论点：

| LLM 局限 | 根因 | 世界模型的回应 |
|----------|------|--------------|
| 事实幻觉 | 无验证知识库 | 基于物理一致性的生成 |
| 物理推理失败 | 无具身经验 | 从观察中学习物理规律 |
| 因果混淆 | 模式匹配而非理解 | 动作-结果预测训练 |

## 关键方法

### I-JEPA

[Meta 的 I-JEPA](../sources/meta-i-jepa.md) 是世界模型方向的理论基础之一。核心创新：在表征空间（而非像素空间）预测被遮挡的图像区域，构建"原始世界模型"。LeCun 的 AMI Labs 在此基础上扩展。

### 视频生成即世界模拟

视频生成和世界模型的边界模糊：DeepMind 的 Genie 3（24fps 实时 3D 世界生成）、OpenAI 的 Sora 2（物理合规视频）、NVIDIA Cosmos（自动驾驶/机器人合成训练数据）都在将视频生成推向物理模拟。

## Othello 世界模型假说：联结主义涌现符号结构

[Li et al. (2022)](../sources/2210.13382-emergent-world-representations-othello-gpt.md) 首次发现：仅在 Othello 着手序列上训练的 GPT 变体（OthelloGPT），在其激活中自发形成了棋盘状态的非线性表征，且因果性地影响下游预测。[Yuan & Søgaard (2025)](../sources/2503.04421-revisiting-othello-world-model-hypothesis.md) 将此扩展到 7 个 LLM，用跨模型 Procrustes 对齐替代探针，发现：

- 无监督对齐精度高达 **99%**，跨架构余弦相似度 93–96%
- 不同架构收敛到**相同的表征吸引子**
- 棋盘状态精度高但 2-hop 规划退化——**世界模型 ≠ 战略深度**

机制层面，jylin04 (2024) 的 MATS 分析发现 OthelloGPT 的计算机制可能是**局部启发式规则的聚合**，而非统一的棋盘追踪算法——表征准确性与算法统一性是不同维度的问题。

详见：[Othello 世界模型假说](othello-world-model-hypothesis.md)

## LLM 内部的时空表征：世界模型的实证线索

[Gurnee & Tegmark (2023)](../sources/2310.02207-language-models-represent-space-and-time.md) 提供了迄今最直接的证据：Llama-2 系列模型在内部自发形成了真实世界的空间（经纬度）和时间（历史年代）的**线性结构化表征**。

关键数据：Llama-2-70B 对世界地点坐标的线性探针 R² = 0.911；对历史人物死亡年 R² = 0.835。非线性探针相比线性探针几乎无提升，说明编码方式是几何意义上的线性。

这与"随机鹦鹉"论点直接对立——一个只学表面统计的系统无法涌现出如此精确且统一的坐标表征。但作者谨慎地指出：这是世界模型的"基本成分"，而非完整的动态因果世界模型。

详见：[时空世界模型](spatiotemporal-world-model.md)

## 与 Agent 工程的关系

世界模型对 [agentic systems](agentic-systems.md) 的多模态演进有重要启示：

- **规划增强**：世界模型可为 agent 提供"心理预演"能力——在行动前模拟结果
- **具身 agent**：机器人和自动驾驶 agent 需要物理理解，LLM 无法直接提供
- **互补而非替代**：LLM 处理语言推理和工具使用，世界模型提供物理环境理解

但目前世界模型尚处早期，与文本 agent 工程的交叉有限。

## 相关概念

- [Agentic systems](agentic-systems.md) — 世界模型可能成为未来 agentic 系统的感知层
- [时空世界模型](spatiotemporal-world-model.md) — LLM 内部时空表征的具体实证
- [线性表征假说](linear-representation-hypothesis.md) — 时空表征的方法论基础
- [机制可解释性](mechanistic-interpretability.md) — 探测世界模型成分的研究工具

## 相关概念

- [Othello 世界模型假说](othello-world-model-hypothesis.md) — 序列模型涌现棋盘表征的受控实验链

## References

- `sources/introl-world-models-race-2026.md`
- `sources/meta-i-jepa.md`
- `sources/arxiv_papers/2310.02207-language-models-represent-space-and-time.md`
- `sources/arxiv_papers/2210.13382-emergent-world-representations-othello-gpt.md`
- `sources/arxiv_papers/2503.04421-revisiting-othello-world-model-hypothesis.md`
- `sources/othellogpt-bag-of-heuristics-jylin04-mats2024.md`
