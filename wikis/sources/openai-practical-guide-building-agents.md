# A Practical Guide to Building Agents

- **来源**: `sources/openai_official/practical-guide-building-agents.md`
- **URL**: https://openai.com/business/guides-and-resources/a-practical-guide-to-building-ai-agents/
- **作者**: OpenAI

## 概述

OpenAI 面向产品和工程团队的 agent 构建指南。涵盖用例识别、agent 设计基础（model + tools + instructions）、编排模式（单 agent vs 多 agent）、guardrails。

## Agent 设计基础

三个核心组件：
1. **Model**：选择策略——先用最强模型建立基线，再用小模型替换可行的部分
2. **Tools**：三类——Data（检索）、Action（执行）、Orchestration（agent 作为工具）
3. **Instructions**：从现有文档生成、分解为小步骤、定义明确操作、捕获边缘场景

## 编排模式

### 单 Agent

一个 model + tools + instructions 在循环中运行。通过 prompt templates（变量化基础 prompt）管理复杂度。核心建议：**先最大化单个 agent 能力，再考虑多 agent。**

### 多 Agent

两种模式：
- **Manager（agent 作为工具）**：中央 manager 通过 tool call 调度专业 agent，保持统一上下文
- **Decentralized（agent 间 handoff）**：peer agent 之间直接移交控制权

选择信号：当单 agent 的复杂条件分支或工具重叠导致性能下降时，拆分为多 agent。

### 声明式 vs 非声明式

声明式框架（LangGraph 风格）要求预定义分支和条件图；OpenAI Agents SDK 采用 code-first 方式，用编程构造表达工作流逻辑。

## Guardrails

分层防御机制：
- **Relevance classifier**：过滤离题输入
- **Safety classifier**：检测 jailbreak/prompt injection
- **PII filter**：防止个人信息泄露
- **Moderation**：有害内容过滤
- **Tool safeguards**：按风险等级（低/中/高）给工具分级
- **Rules-based**：blocklist、长度限制、regex
- **Output validation**：品牌一致性检查

Agents SDK 将 guardrails 作为一等概念，使用 **optimistic execution**：agent 正常运行，guardrails 并发检查，违规时触发异常。

## Human intervention

两个触发条件：
1. 超过失败阈值（重试上限）
2. 高风险操作（不可逆、高金额、敏感）

## 与 Anthropic 指南的对比

与 [Building Effective Agents](anthropic-building-effective-agents.md) 的核心共识：
- 从简单开始，证据驱动升级
- 单 agent 优先
- 工具设计是关键

差异：OpenAI 更强调 guardrails 的工程化和 handoff 机制；Anthropic 更强调 [ACI](../concepts/aci.md) 和 workflow 模式的分类学。

## References

- `sources/openai_official/practical-guide-building-agents.md`
