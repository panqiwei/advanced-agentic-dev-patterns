# Neel Nanda

**领域**：机制可解释性（Mechanistic Interpretability）
**机构**：Google DeepMind（可解释性团队）；前 Anthropic
**角色**：MATS（ML Alignment Theory Scholars）项目导师，机制可解释性研究者

---

## 主要贡献

### TransformerLens（开源库）

Neel Nanda 开发了 TransformerLens（前身 EasyTransformer），是机制可解释性研究领域最广泛使用的开源工具库。提供：
- 干净的 hook API，可在任意位置读取/修改激活
- 预训练模型库
- 支持残差流分解、注意力模式分析等 MI 核心操作

### MATS 项目

MATS（ML Alignment Theory Scholars）是 Neel Nanda 主导的研究训练计划，每期招募研究生和研究者进行密集的机制可解释性研究。jylin04 的 OthelloGPT 分析（"Bag of Heuristics"）即来自 MATS 6.0（2024 年夏季）。

### OthelloGPT 线性表征（2023）

与 Andrew Lee、Martin Wattenberg 合作，发表"Emergent Linear Representations in World Models of Self-Supervised Sequence Models"（BlackboxNLP @ EMNLP 2023）。

**核心发现**：Li et al. (2022) 认为 OthelloGPT 使用非线性探针，Nanda et al. 找到了问题根源——错误的特征坐标系。用 Mine/Yours/Empty（相对行棋方）代替 Black/White/Empty（绝对颜色）后，线性探针准确率从 ~75% 跃升至 ~99%。同时提出单次线性向量加法干预法，比 Li et al. 的梯度迭代干预更简洁。

→ Wiki 摘要：[`sources/2309.00941-emergent-linear-representations-world-models.md`](../sources/2309.00941-emergent-linear-representations-world-models.md)

### 模块化性与玩具任务研究

Neel Nanda 及其合作者对小型 transformer 在玩具任务（如 modular addition）上的电路进行了系统研究，发现"小要塞（grokking）"现象和算法发现的相变过程。

---

## 与 OthelloGPT 研究的关系

[jylin04 (2024)](../sources/othellogpt-bag-of-heuristics-mats2024.md) 的 OthelloGPT Bag of Heuristics 分析是 MATS 6.0 的产物，由 Neel Nanda 指导。Nanda 在自己的工作中也使用了 OthelloGPT 数据集——他与合作者的研究发现了 [Othello 世界模型假说](../concepts/othello-world-model-hypothesis.md)的线性化版本（MINE/YOURS/EMPTY 标注方案），这成为假说演化中的 Nanda et al. (2023) 那篇。

---

## 相关概念

- [机制可解释性](../concepts/mechanistic-interpretability.md) — Neel Nanda 是该领域的核心建设者
- [激活干预](../concepts/activation-intervention.md) — TransformerLens 提供了激活干预的工程支持
- [Othello 世界模型假说](../concepts/othello-world-model-hypothesis.md) — Nanda et al. (2023) 是该假说发展的第二代
- [启发式规则集合](../concepts/bag-of-heuristics.md) — MATS 学员的研究发现

## References

- Nanda et al. (2023)："Emergent Linear Representations in World Models of Self-Supervised Sequence Models"（BlackboxNLP @ EMNLP 2023）→ `sources/arxiv_papers/2309.00941-emergent-linear-representations-world-models.md`，Wiki 摘要：`sources/2309.00941-emergent-linear-representations-world-models.md`
- jylin04 (2024)："OthelloGPT Learned a Bag of Heuristics"（MATS 6.0）→ `sources/othellogpt-bag-of-heuristics-jylin04-mats2024.md`
