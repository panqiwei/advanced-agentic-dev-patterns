# Pets vs Cattle（宠物与牲畜）

## 定义

云计算基础设施模式：将服务器视为不可失去的唯一个体（宠物）还是可随时替换的群体成员（牲畜）。由 Randy Bias 在 2011-2012 年推广，基于 Bill Baker 关于 SQL Server 扩展的类比。

核心区分不在于 scale-up vs scale-out，而在于**可处置性**（disposability）：如果一个服务器（无论物理、虚拟化还是容器化）可以在任何时候被销毁和替换，那它就是牲畜。如果它不可或缺，那它就是宠物。

## 在 Agent 系统中的应用

[Managed Agents](../sources/anthropic-managed-agents.md) 将 pets vs cattle 模式从基础设施层引入 agent 架构层。

### 初始设计：Agent 组件作为宠物

将所有 agent 组件（session、harness、sandbox）放入单一容器，创造了一个不可失去的"宠物"：
- 容器故障 → session 丢失，无法恢复
- 调试需要进入包含用户数据的容器 → 隐私风险
- 故障表现统一（harness bug、网络丢包、容器下线）→ 无法定位原因

### 解耦后：每个组件作为牲畜

Brain-hands 解耦（[meta-harness](meta-harness.md)）使每个组件可独立故障恢复：
- **Sandbox 故障** → harness 捕获 tool-call error → 新容器通过 `provision({resources})` 初始化
- **Harness 故障** → 新实例通过 `wake(sessionId)` 启动 → `getSession(id)` 恢复
- **Session** → 独立持久化服务，不受其他组件故障影响

从编号看也符合 Bias 的原始定义：不再是"Bob 的容器"，而是可互换的实例池。

## 与现有 wiki 概念的连接

Pets vs cattle 在 wiki 中已有的几个领域以不同形式出现：

- **[Agent Sandboxing](agent-sandboxing.md)**：cattle 化的 sandbox 是安全的前提——如果 sandbox 是宠物，凭证隔离就不现实（需要进入宠物容器调试）
- **[Context Management](context-management.md)**：session 外部化的前提是 harness 的 cattle 化——如果 harness 是宠物，session 就必须与它同生共死
- **[可靠性衰减](reliability-decay.md)**：cattle 化是对抗可靠性衰减的基础设施策略——单组件故障不传播为系统故障
- **[Harness Engineering](harness-engineering.md)**：pets vs cattle 是 harness 进化的基础设施前提

## 相关概念

- [Meta-harness](meta-harness.md) — 实现 cattle 化的架构模式
- [Agent sandboxing](agent-sandboxing.md) — cattle 化的安全含义
- [Harness engineering](harness-engineering.md) — cattle 化使 harness 可替换

## References

- `sources/bias-pets-vs-cattle.md`
- `sources/anthropic-managed-agents.md`
