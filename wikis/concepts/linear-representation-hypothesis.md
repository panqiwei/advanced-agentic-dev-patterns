# 线性表征假说（Linear Representation Hypothesis）

## 定义

线性表征假说（LRH）主张：神经网络内部的特征以线性方式编码在激活空间中——即某个特征的存在或强度，可以通过将激活向量投影到某个特征方向向量上来读取。

形式化表述：若模型在内部表征特征 $f$，则存在方向向量 $\mathbf{w}$，使得 $f(\mathbf{x}) \approx \mathbf{a}(\mathbf{x}) \cdot \mathbf{w}$，其中 $\mathbf{a}(\mathbf{x})$ 是输入 $\mathbf{x}$ 对应的激活向量。

这不意味着神经网络本身是线性的——网络的全局行为高度非线性——而是说**特定特征在局部激活空间中占据线性可分离的方向**。

---

## 历史脉络

### 早期证据：类别特征

LRH 最早的支撑来自 word2vec 时代的"king - man + woman = queen"类比算术（2013），以及后续大量证据：

- **词性、情感**：用线性分类器从 BERT 激活中以高精度预测
- **事实关系**：主语-宾语关系在变换器表征中的线性结构（Hernandez et al., 2023）
- **棋盘状态**：Othello-GPT 在表征中线性编码棋盘格状态（Li et al., 2022; Nanda et al., 2023）——关键在于特征坐标系选择：用相对颜色（Mine/Yours/Empty）而非绝对颜色（Black/White/Empty）才能使线性探针有效，准确率从 ~75% 跃升至 ~99%
- **事实陈述真值**：Burns et al. 2022 发现"潜在知识"方向

这些证据共同的特点：目标变量是**离散或二元的**类别标签。

### 连续量的扩展：本文的贡献

[Gurnee & Tegmark (2023)](../sources/2310.02207-language-models-represent-space-and-time.md) 将 LRH 扩展到**连续量**，对经纬度坐标（二维）和历史时间戳（一维）进行系统验证。

关键证据：线性探针（ridge regression）vs 非线性 MLP 探针性能几乎持平（R² 差距 <0.02），说明空间和时间信息确实以线性方式编码，而非需要非线性变换才能提取。

---

## 与叠加（Superposition）的关系

LRH 与叠加假说（Elhage et al., 2022）并不矛盾，而是互补：

- **叠加**：模型用 $n$ 个神经元表征远多于 $n$ 个特征（near-orthogonal 方向），以节省参数
- **LRH**：每个特征对应一个线性方向，但这个方向可能不与任何单个神经元对齐

这意味着个体神经元通常是多义的（polysemantic），而特征存在于神经元激活的**线性组合**方向上。稀疏自编码器（SAE）正是为了从叠加中恢复这些线性特征方向而设计的。

---

## 形式化：三种 LRH 等价的数学证明

[Park、Choe、Veitch (2023)](../sources/2311.03658-linear-rep-hypothesis.md)（ICML 2024）是 LRH 迄今最严格的形式化，用**反事实语言**统一了三种直觉：

| LRH 直觉 | 形式名称 | 数学定义 | 关联到 |
|---------|---------|---------|------|
| 词对差值共线（"queen"-"king" ‖ "woman"-"man"） | 非嵌入表征（Unembedding Rep.） | counterfactual 词对差值 $\gamma(y(1))-\gamma(y(0))$ 所在方向锥 | → 线性探针（Thm 2.2） |
| 线性探针可预测概念 | 测量表征（Measurement） | logit-linear 可预测 $W$ 的概率 | ← 非嵌入表征 |
| 方向向量可定向修改输出 | 嵌入表征（Embedding Rep.） | 仅改变目标概念的上下文激活差值方向 | → Steering Vector（Thm 2.5） |

**关键技术贡献**：在[因果内积](causal-inner-product.md)下，非嵌入表征和嵌入表征通过 Riesz 同构统一到同一方向（Thm 3.2）。这意味着：同一方向向量既可用作线性探针，又可用作有效 steering vector，且保证修改目标概念时不影响因果无关的其他概念。

## 证伪条件

以下情况会否定 LRH：
1. 非线性探针显著优于线性探针（超过统计噪声）
2. 对同一特征的不同实体类型泛化失败（表明分别用了不同方向）
3. 主成分分析前几个成分无法捕捉目标特征的任何信息

---

## 意义

### 对可解释性研究

LRH 是 [机制可解释性](mechanistic-interpretability.md) 的核心方法论基础。如果特征是非线性的，归因图和特征干预研究将大幅复杂化。

### 对世界模型理解

LRH 表明 LLM 内部可能存在真实世界的结构化表征，而非仅仅是 token 级的统计记忆。这为 [时空世界模型](spatiotemporal-world-model.md) 和更广义的 [世界模型](world-models.md) 研究提供了方法论基础。

### 对干预和编辑

如果特征呈线性，则原则上可以通过激活补丁（activation patching）或方向干预来定向修改模型的表征，而无需重训练。这对 AI 安全和模型编辑有直接价值。

---

## 相关概念

- [探针分类器](probing-classifiers.md) — 验证 LRH 的主要实验工具；子空间表征 ≡ 线性探针方向（Park et al.）
- [因果内积](causal-inner-product.md) — LRH 的正确几何结构；因果可分离概念正交
- [时空世界模型](spatiotemporal-world-model.md) — LRH 在连续量上的关键实验验证
- [机制可解释性](mechanistic-interpretability.md) — LRH 是 MI 的方法论前提
- [世界模型](world-models.md) — LRH 暗示 LLM 内部存在结构化现实表征

## References

- `sources/arxiv_papers/2310.02207-language-models-represent-space-and-time.md` — Gurnee & Tegmark，连续量 LRH 的系统验证
- `sources/arxiv_papers/2311.03658-linear-rep-hypothesis.md` — Park, Choe & Veitch，LRH 的严格反事实形式化与因果内积
- Elhage et al. (2022), "Toy Models of Superposition" — 叠加假说
- Nanda et al. (2023), "Emergent Linear Representations in World Models" — Othello-GPT 线性表征，特征坐标系选择的关键发现 → `sources/arxiv_papers/2309.00941-emergent-linear-representations-world-models.md`，Wiki 摘要：`sources/2309.00941-emergent-linear-representations-world-models.md`
