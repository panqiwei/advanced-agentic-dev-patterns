# Wiki Index

Wiki 内容索引。LLM 通过读取此文件定位相关页面。

## Sources

- [anthropic-building-effective-agents](sources/anthropic-building-effective-agents.md) — Anthropic 官方 agent 构建指南，workflows vs agents 分类，五种 workflow 模式，ACI 设计原则
- [anthropic-effective-harnesses-long-running-agents](sources/anthropic-effective-harnesses-long-running-agents.md) — 长时运行 agent 的 harness 设计：initializer-coder 双 agent 架构、feature tracking、增量推进
- [anthropic-harness-design-long-running-apps](sources/anthropic-harness-design-long-running-apps.md) — GAN 式 generator-evaluator 架构、sprint contracts、context reset vs compaction、harness 随模型进化简化
- [anthropic-building-agents-claude-agent-sdk](sources/anthropic-building-agents-claude-agent-sdk.md) — Claude Agent SDK 设计哲学：给 agent 一台计算机，隐式循环架构，gather-act-verify-repeat
- [anthropic-equipping-agents-agent-skills](sources/anthropic-equipping-agents-agent-skills.md) — Agent Skills 开放标准：指令+脚本+资源的可组合打包，三层渐进式披露
- [openai-harness-engineering](sources/openai-harness-engineering.md) — OpenAI 零人工编码实验：agent legibility、repo 即知识系统、架构执行、熵管理
- [openai-unlocking-codex-harness](sources/openai-unlocking-codex-harness.md) — Codex App Server 架构：threads/turns/items 会话原语、双向 JSON-RPC、多表面集成
- [openai-unrolling-codex-agent-loop](sources/openai-unrolling-codex-agent-loop.md) — Codex agent loop 内部机制：prompt 构建、推理流程、prompt caching、compaction
- [openai-practical-guide-building-agents](sources/openai-practical-guide-building-agents.md) — OpenAI agent 构建指南：设计基础、编排模式、guardrails、人类介入
- [george-zhang-harness-engineering-cybernetics](sources/george-zhang-harness-engineering-cybernetics.md) — 控制论视角的 harness engineering：三次同构（调速器→K8s→harness），隐性知识编码
- [openai-introducing-codex](sources/openai-introducing-codex.md) — Codex 产品发布：云端 agent、AGENTS.md 引导、codex-1 模型

- [anthropic-tracing-thoughts-language-model](sources/anthropic-tracing-thoughts-language-model.md) — Anthropic 可解释性综述：AI 显微镜、归因图、十种行为的内部机制
- [anthropic-introducing-claude-opus-4-6](sources/anthropic-introducing-claude-opus-4-6.md) — Claude Opus 4.6 发布：1M context、agent teams、adaptive thinking、effort 控制
- [anthropic-circuit-tracing-methods](sources/anthropic-circuit-tracing-methods.md) — 电路追踪方法论：跨层转码器、归因图、替代模型
- [anthropic-biology-large-language-model](sources/anthropic-biology-large-language-model.md) — Claude 3.5 Haiku 内部机制研究：规划、幻觉、越狱、CoT 忠实性
- [anthropic-emergent-introspective-awareness](sources/anthropic-emergent-introspective-awareness.md) — LLM 内省能力研究：概念注入、思维检测、自我觉察
- [anthropic-harnessing-claudes-intelligence](sources/anthropic-harnessing-claudes-intelligence.md) — 三大模式：用已知工具、持续剥离假设、谨慎设边界
- [mit-mechanistic-interpretability-2026](sources/mit-mechanistic-interpretability-2026.md) — MIT Tech Review 2026 十大突破：mechanistic interpretability
- [cartesia-mamba-3](sources/cartesia-mamba-3.md) — Mamba-3：推理优先 SSM，复数值系统、MIMO、经典控制论启发
- [ai21-jamba](sources/ai21-jamba.md) — Jamba：首个生产级 SSM-Transformer 混合架构，256K context
- [nvidia-energy-based-diffusion-lm](sources/nvidia-energy-based-diffusion-lm.md) — EDLM：能量扩散语言模型，非自回归文本生成
- [introl-world-models-race-2026](sources/introl-world-models-race-2026.md) — 世界模型竞赛：AMI Labs、Genie 3、Marble、Cosmos
- [schneier-ooda-loop-agentic-ai](sources/schneier-ooda-loop-agentic-ai.md) — Schneier 博客快照：认知安全分类、加密法律、hackback
- [meta-i-jepa](sources/meta-i-jepa.md) — I-JEPA：表征预测架构，世界模型基础，LeCun 愿景
- [langgraph-documentation](sources/langgraph-documentation.md) — LangGraph：显式图编排框架，隐式循环的对比范式
- [chroma-context-rot](sources/chroma-context-rot.md) — Chroma 2025 研究：18 个前沿模型的 context rot 系统性测试，三种退化机制
- [anthropic-effective-context-engineering](sources/anthropic-effective-context-engineering.md) — Anthropic context engineering 总论：注意力预算、context rot、just-in-time context、compaction/note-taking/sub-agent 三种长时策略
- [swe-evo](sources/swe-evo.md) — SWE-EVO：多步长 horizon 软件演进基准，48 任务平均 21 文件 874 测试，GPT-5.4 仅 25%，误差级联效应的核心证据
- [beyond-pass-at-1-reliability-framework](sources/beyond-pass-at-1-reliability-framework.md) — 可靠性科学框架：RDC/VAF/GDS/MOP 四指标评估长时 agent
- [reliabilitybench](sources/reliabilitybench.md) — ReliabilityBench：三维可靠性曲面 R(k,ε,λ)，生产级压力下的 agent 评估
- [factory-evaluating-context-compression](sources/factory-evaluating-context-compression.md) — Factory.ai 压缩质量评估：三种策略对比，probe-based 功能质量测试，artifact tracking 难题

