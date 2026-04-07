# Effective Harnesses for Long-Running Agents

- **来源**: `sources/anthropic_official/effective-harnesses-long-running-agents.md`
- **URL**: https://www.anthropic.com/engineering/effective-harnesses-for-long-running-agents
- **作者**: Justin Young (Anthropic)

## 概述

本文聚焦一个具体问题：如何让 agent 在跨越多个 context window 的长时任务中持续有效地工作。核心洞察是将"一次性完成"的思路转换为"增量推进 + 状态交接"的工程模式。

## 核心问题

长时运行的 agent 面临两个失败模式：

1. **一次性尝试（one-shotting）**：agent 试图在单个 session 中完成整个任务，导致 context 耗尽时留下半成品，下一个 session 无法理解前序状态
2. **过早宣布完成（premature victory）**：agent 看到已有进展后误判任务已完成

这两个问题的根源相同——agent 在 session 之间缺乏有效的状态传递机制。

## 解决方案：双 Agent 架构

### Initializer Agent（初始化 agent）

首次运行使用专门 prompt，负责：
- 编写 `init.sh` 脚本（开发环境启动）
- 创建 `claude-progress.txt`（进度日志）
- 基于用户需求生成结构化 feature list（JSON 格式，200+ 条）
- 初始 git commit

### Coding Agent（编码 agent）

后续每个 session 使用不同 prompt，负责：
- 读取进度文件 + git log 了解当前状态
- 选择一个 feature 增量实现
- 端到端测试（使用 Puppeteer MCP）
- 提交 git commit + 更新进度文件
- 保持代码库在可合并状态

### Feature Tracking

结构化 JSON feature list，每条包含：category、description、steps、passes（布尔值）。关键约束：agent 只能修改 `passes` 字段，不得删除或编辑测试描述。选择 JSON 而非 Markdown 是因为模型更不容易"顺手"修改 JSON 内容。

## 关键设计决策

| 问题 | Initializer 行为 | Coding Agent 行为 |
|------|------------------|-------------------|
| 过早完成 | 生成完整 feature list | 逐个 feature 推进 |
| 状态丢失 | 创建进度文件 + git 仓库 | 读进度 + git log，写 commit + 更新进度 |
| 测试不充分 | 配置测试工具 | 端到端验证后才标记通过 |
| 环境理解成本 | 写 init.sh | 读 init.sh 快速启动 |

## 与其他概念的关联

- [Harness engineering](../concepts/harness-engineering.md) — 本文是 harness 设计的核心实践案例
- [Long-running agents](../concepts/long-running-agents.md) — 本文定义并解决的问题空间
- [Context management](../concepts/context-management.md) — compaction 不够，需要外部状态机制
- [Feature tracking](../concepts/feature-tracking.md) — 结构化进度追踪的具体方案
- [Agentic systems](../concepts/agentic-systems.md) — 长时 agent 是 agentic 系统复杂度的延伸
- [Claude Agent SDK](../entities/claude-agent-sdk.md) — 本文基于 SDK 构建

## 与前序来源的关系

[Building Effective Agents](anthropic-building-effective-agents.md) 定义了 agent 系统的分类和基础模式，本文在此之上探索了一个更具体的工程问题——当 agent 任务超出单个 context window 时如何设计 harness。两篇文章共同构成从"构建 agent"到"运行 agent"的递进。

## References

- `sources/anthropic_official/effective-harnesses-long-running-agents.md`
