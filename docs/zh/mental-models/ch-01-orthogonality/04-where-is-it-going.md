# 这股力的方向，会变吗

<div class="mm-article" data-card="assets/where-is-it-going.png" data-card-alt="方向会变吗" markdown>

光知道模型在变强还不够。如果这股力只是沿着同一个方向越来越大，你至少可以选一个固定的正交方向然后安心干活。

但如果它在变强的同时还在**转向**呢？那就是另一个工程问题了。

## 当前的主流：Transformer

当前的主流架构——Transformer——建立在一个核心机制上：自注意力（self-attention）。每个 token 都能"看到"上下文中的所有其他 token，并据此计算自己的表征。这就是你的上下文窗口的由来：模型能"看到"多少，取决于 attention 机制能覆盖多长的序列。

Transformer 架构下的大语言模型，归根到底是在文本序列上做统计建模。它通过 next-token prediction 学到了语言的结构、知识和推理模式。很强——但"通过预测文本来理解世界"只是编码世界的方式之一。

至少还有三种不同的路径正在演进。

## 四种编码世界的方式

| | Transformer | 状态空间模型 (SSM) | 基于能量的模型 (EBM) | 世界模型 (World Model) |
|---|---|---|---|---|
| **一句话** | 读遍所有文字的补全者 | 带有限记忆的流处理器 | 给整体兼容性打分的裁判 | 在脑中模拟物理后果的想象者 |
| **建模目标** | 给定前文，下一个 token 最可能是什么 | 怎样把全部历史压缩进一个固定大小的状态向量 | 一个完整的配置有多"合理" | 如果我采取这个行动，世界会变成什么样 |
| **怎么"理解"世界** | 从文本共现中提取统计规律 | 将序列动态建模为状态的演化 | 在全局配置的能量景观中寻找低能态 | 学习因果结构与状态转移规律 |

??? note "状态空间模型 (SSM)"

    以 Mamba 系列为代表。灵感来自控制论中的动态系统：一个固定大小的隐藏状态随时间演化，每个新输入决定状态怎么更新、哪些信息保留、哪些信息遗忘。
    
    跟 Transformer 的区别是根本性的——Transformer 把所有历史 token 都存在一个叫 KV cache 的结构里（可以理解为"对话记忆缓存"），让每个 token 都能随机访问任何历史信息；SSM 把整个历史压缩进一个固定大小的状态向量，内存恒定，但信息是有损的。极长序列下更快、更省内存，但精确检索不如 Transformer。
    
    Mamba-3（2025）的作者自己坦承："线性层将主要与全局自注意力层配合使用。"业界的共识正在收敛于**混合架构**——比如 AI21 的 Jamba：7 层 Mamba 配 1 层 attention，256K 上下文只需要 4GB KV cache，吞吐量是同级 Transformer 的 3 倍。

??? note "基于能量的模型 (EBM)"

    以 Yann LeCun 力推的 JEPA 架构为代表。思路完全不同：不做序列预测，而是定义一个能量函数来给整个输入配置打分——低能量意味着"兼容、合理"，高能量意味着"矛盾、不自然"。
    
    推理不是"一个 token 接一个 token 地采样"，而是"在能量景观中寻找低能态"——本质上是一个优化过程，不是采样过程。JEPA 的变体在嵌入空间中操作：它预测的不是原始像素或文字，而是学到的抽象表征，这迫使模型丢弃无关细节、聚焦结构。
    
    LeCun 2025 年底离开 Meta 创办 AMI Labs，2026 年 3 月以 35 亿美元估值融了 10 亿美元，就是奔着这条路去的。

