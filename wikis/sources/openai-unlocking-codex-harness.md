# Unlocking the Codex Harness: How We Built the App Server

- **来源**: `sources/openai_official/unlocking-codex-harness.md`
- **URL**: https://openai.com/index/unlocking-the-codex-harness/
- **作者**: Celia Chen (OpenAI)

## 概述

本文介绍 Codex App Server——将 [Codex](../entities/codex.md) harness 暴露为稳定 API 的协议层。核心设计：双向 JSON-RPC over stdio，统一驱动 CLI、IDE、Web、桌面等多个客户端表面。

## 核心架构

### 会话原语

三层嵌套结构：
- **Thread**（线程）：持久容器，一个 user-agent 会话，可创建/恢复/fork/归档
- **Turn**（轮次）：一次用户输入 → agent 完成输出的完整过程
- **Item**（项）：原子 I/O 单元，带类型（user message、agent message、tool execution、approval request、diff）和生命周期（started → delta → completed）

### App Server 内部

四个组件：stdio reader → Codex message processor → thread manager → core threads。每个 thread 对应一个 core session，message processor 负责 client JSON-RPC ↔ core 事件流的翻译。

### 集成模式

| 表面 | 集成方式 |
|------|----------|
| 本地 IDE/Desktop | 捆绑平台特定二进制，长驻子进程 + stdio |
| Web | 容器内启动 App Server，浏览器通过 HTTP+SSE 与后端通信 |
| TUI/CLI | 重构为标准 App Server 客户端（进行中）|

### 协议选择

- **App Server（JSON-RPC）**：完整 harness 功能 + UI-ready 事件流
- **MCP Server**：已有 MCP 工作流时使用，但功能子集
- **Codex Exec**：CI/脚本场景的轻量非交互模式
- **Codex SDK**：TypeScript 库，编程控制本地 agent

## 与其他概念的关联

- [Codex](../entities/codex.md) — App Server 是 Codex harness 的协议暴露层
- [Implicit loop architecture](../concepts/implicit-loop-architecture.md) — threads/turns/items 是隐式循环的会话表达
- [MCP](../entities/mcp.md) — 作为替代集成方式被比较
- [Harness engineering](../concepts/harness-engineering.md) — App Server 本身是 harness 工程的产物

## References

- `sources/openai_official/unlocking-codex-harness.md`
