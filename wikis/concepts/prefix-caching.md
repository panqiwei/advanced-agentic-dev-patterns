# Prefix Caching（前缀缓存）

## 定义

Prefix caching（亦称 prompt caching、KV cache reuse）是 LLM 推理服务的一种优化机制：当连续请求共享相同的 prompt 前缀时，服务端复用已计算的 KV（Key-Value）张量，跳过 prefill 阶段的重复计算。

对 agent 系统的意义：agent loop 的 prefill/decode token 比例约为 100:1（远高于对话场景），因此 prefix cache 命中率直接决定运行成本和延迟，是 harness 层最重要的经济杠杆之一。

## 三大厂商的实现机制

### Anthropic：显式断点 + Lookback 窗口

Anthropic 要求开发者在请求中用 `cache_control` 显式标记缓存断点。系统对每个断点计算累积前缀哈希，在后续请求中向后查找最多 20 个 block 位置，寻找哈希匹配的历史写入。

**关键参数：**
- TTL：默认 5 分钟（缓存读取时自动刷新），可选 1 小时扩展 TTL
- 最小可缓存大小：Claude Sonnet 4.6 = 2,048 token；Sonnet 3.5/4 = 1,024 token；Opus = 4,096 token
- 定价：写入 1.25× base，读取 0.10× base（命中率越高，节省越多）
- **Lookback 溢出陷阱**：若对话增长超过 20 个 block，早期断点会滑出查找窗口，导致 miss。解决方案：在稳定的中间位置添加第二个断点

**Cache 层级（失效级联）：**
```
tools → system → messages
```
修改 tools 定义会使三层全部失效；仅修改 messages 只影响 messages 层。工程含义：工具定义应最大化稳定，放在最前面。

**自动破坏缓存的操作：** 开关 web search、citations、speed mode（使 tools 层失效）；更改 `tool_choice`、添加/移除图片、修改 thinking 参数（使 tools + system 层失效）。

### OpenAI：自动路由 + Prefix Hash

OpenAI 的缓存完全自动，无需显式标记。系统对 ≥ 1,024 token 的 prompt 前缀以 128 token 为粒度进行哈希，路由到最近处理过相同前缀的后端机器，直接复用其 GPU 内存中的 KV 张量。

**关键参数：**
- 默认 TTL：5–10 分钟不活跃，最长 1 小时
- 扩展 TTL（`prompt_cache_retention: "24h"`）：gpt-5.x 系列支持，仅存储 KV 张量（ZDR 兼容）
- 定价：gpt-4o 系列 50% 折扣；gpt-5 nano/5.2 最高 90%+ 折扣；缓存 token 仍计入 TPM
- **Response API vs Chat Completions**：Response API 通过 `previous_response_id` 保留思维链 token，Cache 利用率提升 40–80%；Chat Completions 因推理模型会丢失隐藏 token 而破坏前缀稳定性

**`prompt_cache_key` 参数：** 可选字段，偏置路由到共享该 key 的服务器。推荐值为 session ID 或 task ID。每个唯一前缀+key 组合可承受约 15 req/min，超出后分布到其他机器产生 miss。多 agent 系统中，每个 agent/用户应有独立的 `prompt_cache_key`。

**自动破坏缓存的操作：** 工具/schema 顺序或 key 变更（Go、Swift 等语言随机化 map key，需注意 JSON 序列化顺序）；任何前缀内容修改（包括单个 token）；在静态内容前插入动态内容；更改推理 effort 参数；context compaction/摘要（截断破坏稳定前缀）。

### Moonshot/Kimi：自动缓存 + Session Affinity

Kimi 的前缀缓存完全自动，无需开发者标注。核心基础设施为 **Mooncake**——一个解耦 prefill/decode 集群、跨 GPU/CPU/DRAM/SSD 多层存储 KV 张量的分布式推理架构，每日处理 100B+ token。

**关键参数：**
- 响应的 `usage.cached_tokens` 字段反映缓存命中数（kimi-k2 代及以上可用）
- 定价：kimi-k2.5 未缓存 $0.60/MTok，缓存命中 $0.15/MTok（75% 折扣）
- **`prompt_cache_key`** 参数：功能同 OpenAI，推荐设为 session ID 或 task ID

**`x-session-affinity` HTTP Header（Kimi 特有）：** 在基础设施层引导路由，将请求导向同一模型实例，最大化前缀 cache 命中率。这是 Mooncake KVCache-centric 调度器的 API 暴露。Kimi Code Plan 工作流要求设置此 header。

