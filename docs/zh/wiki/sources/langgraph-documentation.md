# LangGraph Documentation

- **来源**: `sources/langgraph-documentation.md`
- **URL**: https://langchain-ai.github.io/langgraph/
- **作者**: LangChain
- **截取**: 2026-04-07

## 摘要

LangGraph 是 LangChain 提供的低层编排框架，用于构建有状态的 agent。被 Klarna、Uber、J.P. Morgan 等企业采用。强调"耐久执行"（durable execution）、human-in-the-loop、流式处理和内存管理。

## 核心特性

| 功能 | 说明 |
|------|------|
| Durable execution | agent 在故障后从检查点恢复 |
| Human-in-the-loop | 执行中检查和修改 agent 状态 |
| 内存管理 | 短期工作记忆 + 长期会话记忆 |
| LangSmith 集成 | 可视化执行追踪和状态转换 |
| 生产部署 | 有状态工作流的可扩展基础设施 |

## 显式图架构

LangGraph 采用 StateGraph 定义节点和边的有向图：

```python
graph = StateGraph(MessagesState)
graph.add_node(mock_llm)
graph.add_edge(START, "mock_llm")
graph.add_edge("mock_llm", END)
```

这是与 [implicit loop architecture](../concepts/implicit-loop-architecture.md)（Claude Agent SDK、Codex 采用的隐式循环）形成鲜明对比的范式。显式图在编译时确定流程拓扑；隐式循环由模型在运行时自主决定路径。

## 两种范式的取舍

| | 显式图 (LangGraph) | 隐式循环 (Claude SDK / Codex) |
|---|---|---|
| 可预测性 | 高——流程在编译时确定 | 低——模型自主决策 |
| 灵活性 | 受限于预定义拓扑 | 高——可应对未预见的情况 |
| 调试 | 易——状态转换可视化 | 难——需推理模型决策链 |
| 模型依赖 | 低——结构由代码控制 | 高——依赖模型能力 |

## 对 Agent 工程的意义

LangGraph 代表了 [agentic systems](../concepts/agentic-systems.md) 中 workflow 端的工程选择。对于流程固定、可预测性优先的场景（如企业审批流、合规检查），显式图可能是更合适的选择。但随着模型能力提升，[harness engineering](../concepts/harness-engineering.md) 的趋势指向减少硬编码结构——这暗示隐式循环范式可能在长期占优。

## References

- `sources/langgraph-documentation.md`
