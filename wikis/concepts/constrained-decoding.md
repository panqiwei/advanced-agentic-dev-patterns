# 约束解码（Constrained Decoding）

## 定义

约束解码（constrained decoding，又称 constrained sampling）是一种在 LLM 推理时限制合法输出 token 集合的技术。默认情况下，模型在整个词表（vocabulary）上采样——这种无约束采样允许模型在任何时刻输出任何 token，包括在语法上不合法的 token。约束解码通过在每步采样前构造合法 token 的掩码（mask），将非法 token 的概率强制置零。

## 核心挑战：约束的动态性

约束解码的关键难点在于合法 token 集合随生成上下文动态变化：

- 输出开始时，合法 next token 包括 `{`、`{"` 等
- 当已生成 `{"val` 时，`{` 不再合法——合法集已收窄

因此必须实现**动态约束解码**：每步采样后，根据当前已生成序列重新计算合法 next token 集合。

## 实现方式

### 基于上下文无关文法（CFG）

OpenAI Structured Outputs 采用的方式：

1. 将 JSON Schema 编译为 [CFG](context-free-grammar-llm.md)
2. 预处理 CFG 并缓存（首次请求一次性开销）
3. 推理时，每步根据 CFG 规则和当前状态计算合法 token 集
4. 将非法 token 概率 mask 为 0，再采样

CFG 的优势：能够表达递归结构（如嵌套 JSON 对象），这是 FSM 无法原生处理的。

### 基于有限状态机（FSM）

outlines、guidance 等开源库早期采用的方式：

1. 将正则表达式或 schema 转换为 FSM
2. 推理时维护 FSM 状态，每步采样后转移状态
3. 合法 token = 当前状态下 FSM 接受的 token 集合

FSM 更简单、部分场景更高效，但无法处理递归 schema。遇到递归结构时需引入深度限制等变通。

### CFG vs FSM 对比

| 维度 | CFG（OpenAI 方式）| FSM（outlines 等）|
|---|---|---|
| 表达能力 | 更强，处理递归结构 | 较弱，需深度限制 |
| 实现复杂度 | 较高 | 较低 |
| 常规 schema 效率 | 预处理后高效 | 通常高效 |
| 递归 schema | 原生支持 | 需要变通 |

## 效果

据 OpenAI 数据（2024 年）：

- 旧版 JSON mode：~11.97% 格式错误率
- Structured Outputs（CFG 约束解码）：<0.1%（复杂 schema evals 测试中达到 0%）

## 开源先驱

约束解码这一思想在学术和开源社区早于 OpenAI 的 API 功能存在，OpenAI 明确引用的先驱：

- **outlines**（dottxt-ai）：正则/CFG 约束解码的主要开源实现
- **jsonformer**：专用于 JSON 的约束解码库
- **guidance**（Microsoft）：复杂约束生成框架
- **instructor**：pydantic schema → LLM 输出的高级封装
- **lark**：通用 CFG 解析库，被约束解码系统所使用

## 与 LLM 架构的关系

约束解码是在**推理层**介入，不涉及训练。它改变的不是模型权重，而是采样过程。这使得同一模型可以在约束解码模式下完美遵从 schema，同时在自由生成模式下保持创造力——两种模式的切换是运行时的。

这是符号主义与联结主义交汇的典型形式：符号规则（文法）对神经网络输出的运行时约束。

## 隐性代价：轨迹偏差

Schall & de Melo（RANLP 2025）发现一个被忽视的系统性问题：约束解码可能在句法完全合规的前提下损害**语义正确性**。

当严格格式要求强制进行低熵语法决策（如 JSON 的 `{`、`"`、`,`）时，模型在合法选项上分配的概率极低，重归一化变成大扰动。跨多步累积此扰动引发**[轨迹偏差](trajectory-bias.md)**——解码路径被推向更容易保持结构合法的前缀，而非语义最正确的前缀。

关键实验发现：
- **指令微调模型**受轨迹偏差影响更重：对话训练目标与文法约束形成摩擦
- **基础模型**适应更好：无对话训练的内部目标，摩擦较小
- 约束模型从额外 few-shot 示例中获益比无约束模型**更陡**
- 当前"训练为对话、推理时施加约束"的范式存在根本性错位，需要将约束纳入训练阶段