??? note "世界模型 (World Model)"

    试图从根本上弥合"描述因果"和"建模因果"之间的鸿沟。大语言模型说"重力使物体下落"，是因为它在训练文本中见过这句话及其变体——它学到的是语言层面的因果描述。世界模型的目标是让系统真正学习到物理的动态规律：物体有持久性、重力向下、碰撞传递动量、行动有后果。
    
    DeepMind 的 Genie 3 通过逐帧预测生成交互式 3D 世界，在其中涌现出了直觉物理（重力、碰撞、物体持久性）。NVIDIA 的 Cosmos 平台用超过 2000 万小时的真实世界数据训练物理 AI。短期物理模拟已经可用——但长期的通用规划和推理，仍是开放前沿。

## 不是互斥的

看到这里，你可能会以为这是四条分道扬镳的路径，未来某天会有一条胜出。实际的画面比这更有趣。

2025 年底的一篇论文证明，自回归模型和基于能量的模型在函数空间上存在**双射关系**——通过最大熵强化学习中的 soft Bellman 方程，每一个自回归模型都隐含地定义了一个能量函数，反之亦然。这是一个数学上的等价性，不意味着两者在工程实现上可以互换——训练方式、推理开销、适用场景仍然差异很大。但它说明这些路径在理论根基上比表面看起来更近。

SSM 的实际走向是与 Transformer 融合，不是替代它。世界模型的当前实现大量建立在 Transformer 架构之上。这些路径正在交汇，而不是分叉。

## 对 harness engineering 意味着什么

但它们确实代表了**不同的力的方向**。

!!! warning "如果这些方向兑现了"

    - 如果未来的模型能原生地模拟因果关系（World Model），你在 harness 层搭建的 chain-of-thought scaffolding——本质上是你在替模型做规划——可能变得不再必要。
    - 如果未来的模型能在无损的无限上下文中操作（SSM 的极限场景），你精心设计的 context window management 策略——压缩、摘要、遗忘、检索——可能变得不再必要。
    - 如果未来的模型能全局评估一个完整配置的合理性（EBM），你为了让模型"一步一步想"而搭建的推理链路，可能变得不再必要。

这些都是"可能"，不是"一定"。这些架构还在早期——LeCun 的 AMI Labs 才刚拿到钱；纯 SSM 在需要精确检索的任务上仍然弱于 Transformer；世界模型的长程推理和规划依然是研究前沿，而不是工程现实。

但趋势看得见：模型在试图从更本质的层面去编码世界，不只是预测下一个 token。

这股力不只在变强，它可能在**转向**。

</div>

---

## 延伸阅读

- Hounie, I., Dieng, A. B., & Dathathri, S. (2025). Autoregressive Language Models Are Secretly Energy-Based Models. [arXiv:2512.15605](https://arxiv.org/abs/2512.15605)
- Gu, A. & Dao, T. (2023). Mamba: Linear-Time Sequence Modeling with Selective State Spaces. [arXiv:2312.00752](https://arxiv.org/abs/2312.00752)
- Cartesia. (2025). Mamba-3: An Inference-First State Space Model. [blog.cartesia.ai](https://blog.cartesia.ai/p/mamba-3)
- AI21 Labs. (2024). Jamba: AI21's Groundbreaking SSM-Transformer Model. [ai21.com](https://www.ai21.com/blog/announcing-jamba/)
- Meta AI. (2023). I-JEPA: The First AI Model Based on Yann LeCun's Vision for More Human-Like AI. [ai.meta.com](https://ai.meta.com/blog/yann-lecun-ai-model-i-jepa/)
- NVIDIA Research. (2025). Energy-Based Diffusion Language Models for Text Generation. [research.nvidia.com](https://research.nvidia.com/publication/2025-01_energy-based-diffusion-language-models-text-generation)
- LeCun, Y. / AMI Labs. (2026). AMI Labs raises $1B at $3.5B valuation to build energy-based world models. [报道来源](https://tech-insider.org/yann-lecun-ami-labs-1-billion-world-models-2026/)
- Introl. (2026). World Models Race 2026: LeCun, DeepMind, and Beyond. [introl.com](https://introl.com/blog/world-models-race-agi-2026)
