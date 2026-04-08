# Manus：面向生产级 AI Agent 的 Context Engineering

## 来源

- **标题**：Context Engineering for AI Agents: Lessons from Building Manus
- **作者**：Yichao "Peak" Ji（Manus 联合创始人）
- **URL**：https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
- **类型**：技术博客

## 摘要

Manus 团队在经历四次架构重建（自称"Stochastic Graduate Descent"）后总结的 context engineering 实战经验。核心论点：在 agent 系统中，prefill token 与 decode token 的比例约为 100:1，这使得 prefix cache 命中率成为首要经济指标——Claude Sonnet 缓存价格 $0.30/MTok vs 未缓存 $3.00/MTok，差距 10 倍。

## 核心洞察

### 1. KV Cache 优化是生产系统的第一优先级

Agent loop 有着极高的 prefill/decode token 比例（约 100:1），与对话机器人截然不同。这意味着 cache miss 的边际成本在 agent 场景下被放大了两个数量级。

具体实践：
- **消除系统提示中的一切动态时间戳**：这是最常见的 cache-break 来源
- **Append-only context 序列化 + 确定性字段排序**：确保前缀逐字节一致
- **Session ID 路由**：向 OpenAI 传 `prompt_cache_key`，向 Kimi 传 `x-session-affinity`，引导请求到同一后端实例
- **在 vLLM 部署中启用 prefix caching**：自托管场景的等价配置

### 2. 动态 Action Space 管理：掩蔽而非移除

Manus 发现，在 agent 循环中途从 tools 数组中移除工具会使 KV cache 失效——因为 tools 定义处于提示前缀最早部分，任何修改都会产生完全的 cache miss。

解决方案：**context-aware 状态机** + **logit masking**。将工具始终保留在 tools 数组中，通过在解码阶段屏蔽 token logits 来约束动作空间。三种模式：Auto（模型自选）、Required（必须调用）、Specified（从预定义子集选）。工具命名遵循一致前缀（`browser_`、`shell_`），使约束逻辑无需修改工具定义本身。

### 3. 文件系统作为无限外部 Memory

Manus 将文件系统视为独立的 memory tier，零 token 成本。核心原则：**只要能恢复就可以压缩**。

具体规则：
- 网页内容可从 context 移除，但 URL 必须保留
- 文档内容可省略，但文件路径必须保留
- **不可恢复的压缩等同于数据销毁，被明确禁止**

这使得压缩成为可逆操作：agent 在需要时可通过路径/URL 重新检索完整内容，避免了激进 compaction 带来的不可逆信息丢失。

### 4. `todo.md` 的注意力操控

Manus 任务平均涉及 50 次工具调用，跨越极长的 context。原生"中间迷失"问题（lost-in-the-middle degradation）会让 agent 在执行深处遗忘早期建立的全局计划。

解决方案：在每次 agent loop 迭代中创建并更新 `todo.md` 文件。文件内容持续出现在 context 的近期位置，将全局目标推入模型的高注意力区域。这是一种注意力工程，而非记忆工程——不是在"存储"信息，而是在操控模型的注意力焦点。

### 5. 错误保留策略

失败的操作、堆栈跟踪和错误信息被**刻意保留**在 context 中，不做清除。机制：这些记录为模型提供隐式的 belief update，使模型在后续行动中规避已知失效路径。

工程含义：agent 的错误恢复能力（"在失败后找到不同路径"）是真实 agentic 能力的指标之一。主动清除错误历史会消除这种能力。

### 6. Few-shot 模式崩溃的预防

模型会模仿 context 中占主导地位的行为模式。若所有工具调用示例格式单一，模型会变得僵化和重复。解决方案：在序列化模板、措辞、格式上引入**结构化变异**，打破单一模式的强化。

## 五维 Context Engineering 框架

ZenML LLMOps 整理的 Manus 五维框架：

| 维度 | 操作 | 说明 |
|------|------|------|
| **Context Offloading** | 信息移出 context | 文件系统为主存，按需读回 |
| **Context Reduction** | 压缩/摘要 | 仅限可恢复压缩，保留指针 |
| **Context Retrieval** | 按需检索 | 文件搜索工具作为结构化检索层 |
| **Context Isolation** | 子 agent 隔离 | 独立 context window，防止交叉污染 |
| **Context Caching** | KV cache 优化 | stable prefix engineering，session affinity |

## 关键结论

1. **Agent loop 的 prefill/decode 比例约 100:1**——KV cache 命中率在 agent 场景的经济影响比对话场景大两个数量级
2. **移除工具比保留工具代价更高**——掩蔽 logit 优于修改 tools 数组
3. **文件系统 > compaction**——外部化优于压缩，因为外部化是可逆的
4. **`todo.md` 是注意力工程**——通过 context 位置操控注意力权重，而非存储
5. **错误保留 = 免费的 belief update**——不要清除失败历史

## 连接

- [Context management](../concepts/context-management.md) — Manus 的五维框架扩展了现有 compaction/外部化状态的视角
- [Prefix caching](../concepts/prefix-caching.md) — KV cache 优化的核心实践
- [Context compression](../concepts/context-compression.md) — "可恢复才可压缩"原则
- [Harness engineering](../concepts/harness-engineering.md) — prefix cache 优化是 harness 的核心职责
- [Context engineering](../concepts/context-engineering.md) — Manus 的五维框架是 context engineering 的生产级实例

## References

- https://manus.im/blog/Context-Engineering-for-AI-Agents-Lessons-from-Building-Manus
- https://www.zenml.io/llmops-database/context-engineering-for-production-ai-agents-at-scale
