# ACI — Agent-Computer Interface

## 定义

Agent 与计算机（工具、API、文件系统）交互的接口设计。Anthropic 类比 HCI（Human-Computer Interface）提出：在 ACI 上投入的设计精力应该与 HCI 同等。

## 设计原则

1. **站在模型的角度思考**：仅凭工具描述和参数，使用方式是否显而易见？如果你自己需要仔细想，模型也一样。
2. **命名要自解释**：参数名和描述要让用途一目了然，就像给团队里的初级开发者写文档。
3. **测试模型如何使用工具**：用大量样本输入观察模型犯什么错，然后迭代。
4. **Poka-yoke（防误设计）**：改变参数设计让犯错更难。例如用绝对路径而非相对路径。

## 实践案例

Anthropic 在 SWE-bench agent 中花在优化工具上的时间比优化 prompt 更多。例如：模型在使用相对路径时经常出错（因为 agent 移出了根目录），改为强制使用绝对路径后错误消失。

## 基础设施层的 ACI

[Karpathy](../entities/andrej-karpathy.md) 在 [2025 YC 演讲](../sources/karpathy-software-is-changing-again.md) 中将 ACI 的思想扩展到基础设施层面：agent 是"数字信息的新消费者和操纵者"，既不是传统人类用户（通过 GUI），也不是传统程序（通过 API），而是一种新的中间存在。因此需要专门的接口：

- **[llms.txt](llms-txt.md)**：类似 robots.txt，用 markdown 告诉 LLM 一个域名是什么、关键文档在哪里。相比让 LLM 解析 HTML，这是一种主动适配。由 [Jeremy Howard](../entities/jeremy-howard.md)（Answer.AI）于 2024 年提出。
- **Docs for LLMs**：Vercel/Stripe 等先行者将文档以 markdown 提供；将 "click" 替换为等效 curl 命令，使 agent 可直接执行。
- **[MCP](../entities/mcp.md)**：Anthropic 的协议，agent 与服务间的标准化通信。
- **数据转换工具**：getingest（GitHub → 纯文本）、Deep Wiki（repo → 分析文档）——"改 URL 就能让内容对 LLM 可达"。

Karpathy 的论点："Meeting LLMs halfway"——即使 LLM 将来能操作 GUI，主动让基础设施适配 LLM 仍然值得，因为更高效、更可靠。

这与 Anthropic 的微观 ACI 原则一脉相承：站在模型角度思考 → 让接口对模型直觉化。区别在于 Anthropic 聚焦单工具接口，Karpathy 推广到整个互联网基础设施。

## 相关概念

- [Tool design](tool-design.md) — ACI 的具体工程实践
- [Augmented LLM](augmented-llm.md) — ACI 是增强型 LLM 的接口层
- [Software 3.0](software-3-0.md) — ACI 是 Software 3.0 程序与外部世界的接口

## References

- `sources/anthropic_official/building-effective-agents.md`
- `sources/karpathy-software-is-changing-again.md`
- `sources/llmstxt-org-the-llms-txt-file.md`
