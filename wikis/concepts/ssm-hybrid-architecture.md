# SSM-Hybrid Architecture（SSM 混合架构）

## 定义

SSM-Hybrid Architecture 是将状态空间模型（SSM，如 Mamba）与 Transformer 注意力层结合的模型架构范式。利用 SSM 的线性时间复杂度处理长序列，同时保留注意力机制的精确检索能力。

## 核心权衡

| | SSM（纯） | Transformer（纯） | 混合架构 |
|---|---|---|---|
| 序列长度扩展 | 线性 O(n) | 二次方 O(n^2) | 接近线性 |
| 检索能力 | 弱（固定状态压缩） | 强（KV cache 全量存储） | 强 |
| 推理效率 | 高 | 随 context 增长而降低 | 高 |
| 内存占用 | 固定 | 随 context 线性增长 | 介于两者之间 |

关键洞察：SSM 的固定大小状态是一把双刃剑——推理高效，但迫使模型将所有历史压缩到一个表征中，与 Transformer 的 KV cache（全量存储）形成根本对立。

## Mamba 系列演进

### Mamba-2 (2024)

围绕**训练效率**设计，简化 SSM 机制实现 2-8 倍训练加速。代价：解码步骤"过于简单"，GPU 大部分时间在搬运内存。

### Mamba-3 (2026)

[推理优先](../sources/cartesia-mamba-3.md) 的设计转向。三大改进：
1. 指数梯形离散化 → 更丰富的递归表达力
2. 复数值 SSM → 增强状态追踪
3. MIMO SSM → 不增加状态大小即提升性能

所有改进受启发于**经典控制论和状态空间模型文献**——逆当前线性注意力/测试时训练的潮流。

Mamba-3 的核心预测：**线性层将主要与全局自注意力层结合使用**，即混合架构将成为主流。

### Jamba (2024)

[AI21 的首个生产级混合模型](../sources/ai21-jamba.md)。架构：每 8 层中 1 层 Transformer attention + 7 层 Mamba + MoE。52B 总参数 / 12B 活跃参数。256K context window，单 GPU 可容纳 140K context。

## 推理效率的 Agent 工程意义

Mamba-3 的动机直接源于 agentic 工作流的推理需求爆发（Codex、Claude Code、OpenClaw）。对 agent 系统而言：

- **成本**：[长时运行 agent](long-running-agents.md) 的推理成本直接影响可行性
- **延迟**：实时交互场景对每步延迟敏感
- **上下文长度**：更高效的长序列处理减少 [context management](context-management.md) 的压力

## 非自回归替代方案

除 SSM-Transformer 混合外，NVIDIA 的 [能量扩散语言模型](../sources/nvidia-energy-based-diffusion-lm.md)（EDLM）探索了完全不同的方向——用能量模型 + 离散扩散实现非自回归文本生成，已接近自回归模型的困惑度。这代表了对"下一个 token 预测"范式的根本挑战。

## 相关概念

- [Long-running agents](long-running-agents.md) — 推理效率直接影响运行成本
- [Context management](context-management.md) — 长序列处理能力影响 compaction 策略
- [Implicit loop architecture](implicit-loop-architecture.md) — 每步推理延迟影响循环速度

## References

- `sources/cartesia-mamba-3.md`
- `sources/ai21-jamba.md`
