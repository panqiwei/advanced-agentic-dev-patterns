# Introducing Claude Opus 4.6

- **来源**: `sources/anthropic_official/introducing-claude-opus-4-6.md`
- **URL**: https://www.anthropic.com/news/claude-opus-4-6
- **作者**: Anthropic
- **发布**: 2026

## 摘要

Anthropic 发布 Claude Opus 4.6，在编码、agentic 任务和长上下文处理方面全面升级。首个 Opus 级 100 万 token 上下文窗口。在 Terminal-Bench 2.0、Humanity's Last Exam、GDPval-AA 等多个基准测试中达到最先进水平。

## 关键能力提升

1. **Agentic 编码增强**：更仔细的规划、更长的任务持续力、更大代码库中更可靠的操作、更好的代码审查/调试（自我纠错）
2. **长上下文**：1M token context window（beta）；MRCR v2 8-needle 1M 版本得分 76%（Sonnet 4.5 仅 18.5%），质变级提升
3. **安全性**：与 Opus 4.5 对齐程度持平或更优，所有最近 Claude 模型中过度拒绝率最低

## 产品与 API 更新

| 功能 | 说明 |
|------|------|
| Adaptive thinking | 模型自行判断何时使用深度推理，取代二元开关 |
| Effort 控制 | low / medium / high (默认) / max 四级 |
| Context compaction (beta) | 接近阈值时自动摘要替换旧 context |
| Agent teams | Claude Code 中多 agent 并行协作（研究预览） |
| 128k 输出 token | 支持更长输出 |

## 对 Agent 工程的意义

- **Agent teams** 是 [orchestrator-workers](../concepts/orchestrator-workers.md) 模式的产品化实现
- **Adaptive thinking** + **effort 控制** 为 [harness engineering](../concepts/harness-engineering.md) 提供新的智能-延迟-成本调节杠杆
- **Compaction API** 使 [context management](../concepts/context-management.md) 从 SDK 特性升级为平台级能力
- 长上下文能力削弱了对激进 compaction 策略的依赖

## 与其他 source 的关联

- [Harnessing Claude's Intelligence](anthropic-harnessing-claudes-intelligence.md) 基于 Opus 4.6 能力给出应用开发指导
- [Harness Design](anthropic-harness-design-long-running-apps.md) 中的"harness 随模型进化"论点在 Opus 4.6 得到验证

## References

- `sources/anthropic_official/introducing-claude-opus-4-6.md`
