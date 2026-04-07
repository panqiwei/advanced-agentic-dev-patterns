# Harness Design for Long-Running Application Development

- **来源**: `sources/anthropic_official/harness-design-long-running-apps.md`
- **URL**: https://www.anthropic.com/engineering/harness-design-long-running-apps
- **作者**: Prithvi Rajasekaran (Anthropic Labs)

## 概述

本文在 [前序 harness 研究](anthropic-effective-harnesses-long-running-agents.md) 的基础上探索两个更深层问题：1）如何让 agent 产出高质量前端设计（主观品味问题）；2）如何让 agent 自主构建完整应用。核心方法论来自 GAN（生成对抗网络）的启发——将生成与评估分离为独立 agent。

## 核心贡献

### GAN 式 Generator-Evaluator 架构

受 GAN 启发，将 [evaluator-optimizer](../concepts/evaluator-optimizer.md) 模式从理论推向工程实践：

- **Generator**：生成代码/设计
- **Evaluator**：使用 Playwright MCP 实际操作应用后给出评分和具体反馈
- **关键洞察**：agent 评估自己的工作时天然偏向乐观（self-evaluation problem），分离评估者后更容易调校为严格的批评者

### 评估标准的操作化

将主观判断转化为可评分的维度（以前端设计为例）：
- Design quality（整体感 > 局部）
- Originality（自主创意 > 模板默认）
- Craft（技术执行）
- Functionality（可用性）

权重设计：刻意强调 design quality 和 originality，因为模型默认已擅长 craft 和 functionality。

### Sprint Contracts

Generator 和 Evaluator 在每个 sprint 开始前协商"完成标准"——从高层 spec 到可测试的具体标准。这解决了 spec 过于抽象与实现过于细节之间的鸿沟。

### 三 Agent 架构（Planner-Generator-Evaluator）

- **Planner**：将 1-4 句用户 prompt 扩展为完整产品 spec（200+ features）
- **Generator**：逐 sprint 实现，每 sprint 结束自评后交 QA
- **Evaluator**：用 Playwright 实际操作应用，逐条验证 sprint contract

### Context Reset vs Compaction

- **Compaction**：压缩对话历史，保持连续性，但 agent 可能仍有 **context anxiety**（接近 context 上限时过早收尾）
- **Context reset**：清空 context，启动新 agent + 结构化交接文件，提供干净的起点
- Sonnet 4.5 需要 context reset（context anxiety 严重），Opus 4.5/4.6 可以靠 compaction（context anxiety 减轻）

### Harness 随模型进化的简化

核心原则：harness 的每个组件都编码了"模型做不到什么"的假设，这些假设需要随模型升级持续检验。
- Opus 4.6 发布后，sprint 结构不再必要（模型自身能保持长时连贯性）
- Evaluator 的必要性取决于任务是否在模型能力边界上
- 但 Planner 始终有价值（模型不会自发地做充分的前期规划）

## 量化结果

| 对比 | 时长 | 成本 | 质量 |
|------|------|------|------|
| Solo agent (Opus 4.5) | 20 min | $9 | 核心功能损坏 |
| Full harness (Opus 4.5) | 6 hr | $200 | 功能完整、设计一致 |
| Simplified harness (Opus 4.6) | 3 hr 50 min | $125 | 功能完整、更少组件 |

## 与其他概念的关联

- [Harness engineering](../concepts/harness-engineering.md) — 本文是 harness 设计方法论的核心案例
- [Evaluator-optimizer](../concepts/evaluator-optimizer.md) — GAN 式 generator-evaluator 是其工程化实现
- [Long-running agents](../concepts/long-running-agents.md) — 本文在前序工作基础上进一步推进
- [Context management](../concepts/context-management.md) — context reset vs compaction 的深入对比
- [Feature tracking](../concepts/feature-tracking.md) — sprint contracts 是 feature tracking 的进化形态

## 与前序来源的关系

直接建立在 [Effective Harnesses](anthropic-effective-harnesses-long-running-agents.md) 之上。前序文章解决了基础的状态传递问题，本文进一步解决了品质保证和任务规划问题，并展示了随模型能力提升而简化 harness 的方法论。

## References

- `sources/anthropic_official/harness-design-long-running-apps.md`
