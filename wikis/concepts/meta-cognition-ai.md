# 元认知（Meta-Cognition in AI）

**定义：** 在 AI 系统中，元认知是系统监控、评估和调整自身推理与学习过程的能力。字面含义是"对自身思维的思考"（thinking about thinking）。它作为一个控制层，决定系统何时依赖快速直觉（System 1）、何时切换到慢速推理（System 2）。

---

## 核心能力

元认知要求系统具备：

1. **自我监控（monitoring）：** 实时追踪自身推理过程的质量与进展
2. **自我评估（evaluation）：** 判断当前策略是否适合当前任务
3. **自我调整（adjustment）：** 基于评估结果动态改变推理策略

这三个能力构成"认知控制闭环"，是人类高级认知的核心特征，也是现有 AI 系统最欠缺的能力之一。

---

## 为什么元认知是 NSAI 最欠缺的维度

2020–2024 年 NSAI 系统综述（arXiv:2501.05435）发现，在 167 篇论文中：
- 学习与推理：63%
- 知识表示：44%
- 逻辑与推理：35%
- 可解释性与可信度：28%
- **元认知：5%（仅 8 篇）**

元认知的低占比反映了一个根本性困难：它不是一个独立的功能模块，而是横跨所有其他维度的调控层——实现它需要首先在其他四个维度都有良好基础。

---

## 与 System 1/2 框架的关系

元认知是 [System 1 vs System 2](system-1-vs-system-2.md) 框架的**第三层**：

- **System 1（神经）：** 快速、直觉、并行
- **System 2（符号）：** 慢速、推理、顺序
- **元认知：** 决定何时用哪个系统，如何在两者之间切换

重要背景：Kahneman 本人指出，System 1 和 System 2"并不真正存在于大脑中"——它们是认知科学对自动与唤醒处理的概念化捷径，不是独立的神经基底。这意味着：

1. 神经符号 AI 以 System 1/2 为设计框架，但该框架本身是简化的
2. 真正的 AGI 需要比 System 1/2 二分更精细的元认知控制架构
3. 元认知是连接神经直觉与符号推理的**调控接口**，而非第三种系统

---

## 元认知与可解释性的关系

[知识提取与忠实性](knowledge-extraction-fidelity.md) 关注的是事后描述（ex-post）——从已训练好的网络中提取符号描述。元认知关注的是**过程中调控**（in-process）——系统在推理过程中实时监控自身。

两者在最终目标上有交叉：都要求系统能够生成可检验的、准确的自我描述。但元认知在时态上是前向的（推理时），知识提取是后向的（训练后）。

---

## 实证案例：AlphaGeometry

**AlphaGeometry（Google）** 是 2020–2024 年间唯一被认定为跨越全部四个主要研究区域的项目，也是元认知维度实现最完整的案例：

- 神经语言模型生成候选定理和构造（System 1 — 快速、直觉）
- 符号演绎引擎验证候选答案（System 2 — 精确、逻辑）
- 系统知道何时生成候选、何时触发验证（元认知 — 任务分配）
- 在国际数学奥林匹克几何题上达到金牌水平

AlphaGeometry 的架构是 Type 3 神经符号集成（见 [Kautz 分类法](neurosymbolic-ai-taxonomy.md)）的具体实现，也是元认知在实践中最可见的体现。

---

## 研究进展（2020–2024）

**元强化学习近似元认知：** 结合强化学习与逻辑程序归纳，改善了金融交易策略的自适应性。

**认知架构 + LLM 集成：** 将 ACT-R、Soar、Sigma 等认知架构与大型语言模型融合，利用认知架构的元层结构为 LLM 提供元认知框架。

**Common Model of Cognition（CMC）：** 提供统一的人类认知框架，多个项目将神经符号方法与 CMC 对齐，寻求可实现的元认知路径。

---

## 与现有 Wiki 概念的关联

- **[system-1-vs-system-2](system-1-vs-system-2.md)** — 元认知是 System 1/2 二分框架之上的调控层，也是 Kahneman 自我批评的关键概念
- **[neurosymbolic-ai](neurosymbolic-ai.md)** — 元认知是神经符号 AI 向 AGI 演化的核心缺失能力
- **[neurosymbolic-ai-taxonomy](neurosymbolic-ai-taxonomy.md)** — 元认知对应 Type 6（Neuro[Symbolic]）目标的内部调控层
- **[knowledge-extraction-fidelity](knowledge-extraction-fidelity.md)** — 与元认知在目标上有交叉，但在时态和机制上不同
- **[mechanistic-interpretability](mechanistic-interpretability.md)** — MI 是事后理解神经网络，元认知是系统在运行时自我理解
- **[agent-reliability-evaluation](agent-reliability-evaluation.md)** — 元认知能力是 agent 长时可靠性的关键变量：能监控和调整自身的 agent 比不能的失败更少

---

## References

- arXiv:2501.05435 (2025). Neuro-Symbolic AI in 2024: A Systematic Review. [wikis/sources/2501.05435-neurosymbolic-ai-2024-systematic-review.md](../sources/2501.05435-neurosymbolic-ai-2024-systematic-review.md)
