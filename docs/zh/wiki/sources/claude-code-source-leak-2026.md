# Claude Code 源码泄露：社区分析与内部机制研究（2026）

## 来源

- **事件**：2026 年 3 月 31 日，Claude Code npm 包 v2.1.88 意外包含 `.map` source map 文件（缺少 `.npmignore` 配置），暴露约 51.2 万行 TypeScript，共 ~1,900 个文件
- **规模**：在 Chaofan Shou（安全研究员）X 平台披露后数小时内被撤除，但已被广泛镜像
- **Anthropic 官方声明**："人为错误导致的发布打包问题，不是安全漏洞"
- **GitHub 响应**：对几乎所有 fork 发出 DMCA takedown（见 HN: 47594936）
- **类型**：社区技术分析综合（非官方来源）

## 关键分析来源

| 来源 | URL | 关注点 |
|------|-----|--------|
| Alex Kim 博客 | https://alex000kim.com/posts/2026-03-31-claude-code-source-leak/ | 总体架构、anti-distillation |
| dbreunig 博客 | https://www.dbreunig.com/2026/04/04/how-claude-code-builds-a-system-prompt.html | 系统提示构建、cache 架构 |
| Sabrina.dev | https://www.sabrina.dev/p/claude-code-source-leak-analysis | Cache 边界标记、工具架构 |
| Latent.Space | https://www.latent.space/p/ainews-the-claude-code-source-leak | 子 agent fork-join KV cache |
| HN 线程 47586778 | https://news.ycombinator.com/item?id=47586778 | 最高技术密度讨论 |
| HN 线程 47609294 | https://news.ycombinator.com/item?id=47609294 | 对话持久化细节 |
| VentureBeat | https://venturebeat.com/technology/claude-codes-source-code-appears-to-have-leaked-heres-what-we-know | 事件概述 |

## 发现：Context 与 Cache 架构

### 1. Cache 边界标记机制（直接来自源码）

源码包含名为 `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` 的命名边界标记。标记含义：

- **标记之前**：工具定义、核心指令——跨所有 organization 全局缓存
- **标记之后**：项目特定配置、git 状态、时间戳——session 特定，不缓存

文件 `promptCacheBreakDetection.ts` 实现了 **14 向量 cache-break 检测**，配有"sticky latches"机制——防止模式切换（如开关某些功能）无意中使已缓存内容失效。

函数 `DANGEROUS_uncachedSystemPromptSection()` 的命名本身就是文档：一个有意识的工程决策——某些 section 必须绕过缓存。

服务端 prompt cache TTL：1 小时。超时后后续消息需以全价重新处理整个对话历史。

### 2. 对话压缩（Compaction）机制（直接来自源码）

`autoCompact.ts` 组件实现会话压缩：

- **触发**：接近 token 限制时自动触发
- **机制**：派遣次级 Claude 实例（更小的模型）对对话历史进行摘要
- **思维链处理**：摘要器在 `<analysis>` 标签内推理，然后剥除推理过程，仅将浓缩摘要插回 context
- **生产 bug 记录**：源码注释记载"1,279 个 session 在单次 session 内出现 50 次以上连续失败（最多 3,272 次），每天全球浪费约 25 万次 API 调用"。修复：`MAX_CONSECUTIVE_AUTOCOMPACT_FAILURES = 3`

**Microcompaction**（轻量级压缩）：在空闲期后（与 cache 过期时间挂钩）触发。保留 `tool_use` blocks，但将实际工具输出替换为 `[Old tool result content cleared]`。始终保留最近 5 条工具结果。默认禁用，通过 GrowthBook feature flag 服务端控制。

### 3. 对话历史存储（直接来自源码）

Claude Code 以 append-only JSONL 文件存储对话历史：

- 压缩前的消息**永不删除**
- 消息携带元数据标志：`isCompactSummary`、`isVisibleInTranscriptOnly`、`isMeta`
- 这些标志控制发送给 API 之前的消息过滤

**关键推论**：用户可见的 transcript 和模型可见的 context 可以显著偏离。用户看到"完整"对话，模型实际接收的是经过多重过滤的版本。

### 4. 系统提示的动态组装（直接来自源码）

Claude Code 从 30+ 组件片段动态组装系统提示：

- **总是包含**：核心身份、系统规则、安全准则
- **条件包含**：基于用户类型（Anthropic 员工 vs 外部用户）、可用工具、会话模式（交互式 REPL vs 非交互式）、feature flags
- 泄露文档列出了约 40+ 系统提示片段，含各自的 token 计数
- 版本变更日志跨越 51 个版本
- 约 50 个工具定义，含条件渲染逻辑

### 5. 子 Agent 的 KV Cache Fork-Join 模型（直接来自源码）

子 agent 实现 fork-join KV cache 模型：

