# 启发式规则集合（Bag of Heuristics）

## 定义

"启发式规则集合"（Bag of Heuristics）是 jylin04 (2024) 在 MATS 6.0 的机制可解释性分析中提出的概念，描述的是一类**神经网络解决结构化任务的方式**：

> 模型不是实现了一个统一的、可组合的算法来解决任务，而是积累了大量局部的、位置特异性的、彼此独立的 if-then 规则，这些规则的聚合效果在宏观上近似于一个"世界模型"。

这一概念来源于对 OthelloGPT 的深度电路追踪分析，但其含义对更广泛的 LLM 能力理解有重要影响。

---

## 来源：OthelloGPT 的案例

[jylin04 (2024)](../sources/othellogpt-bag-of-heuristics-mats2024.md) 对 Li et al. (2022) 的 OthelloGPT（8 层 GPT，Othello 着手序列训练）进行了深度机制可解释性分析。

**已发现的局部规则案例（MLP 神经元 L1N421）**：

```
IF 刚刚落子 A4
AND B4 非空（由 L0N377 判断）
AND C4 非空
→ 将 B4+C4+D4 更新为"对方"
```

关键特性：
- **位置特异**：这条规则不能平移到棋盘其他位置
- **局部性**：只涉及棋盘 A-D 列的一小段区域
- **独立性**：与其他类似规则并列，彼此不共享参数

研究者发现了许多这样的神经元，而没有找到一个描述长度短的统一翻转算法。

---

## 核心区分：表征准确性 vs 算法统一性

Bag of Heuristics 概念揭示了一个重要的二维空间：

| | 算法统一 | 算法分散（Bag of Heuristics） |
|---|---|---|
| **表征准确** | 理想世界模型 | **OthelloGPT 的实际情况** |
| **表征不准确** | 算法存在但执行错误 | 既没有表征也没有算法 |

探针类研究（Li et al., Nanda et al., Yuan & Søgaard）回答左侧问题（表征是否准确）。机制可解释性研究（MATS）回答上侧问题（算法是否统一）。两个维度可以独立变化。

---

## 对"世界模型"主张的影响

探针和表征对齐研究证明了"表征准确"；Bag of Heuristics 发现证明"算法分散"。这产生了一个哲学上有趣的情况：

**一个模型可以同时**：
- 以 99% 精度追踪棋盘状态
- 没有任何实现这种追踪的统一算法

这并不是矛盾——许多独立的局部规则可以密集到足以近似全局状态追踪，即使没有一个中央协调机制。

注意：nostalgebraist（LessWrong 评论者）指出，"启发式规则集合"本身可能*就是*世界模型的一种实现方式——世界模型不必是紧致的算法才能有效工作。

---

## 泛化性担忧

Bag of Heuristics 结构引出了一个重要的泛化性问题：

**局部规则集合在训练分布内可能工作良好，但在稀有/新颖配置下更可能失败。**

- 如果模型没有学到"A5 的规则"（因为 A5 场景稀少），那么 A5 相关的棋盘状态追踪就会错误
- 一个真正的统一算法可以泛化到所有位置；一袋位置特异规则只能覆盖已见过的模式

这对 LLM 推理能力的现实评估有直接影响：benchmark 表现良好不意味着底层算法健全，可能只是训练数据覆盖了所有 benchmark 需要的局部模式。

---

## 与其他 MI 发现的关系

Bag of Heuristics 并非 OthelloGPT 特有的怪象。相关发现包括：

- **算术中的 Bag of Heuristics**（Abbe et al., 2024）：语言模型用一袋启发式方法解算术题，而非实现通用算法
- **电路间的多元性**：Anthropic 的电路追踪研究也发现不同 prompt 激活不同的特征子图，暗示没有单一的"事实检索算法"
- **注意力头专化**：Mine-Head/Yours-Head 分化本身是功能专化的证据，但多个专化头的组合仍可能是 bag 而非 unified circuit

---

## 对符号 vs 联结主义问题的贡献

Bag of Heuristics 为这一争论贡献了一个重要的中间立场：

- **强符号主义**：模型学到了可组合的符号规则
- **强联结主义**：模型是不透明的函数近似器
- **Bag of Heuristics**：**模型学到了许多局部、位置特异的规则，这些规则是"小符号"的集合，但不构成"大算法"**

这不是符号主义的胜利，也不是联结主义的胜利——而是表明规则性和组合性可以在不同粒度上独立出现。

---

## 相关概念

- [Othello 世界模型假说](othello-world-model-hypothesis.md) — Bag of Heuristics 是其机制层面的深化
- [机制可解释性](mechanistic-interpretability.md) — 电路追踪是发现 Bag of Heuristics 的工具
- [激活干预](activation-intervention.md) — MATS 用因果消融验证各规则的角色
- [探针分类器](probing-classifiers.md) — 探针揭示表征存在，但无法区分 Bag of Heuristics 与统一算法
- [线性表征假说](linear-representation-hypothesis.md) — LRH 关于"特征存在"；Bag of Heuristics 关于"特征如何被计算"

## References

- jylin04 (2024)："OthelloGPT Learned a Bag of Heuristics"，AI Alignment Forum → `sources/othellogpt-bag-of-heuristics-jylin04-mats2024.md`，Wiki 摘要：`sources/othellogpt-bag-of-heuristics-mats2024.md`
- Li et al. (2022)：`sources/arxiv_papers/2210.13382-emergent-world-representations-othello-gpt.md`
- Yuan & Søgaard (2025)：`sources/arxiv_papers/2503.04421-revisiting-othello-world-model-hypothesis.md`
