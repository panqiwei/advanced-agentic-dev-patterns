# Don't Break the Cache：长 Horizon Agent 任务的 Prompt Caching 评估

## 来源

- **标题**：Don't Break the Cache: An Evaluation of Prompt Caching for Long-Horizon Agentic Tasks
- **URL**：https://arxiv.org/html/2601.06007v1
- **类型**：学术论文（arXiv preprint）

## 摘要

首篇系统评估 prompt caching 在长 horizon agent 任务中表现的论文。在 DeepResearchBench 上跑 500+ agentic session，system prompt 约 10,000 token，对比三种缓存策略：full-context caching（缓存完整消息历史）、system-prompt-only caching（仅缓存系统提示）、no caching。

## 核心发现

### 主发现：System-Prompt-Only 缓存最一致

Full-context caching（缓存整个不断增长的消息历史，包括工具结果）在动态内容主导时会**悖论性地增加延迟**——缓存写入频繁，但实际命中极少。System-prompt-only 缓存（仅缓存稳定的系统提示 + 工具定义）提供最一致的收益：

- 成本降低：45–80%（跨所有测试 provider）
- TTFT 延迟改善：13–31%
- 注：延迟改善低于厂商宣传值，因为长 agent session 的主要延迟来自输出生成（decode），而非 prefill

### Agent 任务中破坏 Cache 的典型来源

1. **系统提示中嵌入的时间戳、日期字符串、session ID**
2. **每个 session 动态发现的工具**（tools 数组每次不同）
3. **早期 prompt 位置中包含 UUID 或 session 特定内容的工具结果**
4. **agent loop 迭代间的任何前缀变更**

### Harness 设计建议

> 只缓存静态系统提示 + 固定工具定义。将动态函数调用排除在缓存范围之外。UUID 和 session 特定数据放在所有 breakpoint/缓存内容之后。

### 延迟改善的现实期望

13–31% TTFT 改善比厂商宣传的"80% 延迟降低"低得多，原因结构性：
- TTFT 是 prefill 时间，缓存命中可大幅减少
- 但长 agent session 的整体感知延迟主要由 decode 时间决定（生成输出）
- 在 150k+ token 的 prompts 上延迟改善最显著

## 跨 Provider 对比

| Provider | Caching 机制 | 成本节省 |
|----------|-------------|---------|
| Anthropic | 显式 cache_control 断点，lookback 20 block | 45–80%（system-prompt-only 策略下） |
| OpenAI | 自动，≥1024 token prefix，128 token 粒度 | 45–80%（system-prompt-only 策略下） |
| Moonshot | 自动 + x-session-affinity header | 45–80%（system-prompt-only 策略下） |

## 与现有 Wiki 的关联

- 验证了 [Manus context engineering](manus-context-engineering.md) 中"system prompt 不能有时间戳"的结论
- 为 [context compression](../concepts/context-compression.md) 的 compaction vs caching 张力提供了量化基准
- 直接为 [prefix caching](../concepts/prefix-caching.md) 概念页提供实证支撑

## References

- https://arxiv.org/html/2601.06007v1