## Concepts

- [agentic-systems](concepts/agentic-systems.md) — Agentic 系统总论：workflows（预定义路径）vs agents（自主决策），复杂度阶梯
- [augmented-llm](concepts/augmented-llm.md) — 增强型 LLM：检索 + 工具 + 记忆，agentic 系统的基础构建块
- [prompt-chaining](concepts/prompt-chaining.md) — 提示链：任务分解为顺序步骤，用延迟换准确率
- [routing](concepts/routing.md) — 路由：输入分类后导向专门化处理，关注点分离
- [parallelization](concepts/parallelization.md) — 并行化：sectioning（分段并行）+ voting（投票取共识）
- [orchestrator-workers](concepts/orchestrator-workers.md) — 编排器-工作者：中央 LLM 动态分解任务并分发
- [evaluator-optimizer](concepts/evaluator-optimizer.md) — 评估器-优化器：生成-评估循环迭代
- [aci](concepts/aci.md) — Agent-Computer Interface：agent 与工具/API 的接口设计，与 HCI 同等重要
- [tool-design](concepts/tool-design.md) — 工具设计：格式选择、文档质量、防误设计（poka-yoke）
- [long-running-agents](concepts/long-running-agents.md) — 长时运行 agent：跨多个 context window 的任务，失败模式与 initializer-coder 解法
- [harness-engineering](concepts/harness-engineering.md) — Harness 工程：设计约束、工具、反馈回路来引导 agent 行为的学科
- [context-management](concepts/context-management.md) — 上下文管理：compaction + 外部化状态（progress file、git history）
- [feature-tracking](concepts/feature-tracking.md) — 特性追踪：结构化 JSON feature list，防止 one-shotting 和 premature victory
- [implicit-loop-architecture](concepts/implicit-loop-architecture.md) — 隐式循环架构：gather-act-verify-repeat，行为由约束塑造而非预设路径
- [agent-skills](concepts/agent-skills.md) — Agent 技能：领域知识的可组合打包标准，渐进式披露，开放标准
- [guardrails](concepts/guardrails.md) — 护栏：分层防御机制，输入/执行/输出侧安全约束，optimistic execution

- [mechanistic-interpretability](concepts/mechanistic-interpretability.md) — 机制可解释性：特征发现、电路追踪、归因图、扰动验证
- [world-models](concepts/world-models.md) — 世界模型：物理理解、I-JEPA、视频生成即世界模拟
- [ssm-hybrid-architecture](concepts/ssm-hybrid-architecture.md) — SSM 混合架构：Mamba-3、Jamba、推理优先设计
- [context-rot](concepts/context-rot.md) — Context Rot：LLM 性能随输入长度增长的系统性退化，注意力稀释、干扰项干涉、结构干扰三种机制
- [context-engineering](concepts/context-engineering.md) — 上下文工程：策展和维护最优 token 集合的策略，区别于 prompt engineering
- [error-cascade](concepts/error-cascade.md) — 误差级联：多步任务中前序错误的放大效应，SWE-EVO 的核心发现
- [software-evolution-benchmark](concepts/software-evolution-benchmark.md) — 软件演化 benchmark：从单 issue 修复到版本级演进的评测维度升级
- [agent-reliability-evaluation](concepts/agent-reliability-evaluation.md) — Agent 可靠性评估：RDC/VAF/GDS/MOP 四指标框架
- [reliability-decay](concepts/reliability-decay.md) — 可靠性衰减：pass^k 随任务时长的超线性衰减
- [reliability-surface](concepts/reliability-surface.md) — 可靠性曲面：一致性×鲁棒性×容错性的三维评估框架
- [action-metamorphic-relations](concepts/action-metamorphic-relations.md) — 动作蜕变关系：将判等锚点从输出文本下沉到系统终态
- [chaos-engineering-for-agents](concepts/chaos-engineering-for-agents.md) — Agent 混沌工程：超时、限流、schema 漂移等故障注入评估
- [context-compression](concepts/context-compression.md) — 上下文压缩：压缩策略谱系、probe-based 评估、artifact tracking 难题、tokens-per-task 优化目标

## Entities

- [anthropic](entities/anthropic.md) — AI 安全公司，Claude 开发者，本 wiki 最主要参考来源
- [claude-agent-sdk](entities/claude-agent-sdk.md) — Anthropic 的 agent 开发框架
- [mcp](entities/mcp.md) — Model Context Protocol，标准化 LLM 与外部工具的集成接口
- [openai](entities/openai.md) — AI 研究公司，GPT 和 Codex 开发者，harness engineering 的重要实践者
- [codex](entities/codex.md) — OpenAI 的 agent 编码平台，隐式循环架构实现
- [langgraph](entities/langgraph.md) — LangChain 的显式图编排框架，隐式循环的对比范式
- [chroma](entities/chroma.md) — 开源向量数据库公司，context rot 研究发布者
- [swe-bench](entities/swe-bench.md) — SWE-Bench：AI 编码 agent 的标准评测基准
- [openhands](entities/openhands.md) — OpenHands：开源 coding agent 框架
- [factory-ai](entities/factory-ai.md) — Factory.ai：AI 编码 agent 公司，context compression 评估研究发布者
