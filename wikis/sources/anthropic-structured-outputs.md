# Anthropic 结构化输出官方文档

## 元数据

- **来源**: `sources/anthropic_official/structured-outputs.md`
- **原始 URL**: https://docs.anthropic.com/en/docs/build-with-claude/structured-outputs
- **作者**: Anthropic
- **发布时间**: —（文档持续更新）

## 摘要

Anthropic 官方的结构化输出 API 文档，覆盖 Claude 的 JSON outputs 和 strict tool use 两种约束机制，底层使用 grammar-constrained sampling（文法约束采样）。文档详细描述了 API 参数设计、SDK 集成、文法编译缓存行为、schema 复杂度限制、数据保留规则和特性兼容性。

## 与 OpenAI 实现的关键差异

| 维度 | OpenAI | Anthropic |
|---|---|---|
| 响应格式参数 | `response_format: {type: "json_schema", ...}` | `output_config: {format: {type: "json_schema", ...}}` |
| 工具严格模式 | `strict: true`（tools 内） | `strict: true`（tools 内，相同） |
| 文法描述 | context-free grammar（CFG）| grammar（不区分 CFG vs FSM）|
| 缓存有效期 | 未明确（首次请求后缓存）| 24 小时（从上次使用计）|
| 缓存失效条件 | schema 变更 | schema 结构变更（name/description 不触发失效）|
| 复杂度模型 | schema 子集 + 首次延迟 | 明确的可选参数预算（每个可选参数约使 grammar 状态空间翻倍）|

## 核心洞见

### 1. 文法缓存的精细化语义

Anthropic 文档明确了一个 OpenAI 未详述的规则：**只改 `name` 或 `description` 字段不触发缓存失效**。这对提示工程有直接影响——工程师可以在不付出重新编译成本的前提下调整字段描述，而修改 schema 结构（新增/删除字段、改变类型）则必然触发重新编译。

### 2. 可选参数是 grammar 复杂度的核心驱动

"Each optional parameter roughly doubles a portion of the grammar's state space." 这是对约束解码复杂度的精确建模：必填参数在 grammar 中有唯一路径，可选参数引入分支，每个分支使状态空间指数增长。这直接解释了为什么复杂 schema 的首次编译可能长达数分钟，以及为什么 Anthropic 建议"尽量将参数设为 required"。

### 3. 文法作用域与 Extended Thinking 的结合

文法约束仅作用于 Claude 的"直接输出"，不影响工具调用参数、工具结果或 thinking 标签。**Grammar state resets between sections**——模型在思考阶段可以自由使用自然语言，只有最终响应受 schema 约束。这是符号约束与自由推理的空间划分，与[轨迹偏差](../concepts/trajectory-bias.md)的缓解思路（CRANE 方案）高度吻合。

### 4. PHI/HIPAA 隐患

JSON schema 被单独缓存且有不同的隐私保护级别——文档明确警告不要在 schema 中包含 PHI（包括 property names、enum values、const values、pattern regex）。这揭示了约束解码的一个隐藏合规面：**schema 本身不是消息内容，而是系统层制品**，受不同的数据保留策略管辖。

### 5. SDK 自动降级变换

Python/TypeScript/Ruby/PHP SDK 会自动将不支持的 schema 约束（`minimum`、`maximum`、`minLength`、`maxLength`）转为描述文字，同时在客户端用原始约束验证响应。这是一种**接口降级兼容策略**：向 API 发送简化 schema，本地恢复完整约束验证。

## 与 wiki 其他内容的关联

- [结构化输出](../concepts/structured-outputs.md) — 此文档是 Anthropic 侧的实现视角，与 OpenAI 侧互补
- [约束解码](../concepts/constrained-decoding.md) — Anthropic 明确使用"grammar-constrained sampling"术语，与 OpenAI 的 CFG 方式并行
- [上下文无关文法（LLM 应用）](../concepts/context-free-grammar-llm.md) — Anthropic 文档对编译/缓存机制的补充
- [轨迹偏差](../concepts/trajectory-bias.md) — Extended Thinking + grammar scope reset 是对轨迹偏差的工程级缓解
- [prefix-caching](../concepts/prefix-caching.md) — grammar 缓存的失效规则与 KV cache 失效规则正交，需分别管理
- [Anthropic](../entities/anthropic.md) — 发布主体

## References

- `sources/anthropic_official/structured-outputs.md`
