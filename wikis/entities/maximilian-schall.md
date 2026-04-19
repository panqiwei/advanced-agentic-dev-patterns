# Maximilian Schall

## 简介

Maximilian Schall，NLP 研究者，与 Gerard de Melo 合作研究 LLM 约束解码与推理质量。

## 主要贡献

- **轨迹偏差（Trajectory Bias）命名与实证**（RANLP 2025）：首次系统性证明约束解码在保持句法合规的同时会损害语义正确性，通过对 11 个模型的跨基准实验识别了基础模型与指令微调模型在约束下的分歧行为。
- **Draft-Conditioned Constrained Decoding**（arXiv:2603.03305, 2025）：与 Castillo、de Melo 合作提出通过草稿-格式两阶段分离来缓解轨迹偏差的算法解。

## 相关概念

- [约束解码](../concepts/constrained-decoding.md)
- [轨迹偏差](../concepts/trajectory-bias.md)
- [结构化输出](../concepts/structured-outputs.md)

## References

- Schall & de Melo. "The Hidden Cost of Structure." RANLP 2025. `sources/ranlp-2025-hidden-cost-constrained-decoding.md`
