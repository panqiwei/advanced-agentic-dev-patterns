# 探针分类器（Probing Classifiers）

## 定义

探针分类器（Probing Classifiers，也称 Probes）是一种在不修改被分析模型参数的前提下，用简单分类器或回归器检测神经网络内部是否编码了某种特定信息的实验方法。

典型流程：
1. 固定预训练模型，在一组标注样本上提取某一层的激活（隐藏状态）
2. 用提取的激活作为输入特征，训练一个简单探针（线性分类器、逻辑回归、MLP）
3. 评估探针在测试集上的性能：高性能 → 该层激活线性（或非线性）编码了目标属性

---

## 分类

| 探针类型 | 适用场景 | 局限 |
|---------|---------|------|
| **线性探针**（Linear Probe） | 验证线性表征假说；效率高；可解释 | 无法捕捉非线性编码 |
| **非线性探针**（MLP Probe） | 更强能力上限；作为线性探针的对照 | 高性能可能反映探针本身的建模能力 |
| **稀疏探针**（Sparse Probe） | 定位单个或少数神经元；可解释性更强 | 覆盖范围受限 |

---

## 核心方法论争议

探针高性能 ≠ 模型"使用"了该信息。

[Ravichander et al. (2020)](https://arxiv.org/abs/2005.00719) 的"probing the probing paradigm"提出核心挑战：如果探针准确，有两种解释：
1. 模型在内部表征并主动使用了这个特征
2. 特征只是"以某种方式存在"于激活中，但模型实际计算时并未依赖它

[Gurnee & Tegmark (2023)](../sources/2310.02207-language-models-represent-space-and-time.md) 通过两种方式缓解这一问题：
- **泛化实验**：训练时排除某个国家/年代，测试探针是否能泛化 → 说明模型学的是几何结构而非记忆
- **因果干预**：找到激活值与探针方向余弦相似度最高的"空间神经元"/"时间神经元"，通过**消融**和**定向激活干预**验证其对模型输出的因果效应

---

## 在时空表征研究中的应用

Gurnee & Tegmark 使用**线性岭回归探针**，对六个数据集（三空间、三时间）在 Llama-2 所有层上训练探针：

$$\hat{\mathbf{W}} = \arg\min_{\mathbf{W}} \|\mathbf{Y} - \mathbf{A}\mathbf{W}\|_2^2 + \lambda\|\mathbf{W}\|_2^2$$

关键发现：
- 线性探针与非线性 MLP 探针性能几乎持平，R² 差距 <0.02
- 探针在模型前半段（约 60% 深度）性能稳定提升后趋于饱和
- 对低秩 PCA 投影的探针（减少 2-3 个量级的参数量）仍能保留大部分 Spearman 相关性，说明时空信息在激活的主成分中占有显著比例

---

## 设计要点

1. **探针要足够简单**：探针越简单，高性能越能说明特征存在于被分析模型中，而非探针本身在建模
2. **对照实验**：线性探针与非线性探针对比，量化非线性带来的增益
3. **泛化测试**：块排除（block holdout）测试探针是否真正学到几何结构
4. **因果验证**：不止于相关性——用激活干预验证神经元的因果效应

---

## 探针方法的局限：Othello 研究的教训

[Othello 世界模型假说](othello-world-model-hypothesis.md) 的研究链为探针方法的局限提供了典型案例：

1. **Li et al. (2022)**：非线性探针成功，线性探针失败——但后来发现可能是标注坐标系问题，而非本质非线性
2. **Nanda et al. (2023)**：换用 MINE/YOURS/EMPTY 标注后线性探针也成功——探针结论高度依赖标注方案
3. **Yuan & Søgaard (2025)**：用 [Procrustes 表征对齐](../sources/2503.04421-revisiting-othello-world-model-hypothesis.md) 替代探针，绕开了探针的三个核心缺陷：
   - 容易受到虚假相关性影响
   - 无法揭示模型内部信息的全局组织
   - 忽略空间关系等结构性属性

这说明：探针方法是强大的起点，但当论断关乎"是否真的学到了世界模型"时，需要辅以跨模型对齐、因果干预等更强的验证手段。

## 相关概念

- [线性表征假说](linear-representation-hypothesis.md) — 探针是其主要验证工具
- [机制可解释性](mechanistic-interpretability.md) — 探针是 MI 的基础实验工具之一
- [时空世界模型](spatiotemporal-world-model.md) — 探针方法在时空研究中的关键应用
- [Othello 世界模型假说](othello-world-model-hypothesis.md) — 探针在游戏世界模型研究中的应用与局限

## References

- `sources/arxiv_papers/2310.02207-language-models-represent-space-and-time.md` — 探针方法在时空连续量上的系统性应用
- `sources/arxiv_papers/2210.13382-emergent-world-representations-othello-gpt.md` — OthelloGPT 非线性探针的原始应用
- `sources/arxiv_papers/2503.04421-revisiting-othello-world-model-hypothesis.md` — 用表征对齐替代探针的方法论升级
- Belinkov (2022), "Probing classifiers: Promises, shortcomings, and advances" — 探针方法综述
- Alain & Bengio (2016), "Understanding intermediate layers using linear classifier probes" — 经典探针方法
