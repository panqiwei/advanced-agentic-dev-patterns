# REPL for Agents（Agent 的有状态工作台）

REPL（Read-Eval-Print Loop）是人类程序员熟悉的交互范式——Python shell、Ruby irb、浏览器 DevTools console 都是例子。把 REPL 作为 **agent 的工作模式** 是一种值得独立命名的模式：agent 不只是"单次调用一个工具命令"，而是**进入一个持有状态的会话**，在这个会话里连续执行相关操作，上下文累积。

## 为什么 agent 需要 REPL

单次调用（subcommand）模式在很多场景下够用，但有若干场景 subcommand 的开销高得离谱：

### 场景 1：强状态工作流

一个图像编辑任务可能是：打开项目 → 加图层 → 套滤镜 → 调对比度 → 预览 → 再调 → 导出。用 subcommand 模式，每次都要：

```bash
cli-anything-gimp project open ./poster.xcf
cli-anything-gimp layer add -n Background ...
cli-anything-gimp filter gaussian-blur --radius 4 ...
# 每一行都要重新打开项目、重放历史、重算状态
```

每次调用都付出启动成本（进程、文件 I/O、JSON 序列化），而且 agent 要自己追踪"我现在编辑到哪一步"。

REPL 模式下，项目进程驻留，状态一直在内存里：

```
[gimp:poster] > layer add -n Background
[gimp:poster] > filter gaussian-blur --radius 4
[gimp:poster] > preview
```

### 场景 2：Undo / Redo 是一等原语

Agent 试错是常态——它需要能回退到上一步。REPL 天然持有操作历史栈，`undo` / `redo` 是 O(1) 的。Subcommand 模式下要实现同样的事，需要把历史外部化到文件。

### 场景 3：渐进式探索

Agent 不知道一个软件的完整能力时，REPL 允许它"先进来逛逛"：

```
[gimp:] > help
[gimp:] > project info
[gimp:] > layer list
```

每条命令的输出立刻塑造 agent 的下一步决策——这是 [implicit-loop-architecture](implicit-loop-architecture.md) 在一个工具内部的小型实例。

## REPL-for-Agents 的关键设计原则

### 1. 双模式：无参进 REPL，有参做脚本

来自 [CLI-Anything](../entities/cli-anything.md) HARNESS.md 的一条具体规则：

```python
@click.group(invoke_without_command=True)
@click.pass_context
def cli(ctx, ...):
    if ctx.invoked_subcommand is None:
        ctx.invoke(repl, project_path=None)
```

裸命令 `cli-anything-gimp` 进 REPL；`cli-anything-gimp project new ...` 做一次性调用。**同一个二进制同时服务两种调用场景**——agent 可以按场景切换，不需要学两套工具。

### 2. Banner 自描述

REPL 启动时打印 banner，banner 里必须包含 agent 能 grep 到的关键元数据：

- 软件名 + 版本
- **SKILL.md 的绝对路径**（如果存在）——agent 一看就知道说明书在哪
- 当前项目 / 会话状态摘要

CLI-Anything 的 `ReplSkin.print_banner()` 是这个模式的范例。Banner 本身就是 agent 的"入门说明书"——不需要额外引导。

### 3. Prompt 显示会话状态

Prompt 本身就是一个持续更新的状态摘要：

```
[gimp:poster.xcf *] >
       ^^^^^^^^^^ ^
       当前项目   修改标记
```

Agent 读 prompt 就知道：我在哪个项目、是否有未保存修改、是否有 undo 栈、当前选中的图层……这比每次都 `status` 查询高效得多。

### 4. 统一的输出骨架

REPL 输出需要有稳定结构，agent 才能解析：

- `success/error/warning/info/status/table/progress` 分类清晰
- 颜色码对 agent 无意义，但结构化前缀有（`✓` / `✗` / `⚠` / `●` / `|`）
- 支持 `--json` 切换到纯结构化输出（同样的命令，同样的数据，不同的表现层）

