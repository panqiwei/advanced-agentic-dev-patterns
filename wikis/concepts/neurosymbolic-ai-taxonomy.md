# 神经符号 AI 分类法（Kautz 六类）

**定义：** Henry Kautz 在 AAAI 2020 Robert S. Engelmore 纪念讲座（"第三个 AI 之夏"）中提出的六类神经符号集成架构分类法。这是该领域迄今最具影响力的结构化分类框架，后续几乎所有综述均以此为参照。

---

## 命名规则

符号表示用于直观呈现神经（Neuro）与符号（Symbolic）的嵌套关系：
- `Symbolic_Neuro_Symbolic`：符号在外，神经在内
- `Symbolic[Neuro]`：符号框架内嵌神经
- `Neuro[Symbolic]`：神经框架内嵌符号（最紧耦合）
- 方括号 `[...]` 表示内嵌关系，分号 `;` 表示并行，下划线 `_` 表示包裹

---

## 六类详解

### Type 1：Symbolic_Neuro_Symbolic
**特征：** 符号输入 → 神经处理 → 符号输出。符号表示（文本词元）在边界处与神经计算交接，是当前 NLP 深度学习的标准范式。

**意义：** 确立了符号可以在输入/输出边界与神经计算接口——这是神经符号集成最基础的形式。

**代表系统：** Transformer 语言模型（文本翻译、问答）

---

### Type 2：Symbolic[Neuro]
**特征：** 总体架构是符号/结构化的，神经网络作为子组件嵌入。符号规划框架调用神经网络评估局部状态。

**耦合程度：** 松——神经与符号通过输入/输出接口交互，无梯度流通

**代表系统：** AlphaGo（Monte Carlo 树搜索 + 策略网络/价值网络）

---

### Type 3：Neuro;Symbolic
**特征：** 神经系统与符号系统并行/顺序运行，各自专化于不同任务（感知 vs 推理），通过接口交换信息。

**耦合程度：** 中——模块化任务分工，无梯度从符号流向神经

**代表系统：** Neuro-Symbolic Concept Learner（NS-CL）——神经做视觉感知，符号做查询回答；deepProbLog——神经做感知，概率逻辑程序做推理

---

### Type 4：Neuro:Symbolic→Neuro
**特征：** 符号知识被"编译"进神经网络的结构或训练过程。训练结束后，推理时不再需要符号机器。

**耦合程度：** 较紧——符号知识塑造神经基底，但推理阶段为纯神经

**特点：** 部分 Type 4 系统可提供正确性保证（correctness guarantees）

**代表系统：** Logical Neural Networks（LNN）——神经元与逻辑公式元素一一对应；将规则知识蒸馏进网络权重

---

### Type 5：Neuro_Symbolic
**特征：** 符号逻辑规则通过"张量化"映射为嵌入空间的软约束（正则化项），作用于网络损失函数。符号内容以分布式方式扩散进连续向量空间。

**耦合程度：** 紧——符号与神经通过可微损失函数融合，无干净的架构边界

**代表系统：** Logic Tensor Networks（LTN）——逻辑陈述作为损失函数约束；Tensor Product Representations

---

### Type 6：Neuro[Symbolic]
**特征：** 符号推理引擎嵌入神经引擎内部。目标：在神经基底内实现真正的组合推理（combinatorial reasoning）——精确符号推理在神经网络内部运行。

**耦合程度：** 最紧——神经与符号统一，无架构边界

**动机：** 实现 Kahneman 的"快思慢想"的完全集成版——System 1（神经，快）能够内生地调用 System 2（符号，慢）推理

**现状（截至 2020）：** 完整的 Type 6 系统尚不存在。早期神经符号工作（使用局部主义表示）部分达到了这一目标；近期基于注意力机制的研究有所进展。

---

## 耦合谱

```
Type 1 ←————————————————————————→ Type 6
最松耦合                        最紧耦合
可学习性高                      可验证性高
训练容易                        训练难
形式保证弱                      形式保证强
```

**核心权衡：** 耦合越紧，系统越可被形式化验证（逻辑保证强），但越难用梯度端到端训练。

---

## 与实际工程的对应

当代工程中的隐式实现：

| 工程实践 | 对应类型 | 说明 |
|---|---|---|
| Transformer + JSON Schema 约束解码 | Type 1/4 | 符号规则（schema）编译进采样约束 |
| LLM + 外部知识图谱查询 | Type 2/3 | 符号知识库与神经推理分离运行 |
| Logic Tensor Networks | Type 5 | 逻辑规则作为损失约束 |
| LIME 等后验解释 | 不属于任何类型 | 这是事后解释，不是架构级集成 |

注意：[约束解码](constrained-decoding.md) 在架构上是 Type 1 或 Type 4，但 [轨迹偏差](trajectory-bias.md) 研究揭示它并非无代价——符号约束会干扰神经网络的语义最优路径。

---

## 替代分类框架

Yu et al. (2021) 提出了功能性替代分类（三类）：
- **学习用于推理** — 神经网络学习符号推理所需的输入
- **推理用于学习** — 符号推理引导/约束神经学习
- **学习-推理** — 两者交织进行

Kautz 的分类从**架构结构**出发（更精确），Yu et al. 从**功能流向**出发（更直觉）。两者互补。

---

## Kautz 原始讲座的补充说明

以下来自 Kautz 本人的讲座原文（*AI Magazine*, 2022），作为对上述分类法的第一手来源补充：

**System 1/2 作为设计模板：** Kautz 明确将 Kahneman 框架不只作为比喻，而作为工程目标的规范——Type 6 的目标是在 System 1（神经）基底内实现 System 2（符号）推理，而非将两者分别运行。

**AlphaGo 作为存在性证明：** Type 2 系统已实现超人围棋表现，这对分类法有深刻意义：神经符号集成不只是理论愿景，在 2016 年已被证明有效。

**"不会有第三个冬天"：** Kautz 的预测——第三夏将通过神经符号融合演化，而非以资金撤退告终。这一预测塑造了 2020–2025 年间的领域研究议程。

**背景：** 分类法提出于 AAAI-2020（2020 年 2 月 10 日 Engelmore 纪念讲座），正式发表于 *AI Magazine* Vol. 43, No. 1（2022）。此前 Garcez & Lamb（2020）的引述是该分类法在学术文献中的首次传播。详见 [AI 三个夏天历史框架](ai-summers-history.md)。

## 替代分类框架

Yu et al. (2021) 提出了功能性替代分类（三类）：
- **学习用于推理** — 神经网络学习符号推理所需的输入
- **推理用于学习** — 符号推理引导/约束神经学习
- **学习-推理** — 两者交织进行

Kautz 的分类从**架构结构**出发（更精确），Yu et al. 从**功能流向**出发（更直觉）。两者互补。

---

## References

- Kautz, H. (2022). The Third AI Summer: AAAI Robert S. Engelmore Memorial Lecture. *AI Magazine*, 43(1), 105-125. DOI: 10.1002/aaai.12036 [wikis/sources/kautz-2022-third-ai-summer-engelmore-lecture.md](../sources/kautz-2022-third-ai-summer-engelmore-lecture.md)
- d'Avila Garcez, A. & Lamb, L.C. (2023). Neurosymbolic AI: The 3rd Wave. *Artificial Intelligence Review*. [wikis/sources/2012.05876-neurosymbolic-ai-third-wave.md](../sources/2012.05876-neurosymbolic-ai-third-wave.md)
