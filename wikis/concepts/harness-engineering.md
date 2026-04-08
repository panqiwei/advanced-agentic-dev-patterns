# Harness Engineering（Harness 工程）

## 定义

Harness 是 agent 系统中包裹 LLM 的那一层工程——system prompt、工具定义、编排逻辑、上下文管理、权限系统、反馈回路、终止机制的总和。它不是"调用 API 的胶水代码"，而是一个完整的控制系统。

Harness engineering 是设计这一层的学科：通过约束、工具、反馈回路、文档和验证系统来引导 agent 的行为，使其在自由度中保持方向。

## 核心思想

Harness 的作用不是限制 agent，而是让 agent 的能力可靠地发挥。正如 [Building Effective Agents](../sources/anthropic-building-effective-agents.md) 所强调的——从简单开始，只在有证据时增加复杂度——harness 的设计也遵循同样原则。

在 [长时运行 agent](long-running-agents.md) 的案例中，harness 的具体形态是：
- **Initializer-Coder 双 prompt 架构**：不同阶段使用不同的 prompt，但共享工具和系统
- **外部状态机制**：progress file + git history 替代纯 context 传递
- **行为约束**：feature list 中 agent 只能改 `passes` 字段，不能删除测试
- **反馈回路**：端到端测试（Puppeteer MCP）提供真实反馈而非自我判断

## 控制论视角

[George Zhang](../sources/george-zhang-harness-engineering-cybernetics.md) 将 harness engineering 置于控制论（Cybernetics）框架下，建立三次同构映射：瓦特离心调速器 → K8s controller → agent harness。核心洞察：

- 人的角色从**执行者**变为**设计者**——从直接操控变为设定约束
- 代码库的底层反馈回路（编译器、测试、linter）已存在，但**高层反馈回路**（架构一致性、设计正确性）只有 LLM 才能闭合
- **Agent 失败 = 隐性知识未编码**，不是模型能力不足

## 与 ACI 的关系

[ACI](aci.md)（Agent-Computer Interface）关注 agent 与单个工具的接口设计；harness engineering 关注整个系统的编排设计。ACI 是 harness 的组成部分——好的 harness 需要好的工具接口，但仅有好的接口不构成好的 harness。

## OpenAI 的视角：Agent-First 开发

[OpenAI 的实践](../sources/openai-harness-engineering.md) 从更极端的角度定义 harness engineering——当整个开发流程由 agent 驱动时，harness 成为核心基础设施：

- **AGENTS.md 作为目录而非百科**：~100 行入口指向结构化的 `docs/` 知识库
- **Agent legibility**：优化为 agent 可读性而非人类可读性，"agent 无法访问的信息等于不存在"
- **Enforce invariants, not implementations**：机械化执行架构边界，允许边界内自由
- **熵管理**：golden principles + 后台清理 agent = 技术债的持续偿还

关键共识（Anthropic + OpenAI）：agent 的失败是环境不足的信号，而非模型能力的上限。正确的响应不是"更强的模型"，而是"更好的 harness"。

## Harness 随模型进化

Anthropic 在 [harness 迭代实践](../sources/anthropic-harness-design-long-running-apps.md) 中提出一个重要原则：**harness 的每个组件都编码了"模型做不到什么"的假设，这些假设需要随模型升级持续检验。**

具体表现：
- Sonnet 4.5 需要 sprint 结构 + context reset → Opus 4.6 可以移除两者
- Evaluator 的边际价值随模型能力提升向任务边界收缩
- Planner 的价值始终存在——模型不会自发做充分前期规划

方法论：不要一次性大幅简化（难以判断哪些组件真正承重），而是逐个移除、观察影响。

## "What Can I Stop Doing?" 原则

