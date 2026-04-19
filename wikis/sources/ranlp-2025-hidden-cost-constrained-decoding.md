# The Hidden Cost of Structure: How Constrained Decoding Affects Language Model Performance

## 元数据

- **来源**: `sources/ranlp-2025-hidden-cost-constrained-decoding.md`
- **原始 URL**: https://aclanthology.org/2025.ranlp-1.124/
- **作者**: Maximilian Schall, Gerard de Melo
- **发布时间**: 2025-09（RANLP 2025，第 1074–1084 页，Varna, Bulgaria）

## 摘要

本文系统研究了约束解码（constrained decoding）对 LLM 推理质量的隐性代价。通过对 11 个模型的跨基准实验，作者发现：即使在句法层面完全合规的情况下，结构性约束也会系统性地损害语义正确性——这一现象被命名为**轨迹偏差**（trajectory bias）。

## 核心发现

### 轨迹偏差（Trajectory Bias）

约束解码在每个 token 生成步骤中改变模型的概率分布：
1. **掩码非法 token**：将违反文法约束的 token 概率归零
2. **重归一化**：在剩余合法 token 集合上重新分配概率

当严格格式要求强制进行低熵语法决策（如 JSON 中的 `{`、`"`、`,`）时，模型可能只为合法选项分配极小概率。此时重归一化变成一次大扰动。跨多步重复此过程引发**轨迹偏差**：解码路径被系统性地推向"更容易保持结构合法的前缀"，即使这些前缀对应错误的推理结果。

日志概率分析证实：约束解码强迫模型从其偏好的自然语言模式转向低置信度的结构化替代路径，**模型的推理轨迹**（编码在 token 序列中的中间计算过程）在产出最终答案之前就已被损坏。

### 基础模型 vs 指令微调模型的分歧

- **基础模型**对结构约束适应更好——没有指令微调意味着其自然生成偏好与文法之间摩擦更小
- **指令微调模型**表现出明显摩擦——对话训练产生的内部目标与严格结构约束冲突，模型同时满足两套目标的代价体现在生成语义次优 token 上

结论：**当前指令微调实践可能无意间削弱了模型的结构化输出能力**。

### Few-shot 示例的非对称重要性

约束模型从额外 few-shot 示例中获益的斜率**比无约束模型更陡**。这意味着在约束存在的情况下，模型需要更多显式 in-context 引导来抵消约束扰动——自然语言推理灵活性被约束剥夺后，few-shot 成为主要代偿机制。成功的约束生成需要**同时具备适配的 prompt 和足够的 few-shot 示例**。

### 基础模型性能的预测价值

基础模型在约束条件下的性能可作为**指令微调后结构化输出能力的早期预测指标**，为模型开发团队提供实用评估工具。

### 训练时集成的必要性

当前范式（训练流畅对话，推理时施加约束）存在根本性错位。本文论证了**将结构约束集成到训练阶段**的必要性。

## 与文献的关联

- **Willard & Louf (2023, arXiv:2307.09702)**：Outlines 框架，奠定 FSM 约束解码的高效机制（O(1) 开销）——本文研究的正是这种高效语法约束的*语义代价*
- **CRANE (2025, arXiv:2502.09061)**：从理论上独立发现相同问题，提出通过扩充文法保留自由推理区间的算法解
- **JSONSchemaBench (2025, arXiv:2501.10868)**：互补的基准研究，发现当前约束解码框架在真实世界 schema 上有显著覆盖率和质量缺口
- **Draft-Conditioned Constrained Decoding (Castillo, Schall & de Melo, 2025, arXiv:2603.03305)**：同一团队的后续工作，通过草稿-格式两阶段分离来缓解轨迹偏差

## 对符号主义 vs 联结主义主题的意义

本文为 ch-07 提供了**实验层面的核心证据**：
- 联结主义计算（梯度训练神经网络）产生针对流畅自然语言优化的分布式连续表征
- 符号约束（文法、schema）在输出层面施加离散、硬边界结构

轨迹偏差是这种张力的可测量体现：**格式本身改变了思考过程**。模型并非只是"用不同格式写同样的答案"——约束在每个 token 步骤上的干预累积改变了中间计算路径。这是联结主义与符号主义在 token 生成级别的交汇点产生的紧急代价，是两种范式单独分析时无法预测的。

## 关键概念连接

- [约束解码](../concepts/constrained-decoding.md) — 本文研究的技术机制
- [轨迹偏差](../concepts/trajectory-bias.md) — 本文命名和实证的核心现象
- [结构化输出](../concepts/structured-outputs.md) — 约束解码的应用目标
- [系统一 vs 系统二](../concepts/system-1-vs-system-2.md) — 推理能力与格式合规之间的权衡类比

## References

- `sources/ranlp-2025-hidden-cost-constrained-decoding.md`
- Schall, Maximilian and de Melo, Gerard. "The Hidden Cost of Structure." RANLP 2025, pp. 1074–1084.
