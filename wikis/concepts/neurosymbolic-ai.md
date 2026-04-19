# 神经符号 AI（Neurosymbolic AI）

**定义：** 将神经网络的学习能力与符号系统的推理能力原理性地结合起来的 AI 范式。核心目标是让系统同时具备感知/学习（神经）和知识表示/逻辑推理（符号）的能力。

---

## 基本定位

神经符号 AI 是对"神经 vs 符号"二元争论的超越，将问题重新定位为：**如何在同一系统中让分布式表示（擅长学习）和局部主义表示（擅长推理）协同工作？**

从 Kahneman 的认知框架看：
- **System 1**（神经）：快速、并行、模式识别、概率预测
- **System 2**（符号）：慢速、顺序、逻辑推理、因果识别

神经符号 AI 的目标是让机器同时拥有两种能力，而不是在两者之间选择。详见 [system-1-vs-system-2](system-1-vs-system-2.md)。

---

## 为什么需要神经符号集成

### 深度学习的局限

- **脆弱性：** 对抗攻击敏感，分布外样本泛化差
- **缺乏可解释性：** 没有形式化定义的计算语义
- **过度依赖数据：** 数据和计算需求过高
- **命题固着：** 神经网络最多表示一阶逻辑的片段，无法表示完整的一阶或高阶逻辑（McCarthy 的诊断）

### 纯符号系统的局限

- 感知能力弱：难以从原始数据学习
- 知识获取瓶颈：手工构建知识库成本极高
- 计算效率：贝叶斯网络等推理方法往往需要近似

### 互补的根本性

**量化不对称性：**
- 学习擅长**存在量化**（∃x P(x)）——只需找到一个例子
- 推理擅长**全称量化**（∀x P(x)）——可以从前提逻辑导出

这种内在互补使神经与符号天然形成搭档。

---

## Kautz 六类架构分类法

详见 [neurosymbolic-ai-taxonomy](neurosymbolic-ai-taxonomy.md)。简述：

| 类型 | 耦合程度 | 代表系统 |
|---|---|---|
| Type 1（Symbolic_Neuro_Symbolic）| 最松 | Transformer NLP |
| Type 2（Symbolic[Neuro]）| 松 | AlphaGo |
| Type 3（Neuro;Symbolic）| 中 | NS-CL, deepProbLog |
| Type 4（Neuro:Symbolic→Neuro）| 较紧 | Logical Neural Networks |
| Type 5（Neuro_Symbolic）| 紧 | Logic Tensor Networks |
| Type 6（Neuro[Symbolic]）| 最紧 | （理想目标，尚未完全实现）|

**耦合谱的含义：** 越紧耦合，系统越可验证（逻辑保证强），但越难训练（端到端梯度信号弱）。

---

## 核心要素（Garcez & Lamb 2020）

1. **梯度优化** — 处理大规模数据的学习基础
2. **模块性** — 用符号组合引用神经网络的功能块
3. **符号语言** — 一阶逻辑/非单调逻辑/模态逻辑/逻辑程序
4. **推理** — 网络内部（分布式）或外部（符号）均可，精确或近似
5. **约束满足** — 学习与推理相互驱动的闭环

---

## 理想应用场景

**复杂概念学习：** 需要从简单概念组合出高层概念，同时处理通则与例外。

**关系学习：** 学习"祖先"关系（从父母/祖父母数据中归纳）——纯神经方法在推理链任意长时失效；符号规则如 ∀X,Y: father(X,Y) → ancestor(X,Y) 可以外推。

**非单调推理：** 结论可以在新证据出现时被修正，这对鲁棒性至关重要。

---

## 与因果推理的连接

[Pearl 因果之梯](ladder-of-causation.md) 三级（关联→干预→反事实）在神经符号框架中均可实现。一旦网络编码了符号描述 A→B，就可以进行干预查询（"如果 A 不发生…"）和反事实推理，而纯神经系统停留在因果之梯第一级。

---

## 可解释 AI 中的地位

神经符号 AI 为可解释 AI 提供了理论基础：通过知识提取（knowledge extraction），将神经网络学到的知识用符号语言描述出来。

关键标准：**忠实性（fidelity）** — 提取的知识对网络行为的描述准确度，而非对数据的拟合度。LIME 等方法虽流行，但忠实性极低，因此不满足这一标准。

---

## 工程化体现