### 5. 命令历史可检索

REPL 的 up/down 历史和 `prompt_toolkit` history 文件是 agent 的"短期记忆"——它可以通过"最近执行过什么" 推断当前状态。这让 agent 不需要主动追踪，工具帮它记住。

### 6. 会话可序列化

长任务需要跨会话延续。REPL 退出时可以把状态 dump 成 JSON session file，下次启动时 load 回来。这让 REPL 既有"进程级状态"的效率，又有"文件级状态"的持久性。

## REPL vs Subcommand vs MCP Tool

Agent 调用软件有三种主流接口模式，REPL 是其中一种：

| 维度 | Subcommand CLI | REPL | MCP Tool |
|---|---|---|---|
| 状态 | 外部化（文件） | 驻留进程 | 驻留 server |
| 启动开销 | 每次调用都付 | 一次进入，后续免费 | 一次连接，后续免费 |
| 并发 | 天然 | 受限（单进程单会话） | 原生支持 |
| 协议 | POSIX 参数 | 行编辑 + 命令字符串 | JSON-RPC |
| 适合场景 | 单步、脚本化 | 多步、试错、强状态 | 跨进程、跨机器、权限管理 |

**三种模式并不互斥**——CLI-Anything 让同一个软件同时暴露 subcommand 和 REPL；MCP server 可以内部包装 CLI 或 REPL。它们是不同层级的抽象。

## 与相邻概念的关系

- [tool-design](tool-design.md)：REPL 是工具设计的一种具体形态，考虑因素（防误、格式、文档）与一般工具相同，但有"会话" 这个额外维度
- [implicit-loop-architecture](implicit-loop-architecture.md)：REPL 是 agent 的隐式循环在工具内部的缩影——每条命令是一次 gather-act-verify
- [context-management](context-management.md)：REPL 会话状态的持久化是局部 context 管理的一种具体方案
- [agent-skills](agent-skills.md)：REPL banner 暴露 SKILL.md 路径是 Agent Skills 标准的一个零 glue 实现

## 已知的实现

- **[CLI-Anything](../entities/cli-anything.md) 的 ReplSkin**——20+ CLI 共享同一套 REPL 皮肤，是目前最完整的 REPL-for-agents 范例
- **Claude Code 自己的交互 shell**——本质上是一个针对 agent 的 REPL，持有项目 context、文件状态、命令历史
- **Jupyter / IPython kernel**——数据科学场景下 agent 最常用的 REPL（通过 `mcp__ide__executeCode` 这类工具接入）
- **SQL CLI**（psql、mysql）——对 agent 来说是很好的 REPL，状态丰富、命令可预测

## 未解问题

- **REPL 如何与 sub-agent 协作？**——当父 agent 启动 sub-agent 去做子任务，sub-agent 能否"借用" 父 agent 的 REPL 会话？还是只能重新启动一个？
- **REPL 的安全边界**——REPL 进程是长寿命的，权限边界比 subcommand 宽。如何在 REPL 内部实现细粒度的 [claude-code-permission-system](claude-code-permission-system.md) 式审批？
- **REPL 如何向 observability 暴露状态**——传统 observability 工具假设"请求-响应" 模型，对 REPL 这种长连接状态不友好
- **REPL 对 prompt caching 的友好度**——REPL 的历史可以成为稳定前缀利于 caching，但命令交互的动态性也可能破坏 cache。需要类似 [prefix-caching](prefix-caching.md) 原则的 REPL 专属指南

## References

- [cli-anything source summary](../sources/cli-anything.md) — ReplSkin 的详细实现、REPL 为默认行为的设计
- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) — HARNESS.md 中 Phase 3 对 REPL 的要求
- [anthropic-building-effective-agents](../sources/anthropic-building-effective-agents.md) — ACI 设计原则在 REPL 上的应用
- [anthropic-building-agents-claude-agent-sdk](../sources/anthropic-building-agents-claude-agent-sdk.md) — 隐式循环架构与 REPL 范式的同构性