这意味着约束解码的效果评估不能仅看**格式合规率**，还必须检测**任务语义正确率**——两者可以同时优化，也可以相互权衡。

## 推理能力与约束的权衡

CRANE（Beurer-Kellner et al., 2025）从理论上证明：将输出限制到只允许句法合法最终答案的严格文法，会减弱模型的推理能力。CRANE 的解决方案是扩充文法，在最终答案之前插入自由文本推理区间，在结构合规与推理自由之间取得平衡。

## JSONSchemaBench：实际覆盖率的缺口

JSONSchemaBench（2025，arXiv:2501.10868）在 10K 真实世界 JSON Schema 上测试六个主流约束解码框架（Guidance、Outlines、Llamacpp、XGrammar、OpenAI、Gemini），发现：
- 没有任何开源框架能处理全部 10K schema（尤其在含 `$ref`、`anyOf`/`oneOf`、递归结构的复杂 schema 上失败率显著上升）
- API 方案（OpenAI、Gemini）覆盖率更高但不透明
- 编译延迟随 schema 复杂度非线性增长

## Anthropic 的术语：Grammar-Constrained Sampling

Anthropic 文档将约束解码称为 **grammar-constrained sampling**（文法约束采样），在术语层面与 OpenAI 的 "constrained decoding" 等义。两者都描述同一机制：将 schema 编译为文法制品，在每步采样时用文法规则 mask 非法 token。

Anthropic 文档明确了**可选参数对 grammar 状态空间的指数影响**：

> "Each optional parameter roughly doubles a portion of the grammar's state space."

这是约束解码复杂度分析的精确建模：必填字段在 grammar 中有单一路径，每个可选字段引入"是否出现"的分支，使状态空间成指数增长。Anthropic 因此对 schema 施加明确的复杂度限制（可选参数总数上限），并在超限时返回 400 错误"Schema is too complex for compilation."。

Anthropic 还额外规定了**文法作用域**：grammar 只约束 Claude 的直接输出，不约束 thinking 标签（Extended Thinking）——grammar 状态在 thinking 和最终响应区段之间重置。这为模型保留了推理阶段的自由度，符合 CRANE 方案的精神。

## 神经符号 AI 视角

从 [Kautz 六类分类法](neurosymbolic-ai-taxonomy.md) 来看，约束解码是 **Type 4**（符号知识编译进神经）的工程实例：JSON Schema 等符号规则被编译为 CFG，在推理时约束神经采样。这是神经符号集成在工业界最普遍的隐式形态。

但 [轨迹偏差](trajectory-bias.md) 研究揭示了这一集成方式的代价——符号约束干扰了神经网络的语义最优路径。这印证了 Garcez & Lamb 关于"耦合越紧，训练越难"的预测：Type 4 系统在推理时施加符号约束，与训练目标存在错位（训练为对话、推理时施加文法），是一种不完整的符号-神经集成。

完整的神经符号循环应将符号约束纳入训练阶段，而非仅在推理时追加。见 [neurosymbolic-ai](neurosymbolic-ai.md)。

## 相关概念

- [结构化输出](structured-outputs.md) — 约束解码在 API 层的应用
- [轨迹偏差](trajectory-bias.md) — 约束解码引发的核心语义代价
- [上下文无关文法（LLM 应用）](context-free-grammar-llm.md) — CFG 方式的形式基础
- [ACI](aci.md) — 约束解码是机器可验证接口契约的技术底层
- [neurosymbolic-ai-taxonomy](neurosymbolic-ai-taxonomy.md) — 约束解码对应 Kautz Type 4 神经符号集成

## References

- `sources/openai_official/introducing-structured-outputs-in-the-api.md`
- `sources/anthropic_official/structured-outputs.md`
- Schall, Maximilian and de Melo, Gerard. "The Hidden Cost of Structure." RANLP 2025, pp. 1074–1084. `sources/ranlp-2025-hidden-cost-constrained-decoding.md`
- Willard, Brandon T. and Louf, Rémi. "Efficient Guided Generation for Large Language Models." arXiv:2307.09702, 2023.
- Beurer-Kellner et al. "CRANE: Reasoning with Constrained LLM Generation." arXiv:2502.09061, 2025.
- Ranchin, Nathan et al. "JSONSchemaBench." arXiv:2501.10868, 2025.
