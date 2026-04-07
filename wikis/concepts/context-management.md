# Context Management（上下文管理）

## 定义

Context management 是 agent 系统中管理 LLM 可用信息的机制集合——包括 context window 内的信息组织，以及跨 session 的状态传递。

## 机制

### Context Window 内

- **Compaction**：[Claude Agent SDK](../entities/claude-agent-sdk.md) 的内建能力，在 context 接近上限时压缩对话历史，使 agent 不会因 context 耗尽而中断。
- **工具结果管理**：选择性保留或丢弃工具调用结果。

### 跨 Session

Compaction 本身不足以解决 [长时运行 agent](long-running-agents.md) 的问题——压缩后的 context 可能丢失关键细节，导致下一个 session 误解状态。

Anthropic 的解决方案是 **外部化状态**：
- **Progress file**（`claude-progress.txt`）：agent 在每个 session 结束时写入结构化的进度摘要
- **Git history**：commit message 作为变更的可审计记录
- **Feature list**（[feature tracking](feature-tracking.md)）：任务完成度的客观指标

关键洞察：context management 不仅是 LLM 内部问题，更需要 [harness engineering](harness-engineering.md) 层面的外部机制配合。

## Context Reset vs Compaction

Anthropic 在 [harness 迭代](../sources/anthropic-harness-design-long-running-apps.md) 中发现两种策略各有取舍：

| | Compaction | Context Reset |
|---|---|---|
| 机制 | 压缩对话历史，同一 agent 继续 | 清空 context，启动新 agent + 交接文件 |
| 优势 | 保持连续性 | 提供干净起点 |
| 劣势 | **Context anxiety** 可能残留 | 增加编排复杂度和延迟 |

**Context anxiety**：模型在接近 context 上限时过早收尾、草草完成工作的倾向。Sonnet 4.5 表现严重（必须用 context reset），Opus 4.5/4.6 明显减轻（compaction 即可）。

这揭示了 [context management](context-management.md) 与模型能力的耦合——策略选择取决于具体模型的行为特征，而非一刀切的最佳实践。

## 与 Augmented LLM 的关系

[Augmented LLM](augmented-llm.md) 的三大增强维度（检索、工具、记忆）中，context management 横跨所有三者——它决定了检索结果如何进入 context、工具输出如何保留、跨 session 记忆如何组织。

## 相关概念

- [Long-running agents](long-running-agents.md) — context management 最具挑战性的场景
- [Context engineering](context-engineering.md) — context management 是 context engineering 的核心机制层
- [Augmented LLM](augmented-llm.md) — context 是增强能力的载体
- [Harness engineering](harness-engineering.md) — context management 是 harness 的核心职责之一
- [Feature tracking](feature-tracking.md) — 外部化状态的具体形式

## Codex 的 Compaction 实现

OpenAI 在 [agent loop 拆解](../sources/openai-unrolling-codex-agent-loop.md) 中展示了 compaction 的演进：
1. 手动 `/compact` → LLM 总结 → 替换 input
2. Responses API `/responses/compact` 端点 → 返回 `type=compaction` + `encrypted_content`（保留模型潜在理解）
3. 自动触发：超过 `auto_compact_limit` 自动调用

关键优化：**prompt caching**——保持后续请求是前序的精确前缀，使采样成本从 O(n²) 降为 O(n)。破坏 cache 的操作需要谨慎管理。

## 模型能力与 Context 策略的共演化

