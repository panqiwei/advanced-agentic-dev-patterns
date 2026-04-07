# Mamba-3: An Inference-First State Space Model

- **来源**: `sources/cartesia-mamba-3.md`
- **URL**: https://blog.cartesia.ai/p/mamba-3
- **作者**: Cartesia (Albert Gu)
- **发布**: 2026

## 摘要

Mamba-3 是状态空间模型（SSM）系列的最新迭代。如果说 Mamba-2 围绕训练效率设计，Mamba-3 则明确为**推理优先**而构建——响应后训练、部署和 agentic 工作流对推理吞吐的爆发需求。

## 三大核心改进

| 改进 | 技术 | 效果 |
|------|------|------|
| 更丰富的递归 | 指数梯形离散化 | 提升 SSM 表达力，隐式卷积取代外部短卷积 |
| 复数值 SSM | 通过 RoPE 实现复数转移矩阵 | 增强状态追踪能力 |
| MIMO SSM | 多输入多输出并行 SSM | 不增加状态大小，提升性能和检索能力 |

三项改进均受启发于**经典控制论和状态空间模型文献**，逆当前线性注意力/测试时训练的潮流。

## 推理效率

在 1.5B 规模下，Mamba-3 SISO 在所有序列长度上实现最快的 prefill + decode 延迟，超越 Mamba-2、Gated DeltaNet，甚至 Transformer (vLLM)。关键洞察：当前线性模型的解码步骤计算量太少，GPU 大部分时间在搬运内存——增加每步 FLOPs 对推理延迟几乎无影响，因为可以利用闲置计算核心。

## 混合架构预测

> "我们预测线性层将来主要与全局自注意力层结合使用。"

固定大小状态导致 SSM 在检索任务上天然弱于 Transformer。混合架构（线性层的记忆性 + 注意力的精确存储）在经验上优于纯模型。

## 与 Agent 工程的关联

Mamba-3 的动机直接源于 agentic 工作流的推理需求——文中明确提到 Codex、Claude Code、OpenClaw 推动推理需求的爆发。对 [long-running agents](../concepts/long-running-agents.md) 而言，推理效率直接影响运行成本和响应延迟。

## References

- `sources/cartesia-mamba-3.md`