Anthropic 在 [Harnessing Claude's Intelligence](../sources/anthropic-harnessing-claudes-intelligence.md) 中将 harness 进化原则提炼为一个核心问题：**"我可以停止做什么？"**

三个维度的权力转移：
1. **编排权**：从 harness 控制每个工具调用 → 让模型通过代码执行工具自主编排（BrowseComp 准确率从 45.3% → 61.6%）
2. **上下文管理权**：从预加载所有指令 → 让模型通过 [agent skills](agent-skills.md) 按需披露
3. **持久化权**：从外部检索系统 → 让模型通过 compaction + memory folder 自主管理

这是 Bitter Lesson 的 agent 版本：harness 中的结构可能成为模型性能的瓶颈，需要持续修剪。

## SWE-EVO：Harness 必要性的量化证据

[SWE-EVO](../sources/swe-evo.md) 的实验结果为 harness engineering 的必要性提供了硬数据。在多步软件演进任务中，[误差级联](error-cascade.md) 将模型的单步 72.8% 成功率击落至多步 25%。

对 harness 设计的具体启示：

- **Checkpoint 不是可选项**：级联放大效应意味着每一步之后的验证（跑测试、确认无回归）不只是"确认这步对了"，更是在错误传播前截断级联
- **需求分解比模型能力更关键**：强模型的主要失败是 *指令遵循*（理解歪了 release notes），不是"不会写代码"。Harness 中的需求澄清和分解机制直接决定上限
- **框架-模型匹配度是隐藏变量**：同一模型在不同 agent 框架上表现差距可达 4 倍（GLM-5：SWE-agent 37.5% vs OpenHands 8.33%）。Harness 的 prompt 风格和交互模式是能力发挥的关键因素
- **Fix Rate 可迁移到 harness 内部**：SWE-EVO 的软评分设计（部分通过率 + 回归惩罚）可用于 harness 的中间评估，不用等完全做完才判断进退

## 可靠性科学视角的 Harness 设计

[Beyond pass@1](../sources/beyond-pass-at-1-reliability-framework.md) 的 23,392 episode 实验为 harness 设计提供了三个可操作的量化工具：

1. **MOP 检测嵌入监控层**：论文的滑动窗口熵检测（w=5 步，监测工具调用分布的信息熵）可直接嵌入 harness 的 step callback。当 H(t) 超阈值时触发 context reset——保存 GDS 进度、清空 context、从最近成功的 subtask 继续。这比"重复 3 次就停"的循环检测精细得多，捕捉的是"行为模式变无序"而非仅仅"重复同一动作"。

2. **任务分解的量化决策**：RDC 斜率直接量化了分解收益。对 RDS 陡峭的模型（如 Qwen3 30B：短任务 75.8% → 超长 34.3%，分解增益 41.5pp），任务分解是高回报策略；对 RDS 平缓的前沿模型（DeepSeek V3 增益仅 13.1pp），分解的收益更小。harness 可根据目标模型的 RDC 动态调整分解粒度。

3. **记忆组件的谨慎使用**：episodic memory 在长任务上全线无效（10 个模型中 0 个改善），便签占步数和 context 的代价超过收益。这启示 harness 中的记忆机制应作为可选组件，只在校准过 overhead-vs-benefit 后启用——或采用有过期机制的分层记忆替代朴素便签本。

## 容错逻辑的归属：Harness 而非 Agent

[ReliabilityBench](../sources/reliabilitybench.md) 的实验为 harness 设计提供了一个重要的架构判据：容错逻辑应放在 harness 层，而非 agent 的推理链。

证据来自 ReAct vs Reflexion 的对比：
- ReAct（简单重试）在故障注入下恢复率 80.9%，Reflexion（反思+重试）仅 67.3%
- Reflexion 的退化梯度更陡（-0.50/0.1λ vs -0.38），说明反思层在错误观察上建立的"教训"反而误导后续行为

这支持一个设计原则：**agent 负责决策，harness 负责容错**。重试、退避、降级、超时兜底——这些机制应该在 harness 的工具调用包装层实现，agent 看到的应该是"工具调用成功"或"永久失败"的干净信号。

[可靠性曲面](reliability-surface.md) 框架还提供了一种评估 harness 设计有效性的方法：对不同 harness 配置画 R(k, ε, λ) 曲面，曲面更平坦的配置在生产中更可靠。

## Prefix Cache 命中率：Harness 的核心经济指标

[Manus](../entities/manus.md) 的生产经验和 [Don't Break the Cache 论文](../sources/dont-break-the-cache.md)共同揭示：对于 agent 系统，**prefix cache 命中率是 harness 设计最重要的经济杠杆**。

原因在于 agent loop 的 token 结构：prefill/decode 比例约为 100:1。相比之下，对话机器人的 prefill 比例通常远低于此。这意味着缓存 miss 的边际成本在 agent 场景下被放大两个数量级（Claude Sonnet：命中 $0.30/MTok vs 未命中 $3.00/MTok，差距 10×）。

**Harness 层对 cache 命中率的直接影响：**

1. **系统提示结构**：将工具定义、核心指令放在最前面并保持逐字节稳定；动态内容（时间戳、git 状态、session 数据）推到所有缓存断点之后。Claude Code 通过 `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` 标记实现这种分区。

2. **工具定义管理**：在 agent loop 中途修改 tools 数组会触发缓存失效级联（Anthropic：tools → system → messages 三层全失效）。正确做法：保持完整工具集不变，通过 logit masking 在解码阶段约束动作空间（Manus 方案）。

3. **Session affinity 配置**：分布式推理服务中，请求必须路由到同一后端实例才能命中 GPU 内存中的 KV 缓存。向 OpenAI 传 `prompt_cache_key`，向 Kimi 传 `x-session-affinity` header。

4. **Compaction 与 caching 的取舍**：compaction 会修改对话历史前缀，直接破坏 cache 稳定性。Manus 的解决方案是优先使用文件系统外部化（外部化不修改前缀），以此规避 compaction 对缓存的破坏。

详见 [prefix caching](prefix-caching.md) 概念页。

## "Agents Are an Execution Problem"：从 Harness 到 OS

[AgenticOS Workshop](../sources/agenticos-workshop-asplos-2026.md)（ASPLOS 2026）的 invited talk 标题——**"Agents Are Not Just a Model Problem. They Are an Execution Problem."**——精确表达了 harness engineering 向下延伸的方向。

当前的 harness 在应用层解决执行控制问题：约束、工具、反馈回路、状态管理。但应用层的控制天然有局限：
- 资源隔离依赖约定而非强制（harness 可以限制 token 预算，但进程级的资源逃逸无法阻止）
- 安全边界依赖模型判断（guardrails 是否触发取决于 classifier 的准确率）
- 探索式执行缺乏原语支持（子 agent 的 context 隔离靠 SDK，不是 OS 级保证）

[Agent OS](agent-os.md) 的研究方向是为 harness 提供系统级支撑：[AgentCgroup](agent-resource-control.md) 提供资源控制原语，[Execute-Only Agents](agent-sandboxing.md) 提供架构级安全隔离，[Fork-Explore-Commit](fork-explore-commit.md) 提供探索式执行原语。

这不意味着 harness 会被 OS 替代——正如 web 框架不因 Linux 容器而消失。Harness 处理业务语义层面的编排，OS 处理系统层面的资源和隔离。两层协同的系统比单层更稳健。

## 产品视角：Keep AI on Leash

[Karpathy](../entities/andrej-karpathy.md) 在 [2025 YC 演讲](../sources/karpathy-software-is-changing-again.md) 中用产品语言表述了 harness 的核心功能——"keep AI on the leash"。这不是技术术语包装，而是对 [generation-verification loop](generation-verification-loop.md) 中人类瓶颈的直接回应：

- **AI 是过度反应的**：给 10,000 行 diff 没有意义——人类验证不过来
- **小增量优于大变更**：每次生成覆盖小而具体的变更，验证通过后再前进
- **具体 prompt 提高通过率**：模糊 prompt → 验证失败 → 旋转循环；具体 prompt → 高概率一次通过
- **可审计的中间 artifact**：课程设计案例——在 AI 和最终产出之间插入人类可审计的 artifact（课程大纲），防止 AI "迷失森林"

这与 harness engineering 的"enforce invariants, not implementations"原则互补：invariants 是系统层面的约束（边界不可越），而"keep on leash"是交互层面的约束（步幅不可过大）。

## 层级分解的理论基础

[Herbert Simon](../entities/herbert-simon.md) 在 [The Architecture of Complexity](../sources/simon-architecture-of-complexity-notes.md)（1962）中提出的[层级系统](hierarchical-systems.md)和[近可分解性](near-decomposability.md)理论，为 harness engineering 提供了跨越 60 年的理论锚点。

Harness 就是一种人工设计的近可分解结构：
- **层级分解**：system prompt（全局约束）→ 工具定义（局部能力）→ 权限系统（边界控制），每一层的修改不必连锁影响其他层
- **频率分离**：全局约束是低频组件（跨 session 不变），工具调用是高频组件（每步迭代），feature tracking 在两个频率之间传递聚合状态
- **稳定中间形态**：Simon 的钟表匠寓言直接解释了 checkpoint 和 feature tracking 的价值——部分进展构成不可被打断摧毁的"子组件"，保障长任务中的演进不因单次失败而回滚到起点

Simon 还指出"没有守恒定律要求复杂系统的描述和被描述对象一样庞大"。这为 context 管理提供了理论许可——正确的层级表示可以在有限 token 预算内保留系统的关键信息，丢弃的只是子系统间的冗余细节。

## 相关概念

- [Hierarchical systems](hierarchical-systems.md) — harness 分层设计的理论基础
- [Near-decomposability](near-decomposability.md) — harness 各层弱耦合的结构性质
- [Long-running agents](long-running-agents.md) — harness 设计的核心应用场景
- [Autonomy Slider](autonomy-slider.md) — harness 在产品层的表达
- [Generation-Verification Loop](generation-verification-loop.md) — harness 必须优化的人-AI 协作循环
- [Agent OS](agent-os.md) — harness 的系统层支撑
- [ACI](aci.md) — harness 的工具接口层
- [Tool design](tool-design.md) — 工具定义的工程实践
- [Context management](context-management.md) — harness 中的上下文管理机制
- [Feature tracking](feature-tracking.md) — harness 中的进度追踪机制
- [Evaluator-optimizer](evaluator-optimizer.md) — harness 中的质量反馈回路
- [Agentic systems](agentic-systems.md) — harness 服务的系统类型
- [Error cascade](error-cascade.md) — harness 必须对抗的核心失败机制
- [可靠性衰减](reliability-decay.md) — harness 必须对抗的另一核心失败机制
- [Agent 可靠性评估](agent-reliability-evaluation.md) — 量化 harness 有效性的评估框架
- [可靠性曲面](reliability-surface.md) — 多维可靠性测量，可用于评估 harness 配置
- [Agent 混沌工程](chaos-engineering-for-agents.md) — 通过故障注入测试 harness 容错能力

## References

- `sources/manus-context-engineering.md`
- `sources/dont-break-the-cache.md`
- `sources/claude-code-source-leak-2026.md`
- `sources/anthropic_official/building-effective-agents.md`
- `sources/anthropic_official/effective-harnesses-long-running-agents.md`
- `sources/anthropic_official/harness-design-long-running-apps.md`
- `sources/anthropic_official/harnessing-claudes-intelligence.md`
- `sources/openai_official/harness-engineering.md`
- `sources/george-zhang-harness-engineering-cybernetics.md`
- `sources/arxiv_papers/2512.18470-swe-evo.md`
- `sources/arxiv_papers/2603.29231-beyond-pass-at-1-reliability-science-framework.md`
- `sources/arxiv_papers/2601.06112-reliabilitybench.md`
- `sources/agenticos-workshop-asplos-2026.md`
- `sources/karpathy-software-is-changing-again.md`
- `sources/simon-architecture-of-complexity-notes.md`
