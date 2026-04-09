# Scaling Managed Agents: Decoupling the Brain from the Hands

- **来源**: `sources/anthropic-managed-agents.md`
- **URL**: https://www.anthropic.com/engineering/managed-agents
- **作者**: Lance Martin, Gabe Cemaj, Michael Cohen (Anthropic)
- **发布**: 2026（具体日期未标注）

## 摘要

Anthropic 工程博客描述了 Managed Agents 的架构演进——一种托管式 agent 服务，将 agent 的组件虚拟化为稳定接口（session、harness、sandbox），使底层实现可独立替换。文章从操作系统设计中汲取灵感：正如 OS 通过虚拟化硬件为"尚未被构想的程序"提供通用抽象，Managed Agents 通过虚拟化 agent 组件为未来的 harness 和 sandbox 提供通用接口。

核心论点：harness 编码了"模型做不到什么"的假设，这些假设会随模型能力提升而失效（[Bitter Lesson](sutton-bitter-lesson.md)）。因此，系统设计应对接口有主张（opinionated about interfaces），对接口背后的实现无主张（unopinionated about implementations）。

## 关键要点

1. **从 Pet 到 Cattle**：初始设计将所有组件（session、harness、sandbox）放在单一容器中——形成了一个不可失去的"宠物"。容器故障意味着 session 丢失，调试需要进入包含用户数据的容器。解决方案是将每个组件解耦为可独立替换的"牲畜"。

2. **Brain-Hands 解耦**：将"大脑"（Claude + harness）与"双手"（sandbox + 工具）分离。每只"手"变成一个统一接口：`execute(name, input) → string`。harness 不关心 sandbox 是容器、手机还是 Pokemon 模拟器。

3. **Session 外部化**：session 是一个独立于 harness 和 sandbox 的持久化事件日志。harness 故障后可通过 `wake(sessionId)` + `getSession(id)` 恢复。session 不是 Claude 的 context window——它是 context window 之外的可查询对象，通过 `getEvents()` 按位置切片访问。

4. **安全边界结构化**：在耦合设计中，prompt injection 只需说服 Claude 读取环境变量即可获得凭证。结构性修复：凭证永远不进入 sandbox。Git token 在初始化时注入 remote，OAuth token 存储在 vault 中通过专用代理访问。

5. **Many Brains, Many Hands**：解耦后，brain 的启动不再等待 container provisioning，p50 TTFT 下降约 60%，p95 下降超 90%。每个 brain 可连接多只 hand，hand 可在 brain 之间传递。

6. **Meta-Harness**：Managed Agents 是一种"元 harness"——不对具体的 harness 实现有主张，而是提供通用接口让不同 harness（Claude Code、任务特定 harness 等）都能运行。

## 与其他 source 的关联

- 延续 [Building Effective Agents](anthropic-building-effective-agents.md) 的"从简单开始"原则，但跳到了平台层
- 解决了 [Harness Design for Long-Running Apps](anthropic-harness-design-long-running-apps.md) 中发现的 context anxiety 和 harness 进化问题
- Session 外部化与 [Effective Context Engineering](anthropic-effective-context-engineering.md) 的 context-as-object-outside-window 概念一脉相承
- OS 虚拟化类比深化了 [LLM-OS 类比](../concepts/llm-os-analogy.md) 的框架
- 安全边界设计与 [Agent Sandboxing](../concepts/agent-sandboxing.md) 形成互补
- "假设会过时"呼应了 [Bitter Lesson](sutton-bitter-lesson.md) 的核心观点

## References

- `sources/anthropic-managed-agents.md`
