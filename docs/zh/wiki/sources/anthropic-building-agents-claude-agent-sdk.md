# Building Agents with the Claude Agent SDK

- **来源**: `sources/anthropic_official/building-agents-claude-agent-sdk.md`
- **URL**: https://www.anthropic.com/engineering/building-agents-with-the-claude-agent-sdk
- **作者**: Thariq Shihipar (Anthropic)

## 概述

本文介绍 Claude Agent SDK（原 Claude Code SDK）的设计哲学和使用方法。核心主张：给 agent 一台计算机——让它像人类一样使用文件系统、终端、工具来完成工作。

## 核心设计原则

### "Give Claude a computer"

Claude Code 的关键设计原则：程序员需要什么工具，Claude 就需要什么工具——查找文件、编辑文件、lint、运行、调试、迭代。通过给 Claude 访问终端的能力，它可以像程序员一样写代码，也可以做非编码任务（读 CSV、搜索网络、构建可视化、解读指标）。

### 隐式循环架构

Agent 在一个反馈循环中运行：**gather context → take action → verify work → repeat**。这不是预定义的图结构，而是模型自主决定下一步——[隐式循环](../concepts/implicit-loop-architecture.md)。

## Agent 能力三层

### 1. Gather Context（获取上下文）

- **Agentic search**：利用文件系统结构 + bash 工具（grep、tail）按需拉取信息，文件夹结构本身就是 context engineering 的一种形式
- **Semantic search**：比 agentic search 快但准确性低、维护成本高、不透明，建议先用 agentic search
- **Subagents**：并行化 + context 隔离，只返回相关信息给 orchestrator
- **Compaction**：context 接近上限时自动压缩历史

### 2. Take Action（执行操作）

- **Tools**：agent 的主要执行构件，在 context window 中占据显著位置，影响模型决策
- **Bash & scripts**：通用计算能力，处理非结构化任务
- **Code generation**：代码是精确、可组合、可复用的输出形式
- **[MCP](../entities/mcp.md)**：标准化外部服务集成，免去自定义集成代码

### 3. Verify Work（验证工作）

- **Rules-based feedback**：定义规则 → 检查 → 报告失败原因（如 linting）
- **Visual feedback**：截图 + 多模态审查（布局、样式、层级、响应式）
- **LLM-as-judge**：另一个模型评估输出，适用于模糊标准场景（但不够健壮）

## 与其他概念的关联

- [Implicit loop architecture](../concepts/implicit-loop-architecture.md) — 本文定义的核心架构模式
- [Claude Agent SDK](../entities/claude-agent-sdk.md) — 本文是 SDK 的官方介绍
- [Augmented LLM](../concepts/augmented-llm.md) — agentic search 是检索能力的工程实现
- [ACI](../concepts/aci.md) — tool 设计影响 agent 决策
- [Context management](../concepts/context-management.md) — compaction + subagent 隔离
- [Evaluator-optimizer](../concepts/evaluator-optimizer.md) — verify 环节的三种方法
- [MCP](../entities/mcp.md) — 外部服务集成标准

## References

- `sources/anthropic_official/building-agents-claude-agent-sdk.md`