[Harnessing Claude's Intelligence](../sources/anthropic-harnessing-claudes-intelligence.md) 用 BrowseComp 数据展示了 context 管理能力随模型演进的跃升：

| 模型 | Compaction 得分 |
|------|----------------|
| Sonnet 4.5 | 43%（不随 budget 变化） |
| Opus 4.5 | 68% |
| Opus 4.6 | 84% |

差异不在技术机制，而在模型"知道保留什么"的判断力。Sonnet 3.5 在长时对局中写流水账；Opus 4.6 蒸馏出战术教训。这暗示 context management 的未来方向不是更复杂的外部系统，而是更智能的模型自主管理。

## Opus 4.6 的平台级 Compaction

[Opus 4.6 发布](../sources/anthropic-introducing-claude-opus-4-6.md) 将 compaction 从 SDK 特性升级为 API 级能力，加上 1M token context window，根本性地扩大了 context 预算。Adaptive thinking 和 effort 控制提供了智能-延迟-成本的新调节维度，间接影响 context 利用率。

## Context Rot：长 Context 的性能代价

[Chroma 的 Context Rot 研究](../sources/chroma-context-rot.md) 提供了一个关键的实证补充：**context management 不仅是"放什么进去"的问题，也是"放多少进去"的问题**。

18 个前沿模型的系统性测试表明，模型性能随输入长度增长而可测量地退化（[context rot](context-rot.md)），即使在极简任务上。三种退化机制——注意力稀释、干扰项干涉、结构干扰——对 context management 策略有直接影响：

- **Compaction 的价值重定位**：compaction 不再仅仅是防止 context window 溢出的被动手段，而是主动维持模型性能的关键机制。即使 context window 足够大（如 Opus 4.6 的 1M token），过长的 context 也会损害性能。
- **检索优于堆积**：context rot 为"只检索相关子集"的策略提供了实证支持，与"尽可能多塞入 context"的直觉相反。
- **Distractor 过滤**：不仅要过滤无关内容，还需识别和过滤"相关但不正确"的干扰信息——这是传统 context management 未充分考虑的维度。

这一发现与上述"模型能力与 Context 策略的共演化"形成互补：更智能的模型可以更好地判断"保留什么"，但 context rot 本身是结构性的，不会因模型能力提升而完全消失。

## Context Engineering 框架下的定位

[Effective Context Engineering](../sources/anthropic-effective-context-engineering.md) 将 context management 置于更广义的 [context engineering](context-engineering.md) 框架中，补充了几个重要维度：

- **Compaction 的取舍艺术**：过度激进的 compaction 会丢失后期才显现重要性的微妙 context。推荐流程：先最大化 recall 确保不丢关键信息，再迭代优化 precision 去除冗余
- **工具结果清理**是最安全的轻量级 compaction——深层历史中的工具调用原始结果很少需要再次查看
- **Structured note-taking**（agentic memory）作为 compaction 的互补策略：agent 定期将笔记写入 context window 外的持久存储，后续按需拉回。Claude 玩 Pokemon 展示了跨数千步骤维持记忆连贯性的能力
- **Sub-agent 架构**提供第三条路径：子 agent 在独立 context window 中深入探索，仅返回 1000-2000 token 的压缩摘要，实现关注点分离

三种长时策略的适用场景：compaction 适合连续对话流，note-taking 适合有里程碑的迭代开发，sub-agent 适合需要并行探索的复杂研究。

## 长 Horizon 任务中的 Context 挑战

[SWE-EVO](../sources/swe-evo.md) 的实验间接验证了 context management 在多步任务中的关键性。论文 Section 2.3 专门综述了 context engineering 对长 horizon agent 的影响：

- **Meta Context Engineering** 将 context 组装视为优化问题，在 SWE-bench Verified 上达到 89.1%（对比手工基线 70.7%）——context 质量的差异本身就值 ~18 个点
- **Memory 架构**（如 MemGPT、hierarchical storage）使 agent 能跨单 session 限制维持连贯推理
- 在 SWE-EVO 的多步演进任务中，agent 需要在跨数千词的需求规格和涉及数十文件的改动之间保持连贯推理——这正是 context management 的极限场景

SWE-EVO 中强模型的主要失败模式（指令遵循——理解歪了 release notes）也暗示：当需求规格足够复杂时，context 的组织方式（如何呈现多条需求、如何关联 PR 上下文）直接影响 agent 的理解质量。

## 记忆脚手架的反面证据

[Beyond pass@1](../sources/beyond-pass-at-1-reliability-framework.md) 对 10 个模型在两种脚手架（ReAct 和 Memory-augmented）下的对比测试表明：episodic memory（便签本式记忆）在长任务上**全线失败**——6 个模型 GDS 下降、4 个中性、0 个改善。最大的负面效应出现在中等能力模型上（Kimi K2.5 -0.14、Mistral 24B -0.13）。

机制分析：便签本的每次 add_to_memory() 调用消耗步数预算，积累的便签注入 system prompt 消耗 context 空间。在短任务上代价可控（便签少），在长任务上代价 load-bearing（便签积累）。

这为 context management 策略增加了一条重要约束：**更多的 context 不一定更好**。与 [context rot](context-rot.md) 的发现一致——无论是被动堆积还是主动记录，过多的 context 都会损害性能。记忆机制需要配合过期、分层、或按需检索策略，而非朴素的"全部保留"。

## 压缩质量的实证比较

[Factory 的 Context Compression 评估](../sources/factory-evaluating-context-compression.md) 首次在 36,000+ 条真实开发 session 消息上对比了三种生产级 [压缩策略](context-compression.md)，为 compaction 策略选择提供了量化依据：

| 方法 | 总分 | 机制 | 压缩率 |
|------|------|------|--------|
| Factory（结构化摘要） | 3.70 | 锚定式迭代合并，显式 section | 98.6% |
| Anthropic（SDK 内建） | 3.44 | 全量重生成结构化摘要 | 98.7% |
| OpenAI（compact 端点） | 3.35 | 不透明压缩表示 | 99.3% |

关键发现对 context management 策略的影响：

- **增量合并优于全量重生成**：Factory 的锚定式方法在多次压缩周期中保持更高的一致性，因为关键细节不会在每次重生成中漂移
- **Artifact tracking 是普遍弱点**（所有方法 2.19-2.45/5.0）：仅靠 compaction 无法可靠追踪文件变更，需要外部化的 artifact 索引配合——这与上述"外部化状态"策略互相印证
- **Tokens per task 才是正确指标**：高压缩率导致的信息丢失最终需要重新获取，可能超过节省的 token。这进一步支持了 compaction 的价值定位——不是最小化 token，而是最大化可用信号

## References

- `sources/anthropic_official/effective-harnesses-long-running-agents.md`
- `sources/anthropic_official/harness-design-long-running-apps.md`
- `sources/anthropic_official/harnessing-claudes-intelligence.md`
- `sources/anthropic_official/introducing-claude-opus-4-6.md`
- `sources/openai_official/unrolling-codex-agent-loop.md`
- `sources/chroma-context-rot.md`
- `sources/anthropic_official/effective-context-engineering-for-ai-agents.md`
- `sources/arxiv_papers/2512.18470-swe-evo.md`
- `sources/arxiv_papers/2603.29231-beyond-pass-at-1-reliability-science-framework.md`
- `sources/factory-evaluating-context-compression.md`
