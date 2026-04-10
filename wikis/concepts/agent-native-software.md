# Agent-Native Software（Agent 原生软件）

Agent-Native Software 是一种软件产品设计立场：**软件应当直接为 agent 这个新型用户类型设计接口，而不是先服务人类再适配 agent**。它的对立面是"human-first, agent-retrofit"——先为人类做 GUI/鼠标/弹窗，再想办法把 agent 套进去（用 RPA、computer-use、screen scraping 等脆弱手段）。

## 为什么这个概念值得单独命名

计算机软件的"用户"历史上只有一类：人类。所以 UI 研究、HCI 学科、产品设计实践全部以人为目标——有视觉、有注意力、能看图标、会点击、会犯错。

但从 2024-2026 这两年开始，agent 以显著速度变成一个新的"用户类群"。它和人类用户的特征几乎相反：

| 维度 | 人类 | Agent |
|---|---|---|
| 输入通道 | 鼠标、键盘、触摸 | 文本命令 |
| 输出偏好 | 视觉、图标、颜色 | 结构化数据（JSON） |
| 反馈耐心 | 秒级延迟敏感 | 毫秒级 token 敏感（caching / 长度）|
| 错误处理 | 会自己修、会重试、能读 stack trace | 需要明确错误码 + 可操作提示 |
| 发现能力 | 靠视觉浏览 | 靠 `--help` / 元数据 / 注册中心 |
| 状态管理 | 愿意看 modal 弹窗 | 需要显式 session / undo 原语 |
| 一次性任务 | 有 | 很少——都是脚本或工作流 |
| 并发 | 几乎没有 | 大量并行 |

**两类用户的需求差异大到足以推导出不同的软件形态**。Agent-Native Software 就是这个推导的结果：专门为 agent 这组需求设计接口的软件。

## 核心原则（从实践中归纳）

不同项目的提法略有差异，但若干共同骨架已经浮现（综合 [CLI-Anything](../entities/cli-anything.md) HARNESS.md 原则、[Agent Skills](agent-skills.md) 标准、[harness-engineering](harness-engineering.md) 实践）：

### 1. 结构化优先（Structured-First）

- 所有返回都可以切换到机器可读格式（JSON 是当前事实标准）
- 不依赖视觉布局传递语义——表格的对齐只对人有意义，agent 看到的是结构
- 错误不是 traceback，是带 code + remediation 的对象

### 2. 自描述（Self-Describing）

- 工具能用 `--help` / schema / metadata 回答"你能做什么"
- 依赖标准入口让 agent 发现能力：POSIX `which`、`--help`、`llms.txt`、`SKILL.md`
- 文档和代码在同一个工具里（不是两个需要同步的东西）

### 3. 可组合（Composable）

- 每个命令做一件事，输入输出可管道
- 状态显式而非隐式（不依赖会话上下文来理解命令含义）
- 命令可预测——同输入必有同输出（或者明确标注为随机/时间相关）

### 4. 显式状态（Explicit State）

- 长任务可以 save/load 会话
- 可撤销（undo/redo 作为一等原语）
- 状态可序列化为文本（JSON / markdown），方便 agent 检查和修改
- 不假设连续的会话——agent 可能中途换窗口、重启、交给子 agent

### 5. 确定性（Deterministic Where Possible）

- 副作用标记清晰（哪些命令只读、哪些会修改状态、哪些不可逆）
- 失败可重试——幂等或有明确的回滚路径
- 不依赖 race 或时间窗口

### 6. POSIX / 标准原语优先

- 使用 agent 已经掌握的工具（shell、pip、which、env var）
- 避免"自研 SDK"增加学习成本
- 能用 CLI 解决就不要 custom protocol

## 与相邻概念的关系

- 对比 [aci](aci.md)：ACI 是"agent 与工具接口" 的学科名称，agent-native software 是这种接口哲学在**整个软件产品**层面的延伸——不只是加一层 agent wrapper，而是从架构上重新考虑用户对象
- 对比 [tool-design](tool-design.md)：tool-design 是为 agent 造工具的具体手艺；agent-native software 是"造工具" 升级为"造产品" 时的立场
- 对比 [harness-engineering](harness-engineering.md)：harness engineering 是在**运行时**用约束和反馈引导 agent；agent-native software 是在**设计时**就让软件侧主动配合 agent
- 对比 [agent-skills](agent-skills.md)：Agent Skills 是描述"如何使用一个 agent-native 软件" 的打包标准，是 agent-native software 的"说明书" 约定
- 对比 [mcp](../entities/mcp.md)：MCP 是跨软件的协议层；agent-native software 是每个软件内部的设计哲学。两者可以叠加（一个 agent-native 软件可以通过 MCP 暴露能力，也可以通过 CLI 暴露——CLI-Anything 选了后者）

