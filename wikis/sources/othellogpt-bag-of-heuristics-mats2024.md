# jylin04 (2024)：OthelloGPT 学到了一袋启发式规则

**来源**：`sources/othellogpt-bag-of-heuristics-jylin04-mats2024.md`
**原始 URL**：https://www.alignmentforum.org/posts/gcpNuEZnxAPayaKBY/othellogpt-learned-a-bag-of-heuristics-1
**作者**：jylin04（Neel Nanda 的 MATS 6.0 学员）
**发表**：2024-07-02
**平台**：AI Alignment Forum / LessWrong

---

## 核心问题

OthelloGPT 的探针精度很高，证明表征存在。但这个表征**是如何被计算出来的**？存在一个统一的棋盘追踪算法，还是一堆临时拼凑的局部规则？

---

## 关键发现

### 1. 空格检测电路（部分完成）

对每个棋盘格，训练线性分类器在 Layer 6 激活上预测：空/己方/对方。探针在未见过的游戏上准确率很高。

**"空格"的计算路径**：两条贡献途径

- **直接嵌入**：每个格子的 token 嵌入直接贡献到残差流方向 "[该格] 非空"
- **移动检测神经元**：MLP Layer 0 中专属于各格的神经元同样贡献该方向
- **注意力头桥接**：
  - 注意力头 0.2：将 1 步前落子的信息移至当前位置 → "[1步前落子格] 非空"
  - 注意力头 0.3：对 2 步前落子做同样事

结论：空格检测是"直接查找 + 注意力媒介的近期历史"的组合，而非通用的棋盘扫描操作。

### 2. 己方/对方区分：找不到简洁算法

对空格/非空格的区分，找到了部分电路。对己方/对方的区分，**找不到简洁算法**。

研究者推测：OthelloGPT 通过**聚合多条启发式规则**来计算己方/对方，而非实现描述长度短的统一算法。这些规则：
- 局部的（特定于棋盘小区域）
- 位置特异的（A4 的规则不能平移到 B4）
- 彼此独立

### 3. 具体电路案例：MLP 神经元 L1N421

发现的一条具体规则：

> "IF 刚刚落子 A4 AND B4 非空 AND C4 非空 → 将 B4+C4+D4 更新为'对方'"

- 由神经元 L1N421（MLP Layer 1）执行
- "B4 非空" 的逻辑由更早的神经元 L0N377 提供（若 B4 的 token 未出现在 A4 之前，L0N377 抑制 L1N421 激活）
- **不能平移**：没有一个通用的翻转规则——而是存在许多类似的位置特异性神经元

### 4. Mine-Head / Yours-Head 注意力专化

注意力头表现出功能专化：
- **Mine-Heads**：只关注当前玩家的着手
- **Yours-Heads**：只关注对手的着手

这是模型分离双方棋子历史的机制。但此观察不能判断是统一的世界模型还是局部启发式规则集合在背后驱动。

---

## 核心论点：两种"世界模型"的区分

| 意义 | 表述 | MATS 结论 |
|---|---|---|
| 表征意义（Representational） | 激活可被线性解码为棋盘状态 | **成立**（探针有效） |
| 算法意义（Algorithmic） | 模型实现了统一、可组合的棋盘状态计算过程 | **存疑**（找不到简洁算法，推测是启发式集合） |

关键洞见：(1) 成立不意味着 (2) 成立。表征的准确性与计算机制的统一性是独立问题。

---

## 方法论

- 线性探针（Layer 6 激活 → 空/己/对 分类）
- 直接归因：追踪哪些 MLP 神经元和注意力头向探针方向写入
- 因果消融：通过消融特定神经元/注意力头验证其角色
- 层层残差流分解

---

## 关键概念链接

- [启发式规则集合（Bag of Heuristics）](../concepts/bag-of-heuristics.md) — 本文提出的核心概念
- [Othello 世界模型假说](../concepts/othello-world-model-hypothesis.md) — 本文在机制层面对该假说的质疑
- [激活干预](../concepts/activation-intervention.md) — MATS 使用的因果消融方法
- [机制可解释性](../concepts/mechanistic-interpretability.md) — 本文是电路追踪方法的典型应用
- [探针分类器](../concepts/probing-classifiers.md) — MATS 使用探针，同时揭示探针无法回答机制问题

## References

- 原始帖子：https://www.alignmentforum.org/posts/gcpNuEZnxAPayaKBY/othellogpt-learned-a-bag-of-heuristics-1
- 剪辑文件：`sources/othellogpt-bag-of-heuristics-jylin04-mats2024.md`
- 相关：Li et al. (2022) `sources/arxiv_papers/2210.13382-emergent-world-representations-othello-gpt.md`
- 相关：Yuan & Søgaard (2025) `sources/arxiv_papers/2503.04421-revisiting-othello-world-model-hypothesis.md`
