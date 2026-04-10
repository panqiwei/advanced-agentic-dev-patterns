# CLI vs GUI Automation：Agent 驱动软件的两条路线

Agent 要使用一个原本为人类设计的软件，技术上有两条根本不同的路线：**GUI 自动化**（让 agent 像人一样操作 UI——点击、截图、读取像素/accessibility tree）和 **CLI 生成**（给软件套一层结构化命令行接口，让 agent 直接调用功能）。这两条路线的分歧不是战术差异，而是对"agent 与软件应该如何相处" 的根本哲学分歧。

## 两条路线的对比

| 维度 | GUI Automation | CLI Generation |
|---|---|---|
| 接口 | 像素 / Accessibility Tree / UI 自动化 API | 命令字符串 / JSON |
| 代表实现 | computer-use（Anthropic）· Operator（OpenAI）· Playwright · Selenium · RPA 工具 | [CLI-Anything](../entities/cli-anything.md) · 原生 CLI 工具 · MCP servers |
| 生成时成本 | 低（不需要分析软件内部） | 高（需要生成、测试、维护 CLI） |
| 运行时成本 | 高（截图 tokens + 慢速迭代） | 低（纯文本，毫秒响应） |
| 稳定性 | 低（UI 改版即崩） | 高（CLI 命令相对稳定） |
| 覆盖率 | 理论上 100%（能看到的都能点） | 实际上由生成的 CLI 定义 |
| 可并行性 | 难（独占屏幕） | 天然并发 |
| 可审计 | 弱（行动记录是截图） | 强（命令历史即 log） |
| 适用软件 | 任意有 UI 的软件 | 有代码/后端/HTTP API 的软件 |
| 失败模式 | 脆弱 + 难以调试 | 脆弱度低 + 错误明确 |

## 两种路线的优势领域

### GUI Automation 擅长的场景

- **完全闭源软件**，没有可分析的后端或 API（某些专业软件、老版本商业工具）
- **视觉判断任务**——需要 agent "看见" 的工作，比如验证网页布局、审查 UI bug、分析设计稿
- **临时性、一次性的操作**——不值得投入 CLI 生成成本
- **跨软件连贯操作**——"从 Figma 拖图到 Slack 再到 Jira"，多软件视觉协调比多 CLI 命令容易
- **人类协作场景**——agent 需要在人类正在使用的界面上做辅助操作

### CLI Generation 擅长的场景

- **可重复、结构化的工作流**——批量处理、管道组合、定时任务
- **有明确数据模型的软件**——项目文件、文档、数据库（ODF、SVG、MLT XML……）
- **后端存在的软件**（bpy、headless 模式、REST API）
- **高并发场景**——多个 agent 同时操作同一个工具
- **需要可审计的自动化**——每个动作都有确定性的命令字符串记录
- **长时运行、跨会话的任务**——会话状态可序列化为文件

## 两派的核心论据

### CLI 派的攻击

关键论点是：**GUI 自动化是"在错误层级工作"**。

- GUI 本来就是把应用能力压缩到视觉/点击层的"有损编码"——agent 用 GUI 等于让 agent 读懂人的二次翻译
- 屏幕截图动辄数千 tokens，成本 × 延迟 × 错误率都不可接受
- UI 改版一次，整套自动化崩一次——成本向脆弱性迁移
- "If you can CLI it, you should CLI it"——CLI-Anything 作者的立场
- Claude Code 每天跑数千个 CLI 驱动的工作流，已经证明 CLI 路线的可行性

### GUI 派的反驳

关键论点是：**CLI 生成假设了"软件有后端"，但这个假设常常不成立**。

- 大部分商业专业软件没有可公开的 CLI/API（Figma、Notion、Cursor、Slack 桌面版……）
- 生成 CLI 需要读源码——闭源软件做不到
- 某些工作本质上是视觉的——色彩匹配、排版审美判断，CLI 无法传递
- 软件演化速度 > CLI 维护速度，特别是快速迭代的 web 产品
- Computer-use 的通用性让 agent 有一个"保底通道"，就像浏览器是最后的兜底

## 混合路线（2026 浮现的共识）

两条路线并非零和——实际生产中最有效的往往是**混合策略**：

1. **有 CLI 用 CLI**——能通过结构化命令完成的，一律走 CLI（80% 场景）
2. **没 CLI 退到 UI 自动化**——闭源、视觉、未覆盖的任务走 GUI 路线（20% 场景）
3. **中间层：逆向 CLI**——[CLI-Anything-WEB](https://github.com/ItamarZand88/CLI-Anything-WEB) 的路线：对只有 web UI 的应用，用 Playwright 捕获流量，再生成 CLI。这是"CLI 路线" 的一次地盘扩张

这种分层的好处：agent 默认用低成本 CLI；只有在 CLI 覆盖不到的地方才启动昂贵的 GUI fallback。Claude Code 的 computer-use 工具本质上就是兜底通道，不是日常工具。

## 这两条路线映射到的两种世界观

更深一层，这两条路线反映了对"agent 与软件关系" 的两种根本世界观：

| 路线 | 世界观 | 谁应该改变？ |
|---|---|---|
| GUI Automation | Agent 应该足够聪明，能使用任何为人类设计的软件 | **Agent 变聪明** |
| CLI Generation | 软件应该为 agent 提供原生接口，不让 agent 承担 UI 识别的成本 | **软件变"听话"** |

两种立场都有合理性：前者是"通用智能" 的承诺延续，后者是"工具专业化" 的工程务实。长期来看，两者都会发生——agent 会变得更能用 GUI（computer-use 类模型继续进步），软件也会变得更 agent-native。

关键的战略问题是：**在当前阶段，哪条路线给 agent 能力 / 美元 / 时间的 ROI 最高？** 2026 年的答案大概率是"CLI 优先 + GUI 兜底"。

## 对 harness 设计的启示

- 同一个任务，能走 CLI 的绝不走 GUI——这是 [harness-engineering](harness-engineering.md) 的一条黄金法则
- Harness 应该把 CLI 工具以 self-describing 方式暴露给 agent（`--help` + SKILL.md），让 agent 容易发现可用工具
- GUI fallback 要有明确的"升级" 触发条件，防止 agent 因为一个无关细节退化到像素操作
- Test discipline 要区分：CLI 工具可以做端到端真实后端测试（CLI-Anything 的做法），GUI 工具测试成本高得多

## References

- [cli-anything source summary](../sources/cli-anything.md) — CLI 路线最激进的实现与论证
- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) — "CLI-Anything can flat-out replace GUI-based agent approaches"
- [ItamarZand88/CLI-Anything-WEB](https://github.com/ItamarZand88/CLI-Anything-WEB) — 逆向 CLI 路线的扩张
- [anthropic-building-effective-agents](../sources/anthropic-building-effective-agents.md) — ACI 设计原则（工具格式、文档、防误）适用于两条路线
- [raymond-unix-philosophy-summary](../sources/raymond-unix-philosophy-summary.md) — CLI 路线的哲学根基
