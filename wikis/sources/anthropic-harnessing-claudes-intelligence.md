# Harnessing Claude's Intelligence: 3 Key Patterns for Building Apps

- **来源**: `sources/anthropic_official/harnessing-claudes-intelligence.md`
- **URL**: https://claude.com/blog/harnessing-claudes-intelligence
- **作者**: Lance Martin (Anthropic, Claude Platform team)
- **发布**: 2026-04-02

## 摘要

面向应用开发者的实践指南，围绕三大模式构建能跟上 Claude 能力演进的应用。核心论点：agent harness 编码了"模型做不到什么"的假设，这些假设需要持续检验和修剪。

## 三大模式

### 1. Use what Claude knows

使用 Claude 已经熟悉的通用工具（bash、text editor），而非为每种场景定制专用工具。Claude Code 的 SWE-bench 进化证明了同一工具集上能力的持续提升。

关键洞察：[Agent Skills](../concepts/agent-skills.md)、programmatic tool calling、memory tool 都是 bash + text editor 的组合产物。

### 2. Ask "what can I stop doing?"

随模型能力提升，主动剥离 harness 中过时的假设：

- **让 Claude 编排自身操作**：给代码执行工具而非将每个工具结果回流 context。编排决策从 harness 转移到模型。在 BrowseComp 上，自主过滤工具输出将 Opus 4.6 准确率从 45.3% 提升到 61.6%。
- **让 Claude 管理自身 context**：通过 [agent skills](../concepts/agent-skills.md) 渐进式披露取代预加载所有指令。context editing 选择性移除过时上下文。
- **让 Claude 持久化自身 context**：[compaction](../concepts/context-management.md) + memory folder。Opus 4.6 在 BrowseComp 上用 compaction 达到 84%（Sonnet 4.5 仅 43%）。

Pokmon 长时对局案例：Sonnet 3.5 写流水账式记忆（31 文件，还在第二个城镇）；Opus 4.6 写战术笔记（10 文件、3 个徽章、从失败中蒸馏的教训）。

### 3. Set boundaries carefully

- **Cache 优化**：静态优先/动态追加、不换模型、工具增减影响 cache
- **声明式工具**：不可逆操作提升为专用工具（typed 参数 → 可拦截、审计、渲染）
- **持续重评估**：Claude Code 的 auto-mode 用第二个 Claude 判断 bash 命令安全性，可减少专用工具数量

## 核心论点：Bitter Lesson 的 Agent 版本

> 随着时间推移，应用中的结构或边界应基于"我可以停止做什么？"来修剪——因为它们可能成为 Claude 性能的瓶颈。

Sonnet 4.5 需要 context reset 对抗"context anxiety"→ Opus 4.5 中该行为消失 → 之前的 reset 机制成为死代码。

## 与其他 source 的关联

- 直接延续 [Harness Design](anthropic-harness-design-long-running-apps.md) 的"harness 随模型进化"论点
- "Use what Claude knows" 呼应 [Claude Agent SDK](anthropic-building-agents-claude-agent-sdk.md) 的"给 agent 一台计算机"哲学
- cache 优化细节呼应 [Codex agent loop](openai-unrolling-codex-agent-loop.md) 中的 prompt caching 策略

## References

- `sources/anthropic_official/harnessing-claudes-intelligence.md`
