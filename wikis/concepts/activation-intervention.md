# 激活干预（Activation Intervention）

## 定义

激活干预（Activation Intervention，也称激活修补 Activation Patching 或激活操控 Activation Steering）是机制可解释性研究中的一类实验方法：**在模型前向传播过程中修改中间层的激活值，观察这一修改是否影响最终输出，从而验证表征的功能性（因果性）角色。**

与探针分类器不同，激活干预不仅回答"模型内部是否编码了信息X"，更回答"编码X的表征是否因果性地驱动模型行为"。

---

## 方法分类

### 1. 梯度引导修改（Li et al. 2022，OthelloGPT）

通过梯度下降，将某一层的激活修改为使探针预测反事实状态 B' 的值：

```
x′ ← x − α ∂ℒ_CE(p_θ(x), B′)/∂x
```

**适用场景**：当有明确的"目标状态"（如某个棋盘配置）时，可精确施加因果干预。
**优点**：可以测试模型对训练分布外（不可达）状态的响应。
**局限**：需要多次迭代优化，干预后的激活可能偏离自然激活流形。

**OthelloGPT 结果**：干预后平均预测错误从 2.68 降至 0.12（合法棋位），证明棋盘表征对预测具有因果作用。

---

### 1b. 线性方向向量加法（Nanda et al. 2023，OthelloGPT 线性化）

Nanda et al. 发现，在正确的特征坐标系（Mine/Yours/Empty）下，只需将线性探针方向加入每层残差流即可实现等效干预：

```
x′ ← x + α · p^λ_d(x)
```

其中 $d \in \{\text{Mine}, \text{Yours}, \text{Empty}\}$，$p^\lambda_d$ 是对应方向的线性探针向量。

**相比梯度干预的优势**：
- 单次向量加法，无需迭代优化
- 更直接地揭示线性表征结构——干预向量就是探针向量本身
- 在"Erasing"（清除已下棋子）任务上错误率更低（0.02 vs 0.11）

**理论意义**：如果单次向量加法就能精确干预，说明表征本身就是线性的，干预方向等于特征方向。这验证了[线性表征假说](linear-representation-hypothesis.md)在世界模型表征中的适用性，也与 [Park et al. (2023)](../sources/2311.03658-linear-rep-hypothesis.md) 的[嵌入表征理论](linear-representation-hypothesis.md)直接对应。

→ 参见 [Nanda et al. 源文件](../sources/2309.00941-emergent-linear-representations-world-models.md)

---

### 2. 直接缓存替换（Activation Patching，Meng et al. 2022）

从一个"干净"运行和一个"受损"运行中缓存激活，将受损模型的特定层激活替换为干净激活，观察输出是否恢复：

```
h_i ← h_i^{clean}  (只替换第 i 层)
```

**适用场景**：事实编辑、定位哪一层/哪个注意力头负责特定知识。
**代表工作**：ROME（Meng et al.，ICLR 2023）用此方法定位事实记忆的存储层，发现 GPT 的"事实关联"主要存储在早中期 MLP 层。

---

### 3. 激活向量操控（Activation Steering，Zou et al. 2023 等）

在前向传播中加入特定方向的向量：

```
h_i ← h_i + α · v
```

其中 v 是通过对比两类输入（如"快乐/悲伤"句子）的激活差提取的"特征方向"。

**适用场景**：研究单个概念对模型行为的影响，情感/内容操控。
**代表工作**：Anthropic 的"内省意识"研究（通过概念注入研究自我觉察）；Zou et al. (2023) "Representation Engineering"。

---

## 与探针方法的关系

| 维度 | 探针分类器 | 激活干预 |
|---|---|---|
| 回答的问题 | 激活中是否编码了信息 X？ | 编码 X 的激活是否因果驱动输出？ |
| 操作 | 训练外部分类器 | 修改激活本身 |
| 证据强度 | 相关性 | 因果性 |
| 局限 | 可能反映虚假相关 | 干预可能离开自然激活流形 |

OthelloGPT 的方法论贡献之一：先用探针建立假设（"某层编码棋盘状态"），再用激活干预验证因果性——这一两步范式成为机制可解释性的标准流程。

---

## 在符号 vs 联结主义问题中的意义

激活干预是检验"联结主义系统是否真正持有符号结构"的关键工具：

- **探针**只是观察：表征可能"存在"但不被使用
- **激活干预**证明表征是**功能性的**——它真的在驱动计算
- OthelloGPT 的干预结果（包括对不可达棋盘状态的有效干预）表明：模型内部持有的不是记忆的模式，而是可组合的结构性表征

---

## 当前局限

1. **流形偏离**：修改后的激活可能落在"自然激活流形"之外，导致模型行为变得不可预测
2. **多义性**：同一激活向量可能同时编码多个特征，孤立干预难以分离
3. **层级依赖**：干预早期层会影响后续所有层，难以精确归因
4. **泛化性存疑**：在特定输入上有效的干预不一定泛化到所有输入

---

## 相关概念

- [探针分类器](probing-classifiers.md) — 激活干预的前置步骤，先确认表征存在
- [机制可解释性](mechanistic-interpretability.md) — 激活干预是 MI 的核心实验工具
- [Othello 世界模型假说](othello-world-model-hypothesis.md) — 激活干预方法的首次系统性应用场景
- [因果干预](causal-intervention.md) — Pearl 意义上的"干预"：概念上相关，但 Pearl 的 do 算子操作因果图，而激活干预操作神经网络中间层激活
- [线性表征假说](linear-representation-hypothesis.md) — 激活干预依赖表征具有可操控的几何结构

## References

- Li et al. (2022)："Emergent World Representations: Exploring a Sequence Model Trained on a Synthetic Task"，ICLR 2023 → `sources/arxiv_papers/2210.13382-emergent-world-representations-othello-gpt.md`
- Nanda et al. (2023)："Emergent Linear Representations in World Models of Self-Supervised Sequence Models"，BlackboxNLP @ EMNLP 2023 → `sources/arxiv_papers/2309.00941-emergent-linear-representations-world-models.md`，Wiki 摘要：`sources/2309.00941-emergent-linear-representations-world-models.md`
- Meng et al. (2022)："Locating and Editing Factual Associations in GPT"（ROME）
- Zou et al. (2023)："Representation Engineering: A Top-Down Approach to AI Transparency"
- `sources/anthropic-emergent-introspective-awareness.md` — 概念注入研究（激活干预思路的应用）
