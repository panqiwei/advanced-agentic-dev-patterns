# Effective Context Engineering for AI Agents

## 来源信息

- **作者**: Anthropic Applied AI team (Prithvi Rajasekaran, Ethan Dixon, Carly Ryan, Jeremy Hadfield)
- **发布日期**: 2026-07-07
- **路径**: `sources/anthropic_official/effective-context-engineering-for-ai-agents.md`
- **URL**: https://www.anthropic.com/engineering/effective-context-engineering-for-ai-agents

## 摘要

Anthropic 关于 **context engineering** 的系统性论述。核心论点：随着 agent 从单次推理走向长时自主运行，工程重心从"如何写好 prompt"转向"如何策展最优 token 集合"。Context 是有限资源，边际收益递减——每多一个 token 都在消耗模型的注意力预算。

文章提出了一个指导原则：**找到最小的高信号 token 集合，最大化期望结果的可能性。**

## 核心贡献

### 1. Context Engineering vs Prompt Engineering

[Prompt engineering](../concepts/augmented-llm.md) 聚焦于如何写好系统提示词；[context engineering](../concepts/context-engineering.md) 是更广义的问题——策展 LLM 推理时的整个 token 状态（system prompt + tools + MCP + 外部数据 + 消息历史）。这不是一次性工作，而是每次推理前都要重复的迭代策展。

### 2. 注意力预算与 Context Rot

LLM 的 transformer 架构产生 n^2 的 pairwise attention 关系。随着 context 增长，模型关注每对 token 的能力被摊薄。训练数据中短序列更常见，模型对长距离依赖的经验更少。结果是性能呈梯度退化（gradient degradation）而非断崖下降——模型在长 context 下仍然有能力，但精度会降低。

### 3. 有效 Context 的三要素

- **System prompt**：寻找"正确高度"——太具体导致脆弱，太模糊缺乏信号。最小但完备的信息集合。
- **工具设计**：工具集应自包含、无歧义、最小重叠。膨胀的工具集是最常见失败模式。
- **示例（Few-shot）**：多样化的典型示例优于穷举边界情况。

### 4. Just-in-time Context 策略

从预处理所有数据转向按需加载：agent 维护轻量级引用（文件路径、存储查询、链接），运行时通过工具动态加载。Claude Code 的实现：用 `head`/`tail` 分析大数据而非加载全量。元数据（文件名、目录结构、时间戳）提供额外信号。

**渐进式披露（progressive disclosure）**：agent 通过探索逐步发现相关 context，而非一次性加载。

**混合策略**：部分数据预加载（如 CLAUDE.md），其余按需检索（如 glob/grep）。

### 5. 长时任务的三种 Context 策略

| 策略 | 机制 | 适用场景 |
|------|------|----------|
| [Compaction](../concepts/context-management.md) | 压缩对话历史，保留关键细节 | 需要持续对话流的任务 |
| [Structured note-taking](../concepts/context-engineering.md) | agent 主动写笔记到外部存储 | 有明确里程碑的迭代开发 |
| [Sub-agent 架构](../concepts/orchestrator-workers.md) | 子 agent 深入探索后返回压缩摘要 | 需要并行探索的复杂研究 |

### 6. Claude Code 作为案例

贯穿全文的实践参考：compaction 保留架构决策和未解决 bug、CLAUDE.md 预加载 + glob/grep 按需检索的混合模式、to-do list 作为结构化笔记、Claude 玩 Pokemon 的长时记忆演示。

## 与已有 wiki 内容的交叉

- **[Context management](../concepts/context-management.md)**：本文扩展了 compaction 的理论框架，增加了 attention budget 和 context rot 的机制解释
- **[Tool design](../concepts/tool-design.md)**：本文强调工具的 token 效率和功能最小重叠，补充了效率维度
- **[Long-running agents](../concepts/long-running-agents.md)**：三种策略（compaction/note-taking/sub-agent）与已有的 initializer-coder 架构互补
- **[Harness engineering](../concepts/harness-engineering.md)**：just-in-time context 是 harness 设计的策略选择
- **[Augmented LLM](../concepts/augmented-llm.md)**：just-in-time context 是检索增强的 agent 式进化

## 关键引用

> Context engineering refers to the set of strategies for curating and maintaining the optimal set of tokens (information) during LLM inference.

> Good context engineering means finding the smallest possible set of high-signal tokens that maximize the likelihood of some desired outcome.

> Context, therefore, must be treated as a finite resource with diminishing marginal returns.

## References

- `sources/anthropic_official/effective-context-engineering-for-ai-agents.md`
