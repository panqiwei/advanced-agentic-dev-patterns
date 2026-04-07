# Harness Engineering: Leveraging Codex in an Agent-First World

- **来源**: `sources/openai_official/harness-engineering.md`
- **URL**: https://openai.com/index/harness-engineering/
- **作者**: Ryan Lopopolo (OpenAI)

## 概述

OpenAI 团队用 5 个月、零人工编码构建了一个内部产品（约百万行代码、1500+ PR）。本文记录了这个过程中关于 harness engineering 的核心经验——当工程师的工作不再是写代码，而是设计环境、表达意图、构建反馈回路时，什么变了。

## 核心主张

**"Humans steer. Agents execute."**

工程师的角色重新定义为：优先级排列、用户反馈转化为验收标准、结果验证。当 agent 卡住时，不是"再试一次"，而是问"缺什么能力，怎么让它对 agent 可读且可执行"。

## 关键实践

### Repository 作为知识系统

"一个大 AGENTS.md"的做法失败了——context 稀缺、过多指导等于无指导、内容迅速腐烂。改为：
- **AGENTS.md 作为目录**（~100 行），指向 `docs/` 中的深层知识
- **结构化 docs/**：design docs、execution plans、product specs、references
- **渐进式披露**：agent 从小而稳的入口出发，按需深入
- **机械化验证**：专门的 linter + CI 检查知识库的新鲜度、交叉链接、结构正确性

### Agent Legibility（Agent 可读性）

传统代码为人类可读性优化；这里为 **agent 可读性** 优化。核心原则："agent 在运行时无法访问的信息等于不存在。" Slack 讨论、Google Docs 中的知识对 agent 不可见——必须推入 repo。

### 架构执行与品味

- **Enforce invariants, not implementations**：每个业务域固定分层（Types → Config → Repo → Service → Runtime → UI），依赖方向机械化执行
- "无聊"技术更适合 agent：可组合、API 稳定、训练数据覆盖好
- 有时 agent 重新实现功能比依赖不透明的外部库更便宜
- 自定义 linter 的错误信息嵌入修复指令——直接注入 agent context

### 熵与垃圾回收

Agent 复制已有模式，包括不好的模式。最初人类每周五手动清理"AI slop"（20% 时间），不可持续。
改为："golden principles" 编码进 repo + 定期后台 agent 扫描偏差 + 开修复 PR → 技术债的持续小额偿还。

### 吞吐量改变合并哲学

Agent 吞吐远超人类注意力 → 最少阻塞合并门、短生命周期 PR、修正比等待便宜。在低吞吐环境下不负责任，在这里是正确的权衡。

## 量化成果

- 3 名工程师起步，后增至 7 人
- 平均每人每天 3.5 PR
- 单次 Codex 运行可持续 6+ 小时
- 吞吐量随团队增长而提升（非下降）

## 与其他来源的关系

与 Anthropic 的 [harness 系列](anthropic-effective-harnesses-long-running-agents.md) 形成有趣对比：
- **共识**：harness 的核心是约束 + 反馈回路 + 外部化状态；渐进式披露而非信息倾倒
- **差异**：OpenAI 更强调整个开发流程的 agent 化（review、merge、cleanup 都由 agent 完成），Anthropic 更聚焦于单个 agent 的 session 间协调
- **共同洞察**：agent 的失败是环境不足的信号，而非模型能力的上限

## References

- `sources/openai_official/harness-engineering.md`
