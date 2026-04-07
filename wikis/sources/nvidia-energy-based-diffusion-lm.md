# Energy-Based Diffusion Language Models for Text Generation

- **来源**: `sources/nvidia-energy-based-diffusion-lm.md`
- **URL**: https://research.nvidia.com/publication/2025-01_energy-based-diffusion-language-models-text-generation
- **作者**: Minkai Xu, Tomas Geffner, Karsten Kreis, Weili Nie 等 (Stanford / NVIDIA)
- **发布**: 2025-01 (ICLR 2025)

## 摘要

提出 Energy-Based Diffusion Language Model (EDLM)，将能量模型引入离散扩散过程的每一步，在全序列级别进行评估。解决了离散扩散模型在减少采样步数时性能退化的问题。

## 核心思想

- **自回归之外的范式**：与逐 token 生成的自回归模型不同，扩散模型支持并行生成
- **能量模型修正**：在每个扩散步骤引入残差形式的 EBM，修正底层近似误差
- **参数来源**：可从预训练自回归模型获取，或通过噪声对比估计微调双向 Transformer
- **高效采样**：并行重要性采样算法，比现有扩散模型加速 1.3 倍

## 定位

这是对当前"所有 LLM 都是自回归"假设的挑战。虽然尚未达到自回归模型的困惑度，但正在接近。代表了 LLM 架构多元化的趋势。

## 与 Agent 工程的距离

目前与 agent 工程的直接关联有限。但如果非自回归生成范式成熟，可能根本改变 agent 系统的推理模式——例如从顺序 token 生成转向并行生成，影响 [context management](../concepts/context-management.md) 和 prompt 设计的基本假设。

## References

- `sources/nvidia-energy-based-diffusion-lm.md`