## 跨厂商的工程统一原则

[Manus](../entities/manus.md) 的生产经验和 [Don't Break the Cache](../sources/dont-break-the-cache.md) 论文都指向三个跨厂商共识：

### 原则一：静态前缀稳定是首要杠杆

工具定义、系统提示、固定文档必须：
1. 放在 prompt 最前面
2. 跨所有请求保持**逐字节一致**
3. 不包含任何动态内容（时间戳、session ID、用户特定数据）

动态内容必须推到所有断点/缓存内容之后。这是所有厂商和实践者的共同结论。

### 原则二：Context 压缩与 Caching 结构性对立

Compaction、摘要、动态截断与 prefix 稳定性天然对立：
- Compaction 修改对话历史前缀 → cache miss
- 摘要替换了历史内容 → 前缀哈希改变
- 按步截断 → 每次请求前缀不同

**Manus 的解决方案**：以文件系统外部化取代 compaction，避免修改 prefix；压缩仅在可恢复（有路径/URL 指针）时进行。
**OpenAI Cookbook 建议**：粗粒度、低频率截断（如 `retention_ratio: 0.7`），而非每轮增量剪枝。

### 原则三：Session Affinity 是基础设施级机制

分布式推理服务中，即使前缀完全相同，若请求路由到不同机器，缓存仍然 miss。Session affinity 的三种实现：

| Provider | 机制 |
|----------|------|
| Anthropic | 确定性排序 + 隐式后端亲和（无显式 API） |
| OpenAI | `prompt_cache_key` 参数 |
| Moonshot/Kimi | `x-session-affinity` HTTP header + `prompt_cache_key` |

## Agent Harness 设计的实践含义

### 监控指标

```
cache_hit_rate = cache_read_input_tokens / total_input_tokens
```

目标：> 80%（重复性 agent 任务）。Anthropic 的缓存命中 token 不计入 TPM 速率限制，OpenAI 的仍计入——影响速率限制的规划。

### 工具定义管理

在 agent loop 中途添加/移除工具的代价远超静态工具集。正确设计：将完整工具集始终包含在 tools 数组中，通过 logit masking 在解码时约束动作空间（Manus 的方案），而非动态修改 tools 数组。

### Harness 结构的 Cache 友好布局

```
[静态区域，全局缓存]
  - 工具定义（完整集合，从不变动）
  - 核心系统提示
  - 固定文档/知识库
  
__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__（或等价边界）

[动态区域，不缓存]
  - 项目特定配置
  - 当前 git 状态
  - 对话历史（growing）
```

这正是 [Claude Code 内部实现](../sources/claude-code-source-leak-2026.md)通过 `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` 标记所采用的结构。

## 经济影响

以 Claude Sonnet 为例：
- 未缓存：$3.00/MTok
- 缓存命中：$0.30/MTok
- 差距：10×

对 agent 任务（prefill/decode = 100:1），从 0% 到 80% 的 cache 命中率可将每任务 API 成本降低约 8×。这不是边际优化，而是量级差距。

## Claude Code 的实现案例

[Claude Code 源码分析](../sources/claude-code-source-leak-2026.md)揭示了生产级 prefix caching 工程的具体形态：

- **`__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` 标记**：显式边界，将全局缓存区与 session 特定区分开
- **`promptCacheBreakDetection.ts`**：14 向量检测哪些操作会破坏缓存，"sticky latch"防止功能切换无意中触发 cache miss
- **`DANGEROUS_uncachedSystemPromptSection()`**：有意识地标记某些必须绕过缓存的 section
- **子 agent fork-join KV cache**：子 agent 共享父 context 的 KV cache，并行化成本接近零

## 相关概念

- [Context management](context-management.md) — prefix caching 是 context management 的成本与性能维度
- [Harness engineering](harness-engineering.md) — prefix caching 是 harness 设计的核心约束
- [Context compression](context-compression.md) — compaction 与 caching 的结构性张力
- [Context engineering](context-engineering.md) — prefix stability 是 context 策展的首要约束

## References

- `sources/manus-context-engineering.md`
- `sources/dont-break-the-cache.md`
- `sources/claude-code-source-leak-2026.md`
- Anthropic Prompt Caching Docs: https://platform.claude.com/docs/en/docs/build-with-claude/prompt-caching
- OpenAI Prompt Caching Guide: https://platform.openai.com/docs/guides/prompt-caching
- Moonshot Kimi API Docs: https://platform.moonshot.ai/docs/api/chat
