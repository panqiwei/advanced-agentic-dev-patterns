# 结构化输出（Structured Outputs）

## 定义

结构化输出指 LLM 的生成结果被强制约束为符合预定义 schema 的格式（通常是 JSON Schema）。区别于 JSON mode（只保证合法 JSON）或 prompt 工程（依赖模型自觉），结构化输出通过推理阶段的硬性机制保证格式合规。

OpenAI 于 2024 年 8 月将其标准化为 API 功能，底层使用[约束解码](constrained-decoding.md)技术实现。

## 两种形式

**1. 工具调用中的严格模式（Function calling with strict: true）**

在 `tools` 定义中设置 `strict: true`，模型输出的 function call 参数将严格符合 `parameters` 中的 schema。

**2. 响应格式约束（response_format: json_schema）**

```json
"response_format": {
  "type": "json_schema",
  "json_schema": {
    "name": "math_response",
    "strict": true,
    "schema": { ... }
  }
}
```

适用于任意生成场景，不限于工具调用。

## 技术机制

底层依赖[约束解码](constrained-decoding.md)：

1. **Schema → CFG**：将 JSON Schema 编译为[上下文无关文法](context-free-grammar-llm.md)
2. **预处理 + 缓存**：首次请求时预处理 schema，生成采样所需的制品（artifact）并缓存
3. **Token Masking**：每步采样后，根据当前已生成 token 和 CFG 规则，将非法 next token 的概率 mask 为 0
4. **动态约束**：合法 token 集随生成状态动态变化（`{"val` 已生成后，`{` 不再合法）

## 与 JSON mode 的区别

| | JSON mode | Structured Outputs |
|---|---|---|
| 保证 | 合法 JSON | 符合 schema 的 JSON |
| 机制 | 提示 + 一定程度的软约束 | 推理时 token masking |
| 错误率 | ~11.97% | <0.1%（evals 实测 0%）|
| 递归 schema | 无法保证 | 支持（CFG 天然处理递归）|

## 局限性

- 仅支持 JSON Schema 子集（非全集）
- 首次请求有延迟（schema 预处理，通常 <10 秒，复杂 schema 可达 1 分钟）
- 安全拒绝（refusal）情形下 schema 约束失效，返回 `refusal` 字段
- 不防范值层面的语义错误（如数学计算步骤错误）
- 与并行 function calling 不兼容

## 隐性代价：轨迹偏差

Schall & de Melo（RANLP 2025）在 11 个模型的跨基准实验中发现：即使结构化输出在句法层面完全合规，约束机制也会系统性地损害**语义正确性**。这一现象被命名为**[轨迹偏差](trajectory-bias.md)**。

核心机制：约束解码在每步 token 采样时掩码非法 token 并重归一化，当合法 token 集合的初始概率极低时，重归一化变成大扰动。跨多步累积后，解码路径被推离语义最优方向，推向"更容易保持结构合法"的分支——即使这些分支对应错误答案。

这意味着：**格式合规率不是结构化输出质量的充分评估指标**。产品和研究中均应同时监测任务语义正确率。

## 与符号主义/联结主义的交汇

结构化输出是**符号规则约束神经生成**的经典范例：
- 联结主义：神经网络在 token 概率分布上预测
- 符号主义：形式文法规则明确限定合法序列

两者在推理时合流：模型的"直觉"（概率）在符号规则的"理性"（文法）框架内运作。这是 ch-07 符号主义 vs 联结主义章节的核心机制案例。

参考开源先驱：[outlines](https://github.com/outlines-dev/outlines)、[jsonformer](https://github.com/1rgs/jsonformer)、[instructor](https://github.com/jxnl/instructor)、[guidance](https://github.com/guidance-ai/guidance)、[lark](https://github.com/lark-parser/lark)

## 相关概念

- [约束解码](constrained-decoding.md) — 底层技术机制
- [轨迹偏差](trajectory-bias.md) — 约束解码引发的语义代价
- [上下文无关文法（LLM 应用）](context-free-grammar-llm.md) — schema 的形式化表示
- [ACI](aci.md) — 结构化输出是机器可验证的接口契约
- [Tool design](tool-design.md) — schema 即工具参数的 formal specification
- [Guardrails](guardrails.md) — 结构化输出是输出侧的格式 guardrail

## Anthropic 的实现视角

Anthropic 文档（2024 年持续更新）从工程实践角度补充了几个 OpenAI 文档未详述的细节：

**API 参数设计**（Anthropic 特有）：

```json
"output_config": {
  "format": {
    "type": "json_schema",
    "schema": { ... }
  }
}
```

与 OpenAI 的 `response_format` 等效，但参数命名不同。功能上，Anthropic 同样区分：① JSON outputs（`output_config.format`）控制响应格式，② Strict tool use（`strict: true`）验证工具参数。

**文法缓存的精细化规则**：

Anthropic 明确：只改 `name` 或 `description` 字段**不触发**文法缓存失效；改变 schema 结构（新增/删除字段、修改类型）**才会**触发重新编译。这对降低反复迭代的延迟成本有直接意义。

**可选参数是 grammar 复杂度的核心驱动**：

> "Each optional parameter roughly doubles a portion of the grammar's state space."

这是对[约束解码](constrained-decoding.md)复杂度的精确建模——必填参数在 grammar 中有唯一路径，每个可选参数引入分支。实践建议：尽量将参数设为 required。

**文法作用域与 Extended Thinking**：

文法约束只作用于 Claude 的直接输出，不影响 thinking 标签。文法状态在各区段间重置——Claude 可以在思考阶段自由使用自然语言，最终响应再受 schema 约束。这是对[轨迹偏差](trajectory-bias.md)的工程级缓解：推理自由区间保留后，最终格式化输出。

**SDK 自动降级变换**：

Python/TypeScript/Ruby/PHP SDK 会自动将不支持的约束（`minimum`/`maximum`/`minLength`/`maxLength`）转为字段描述文字，在客户端用原始约束验证响应。接口降级兼容策略：向 API 发送简化 schema，本地恢复完整验证。

## References

- `sources/openai_official/introducing-structured-outputs-in-the-api.md`
- `sources/anthropic_official/structured-outputs.md`
- Schall, Maximilian and de Melo, Gerard. "The Hidden Cost of Structure." RANLP 2025, pp. 1074–1084. `sources/ranlp-2025-hidden-cost-constrained-decoding.md`
