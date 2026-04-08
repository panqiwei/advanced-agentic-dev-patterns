# Andrej Karpathy

## 简介

AI 研究者、教育者、企业家。前 Tesla AI 总监（Autopilot），前 OpenAI 研究员，Eureka Labs 创始人。以深入浅出的技术教育（YouTube 系列、Stanford CS231n）和对 AI 趋势的敏锐判断著称。

## 与本 Wiki 的关联

Karpathy 是 [LLM-OS 类比](../concepts/llm-os-analogy.md) 框架最系统的构建者。他从 2023 年起持续发展这个类比：

- **2023-11**：在 "Intro to Large Language Models" 演讲中首次系统阐述 LLM OS 概念——LLM 作为内核进程、context window 作为 RAM、embeddings 作为文件系统
- **2025-06**：在 YC AI Startup School 演讲中进一步发展——Software 1.0/2.0/3.0 分类法，"We're in the 1960s of LLMs"
- **2025-06**（补充）：在 [YC AI Startup School 演讲](../sources/karpathy-software-is-changing-again.md) 中系统阐述了 [Software 3.0](../concepts/software-3-0.md) 分类法、[LLM OS](../concepts/llm-os.md) 类比、LLM 的"人灵"心理学、[部分自主产品](../concepts/autonomy-slider.md) 设计（autonomy slider、[generation-verification loop](../concepts/generation-verification-loop.md)、GUI 审计）、vibe coding、为 agent 构建基础设施。核心论断："We're in the 1960s of LLMs"。
- **2026-03**：回复 Guido van Rossum 的推文，将类比凝缩为最简形式——LLM = CPU, Agent = OS Kernel，并指出数据/动态的根本性差异（token vs byte, statistical vs deterministic）

## 核心观点

Karpathy 的 LLM-OS 类比不是修辞，而是一种架构思考工具。它暗示：
- Agent 基础设施的设计可以从数十年 OS 研究中汲取经验
- 当前 agent 系统面临的问题（调度、内存管理、安全隔离）在 OS 历史上都有对应的解决路径
- 但底层"硬件"的非确定性（统计性 LLM vs 确定性 CPU）意味着不能简单照搬，需要重新发明

### 部分自主产品哲学（2025 YC 演讲补充）

Karpathy 不看好纯自主 agent（"2025 不是 agent 之年，这是 agent 的十年"），提出 Iron Man 类比：现阶段应造**战甲（augmentation）**而非**机器人（full agent）**。关键思想：
- LLM 是"人灵"（stochastic simulations of people），有百科知识但也有幻觉、锯齿状智能、顺行性遗忘
- 人-AI 协作的核心是 generation-verification loop——AI 生成，人类验证，GUI 加速这个循环
- 产品应有 autonomy slider，让用户根据任务复杂度选择交出多少控制权
- "Keep AI on leash"——小增量、具体 prompt、可审计的中间 artifact

## 相关实体

- [OpenAI](openai.md) — Karpathy 的前雇主
- [Codex](codex.md) — OpenAI 的 agent 编码平台，某种程度上是 LLM-OS 愿景的产品化

## 相关概念

- [LLM-OS 类比](../concepts/llm-os-analogy.md) — Karpathy 构建的核心类比框架

## 相关概念（扩展）

- [Scaling Laws](../concepts/scaling-laws.md) — 2023 年演讲中阐述的 LLM 能力增长定律
- [LLM Training Pipeline](../concepts/llm-training-pipeline.md) — 三阶段训练流水线的权威科普
- [System 1 vs System 2](../concepts/system-1-vs-system-2.md) — 对 LLM 推理局限和未来方向的分析
- [LLM Security](../concepts/llm-security.md) — 新计算范式的安全挑战

## References

- `sources/karpathy-intro-to-large-language-models.md` — 2023 年标志性演讲，LLM OS 首次提出
- `sources/karpathy-llm-cpu-agent-os-kernel.md`
- `sources/karpathy-software-is-changing-again.md` — 2025 YC AI Startup School 演讲
