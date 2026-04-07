# Harness Engineering 为什么是 Agent 时代的"控制论"？

- **来源**: `sources/george-zhang-harness-engineering-cybernetics.md`
- **URL**: https://jimo.studio/blog/harness-engineering-why-it-is-the-cybernetics-of-the-agent-era/
- **作者**: George Zhang (OpenClaw)

## 概述

本文从控制论（Cybernetics）视角解读 harness engineering，建立三次同构映射：瓦特离心调速器 → Kubernetes controller → agent harness。核心论点：agent 失败的根因不是模型能力不足，而是隐性工程知识未被编码为机器可读形式。

## 三次同构

| 时代 | 控制对象 | 控制机制 | 人类角色转变 |
|------|----------|----------|-------------|
| 工业革命 | 蒸汽机转速 | 离心调速器 | 手动拧阀门 → 设计调速器 |
| 云计算 | 服务状态 | K8s controller | 手动重启 → 编写目标 spec |
| Agent 时代 | 代码库 | Harness | 手写代码 → 设计环境与规则 |

共同模式：**人从执行者变为设计者，从直接操控变为设定约束**。Wiener 控制论的核心词 κυβερνήτης（舵手）精确描述了这个角色转变。

## 反馈回路的层级

代码库中已有的反馈回路都在底层：
- **编译器**：语法层面
- **测试**：行为层面
- **Linter**：风格层面

缺失的是高层反馈回路——架构一致性、设计方案正确性、抽象层合理性。LLM 首次使这些高层回路可以闭合。

## 核心洞察

**"Agent 不会自主学习进化。如果不把知识写出来，Agent 第一百次犯的错会和第一次一模一样。"**

这与 OpenAI [harness engineering 实践](openai-harness-engineering.md) 中的结论完全一致：agent 失败是环境不足的信号。需要做的是将隐性判断标准编码为机器可读形式——架构文档、自定义 linter、审查规则。

## 与其他概念的关联

- [Harness engineering](../concepts/harness-engineering.md) — 本文为 harness 提供了控制论的理论框架
- [Guardrails](../concepts/guardrails.md) — 反馈回路的运行时表现形式
- [ACI](../concepts/aci.md) — "校准传感器与执行器"是 ACI 设计的另一种表达

## References

- `sources/george-zhang-harness-engineering-cybernetics.md`
