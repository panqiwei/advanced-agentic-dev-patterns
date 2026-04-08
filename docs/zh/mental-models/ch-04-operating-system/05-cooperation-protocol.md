# 协作协议

<div class="mm-article" data-card="assets/cooperation-protocol.png" data-card-alt="协作协议——信任边界之间的通信" markdown>

隔离创造了安全，也创造了孤岛。

两个进程不能直接读对方的内存——这是信任边界设计的结果，也是 IPC 存在的原因。OS 在维持进程隔离的前提下，提供了精确的通信通道：管道、消息队列、共享内存、socket。核心特性一个：**字节精确**。进程 A 发了什么，进程 B 收到的就是什么，一个比特都不会变。

Agent 系统里的协作有两种本质不同的形态：human-agent（人类委托 agent），和 agent-agent（agent 之间通信）。两者共享同一个断裂点，但断裂的位置不同。

## Human-Agent：通过 ACI 间接委托

OS 把用户意图翻译成硬件操作。用户点击"保存"，OS 把它变成一串 IO 系统调用——缓冲区刷新，文件系统元数据更新，磁盘写入。这条翻译链是精确的：用户的操作通过 GUI 事件系统被捕捉为确定性的 API 调用，最终到达硬件。

Agent 做同样的事，但通信介质不同。

用户说"帮我整理一下这份报告"，agent 把它变成一串工具调用——读文件，分析结构，重组段落，输出结果。这条翻译链的起点是自然语言，不是 API 调用。

**ACI（Agent-Computer Interface）是这条翻译链的接口设计标准。** Anthropic 在 SWE-bench agent 的实践里发现，花在优化工具接口上的时间比优化 prompt 更多——工具名称要自解释，错误信息要让 agent 能理解，参数设计要防误（比如强制绝对路径而非相对路径，消除了 agent 在切换目录时的一类系统性错误）。

ACI 是 agent 系统的系统调用接口设计学：站在 LLM 的角度设计接口，就像当年的 OS 工程师站在程序员的角度设计 syscall API。区别不在结构，在介质——一边是类型安全的函数签名，一边是自然语言。

这条翻译链的断裂点在**意图解释的不确定性**。

"整理报告"是什么意思——保留原意改格式，还是重写使其更清晰，还是精简到原来的一半——取决于 agent 的解释。用户的意图是模糊的，agent 的执行是离散的，两者之间的映射是概率性的。这和 OS 的"保存文件"操作有本质差异：那是一个确定性的 API 调用，没有解释空间。

Karpathy 在 2025 年的演讲里把这个方向称为"让基础设施主动适配 LLM"——llm.txt 让网站直接提供 LLM 可读的内容，文档以 markdown 提供而非 HTML。这是 ACI 从单工具接口扩展到整个基础设施层的方向：不是让 LLM 去读懂为人类设计的界面，而是重新设计界面让 LLM 直接可用。

## Agent-Agent：通过 A2A 直接通信

进程间通信是对称的：进程 A 和进程 B 都是 OS 下的进程，用同一套 IPC 机制通信。

Agent 之间的通信不那么对称——不同框架开发的 agent，不同语言写的 agent，不同公司部署的 agent，它们之间如何通信？

Google 的 A2A 协议（Agent-to-Agent，2025 年 4 月）是走向标准化的第一个尝试。三个核心组件：

- **Agent Card**：每个 agent 发布一份能力声明（JSON），描述自己能做什么、支持什么通信模式——类比 `/proc` 文件系统里的进程能力信息，让调用方可以在运行时发现对方能做什么
- **HTTPS + JSON-RPC**：确定性传输层，统一消息格式。用已经成熟的 web 基础设施承载 agent 通信，而不是重新发明网络协议
- **OAuth 身份验证**：跨组织 agent 通信的身份验证，解决"我怎么知道这个 agent 是谁"的问题

A2A 试图做的事，和 TCP/IP 当年做的事结构上相似：把分散的、私有的、框架内的通信协议，统一成一套跨实现的标准——让不同 OS 上的进程可以通信，让不同框架里的 agent 可以通信。

## 断裂点：语义信道的结构性衰减

OS 的 IPC 是字节精确的，A2A 的传输层也可以是字节精确的。但 agent 通信的断裂点不在传输层。

Agent A 生成一段摘要传给 agent B。这段摘要是 A 对原始信息的有损压缩：保留了 A 认为重要的部分，丢弃了 A 认为不重要的细节。但 A 的判断是概率性的，不是确定性的。B 基于这段摘要推理，可能进一步丢弃细节，变异语义。链条越长，衰减越多——A → B → C → D 之后，到 D 手里的信息可能已经面目全非。

!!! warning "自然语言没有校验和"

    OS 进程通过管道发送 1024 字节，接收方可以验证数据完整性（CRC、哈希）。Agent 通信的自然语言内容没有等价机制——没有"语义完整性校验"，没有办法确认"B 理解的是 A 想表达的那个意思"。

这个问题两种协作形态都有，但机制不同：
- Human-Agent：人类意图在被翻译成 agent 行动的过程中，模糊性引入解释分歧
- Agent-Agent：agent 输出在被传递给下一个 agent 的过程中，压缩引入信息丢失

A2A 用确定性协议（HTTPS/JSON-RPC）包裹自然语言内容，减少了传输层的损耗。但无法消除语义层的衰减：消息里的自然语言内容依然是有损的，协议层无法校验语义完整性。

这是[信道噪声](../ch-03-entropy/03-context-rot.md)在协作链路上的具体实例化：自然语言没有纠错码，每次传递都是一次有损的语义变换。结构化消息格式（JSON schema 约束字段，而非自由文本）减少衰减——但 agent 间需要传递的很多内容本质上是非结构化的判断和推理，无法完全结构化。

## 通信复杂度正交于模型能力

更强的进程不消灭 IPC 的需求——进程还是需要和其他进程通信，还是需要调用系统资源。

更强的 LLM 不消灭协作协议的需求。能接更复杂的任务，但复杂任务往往需要更多 agent 协作——更多的 human-agent 委托链，更多的 agent-agent 通信跳数。通信复杂度随任务复杂度增长，模型能力的提升不会使其减少。

通信协议的设计空间正交于推理能力。

---

每根支柱都当场指出了 OS 类比在哪里断裂。放在一起看，这些裂缝指向一个共同的方向——而不是随机散落的设计问题。

</div>

---

## 延伸阅读

- Anthropic. (2025). *Building Effective Agents*. anthropic.com/engineering. — ACI 设计原则的一手来源：为什么花在优化工具接口上的时间比优化 prompt 更多，工具名、错误信息、参数设计如何影响 agent 表现
- Factory.ai. (2025). *Evaluating Context Compression for AI Agents*. — 本文"语义信道衰减"论点的实证支撑：量化了信息在 agent 间传递时的有损程度

## 概念与实体

本文涉及的核心概念与实体，在项目知识库中有更详细的资料：

- [ACI](../../wiki/concepts/aci.md) — 本文讨论的 Agent-Computer Interface 设计标准的详细资料
- [A2A Protocol](../../wiki/concepts/a2a-protocol.md) — Agent-to-Agent 协议的技术规格与设计动机
- [Agent Card](../../wiki/concepts/agent-card.md) — A2A 协议中 agent 能力声明机制的详解
- [Agent Interoperability](../../wiki/concepts/agent-interoperability.md) — 跨框架、跨组织 agent 通信的互操作性问题
- [Tool Design](../../wiki/concepts/tool-design.md) — ACI 原则在工具层面的具体工程实践
- [Google](../../wiki/entities/google.md) — A2A 协议的发起方
