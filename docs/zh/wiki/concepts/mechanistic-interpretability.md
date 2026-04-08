# Mechanistic Interpretability（机制可解释性）

=== "图"

    ![mechanistic-interpretability](assets/mechanistic-interpretability.png){ loading=lazy width="100%" }

=== "文"

    
    ## 定义
    
    Mechanistic interpretability 是逆向工程神经网络内部计算机制的研究方向——不只知道模型"做了什么"，而是理解"怎么做的"。核心工具链：发现可解释特征 → 追踪特征间的因果链路（电路）→ 用扰动实验验证假说。
    
    类比：为 AI 构建"显微镜"。如同生物学家用显微镜发现细胞，可解释性研究者用特征分解和归因图发现模型内部的计算单元和信息通路。Anthropic 的 [可解释性综述博文](../sources/anthropic-tracing-thoughts-language-model.md) 是这一领域的入口。
    
    ## 核心概念
    
    ### 特征（Features）
    
    模型内部的可解释计算单元。单个神经元通常是**多义的**（polysemantic）——同时编码多个不相关概念。特征通过稀疏编码方法（SAE、转码器、交叉编码器）从神经元激活中提取，通常对应人类可理解的概念（从低层的具体词汇到高层的情感、计划、推理步骤）。
    
    ### 归因图（Attribution Graphs）
    
    描述模型在特定 prompt 上从输入到输出的计算路径。节点 = 活跃特征；边 = 特征间的线性因果效应。通过剪枝保留对输出贡献最大的子图。
    
    ### 跨层转码器（Cross-Layer Transcoder, CLT）
    
    Anthropic 在 [circuit tracing](../sources/anthropic-circuit-tracing-methods.md) 中使用的关键工具。替换原模型的 MLP 层，使特征间的直接交互线性化，从而支持精确的归因计算。
    
    ### 扰动验证
    
    抑制或注入特征，观察对下游特征和模型输出的影响。如果效应与归因图预测一致，则增强对发现的信心。经典案例：将 "Texas" 特征替换为 "California" → 模型输出从 "Austin" 变为 "Sacramento"。
    
    ## 关键发现
    
    来自 Anthropic 对 Claude 3.5 Haiku 的 [生物学研究](../sources/anthropic-biology-large-language-model.md)：
    
    - **前瞻规划**：写诗时在行首就预选韵脚词——LLM 并非只看下一个 token
    - **多语言共享表征**：存在跨语言的抽象概念空间
    - **幻觉机制**：拒绝回答是默认行为，"已知实体"特征的误触发导致幻觉
    - **CoT 忠实性**：可区分真实推理、无中生有、动机推理三种模式
    - **越狱张力**：语法连贯性特征 vs 安全机制的竞争
    
    ## 内省意识（Introspective Awareness）
    
    Anthropic 的 [内省研究](../sources/anthropic-emergent-introspective-awareness.md) 将可解释性工具用于探索模型自我觉察：通过概念注入测试模型能否检测和报告自身内部状态。最强模型（Opus 4、4.1）表现最佳，暗示内省随能力涌现。
    
    ## 行业认可
    
    MIT Technology Review 将 mechanistic interpretability 列为 [2026 年十大突破技术](../sources/mit-mechanistic-interpretability-2026.md)，标志着从学术探索进入实用阶段。
    
    ## 与 Agent 工程的关系
    
    虽然 mechanistic interpretability 主要是基础研究，但与 agent 系统设计存在多个连接点：
    
    - **Guardrails 设计**：理解幻觉和越狱的内部机制有助于设计更深层的 [guardrails](guardrails.md)
    - **推理可靠性**：CoT 忠实性分析直接关联 agent 的决策可信度
    - **模型选择**：理解不同模型的内部机制差异可指导 [harness engineering](harness-engineering.md) 中的模型选择
    
    ## 历史语境：从"大部分不可解释"到系统性研究
    
    [Karpathy 2023 年演讲](../sources/karpathy-intro-to-large-language-models.md) 描绘了 mechanistic interpretability 尚处萌芽期的状态：模型被视为"大部分不可解释的人工制品"（mostly inscrutable artifacts），需要作为"经验性对象"通过行为观察来研究。他提到了"reversal curse"（知道 Tom Cruise 的母亲是谁但不知道反向查询）这类怪异现象——模型的知识组织方式与人类直觉深度不一致，只能从特定方向访问。
    
    这一 2023 年的判断与后续 Anthropic 的突破形成鲜明对比。从"we don't actually really know"到归因图、跨层转码器、内省能力发现——interpretability 在两年间从"有人在做"变成了 AI 安全的核心基础设施。
    
    ## 当前局限
    
    - 仅能解释约 25% prompt 上的行为
    - 人工分析耗时（短 prompt 需数小时）
    - 替代模型可能引入不同于底层模型的机制
    - 无法覆盖注意力模式（QK-circuits）的因果解释
    
    ## 相关概念
    
    - [Guardrails](guardrails.md) — 可解释性发现指导安全防护设计
    - [Agentic systems](agentic-systems.md) — 内省能力可能影响 agent 透明度
    - [Harness engineering](harness-engineering.md) — 理解模型内部机制有助于设计更好的约束
    
    ## References
    
    - `sources/anthropic_official/tracing-thoughts-language-model.md`
    - `sources/anthropic_official/circuit-tracing-methods.md`
    - `sources/anthropic_official/biology-large-language-model.md`
    - `sources/anthropic_official/emergent-introspective-awareness.md`
    - `sources/mit-mechanistic-interpretability-2026.md`
    - `sources/karpathy-intro-to-large-language-models.md`
    
