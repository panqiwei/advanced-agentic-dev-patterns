# Introducing Structured Outputs in the API

## 元数据

- **来源**: `sources/openai_official/introducing-structured-outputs-in-the-api.md`
- **原始 URL**: https://openai.com/index/introducing-structured-outputs-in-the-api/
- **作者**: OpenAI（Chris Colby, Melody Guan, Michelle Pokrass, Ted Sanders, Brian Zhang 等）
- **发布时间**: 2024-08-06

## 摘要

OpenAI 于 2024 年 8 月宣布 Structured Outputs（结构化输出）功能正式可用。该功能通过将 JSON Schema 编译为上下文无关文法（context-free grammar，CFG），再用 CFG 约束解码过程（constrained decoding），确保模型输出**完全符合**开发者提供的 JSON Schema——理论上实现 100% 合规率（evals 测试中 gpt-4o-2024-08-06 达到 100%，而旧版 gpt-4-0613 仅约 40%）。

## 核心论点

1. **问题定位**：JSON mode 只能保证输出是合法 JSON，无法保证符合特定 schema。开发者长期依赖重试、提示工程、开源工具（outlines/jsonformer/instructor）作为变通手段。

2. **技术机制**：
   - 将 JSON Schema → CFG（上下文无关文法）
   - 预处理 CFG 并缓存（首次请求有延迟，后续复用无延迟）
   - 每个 token 采样步骤后，根据已生成 token + CFG 规则动态计算合法 next token 集合
   - 将非法 token 的概率 mask 为 0（**token masking**）

3. **CFG vs FSM**：同类方法（outlines 等）常用有限状态机（FSM），但 CFG 能表达 FSM 无法处理的递归结构（如 JSON Schema 中的嵌套 UI 组件）。

4. **两种使用形式**：
   - `tools` 接口：`strict: true` 约束 function calling 的参数格式
   - `response_format`：`{"type": "json_schema", "json_schema": {...}}` 直接约束生成内容格式

5. **局限性**：
   - 仅支持 JSON Schema 的子集
   - 首次请求有额外延迟（schema 预处理）
   - 安全拒绝（refusal）会绕过格式约束
   - 不防范值层面的语义错误

## 关键洞见

> "We convert the supplied JSON Schema into a context-free grammar (CFG)... we pre-process its components to make it easily accessible during model sampling."

这揭示了一个本质：**Structured Outputs 不是在训练层面解决格式合规，而是在推理层面的硬性约束**。模型在采样时的"自由度"被语法规则削减——它在合法 token 的子集上选择，而不是在整个词表上选择。这是一种**符号规则约束神经生成**的混合机制，正是符号主义与联结主义的交汇点。

## 与 wiki 其他内容的关联

- [约束解码](../concepts/constrained-decoding.md) — 本文最核心的技术机制
- [上下文无关文法（LLM 应用）](../concepts/context-free-grammar-llm.md) — 将 CFG 编译到 LLM 采样路径上
- [结构化输出](../concepts/structured-outputs.md) — 该功能的综合概念页
- [ACI](../concepts/aci.md) — 结构化输出是 ACI 的一种强化形式：机器可验证的接口契约
- [Tool design](../concepts/tool-design.md) — schema 即工具接口的 formal specification
- [OpenAI](../entities/openai.md) — 发布主体

## References

- `sources/openai_official/introducing-structured-outputs-in-the-api.md`
