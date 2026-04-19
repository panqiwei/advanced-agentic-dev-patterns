# Othello 世界模型假说（Othello World Model Hypothesis）

## 定义

Othello 世界模型假说（OWMH）是一个关于序列模型隐式理解能力的实证命题：**一个仅接受 Othello 棋局着手序列训练的语言模型，能够在其内部激活中涌现出对棋盘布局的结构化表征——即一种无需显式监督、自发形成的"世界模型"。**

该假说由 Li et al. (2022) 通过 OthelloGPT 实验首次提出，经 Nanda et al. (2023) 和 Yuan & Søgaard (2025) 两次系统性强化。它是"联结主义系统能否自发形成符号结构"这一更宏观问题的小规模、可控的实证测试场。

---

## 为什么用 Othello 作测试场？

Othello 提供了理想的实验约束：
- 规则确定性强（完全信息博弈）
- 游戏树过大，无法靠序列记忆
- 棋盘状态离散且可精确标注
- 训练信号完全来自着手序列——无几何信息

这意味着如果模型内部出现棋盘表征，它必然是从序列统计中涌现的，而非从外部提供的。

---

## 证据链：三代研究

### Li et al. (2022)：首次发现

**OthelloGPT**：8 层 GPT 在 2000 万条 Othello 游戏序列上训练。

核心结果：
- 合成数据错误率 0.01%（远低于记忆上限）
- **非线性探针**（MLP）将错误率从随机基线 26% 降至 1.7–4.8%
- 线性探针失败（>20% 错误率）——表征是非线性的
- **因果干预**：修改激活至对应反事实棋盘状态，预测随之改变，证明表征是因果性的

**核心方法创新**：不仅验证表征存在（探针），还证明表征因果影响输出（激活干预）。

→ 参见 [OthelloGPT 源文件](../sources/2210.13382-emergent-world-representations-othello-gpt.md)

---

### Nanda et al. (2023)：线性化修正

**论文**："Emergent Linear Representations in World Models of Self-Supervised Sequence Models"（BlackboxNLP @ EMNLP 2023）

Nanda 等人提出的关键洞察：Li et al. 选择了"绝对颜色"（Black/White/Empty）作为标注方案，但 OthelloGPT 内部用的是**相对颜色**（Mine/Yours/Empty，相对于当前行棋方的视角）。

改变坐标系后：
- 线性探针准确率：从 ~75%（Black/White/Empty）跃升至 **~99%**（Mine/Yours/Empty）
- 与非线性探针（~98%）持平

**修正意义**：Li et al. 的"非线性性"结论可能源于标注方案的坐标系选择，而非表征本身的非线性。重标注后，线性探针即可工作。

**激活干预简化**：Nanda et al. 用线性方向的单次向量加法替代 Li et al. 的梯度迭代干预，效果相当甚至更优。这说明线性表征的方向向量直接就是干预的自然载体。

**多电路假说**：论文还发现在终局（最后 ~20 步），模型常先预测着手再计算完整棋盘（"MoveFirst"现象），暗示存在多条并行电路，与 jylin04 的 Bag of Heuristics 高度吻合。

→ 参见 [Nanda et al. 源文件](../sources/2309.00941-emergent-linear-representations-world-models.md)

---

### Yuan & Søgaard (2025)：跨架构验证与 99% 精度

将实验扩展至 7 个 LLM，引入**跨模型 Procrustes 表征对齐**（来自跨语言嵌入研究）替代探针。

核心结果：
- 无监督对齐精度高达 **99%**
- 跨架构余弦相似度 **93–96%**（GPT-2 vs Mistral vs Bart 等）
- PCA 可视化显示不同模型学到高度相似的步骤表征
- 潜在着手投影证明模型学习了棋盘的**空间相邻关系**

**关键约束**：尽管棋盘状态表征精度高达 99%，2-hop（连续着手）预测性能显著退化——**结构性世界模型不等于战略规划能力**。

→ 参见 [Yuan & Søgaard 源文件](../sources/2503.04421-revisiting-othello-world-model-hypothesis.md)

---

## 机制层面的质疑：MATS 分析（2024）

jylin04（Neel Nanda 的 MATS 6.0 学员）在机制可解释性层面的分析提出了一个独立视角：

**OthelloGPT 学到的可能是"启发式规则的集合"，而非统一的棋盘追踪算法。**

具体发现：
- 部分还原了"空格检测"电路：直接嵌入 + MLP Layer 0 的移动检测神经元 + 注意力头 0.2/0.3 的历史回溯
- Mine-Head（关注己方着手）vs Yours-Head（关注对方着手）的注意力专化
- 神经元 L1N421 的具体规则：`IF A4 刚被下 AND B4 非空 AND C4 非空 → 更新 B4+C4+D4 为"对方"` ——且这条规则**不能平移**到棋盘其他位置

**两个层次的不同问题**：

| 问题层次 | Yuan & Søgaard | jylin04 |
|---|---|---|
| 表征准确性 | 99% 精度，跨架构收敛 | 未质疑（探针有效） |
| 计算机制 | 未深入研究 | 局部启发式规则聚合 |

两者不矛盾：表征可以是准确的，同时计算该表征的机制是分布式的小规则集合。

→ 参见 [jylin04 MATS 分析](../sources/othellogpt-bag-of-heuristics-mats2024.md)

---

## 对"符号 vs 联结主义"的含义

Othello 世界模型假说实验链是**联结主义涌现符号结构**的受控案例：

1. **表征涌现**：纯序列训练 → 隐式棋盘表征，无显式监督
2. **跨架构收敛**：不同架构收敛到相似表征，暗示存在与具体网络无关的"表征吸引子"
3. **表征 ≠ 算法**：准确的表征可以由非统一的机制（启发式规则聚合）实现
4. **世界模型 ≠ 规划**：高精度状态追踪不自动带来多步规划能力

---

## 相关概念

- [世界模型](world-models.md) — OWMH 是语言模型世界模型能力的小规模实证测试场
- [探针分类器](probing-classifiers.md) — 第一、二代研究的核心方法，OWMH 也推动了对探针局限的反思
- [机制可解释性](mechanistic-interpretability.md) — MATS 分析提供了 OWMH 的机制层面视角
- [线性表征假说](linear-representation-hypothesis.md) — Nanda et al. 的修正与 LRH 直接相关
- [时空世界模型](spatiotemporal-world-model.md) — Gurnee & Tegmark 用类似探针方法发现 LLM 内的地理/时间表征，是 OWMH 在更大规模的平行验证

## References

- Li et al. (2022)：`sources/arxiv_papers/2210.13382-emergent-world-representations-othello-gpt.md`，Wiki 摘要：`sources/2210.13382-emergent-world-representations-othello-gpt.md`
- Nanda et al. (2023)：`sources/arxiv_papers/2309.00941-emergent-linear-representations-world-models.md`，Wiki 摘要：`sources/2309.00941-emergent-linear-representations-world-models.md`
- Yuan & Søgaard (2025)：`sources/arxiv_papers/2503.04421-revisiting-othello-world-model-hypothesis.md`，Wiki 摘要：`sources/2503.04421-revisiting-othello-world-model-hypothesis.md`
- jylin04 (2024)：`sources/othellogpt-bag-of-heuristics-jylin04-mats2024.md`