## 实现路径的两种立场

目前社区在"如何实现 agent-native" 这个问题上分裂成两条路线：

### 立场 A：CLI + JSON 就够了

代表：[CLI-Anything](../entities/cli-anything.md) · Unix 哲学传统 · Anthropic Claude Code 的工具使用实践

论点：

- CLI 本来就是结构化、可组合、自描述的
- LLM 已经被训练得非常擅长读写命令行文本
- POSIX 是跨平台、跨语言、跨厂商的稳定标准
- 加协议层（MCP、A2A）增加了额外学习成本，收益不清

代表成果：CLI-Anything 的 20+ 生成 CLI，2,130 测试，用最小协议开销让 agent 驱动 GIMP/Blender/OBS

### 立场 B：需要新协议

代表：[MCP](../entities/mcp.md) · [A2A](a2a-protocol.md) · Agent Sandbox Protocol（尚未标准化）

论点：

- CLI 假设了 stdin/stdout/文件系统——很多场景不适用（跨机器、跨进程隔离、流式）
- 权限、审计、版本管理需要协议层保证
- 双向流（agent 问 → 工具反问）、LRO（长运行操作）、进度上报需要更结构化的 RPC
- 工具之间互操作（agent-to-agent 通信）需要独立于工具实现的协议

代表成果：MCP 的快速采纳、A2A 的开放协议治理、各种 agent OS 论文提出的新原语

**两条路线不互斥**：很可能会合流——协议层做"跨边界通信" 和"元数据/权限"，CLI 层做"工具实现"。CLI-Anything 生成的 CLI 完全可以被包在 MCP server 里。

## 一种更深的含义

把"agent" 提升为一等用户类型，实际上把软件产品设计从 HCI 单极扩展为 **HCI + ACI 双极**。未来可能的演化：

- 某些软件会存在两套并行接口（人用 GUI、agent 用 CLI/API），像图书馆有人工服务台和自助机
- 某些软件会只有 agent 接口（内部工具、后台服务）——这些软件没必要做 GUI
- 某些软件会只有人接口（需要人类审美判断的创造工具），agent 通过"指导人" 间接使用
- 会出现"agent 专属的软件类别"——一些能力对 agent 有意义、对人没有意义（比如 `cli-anything-llmbench` 这种工具）

当 agent 成为最主要的"计算资源消费者" 时，agent-native 就不再是一个可选设计考量，而是默认假设——类似于今天的 mobile-first。这个转折点可能在 2027-2028 发生。

## 未解问题

- **如何判断一个软件"够不够 agent-native"？**——还缺少客观的评估指标（类似 WCAG 对可访问性的分级）。目前只有主观感受："这个工具用起来顺 / 不顺"
- **Agent-native 和 human-friendly 是否总是冲突？**——有时 yes（JSON 难看），有时 no（`--help` 对人也有用）。是否能有一套 API 同时给两种用户？
- **谁为 agent-native 设计买单？**——传统软件厂商的客户是人，改造 agent-native 接口的 ROI 不明。开源项目由兴趣驱动，商业软件动力不足
- **Agent 能力在快速变化——今天设计的"agent 原生" 接口，三年后是否仍然原生？**——比如现在 agent 不擅长处理大 JSON，将来可能擅长；现在依赖 `--help` 发现能力，将来可能靠 embedding 搜索

## References

- [cli-anything source summary](../sources/cli-anything.md) — "Tomorrow's Users will be Agents" 宣言、四大设计原则、CLI 优先论证
- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) — HARNESS.md 方法论 spec
- [anthropic-equipping-agents-agent-skills](../sources/anthropic-equipping-agents-agent-skills.md) — Agent Skills 作为描述 agent-native 软件的打包标准
- [anthropic-building-effective-agents](../sources/anthropic-building-effective-agents.md) — ACI 作为 agent 与工具接口学科的提出
- [raymond-unix-philosophy-summary](../sources/raymond-unix-philosophy-summary.md) — Unix 哲学作为 CLI+JSON 路线的历史根基
