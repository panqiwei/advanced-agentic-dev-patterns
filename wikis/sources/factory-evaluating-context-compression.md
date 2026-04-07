# Evaluating Context Compression for AI Agents

- **来源**: Factory Research
- **发布日期**: 2025-12-16
- **URL**: https://factory.ai/news/evaluating-compression
- **本地路径**: `sources/factory-evaluating-context-compression.md`

## 摘要

[Factory](../entities/factory-ai.md) 构建了一套 probe-based 评估框架，用于衡量不同 [上下文压缩](../concepts/context-compression.md) 策略在真实 agent session 中保留功能性信息的质量。测试覆盖三种生产级方案——Factory 的结构化摘要、[OpenAI](../entities/openai.md) 的 `/responses/compact` 端点、[Anthropic](../entities/anthropic.md) Claude SDK 的内建压缩——在超过 36,000 条消息的真实软件开发 session 上进行对比。

核心结论：**结构化摘要在不牺牲压缩效率的前提下保留了更多有用信息**。Factory 总分 3.70，Anthropic 3.44，OpenAI 3.35（满分 5.0）。

## 评估方法论：Probe-Based 功能质量测试

传统的文本相似度指标（ROUGE、embedding similarity）无法衡量压缩后 agent 能否继续有效工作。Factory 设计了四种探针类型，直接测试压缩后的功能保留：

| 探针类型 | 测试维度 | 示例 |
|----------|----------|------|
| Recall | 事实保留 | "原始的错误信息是什么？" |
| Artifact | 文件追踪 | "我们修改了哪些文件？" |
| Continuation | 任务规划 | "下一步应该做什么？" |
| Decision | 推理链 | "我们对 Redis 问题的决策是什么？" |

使用 GPT-5.2 作为 LLM judge，在六个维度上评分（0-5）：Accuracy、Context Awareness、Artifact Trail、Completeness、Continuity、Instruction Following。

## 三种压缩策略

### Factory：锚定式迭代摘要（Anchored Iterative Summarization）

维护一个结构化持久摘要，包含显式 section（session intent、file modifications、decisions made、next steps）。压缩触发时，仅总结新截断的部分并合并到已有摘要中。**结构迫使保留**——每个 section 都是检查清单，摘要器必须填充或显式留空，防止信息静默丢失。

### OpenAI：`/responses/compact` 端点

产生不透明的压缩表示，优化重建保真度。压缩率最高（99.3%），但牺牲可解释性——无法阅读压缩输出来验证保留了什么。

### Anthropic：Claude SDK 内建压缩

产生详细的结构化摘要（通常 7-12k 字符），包含 analysis、files、pending tasks、current state 等 section。与 Factory 的关键差异在于更新机制：**Anthropic 每次压缩都重新生成完整摘要，而 Factory 的锚定方法增量合并新信息到持久摘要中**。这影响了跨多次压缩周期的一致性和细节存留。

## 核心发现

### 量化结果

| 方法 | 总分 | Accuracy | Context | Artifact | Complete | Continuity | Instruction |
|------|------|----------|---------|----------|----------|------------|-------------|
| Factory | 3.70 | 4.04 | 4.01 | 2.45 | 4.44 | 3.80 | 4.99 |
| Anthropic | 3.44 | 3.74 | 3.56 | 2.33 | 4.37 | 3.67 | 4.95 |
| OpenAI | 3.35 | 3.43 | 3.64 | 2.19 | 4.37 | 3.77 | 4.92 |

### 关键洞察

1. **结构迫使保留**：通用摘要将所有内容视为同等可压缩。文件路径从信息论角度可能是"低熵"的，但恰恰是 agent 继续工作所需的。显式 section 防止了自由格式摘要中的静默漂移。

2. **压缩率是错误的优化目标**：OpenAI 达到 99.3% 压缩率，但质量低 0.35 分。丢失的细节最终需要重新获取，可能超过 token 节省。**正确的目标是 tokens per task，而非 tokens per request**。

3. **Artifact tracking 是未解决的问题**：所有方法在文件追踪上得分仅 2.19-2.45/5.0。即使 Factory 的结构化方案也只达到 2.45。这可能需要摘要之外的专门处理——独立的 artifact 索引或 agent scaffolding 中的显式文件状态追踪。

4. **Probe-based 评估捕获了传统指标遗漏的信号**：ROUGE 衡量词汇相似度，probe-based 方法衡量摘要是否实际支持任务继续。对 agentic workflow 来说，这个区别至关重要。

## 具体示例

一个 178 条消息、89,000 token 的调试 session（401 错误 → CORS → Redis 连接池），压缩后询问原始错误：

- **Factory**（4.8/5）：准确命名端点 `/api/auth/login`、错误码 401、根因（Redis session store）
- **Anthropic**（3.9/5）：得到错误码和大致原因，但丢失端点路径
- **OpenAI**（3.2/5）：几乎丢失所有技术细节

## 与 wiki 已有知识的关系

- 为 [context management](../concepts/context-management.md) 中讨论的 compaction 策略提供了首个跨方案的量化比较
- 与 [context rot](../concepts/context-rot.md) 互补——context rot 研究的是长 context 的性能退化，本研究关注压缩后的信息保留
- "tokens per task" 的优化目标与 [context engineering](../concepts/context-engineering.md) 的"最小高信号 token 集合"原则一致
- Artifact tracking 的普遍弱点对 [长时运行 agent](../concepts/long-running-agents.md) 的文件追踪机制设计有直接启示

## References

- `sources/factory-evaluating-context-compression.md`
