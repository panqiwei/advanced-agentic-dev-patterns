# Unrolling the Codex Agent Loop

- **来源**: `sources/openai_official/unrolling-codex-agent-loop.md`
- **URL**: https://openai.com/index/unrolling-the-codex-agent-loop/
- **作者**: OpenAI Codex Team

## 概述

本文详细拆解 [Codex](../entities/codex.md) 的 agent loop 内部机制——prompt 构建、推理流程、工具调用循环、性能优化和上下文管理。是理解 [隐式循环架构](../concepts/implicit-loop-architecture.md) 工程实现的核心参考。

## Agent Loop 详解

### 循环机制

1. 用户输入 → 构建 prompt → 发送到 Responses API
2. 模型返回：final response（结束 turn）或 tool call（继续循环）
3. Tool call → 执行 → 输出追加到 prompt → 重新查询模型
4. 重复直到模型产出 assistant message（turn 结束信号）

### Prompt 构建

按优先级递减排列：
1. **System message**（由 server 控制）
2. **Instructions**（model-specific，如 `gpt-5.2-codex_prompt.md`）
3. **Tools**（Codex 内建 + Responses API + MCP 工具）
4. **Developer message**（sandbox 权限、审批模式）
5. **User instructions**（AGENTS.md 层级聚合 + skills 元数据）
6. **Environment context**（cwd、shell）
7. **User message**

### Prompt Caching

关键性能优化：后续请求的 prompt 是前序请求的**精确前缀**，使得 prompt caching 可以将采样成本从二次方降为线性。破坏 cache 的操作：改 tools 列表、切换模型、改 sandbox 配置。MCP 工具尤其棘手——`notifications/tools/list_changed` 会导致中间 cache miss。

### Compaction

演进过程：
1. 手动 `/compact` → 用 LLM 总结对话 → 替换 input
2. Responses API `/responses/compact` 端点 → 更高效，包含 `type=compaction` + `encrypted_content` 保留模型对原始对话的潜在理解
3. 自动触发：超过 `auto_compact_limit` 时自动调用

## 与 Anthropic SDK 的对比

两者都采用 [隐式循环架构](../concepts/implicit-loop-architecture.md)，但实现细节不同：
- **Codex**：Responses API + SSE 流 + stateless（支持 ZDR）
- **Claude Agent SDK**：Messages API + compaction 内建
- **共同点**：循环由模型 tool call 驱动，以 assistant message 结束

## References

- `sources/openai_official/unrolling-codex-agent-loop.md`
