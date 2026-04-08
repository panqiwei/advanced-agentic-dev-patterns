# Agentic Systems（Agentic 系统）

=== "图"

    ![agentic-systems](assets/agentic-systems.png){ loading=lazy width="100%" }

=== "文"

    
    ## 定义
    
    Agentic 系统是利用 LLM 完成任务的系统的总称。Anthropic 将其分为两类：
    
    - **Workflows**（工作流）：通过预定义的代码路径编排 LLM 和工具。流程是确定性的，LLM 在固定节点被调用。
    - **Agents**（智能体）：LLM 动态指挥自身的流程和工具使用，自主决定下一步做什么。
    
    这个区分很重要——workflow 提供可预测性和一致性，agent 提供灵活性和自主决策能力。选择取决于任务的开放程度。
    
    ## 复杂度阶梯
    
    Anthropic 建议按复杂度递增选择：
    
    1. 单次 LLM 调用 + 检索 + 上下文示例（大多数场景够用）
    2. Workflow 模式（[prompt chaining](prompt-chaining.md)、[routing](routing.md)、[parallelization](parallelization.md)、[orchestrator-workers](orchestrator-workers.md)、[evaluator-optimizer](evaluator-optimizer.md)）
    3. 自主 Agent（开放式问题、不可预测步骤数）
    
    核心原则：只在有证据表明复杂度能改善结果时才升级。
    
    ## 长时运行维度
    
    当 agent 任务复杂度超出单个 context window，系统进入 [长时运行](long-running-agents.md) 模式。此时 agent 的自主性反而需要更多 workflow-like 的约束——[feature tracking](feature-tracking.md)、增量推进、状态交接——通过 [harness engineering](harness-engineering.md) 在自由度中保持方向。这揭示了一个有趣的张力：越自主的 agent，越需要精心设计的 harness。
    
    ## 另一种定义：OS Kernel 类比
    
    [Karpathy](../entities/andrej-karpathy.md) 提供了一种不同于组件分类的定义方式：agent 之于 LLM 如同操作系统内核之于 CPU（[LLM-OS 类比](llm-os-analogy.md)）。这个视角不关心 agent 内部是 workflow 还是自主决策，而是关注 agent 在系统架构中的**角色**——资源调度、任务编排、I/O 协调。
    
    两种定义互补：Anthropic 的 workflows-vs-agents 分类回答"agent 内部怎么组织"；Karpathy 的 OS 类比回答"agent 在系统中处于什么位置"。
    
    ## 系统基础设施维度
    
    [AgenticOS Workshop](../sources/agenticos-workshop-asplos-2026.md)（ASPLOS 2026）打开了 agentic 系统的第三个维度：不只关注 agent 内部的组织方式（workflows vs agents）或 agent 在系统中的角色（OS kernel 类比），还关注 **agent 需要什么样的基础设施**。
    
    workshop 的核心论点：传统 OS 抽象从未为 agent 负载设计，agent 需要新的执行原语（[Fork-Explore-Commit](fork-explore-commit.md)）、资源控制（[AgentCgroup](agent-resource-control.md)）、安全隔离（[Agent 沙箱](agent-sandboxing.md)）和语义感知调度。这标志着 agentic 系统研究从"如何构建更好的 agent"向"agent 需要什么样的操作系统"的范式下移。详见 [Agent OS](agent-os.md)。
    
    在此之前，[AIOS](../sources/aios-llm-agent-operating-system.md)（Mei et al., COLM 2025）已经提供了一个完整的工程原型：当多个 agent 并发共享 LLM 时，引入 kernel 层统一管理 [调度](agent-scheduling.md)、内存换页、工具冲突、权限隔离。实验在单 GPU 上实现了 2.1x 吞吐量提升，验证了 OS 级资源管理对 agent 并发效率的价值。
    
    ## 产品化维度：部分自主产品
    
    [Karpathy](../entities/andrej-karpathy.md) 在 [2025 YC 演讲](../sources/karpathy-software-is-changing-again.md) 中从产品视角重述了 workflows↔agents 连续体：不是二选一，而是一个 [autonomy slider](autonomy-slider.md)——用户在产品中按需调节 AI 自主权。Cursor 的 tab 补全→Cmd+K→Cmd+L→Cmd+I 就是这个连续体的产品实现。
    
    核心论断：**现阶段应该造 Iron Man 战甲（augmentation），不是 Iron Man 机器人（full agent）**。"This is the decade of agents"——自主权的扩展是渐进的，类似 Tesla Autopilot 经历的 12 年。这与 Anthropic 的"从简单开始"原则在产品层面高度一致。
    
    ## 跨系统互操作维度
    
    [Agent Interoperability](agent-interoperability.md) 是 agentic 系统规模化后遭遇的新挑战：单系统内的 workflows-vs-agents 分类不够了。当多个组织、多个框架的 agent 需要协作时，需要跨系统边界的通信标准。
    
    [A2A 协议](a2a-protocol.md)（Google/Linux Foundation）是这个维度上的标准化答案——将 orchestrator-workers 模式从单框架内部扩展到跨框架、跨组织的多 agent 网络。[Agent Card](agent-card.md) 提供能力发现，[Task Lifecycle](task-lifecycle.md) 提供跨请求的状态管理。
    
    ## 相关概念
    
    - [Augmented LLM](augmented-llm.md) — agentic 系统的基础构建块
    - [ACI](aci.md) — agent 与计算机的接口设计
    - [Tool design](tool-design.md) — 工具定义的工程实践
    - [Long-running agents](long-running-agents.md) — 跨多个 context window 的长时任务
    - [Harness engineering](harness-engineering.md) — agent 系统的控制层设计
    - [LLM-OS 类比](llm-os-analogy.md) — 从系统架构层次定位 agent
    - [Agent OS](agent-os.md) — agent 系统的 OS 级基础设施
    - [Agent scheduling](agent-scheduling.md) — 多 agent 的资源调度
    - [Autonomy Slider](autonomy-slider.md) — workflows↔agents 连续体的产品化表达
    - [Generation-Verification Loop](generation-verification-loop.md) — 人-AI 协作的核心循环
    - [A2A Protocol](a2a-protocol.md) — 跨框架 agent 通信的开放标准
    - [Agent Interoperability](agent-interoperability.md) — 多框架 agent 生态的互操作能力
    
    ## References
    
    - `sources/anthropic_official/building-effective-agents.md`
    - `sources/anthropic_official/effective-harnesses-long-running-agents.md`
    - `sources/karpathy-llm-cpu-agent-os-kernel.md`
    - `sources/agenticos-workshop-asplos-2026.md`
    - `sources/arxiv_papers/2403.16971-aios-llm-agent-operating-system.md`
    - `sources/karpathy-software-is-changing-again.md`
    - `sources/google-a2a-protocol.md`
    
