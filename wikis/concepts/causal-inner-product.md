# 因果内积（Causal Inner Product）

## 定义

因果内积是一种用于 LLM 表征空间的非欧氏内积，其核心性质是：**因果可分离的概念在此内积下表征为正交向量**。

由 Park、Choe、Veitch（2023，ICML 2024）提出，用于解决一个基础性困难：LLM 表征空间在通常的欧氏内积下不具有语义意义，余弦相似度和投影等几何运算无法可靠地反映概念间的语义关系。

---

## 动机：为什么欧氏内积不够用

LLM 的训练目标（softmax next-token prediction）仅由概率分布决定，而同一概率分布可以由无数个表征空间实现——它们之间差一个任意可逆线性变换 $A$：

$$\gamma(y) \leftarrow A\gamma(y), \quad \lambda(x) \leftarrow A^{-\top}\lambda(x)$$

这种变换保持 $\mathbb{P}(y|x)$ 不变，但改变欧氏几何。因此，欧氏内积的计算结果（余弦相似度、投影）**取决于训练随机性带来的不可辨性**，而非概念的语义结构。

---

## 形式定义

对于 LLM 的非嵌入向量空间 $\bar{\Gamma}$，一个**因果内积** $\langle\cdot,\cdot\rangle_C$ 满足：

$$\langle\bar{\gamma}_W, \bar{\gamma}_Z\rangle_C = 0$$

对于任意一对**因果可分离**概念 $W$ 和 $Z$（即可以独立变化的概念，如"语言"和"性别"）。

---

## 显式构造

在合理假设（因果可分离概念对应词汇的统计独立性）下，因果内积有解析形式：

$$\langle\bar{\gamma}, \bar{\gamma}'\rangle_C := \bar{\gamma}^\top \mathrm{Cov}(\gamma)^{-1} \bar{\gamma}'$$

其中 $\gamma$ 是从词汇中均匀采样的非嵌入向量，$\mathrm{Cov}(\gamma)^{-1}$ 是词汇非嵌入矩阵的协方差逆矩阵。

**实践意义**：这个内积完全由模型的非嵌入矩阵（unembedding matrix，即模型最后一层 logit 投影矩阵）决定，无需任何额外训练或人工标注。

---

## 统一三种 LRH 表征

因果内积最重要的理论结果（Theorem 3.2）：

在因果内积下，概念 $W$ 的**非嵌入表征**（$\bar{\gamma}_W$，来自 counterfactual 词对差值）和**嵌入表征**（$\bar{\lambda}_W$，来自 counterfactual 上下文对差值）通过 Riesz 同构统一：

$$\langle\bar{\gamma}_W, \cdot\rangle_C = \bar{\lambda}_W^\top$$

这意味着：
- 在因果内积诱导的变换空间中，非嵌入表征和嵌入表征**指向同一方向**
- 在变换后的空间中，**欧氏内积恰好等于因果内积**：$\langle\bar{\gamma}, \bar{\gamma}'\rangle_C = \bar{g}^\top\bar{g}'$

这统一了 LRH 的三种表述（子空间/测量/干预），使得同一个方向向量可以同时用于探针和 steering vector。

---

## 实验验证

Park et al. 在 LLaMA-2 7B 上验证：

- 27 个概念（语言对、词类比）的非嵌入方向，在因果内积下**因果可分离概念近似正交**
- 热力图呈现 block diagonal 结构，块对应语义相似的概念组（如动词变形、语言对）
- 相比欧氏内积，因果内积下的"相似性"更符合人类对概念关系的直觉

---

## 实践影响

### 对探针设计

探针的最优方向不是欧氏空间的梯度方向，而是因果内积空间中的方向。使用非嵌入矩阵协方差逆矩阵做白化处理（whitening）可以近似因果内积空间。

### 对 Steering Vectors

Steering vectors（激活引导向量）应在因果内积空间中构造，才能保证"修改目标概念而不影响无关概念"的性质。

### 对可解释性工具

余弦相似度通常用于比较特征方向，但欧氏余弦相似度在语义上是任意的。因果内积提供了"正确"的相似度量——两个方向因果内积为 0，意味着它们代表可独立变化的独立概念。

---

## 局限与开放问题

- 因果内积在**中间层激活**（而非最后一层 logit 空间）如何推广？（论文未解决）
- 多值概念（非二元）的扩展？
- 因果内积的唯一性问题：论文证明了存在 $d$ 个自由度，选择 $D=I_d$ 是合理但非唯一的

---

## 相关概念

- [线性表征假说](linear-representation-hypothesis.md) — 因果内积为 LRH 提供几何基础
- [探针分类器](probing-classifiers.md) — 因果内积揭示探针的正确几何
- [机制可解释性](mechanistic-interpretability.md) — steering vectors 和特征干预的理论基础

## References

- `sources/arxiv_papers/2311.03658-linear-rep-hypothesis.md` — Park, Choe & Veitch (2023)，因果内积的提出论文
