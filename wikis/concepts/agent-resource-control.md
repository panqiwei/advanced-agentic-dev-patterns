# Agent Resource Control（Agent 资源控制）

## 定义

Agent 资源控制是在 OS 层面理解、监控和限制 AI agent 资源消耗的机制。传统的 cgroup 控制 CPU、内存、IO——agent 资源控制需要扩展到 token 消耗、API 调用配额、工具访问频率、GPU 时间片等 agent 特有的资源维度。

## 背景：AgentCgroup

[AgenticOS Workshop](../sources/agenticos-workshop-asplos-2026.md) 中的 AgentCgroup 论文（Zheng、Fan、Fu 等）首次系统研究了 AI agent 的 OS 资源消耗模式，并提出将 Linux cgroup 概念扩展到 agent 负载的控制框架。

核心观察：agent 负载的资源消耗模式与传统负载根本不同——
- 突发性：LLM 推理阶段 GPU 密集，工具执行阶段 CPU/IO 密集，等待阶段近乎空闲
- 不可预测性：agent 的下一步行动取决于模型推理，资源需求无法静态预估
- 级联性：一个 agent 的工具调用可能触发其他 agent 或服务的资源消耗

## Agent 特有的资源维度

| 资源 | 传统 OS 已有 | Agent 需要新增 |
|------|-------------|---------------|
| CPU/内存 | cgroup v2 | 按 agent 粒度（非按进程） |
| GPU | CUDA MPS/MIG | 按推理请求的公平调度 |
| Token | 无 | context window 预算、总 token 消耗限额 |
| API 调用 | 无 | 外部 API 速率限制、成本上限 |
| 工具访问 | 文件权限 | 动态工具权限（按任务、按风险等级） |

## 与 Harness 层资源管理的关系

目前 agent 的资源控制主要在 [harness](harness-engineering.md) 层实现：
- Token 预算通过 [context management](context-management.md) 的 compaction 机制间接控制
- API 调用通过 harness 的重试/退避逻辑管理
- 工具权限通过 [guardrails](guardrails.md) 的执行侧安全约束

Agent 资源控制的研究方向是将这些机制下沉到 OS 层，提供更强的隔离保证和更低的开销。这不是要替代 harness 层的控制，而是为其提供系统级支撑。

## 语义感知调度

[AgenticOS Workshop](../sources/agenticos-workshop-asplos-2026.md) 的征稿主题中，"语义感知资源管理和调度"是核心议题之一。传统调度器不理解 agent 行为的语义——它看到的是进程和线程，不是"这个 agent 正在关键路径上做决策"或"这个 agent 在低优先级的探索中"。

Fuyun 论文（Li 等）展示了一个具体实例：在 serverless 环境中，用 LLM agent 弥合资源配置的"语义鸿沟"——让 agent 理解函数的语义特征，据此做出更优的资源分配决策。

## 相关概念

- [Agent OS](agent-os.md) — 资源控制是 Agent OS 的核心层之一
- [Harness engineering](harness-engineering.md) — 应用层的资源控制
- [Context management](context-management.md) — token 资源的应用层管理
- [Guardrails](guardrails.md) — 工具权限的应用层管理
- [可靠性衰减](reliability-decay.md) — 资源不足是可靠性衰减的诱因之一

## References

- `sources/agenticos-workshop-asplos-2026.md`
