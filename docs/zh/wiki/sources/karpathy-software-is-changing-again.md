# Software Is Changing (Again) — Andrej Karpathy YC AI Startup School 演讲

## 来源信息

- **演讲者**: [Andrej Karpathy](../entities/andrej-karpathy.md)
- **场合**: YC AI Startup School, San Francisco
- **日期**: 2025-06-19
- **原始链接**: https://www.ycombinator.com/library/MW-andrej-karpathy-software-is-changing-again
- **本地路径**: `sources/karpathy-software-is-changing-again.md`

## 摘要

Karpathy 从自己在 Stanford、OpenAI、Tesla 的经历出发，提出软件正在经历 70 年来最根本的变革。他构建了一个三层软件分类法——Software 1.0（代码）、Software 2.0（神经网络权重）、[Software 3.0](../concepts/software-3-0.md)（自然语言 prompt）——并论证 LLM 不仅是工具，而是一种全新的计算机，一个新的[操作系统](../concepts/llm-os.md)。

## 核心论点

### 1. 软件三代演进

| 代际 | 编程介质 | 目标硬件 | 类比 |
|------|----------|----------|------|
| Software 1.0 | 代码（C++/Python） | 传统 CPU | GitHub |
| Software 2.0 | 神经网络权重 | GPU/TPU | Hugging Face |
| Software 3.0 | 自然语言 prompt | LLM | 尚未出现的等价物 |

关键观察：Software 2.0 在 Tesla Autopilot 中"吃掉"了 1.0 的 C++ 代码。同样的事情正在 3.0 对 1.0 和 2.0 发生。三种范式共存，开发者需要在三者间流畅切换。

### 2. LLM 是操作系统，不只是工具

LLM 同时具有三种属性：
- **公用事业（utility）**：metered access、低延迟、高可用。LLM 宕机 = "智力停电"。
- **晶圆厂（fab）**：高 capex、深科技树、研发秘密集中。但软件的可塑性削弱了壁垒。
- **操作系统**：最贴切的类比。几个闭源提供者（Windows/macOS ≈ GPT/Claude）+ 开源替代（Linux ≈ LLaMA）。LLM 是 CPU，context window 是内存，LLM 编排记忆和计算来解决问题。

Karpathy 断言："We're in the 1960s of LLMs"——LLM 计算昂贵导致中心化、time sharing、瘦客户端。个人计算革命尚未到来（Mac Mini 是早期迹象）。GUI 也尚未被真正发明——ChatGPT 的文本气泡就像终端。

### 3. LLM 的"人灵"心理学

LLM 是"人的随机模拟"（stochastic simulations of people），具有：
- **超人能力**：百科知识、完美记忆（类似 Rain Man）
- **认知缺陷**：幻觉、锯齿状智能（9.11 > 9.9、strawberry 有几个 r）、顺行性遗忘（context window 是工作记忆，不会自主学习）
- **安全隐患**：容易被骗、prompt injection、数据泄漏

类比：《Memento》和《50 First Dates》——weights 固定、context window 每天清零。

### 4. 部分自主产品与 [Autonomy Slider](../concepts/autonomy-slider.md)

Karpathy 不看好纯自主 agent（"2025 不是 agent 之年，这是 agent 的十年"），转而倡导**部分自主产品**。Cursor 和 Perplexity 是典型案例，共享四个特征：
1. **上下文管理**：LLM 处理信息组装
2. **多 LLM 编排**：embedding + chat + diff apply
3. **专用 GUI**：红绿 diff、一键接受/拒绝，利用人类视觉 GPU
4. **自主度滑块**：从 tab 补全到全 repo agent，用户控制交出多少自主权

Tesla Autopilot 是同一思路的前例——仪表盘 GUI + 渐进式自主权扩展。Iron Man 类比：现阶段应该造战甲（augmentation），不是造机器人（agent）。

### 5. Generation-Verification Loop

人与 AI 的合作本质是：**AI 生成、人类验证**。优化这个循环的两种方式：
- **加速验证**：GUI + 可视化 > 阅读文本。利用人类的"视觉 GPU"。
- **约束 AI**：不要让 AI 生成 10,000 行 diff——人才是瓶颈。小增量、具体 prompt、保持 leash。

课程设计案例：不是让 AI 直接教学（"迷失森林"），而是分成教师端（创建课程）和学生端（按课程学习），中间有可审计的课程 artifact。

### 6. Vibe Coding

自然语言编程使每个人都成为程序员。Karpathy 用 Swift（不会 Swift）做了 iOS app，vibe coded MenuGen（menu.app）。关键发现：**代码是容易的部分，DevOps 才是地狱**——认证、支付、部署全是浏览器操作，需要 agent 来做。

### 7. 为 Agent 构建基础设施

Agent 是数字信息的新消费者和操纵者，需要专门的基础设施：
- **llm.txt**：类似 robots.txt，用 markdown 告诉 LLM 这个域名是什么
- **Docs for LLMs**：Vercel/Stripe 提供 markdown 文档；把 "click" 替换成 curl 命令
- **[MCP](../entities/mcp.md)**：Anthropic 的协议，直接与 agent 通信
- **数据转换工具**：getingest（GitHub → 纯文本）、Deep Wiki（repo → 文档站）

"Meeting LLMs halfway"——即使 LLM 能操作 GUI，也值得让基础设施主动适配。

## 与 wiki 其他内容的连接

| 本演讲概念 | 对应 wiki 页面 | 关系 |
|------------|----------------|------|
| 部分自主产品 | [Agentic Systems](../concepts/agentic-systems.md) | Karpathy 的 autonomy slider 是 workflows↔agents 连续体的产品化表达 |
| "Keep AI on leash" | [Harness Engineering](../concepts/harness-engineering.md) | Karpathy 从产品视角表述了 harness 的核心功能 |
| Generation-verification loop | [Evaluator-Optimizer](../concepts/evaluator-optimizer.md) | 人-AI 版本的生成-评估循环 |
| Context window = 工作记忆 | [Context Management](../concepts/context-management.md) | 与顺行性遗忘类比呼应 compaction/外部化状态方案 |
| 为 agent 构建基础设施 | [ACI](../concepts/aci.md) / [Tool Design](../concepts/tool-design.md) | llm.txt/MCP/docs-for-LLMs 是 ACI 在基础设施层的延伸 |
| LLM 的心理缺陷 | [Guardrails](../concepts/guardrails.md) | 幻觉、gullibility、prompt injection 是 guardrails 要应对的问题 |

## References

- `sources/karpathy-software-is-changing-again.md` — 本页主要来源