- 子 agent 包含完整的父 context，无需重新处理
- 这使并行化成本极低——通过 cache 复用实现
- 描述为使并行化"基本免费"

这解释了 Claude Code 如何以低成本运行并发子 agent：KV cache 在父-子之间共享，每个子 agent 不产生独立的 prefill 成本。

### 6. 工具架构（直接来自源码）

- 基础工具定义：29,000 行
- 默认启用：不足 20 个工具
- 完整集合：60+ 工具
- 命名工具（部分）：`AgentTool`、`BashTool`、`FileReadTool`、`FileEditTool`、`FileWriteTool`、`NotebookEditTool`、`WebFetchTool`、`WebSearchTool`、`TodoWriteTool`、`TaskStopTool`、`TaskOutputTool`、`AskUserQuestionTool`、`SkillTool`、`EnterPlanModeTool`、`ExitPlanModeV2Tool`、`SendMessageTool`
- 46,000 行查询引擎管理所有 API 交互
- Bash 执行经过 `bashSecurity.ts` 的 23 项安全检查

### 7. Anti-Distillation 机制（直接来自源码）

Claude Code API 请求中携带 `anti_distillation: ['fake_tools']` 参数。服务端静默注入诱饵工具定义到系统提示中，污染任何通过录制 API 流量方式收集训练数据的尝试。

`system.ts` 中的客户端认证系统（第 59-95 行）使用 Bun 的 Zig 层 HTTP stack 在传输前将 `cch=00000` 占位符替换为计算出的 hash——在 JavaScript 运行时可见性之下工作。

### 8. Memory 架构（直接来自源码）

三层 memory 设计：
1. `MEMORY.md` 索引（每条指针约 150 字符）
2. 按需加载的主题文件
3. 完整会话 transcripts（从不完整重读，仅对特定标识符进行"grep"）

`autoDream` 整合服务在空闲期运行，由三重锁控制：24 小时间隔 + 5 次以上 session 积累 + 文件级咨询锁。

### 9. Undercover 模式（直接来自源码）

`undercover.ts`（约 90 行）注入系统提示指令，在为外部仓库贡献时剥除 Co-Authored-By 署名，并指示模型不提及内部代号或自己是 AI 的身份。Anthropic 员工默认启用，外部用户无法禁用（只能通过环境变量强制开启）。

## 代码质量观察

- 1.6% 的代码库直接涉及 AI 模型；其余是编排、context 管理和权限处理
- `src/cli/print.ts`：5,594 行；其中一个函数 3,167 行，12 层嵌套，约 486 圈复杂度，在单个函数内处理 agent 运行循环、SIGINT、速率限制、AWS 认证、MCP 生命周期、插件安装/刷新、worktree 桥接和控制消息分发

## 可靠性评估

| 类别 | 内容 |
|------|------|
| **高可靠**（直接来自源码） | `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__`、`promptCacheBreakDetection.ts`（14 向量）、`autoCompact.ts` + 25 万 API 调用浪费 bug、append-only JSONL + 三种元数据标志、`anti_distillation`、`undercover.ts`、工具数量和名称、29K 行工具定义、46K 行查询引擎、`DANGEROUS_uncachedSystemPromptSection()` |
| **中可靠**（社区对源码的分析） | Fork-join KV cache、autoDream 三重锁、五层权限系统 |
| **较低可靠**（推断） | 60+ 条件工具的精确行为、所有 `isMeta` 消息过滤的完整语义、KAIROS daemon 架构（未发布，部分实现） |

## 与现有 Wiki 的关联

- [Claude Code](../entities/claude-code.md) — 内部 cache 架构、compaction 机制的实证补充
- [Context management](../concepts/context-management.md) — autoCompact、microcompaction、append-only history 的实现细节
- [Prefix caching](../concepts/prefix-caching.md) — `__SYSTEM_PROMPT_DYNAMIC_BOUNDARY__` 是 prefix caching 工程实践的直接证据
- [Context compression](../concepts/context-compression.md) — autoCompact 的 secondary-summarizer 模式
- [Implicit loop architecture](../concepts/implicit-loop-architecture.md) — gather-act-verify-repeat 的具体实现
- [Claude Code permission system](../concepts/claude-code-permission-system.md) — 工具条件渲染的底层实现

## References

- https://alex000kim.com/posts/2026-03-31-claude-code-source-leak/
- https://www.dbreunig.com/2026/04/04/how-claude-code-builds-a-system-prompt.html
- https://www.sabrina.dev/p/claude-code-source-leak-analysis
- https://www.latent.space/p/ainews-the-claude-code-source-leak
- https://news.ycombinator.com/item?id=47586778
- https://news.ycombinator.com/item?id=47609294
- https://venturebeat.com/technology/claude-codes-source-code-appears-to-have-leaked-heres-what-we-know
