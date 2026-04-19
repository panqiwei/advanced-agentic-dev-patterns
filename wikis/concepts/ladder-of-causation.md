# 因果之梯（Ladder of Causation）

因果之梯是 [Judea Pearl](../entities/judea-pearl.md) 提出的因果推理三级抽象层次，刻画了从被动观察到主动干预再到想象性反事实推理的认知跃迁。每一级能回答前一级无法回答的问题。

## 三级结构

### 第一级：关联（Association）— 观察 / seeing

- **问题形式**: "观察到 X 时，Y 的概率是多少？"
- **数学语言**: P(Y|X)
- **能力**: 发现数据中的规律、相关性、模式
- **局限**: 无法区分因果与虚假相关。"冰淇淋销量与溺水率正相关"不意味着冰淇淋导致溺水。

当前大多数机器学习系统——包括深度学习——运作在这一层级。它们擅长发现复杂的关联模式，但无法回答"如果我做了 X 会怎样"。

### 第二级：干预（Intervention）— 行动 / doing

- **问题形式**: "如果我做了 X，Y 会怎样变化？"
- **数学语言**: P(Y|[do(X)](do-calculus.md))
- **能力**: 预测主动行动的后果，区分因果与混淆
- **实现方式**: 随机对照试验，或在 [因果 DAG](causal-dag.md) 上应用 [do 演算](do-calculus.md)

do 算子的关键语义：干预是对世界的"微型手术"，切断被干预变量的所有原因，仅观察它对下游变量的影响。

### 第三级：反事实（Counterfactual）— 想象 / imagining

- **问题形式**: "如果当初 X 不同，Y 是否会不同？"
- **数学语言**: P(Y_x(u)) — 个体 u 在假设 X=x 下的潜在结果
- **能力**: 回顾性地评估个体层面的因果归属，区分直接效应与间接效应
- **实现方式**: 溯因（Abduct）→ 行动（Act）→ 预测（Predict）三步法

反事实推理需要 [结构因果模型](structural-causal-model.md) 的完整规格——不仅是 DAG 的定性结构，还需要结构方程的具体函数形式。

## 不可还原性

每一级严格强于前一级：
- 第二级的问题无法仅靠第一级的数据回答（辛普森悖论即其反例）
- 第三级的问题无法仅靠第二级的实验回答（同一干预效果下，不同个体的反事实可能不同）

这种不可还原性意味着：仅靠更多数据或更大的模型无法从关联层跃迁到干预层——需要因果结构的知识。

## Pearl 2010 综述中的具体展开

Pearl 2010 综述用具体的分析工具展示了三级跃迁的内在逻辑：

- **第二级（干预）的操作化**: 通过 [后门准则](backdoor-criterion.md) 和 [前门准则](frontdoor-criterion.md)，将 do 表达式转换为观测表达式。这是从第一级到第二级的桥梁——但桥梁的搭建需要因果假设（图结构），仅靠数据不够。
- **第三级（反事实）的独有问题**: [中介分析](mediation-analysis.md) 中的自然直接/间接效应和 [因果概率](probability-of-causation.md)（PN/PS/PNS）都属于第三级——它们无法用 do 算子表达，无法从实验中回答，但在特定条件下可以从数据中识别。
- **反事实的经验内容**: Pearl 展示了 PN 在特定数据组合下可以达到概率一的惊人结果，证明反事实不是空洞的哲学思辨，而是有实证内容的量。

## 与 wiki 已有概念的关系

- **[结构因果模型](structural-causal-model.md)**: SCM 是支撑三级推理的统一数学框架
- **[do 演算](do-calculus.md)**: 因果之梯第二级的操作工具
- **[因果 DAG](causal-dag.md)**: 因果之梯所有层级的图形化表示基础
- **[中介分析](mediation-analysis.md)**: 横跨第二级（CDE）和第三级（NDE/NIE）的分析方法
- **[因果概率](probability-of-causation.md)**: 第三级的典型查询——"效果的原因"问题

## 神经符号视角（Garcez & Lamb 2020）

Garcez & Lamb 指出，神经符号 AI 是超越因果之梯第一级（关联）的关键路径：

- **纯深度学习** 停留在第一级（关联层），擅长发现复杂统计模式，但无法回答干预和反事实问题
- **神经符号系统** 可以跨越三级：一旦网络编码了符号描述（如 A→B），干预查询（"如果 A 不发生…"）和反事实推理即成为可能
- [命题固着](propositional-fixation.md) 是纯神经网络被限制在第一级的根本原因——一阶逻辑推理（第二、三级所需）超出神经网络的表达边界

这一连接将 Pearl 的因果层级与 [Kautz 六类分类法](neurosymbolic-ai-taxonomy.md)挂钩：Type 6（完全集成）是实现全谱因果推理的架构目标。

## References

- Pearl, Judea; Mackenzie, Dana (2018). *The Book of Why*. Basic Books.
- Pearl, Judea (2021). "Causal and Counterfactual Inference". In *The Handbook of Rationality*. MIT Press.
- Pearl, Judea (2010). "An Introduction to Causal Inference." *The International Journal of Biostatistics*, 6(2). `sources/pearl-intro-causal-inference-2010.md`
- `sources/wikipedia-causal-model.md`
