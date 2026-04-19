# The Third AI Summer: AAAI Robert S. Engelmore Memorial Lecture

**来源文件：** `sources/arxiv_papers/kautz-2022-third-ai-summer-engelmore-lecture.md`
**原始 URL：** https://ojs.aaai.org/aimagazine/index.php/aimagazine/article/view/19122
**作者：** Henry Kautz（University of Rochester）
**发表：** *AI Magazine*, Vol. 43, No. 1, pp. 105-125, 2022
**DOI：** 10.1002/aaai.12036
**讲座原型：** AAAI-2020 Robert S. Engelmore 纪念讲座，2020 年 2 月 10 日

---

## 摘要

Kautz 在 AAAI-2020 的 Engelmore 纪念讲座，将 AI 历史重新框定为神经与符号方法的"共同演化"而非对立竞争。讲座提出了神经符号 AI 的六类架构分类法（Kautz 分类法），成为该领域 2020 年后的标准参照框架。

---

## 核心贡献

### 1. AI 三个夏天的历史框架

Kautz 将 AI 历史划分为三个"夏天"（而非传统的繁荣-寒冬二元叙事）：

| 时期 | 年份 | 关键事件 | 结局 |
|---|---|---|---|
| 第一夏 | 1948–1966 | 神经网络与逻辑系统同步出现；A* 算法 | 过度承诺→第一个冬天 |
| 第二夏 | 1968–1987 | 专家系统商业成功 | 概率推理局限→第二个冬天 |
| 第三夏 | 2012–今 | AlexNet、AlphaGo、深度学习主导 | Kautz 预言：不会有第三个冬天 |

**关键洞见：** AI "寒冬"期并非停滞——Pearl 的贝叶斯网络（1988）、支持向量机、统计关系学习框架都诞生于"冬天"。寒冬是重要理论突破的温床。

### 2. "第三个冬天不会来"论断

Kautz 的预测性核心论点：第三夏不会以寒冬终结，而是通过神经符号集成演化为更成熟的 AI 形态。理由：
- 深度学习已被工业界大规模采用，研究资助结构不同于前两个夏天
- 神经符号集成提供了一条不依赖"全面突破"的渐进演化路径
- AlphaGo 证明了神经符号集成已经在实践中成功（Type 2）

### 3. 反对"猫和老鼠"叙事

Kautz 明确命名并拒绝将 AI 历史描述为符号与神经的对立竞争（"Tom and Jerry"叙事）。历史证据：神经网络与逻辑系统在第一夏就已同时出现；AlphaGo 本身就是神经符号系统（Type 2）。不同思想在历史上"交织演化"，而非胜负竞争。

### 4. 六类神经符号架构分类法

Kautz 分类法的**权威原始表述**（此前 Garcez & Lamb 是引述 Kautz）：

| 类型 | 符号表示 | 耦合度 | 示例 |
|---|---|---|---|
| Type 1 | `Symbolic_Neuro_Symbolic` | 最松 | Transformer NLP |
| Type 2 | `Symbolic[Neuro]` | 松 | AlphaGo |
| Type 3 | `Neuro;Symbolic` | 中 | NS-CL, deepProbLog |
| Type 4 | `Neuro:Symbolic→Neuro` | 较紧 | Logical Neural Networks |
| Type 5 | `Neuro_Symbolic` | 紧 | Logic Tensor Networks |
| Type 6 | `Neuro[Symbolic]` | 最紧 | （理想目标，尚未完全实现）|

详见 [neurosymbolic-ai-taxonomy](../concepts/neurosymbolic-ai-taxonomy.md)。

### 5. 耦合谱的明确形式化

Kautz 明确将 Type 1→6 的递进描述为"耦合紧密度"谱，并指出其与以下权衡的对应关系：
- **可学习性**（learnability）— 端到端梯度训练的强度
- **可验证性**（verifiability）— 逻辑保证的强度

这一形式化是对分类法的重要补充——它不只是描述架构，而是描述设计权衡空间。

### 6. Kahneman 框架作为设计模板

Kautz 明确将 System 1/System 2 不只作为比喻，而是作为**设计模板**：Type 6 的目标就是在 System 1（神经）内部实现 System 2（符号）推理。这将认知科学框架直接转化为工程目标。

---

## 关键论点

1. **神经符号融合不是退步而是进化** — 对"符号 AI 死灰复燃"叙事的明确拒绝
2. **AlphaGo 是现实证明** — Type 2 系统已实现超人表现，证明神经符号集成有效
3. **单一路线的局限** — 纯神经方法在分布外泛化、因果推理、逻辑外推上都力不从心；纯符号方法在感知和可扩展性上失败
4. **开放挑战** — 从 Type 2/3（松耦合）推进到 Type 5/6（紧耦合）是领域核心挑战

---

## 与现有 Wiki 的关联

- **[neurosymbolic-ai-taxonomy](../concepts/neurosymbolic-ai-taxonomy.md)** — 此源是分类法的权威原始来源，上一次 ingest 基于 Garcez & Lamb 的引述；本次提供直接来源视角
- **[henry-kautz](../entities/henry-kautz.md)** — 作者页面，需要补充讲座背景和发表信息
- **[system-1-vs-system-2](../concepts/system-1-vs-system-2.md)** — Kautz 将 System 1/2 作为设计模板而非仅仅比喻
- **[ai-summers-history](../concepts/ai-summers-history.md)** — 三个夏天的历史框架
- **[physical-symbol-system](../concepts/physical-symbol-system.md)** — Newell & Simon 的 PSSH 是 Kautz 所描述的第一夏的理论基础

---

## References

- Source: `sources/arxiv_papers/kautz-2022-third-ai-summer-engelmore-lecture.md`
- Kautz, H. (2022). The Third AI Summer: AAAI Robert S. Engelmore Memorial Lecture. *AI Magazine*, 43(1), 105-125. DOI: 10.1002/aaai.12036