当代工程中已有多种隐式的神经符号集成：
- **约束解码**（[constrained-decoding](constrained-decoding.md)）：用 CFG/FSM 符号规则约束神经生成——这是 Type 4/5 的工程实现
- **结构化输出**（[structured-outputs](structured-outputs.md)）：JSON Schema 约束 LLM 生成——Type 1/4 的产品化形态
- 但 [轨迹偏差](trajectory-bias.md) 研究揭示：符号约束并非无代价，会干扰神经网络的语义最优路径

---

## 2020–2024 实证研究分布（系统综述数据）

2025 年 PRISMA 系统综述（arXiv:2501.05435）对 167 篇 2020–2024 年 NSAI 论文的研究分布分析：

| 研究维度 | 论文占比 | 研究状况 |
|---|---|---|
| 学习与推理 | 63% | 主流，集中在应用 |
| 知识表示 | 44% | 较充分 |
| 逻辑与推理 | 35% | 中等 |
| 可解释性与可信度 | 28% | **明显欠缺** |
| [元认知](meta-cognition-ai.md) | **5%** | **严重欠缺，通往 AGI 的关键缺口** |

**关键发现：** AlphaGeometry（Google）是唯一同时覆盖全部四个主要区域的项目——神经语言模型生成候选定理，符号演绎引擎验证，在国际数学奥林匹克几何题上达到金牌水平。

NSAI 研究论文数量从 2020 年的 53 篇增长到 2023 年的 236 篇，呈指数级增长，说明 Kautz "不会有第三个冬天" 的论断在 2020–2024 实证数据上获得了支持。

## 五维功能分类（与 Kautz 六类的互补）

[Kautz 六类分类法](neurosymbolic-ai-taxonomy.md) 从**架构结构**出发。2024 年系统综述另提出五维**功能/研究焦点**分类：

1. **知识表示** — 神经与符号表示如何整合
2. **学习与推理** — 端到端可微推理
3. **可解释性与可信度** — 透明推理，AI 安全
4. **逻辑与推理** — 逻辑-概率集成
5. **元认知** — 系统监控/调整自身推理（见 [meta-cognition-ai](meta-cognition-ai.md)）

两套分类正交互补：六类描述神经与符号**怎么连**，五维描述研究在**做什么**。

## 历史起点：Fodor & Pylyshyn 的挑战

神经符号 AI 研究纲领的历史起点之一是 Fodor & Pylyshyn（1988）的[系统性论证](systematicity.md)：联结主义系统无法保证认知的系统性（能思考"John loves Mary"就能思考"Mary loves John"），因为它缺乏组合句法结构。

这个挑战在第三波神经符号 AI 中依然悬而未决：
- 实现层应对（张量积表征、调和理论）提供了理论框架
- 实证研究（[Dhar & Søgaard 2024](../sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md)）显示 LLM 展示了部分但不稳定的组合性：规模提升组合能力，指令微调降低组合能力
- 架构保证的系统性（Fodor & Pylyshyn 所要求）与训练涌现的系统性（联结主义所能提供）之间的鸿沟仍然存在

Smolensky（1988）的[亚概念层](subconceptual-level.md)理论是神经符号 AI 第三波的直接理论前身——将符号规则定位为亚概念动力学的涌现近似，而非字面机制。

---

## References

- d'Avila Garcez, A. & Lamb, L.C. (2023). Neurosymbolic AI: The 3rd Wave. *Artificial Intelligence Review*. [wikis/sources/2012.05876-neurosymbolic-ai-third-wave.md](../sources/2012.05876-neurosymbolic-ai-third-wave.md)
- Kautz, H. (2022). The Third AI Summer: AAAI Robert S. Engelmore Memorial Lecture. *AI Magazine*, 43(1), 105-125.
- arXiv:2501.05435 (2025). Neuro-Symbolic AI in 2024: A Systematic Review. [wikis/sources/2501.05435-neurosymbolic-ai-2024-systematic-review.md](../sources/2501.05435-neurosymbolic-ai-2024-systematic-review.md)
- Fodor, J. A., & Pylyshyn, Z. W. (1988). Connectionism and cognitive architecture. *Cognition*, 28(1–2), 3–71. → [`sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md`](../sources/fodor-pylyshyn-1988-connectionism-cognitive-architecture.md)
- Smolensky, P. (1988). On the proper treatment of connectionism. *Behavioral and Brain Sciences*, 11(1), 1–23. → [`sources/smolensky-1988-proper-treatment-connectionism.md`](../sources/smolensky-1988-proper-treatment-connectionism.md)
- Dhar, R., & Søgaard, A. (2024). From words to worlds. *arXiv:2407.13419*. → [`sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md`](../sources/2407.13419-from-words-to-worlds-compositionality-cognitive-architectures.md)
