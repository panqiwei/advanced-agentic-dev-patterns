# Guardrails（护栏）

## 定义

Guardrails 是 agent 系统中的安全和约束机制——在 agent 运行过程中持续监控输入、输出和操作，防止越界行为。与 [harness engineering](harness-engineering.md) 中的"enforce invariants"思想一脉相承，但更聚焦于运行时的安全防护而非架构约束。

## 分层防御

OpenAI 在 [Practical Guide](../sources/openai-practical-guide-building-agents.md) 中提出分层 guardrails 模型：

| 层 | 类型 | 机制 |
|---|------|------|
| 输入侧 | Relevance classifier | 过滤离题输入 |
| 输入侧 | Safety classifier | 检测 jailbreak/prompt injection |
| 输入侧 | PII filter | 防止个人信息进入 |
| 输入侧 | Moderation | 有害内容过滤 |
| 执行侧 | Tool safeguards | 按风险等级分级（读/写、可逆性、金额） |
| 执行侧 | Rules-based | blocklist、regex、长度限制 |
| 输出侧 | Output validation | 品牌一致性、内容质量 |

核心原则：**单一 guardrail 不足以保护系统，多层专门化 guardrails 组合形成韧性。**

## Optimistic Execution

OpenAI Agents SDK 的 guardrails 实现采用乐观执行模式：agent 正常推进工作，guardrails 并发运行检查，违规时触发异常中断。这在延迟和安全之间取得平衡。

## Human Intervention

Guardrails 的最后一道防线是人类介入，触发条件：
1. 超过失败阈值（agent 重试上限）
2. 高风险操作（不可逆、高金额、敏感数据）

## 与 Harness Engineering 的关系

Guardrails 是 [harness](harness-engineering.md) 的运行时安全层。Harness 的架构约束（依赖方向、分层结构）在编译时生效；guardrails 在运行时生效。两者互补。

## 安全视角

Bruce Schneier 从传统安全领域的视角审视 AI agent 的安全问题（[博客快照](../sources/schneier-ooda-loop-agentic-ai.md)），包括认知安全分类和对 agentic AI 进攻/防御能力的分析。这提醒 guardrails 设计不仅是模型安全问题，也是系统安全问题。

## 相关概念

- [Harness engineering](harness-engineering.md) — guardrails 是 harness 运行时安全层
- [ACI](aci.md) — tool safeguards 是 ACI 设计的一部分
- [Tool design](tool-design.md) — 工具风险分级影响 guardrails 策略
- [Agentic systems](agentic-systems.md) — guardrails 在自主 agent 中更关键

## 可解释性视角的 Guardrails

[Mechanistic interpretability](mechanistic-interpretability.md) 研究揭示了 guardrails 失效的内部机制：

- **越狱张力**：[Biology of a LLM](../sources/anthropic-biology-large-language-model.md) 发现语法连贯性特征与安全机制竞争——模型倾向完成已开始的语法结构，即使已检测到危险内容。这解释了为什么单纯的输出侧过滤不够，需要在生成过程中干预。
- **幻觉根因**：拒绝回答是默认行为，"已知实体"特征误触发导致幻觉。这启发了"不确定时拒绝"的 guardrails 设计方向。
- **CoT 忠实性**：模型可能构造看似合理但实为逆向推导的推理链。对依赖 CoT 进行审计的 guardrails 系统是一个警示。

## 声明式工具作为安全边界

[Harnessing Claude's Intelligence](../sources/anthropic-harnessing-claudes-intelligence.md) 提出将高风险操作提升为专用声明式工具（而非通过通用 bash 执行），使 harness 获得 typed 参数用于拦截、审计和渲染。可逆性是判断是否需要专用工具的关键标准。

## 混沌工程：Guardrails 的测试对偶

[ReliabilityBench](../sources/reliabilitybench.md) 引入的 [agent 混沌工程](chaos-engineering-for-agents.md) 可视为 guardrails 的测试对偶：guardrails 在生产中防御故障，混沌工程在测试中主动制造故障来验证防御是否有效。

两个方向的实践启示：

1. **故障注入暴露 guardrails 盲区**：实验发现 rate limiting 是杀伤力最大的故障类型（比混合基线低 2.5%），说明现有 agent 普遍缺乏退避重试的 guardrails
2. **终态等价性检查**：[动作蜕变关系](action-metamorphic-relations.md) 提供了一种运行时鲁棒性监控——两个语义等价的输入是否产生等价终态。发现不等价的 case 可自动标记为可靠性风险

## MOP：基于熵的行为崩溃检测

[Beyond pass@1](../sources/beyond-pass-at-1-reliability-framework.md) 提出了 MOP（Meltdown Onset Point）——一种可嵌入 guardrails 层的运行时 [可靠性](reliability-decay.md) 监控机制。

检测方法：在滑动窗口（w=5 步）内统计工具调用分布的信息熵。熵突然飙升表示 agent 从"有序执行"转入"无序打转"——反复调用、自相矛盾、幻觉工具输出。

与现有 guardrails 的区别：传统 guardrails 检测**有害行为**（安全违规、超权操作），MOP 检测**无效行为**（行为崩溃、效率螺旋）。两者互补——agent 可能没有做任何"危险"的事，但已经在浪费算力和 token。

MOP 悖论的实践启示：前沿模型熔断率最高（DeepSeek V3 超长任务 19%），因为它们尝试更激进的策略。MOP 信号的正确响应不是终止任务，而是 **context reset**——保存已完成的子任务进度，清空 context，从检查点继续。这保留了激进策略的上行收益，同时截断了失控的下行风险。

## References

- `sources/openai_official/practical-guide-building-agents.md`
- `sources/anthropic_official/biology-large-language-model.md`
- `sources/anthropic_official/harnessing-claudes-intelligence.md`
- `sources/arxiv_papers/2601.06112-reliabilitybench.md`
- `sources/arxiv_papers/2603.29231-beyond-pass-at-1-reliability-science-framework.md`
