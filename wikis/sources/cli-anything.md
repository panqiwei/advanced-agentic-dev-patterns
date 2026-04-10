# CLI-Anything：让所有软件都成为 Agent-Native

> **Source**: [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) · [CLI-Hub 注册中心](https://hkuds.github.io/CLI-Anything/) · 生态分叉 [ItamarZand88/CLI-Anything-WEB](https://github.com/ItamarZand88/CLI-Anything-WEB)
> **Type**: 开源项目（HKUDS, 29.8K+ stars, 2026-04 活跃）
> **Core thesis**: "Today's software serves humans. Tomorrow's users will be agents." 通过自动生成结构化 CLI，把任意现有 GUI 软件改造为 agent 可直接驱动的"工具"。

## 一句话定位

CLI-Anything 是一个 Claude Code 插件（同时适配 Pi / OpenClaw / OpenCode / Codex / Qodercli / GitHub Copilot CLI / Goose），把任意"为人类设计的"软件（GIMP、Blender、Audacity、LibreOffice、OBS、Draw.io、Godot……）通过 7 阶段自动化流水线，一键转换为 agent 可原生调用的命令行工具。生成的 CLI 都具备：`--json` 结构化输出 + REPL 交互模式 + undo/redo 状态管理 + 自动 `SKILL.md` 描述 + 端到端测试套件。

## 关键问题：Agent-Software Gap

作者明确提出他们要解决的矛盾：

- **现状**：AI agent 推理能力强，但用真正专业软件的能力很差。目前三种主流方案都不令人满意：
  1. **脆弱的 UI 自动化**（computer-use / Operator / RPA 范式）——依赖像素点击，软件稍微更新即崩溃
  2. **有限的 API 封装**——大部分专业桌面软件根本没有公开 API
  3. **降级重实现**——用 LLM 直接生成"玩具版"功能，丢失 90% 原软件能力
- **CLI-Anything 的解法**：直接与真实软件后端集成（Blender bpy、LibreOffice headless、FFmpeg、mscore、melt……），保留完整专业能力；不做替代品，而是给现有软件"套一层 agent 可读的接口"。

## 为什么是 CLI

项目的"Why CLI"论证值得完整记录，因为它是 agent 工具设计范式的一次清晰宣言：

- **结构化可组合**：文本命令天然匹配 LLM 的生成格式，可以管道/链式组合
- **轻量普适**：零依赖、跨平台
- **自描述**：`--help` 是免费的工具文档
- **已被验证**：Claude Code 每天运行数千个 CLI 驱动的实际工作流
- **Agent-First**：`--json` 输出消除解析复杂度
- **确定性**：结果可预测，agent 行为更可靠

这套论证与 Anthropic 的 Agent Skills 哲学、Unix 哲学、以及 [harness-engineering](../concepts/harness-engineering.md) 的实践经验同向。

## 7 阶段自动生成流水线

`/cli-anything:cli-anything <path-or-repo>` 触发完整流水线（HARNESS.md 是方法论 spec）：

| 阶段 | 动作 | 产物 |
|---|---|---|
| 1. Analyze | 扫描源代码，识别 backend engine（MLT/ImageMagick/bpy...），把 GUI 动作映射到 API 调用，编目 undo/redo command 系统 | 代码导览报告 |
| 2. Design | 设计命令分组、状态模型、输出格式 | 架构方案 |
| 3. Implement | 基于 Click 构建 CLI，内置 REPL、JSON 输出、撤销/重做 | `agent-harness/` 目录 |
| 4. Plan Tests | 在写代码前生成 `TEST.md`（单元 + E2E 测试计划、工作流场景） | `TEST.md` |
| 5. Write Tests | 按计划写测试：单元 + 中间文件 E2E + 真实后端 E2E + CLI subprocess | 完整测试套件 |
| 6. Document | 运行测试、更新 TEST.md 结果 | 测试报告 |
| 6.5 Skill Gen | 从 Click 装饰器 + setup.py + README 自动抽取元数据，生成 `cli_anything/<software>/skills/SKILL.md` | Agent 可发现的 skill 定义 |
| 7. Publish | 生成 `setup.py`，`pip install -e .` 到 PATH | 可被 `which` 命中的命令 |

之后还有 `refine` 命令做增量扩展——对比"软件完整能力"与"当前 CLI 覆盖面"，定位缺口并补命令、补测试、补文档。这种 **"从零生成 → 差距分析 → 迭代补齐"** 的节奏，本质是把软件能力的"翻译"作为一个可持续 agent 任务。

## 四大核心设计原则

从架构章节抽出的四条（这是项目的"宪法"）：

1. **Authentic Software Integration**——CLI 生成的是合法的项目文件（ODF/MLT XML/SVG），渲染交给真实软件完成。"We build structured interfaces TO software, not replacements."
2. **Flexible Interaction Models**——每个 CLI 同时支持**有状态 REPL**和**子命令单次调用**两种模式。裸命令进入 REPL；带参数做 scripting/pipeline。
3. **Consistent User Experience**——所有生成的 CLI 共用 `repl_skin.py`（ReplSkin），统一 banner、prompt、命令历史、表格/进度条格式。
4. **Agent-Native Design**——每个命令内建 `--json` flag；agent 通过 `--help` / `which` 这些 POSIX 原语发现能力，无需特殊 SDK。

## ReplSkin：统一交互皮肤

ReplSkin 是个值得单独拎出来的工程细节——所有生成的 CLI 都拷贝 `repl_skin.py` 到自己的 `utils/` 下，通过它获得：

- 分支 banner（自动探测并显示 `skills/SKILL.md` 绝对路径——agent 启动即可 grep 到自己的说明书）
- `prompt_toolkit` 会话（命令历史、上下键浏览、样式）
- 统一的 `success/error/warning/info/status/table/progress` 格式函数
- 默认行为：`@click.group(invoke_without_command=True)` 让无参调用直接进 REPL

ReplSkin 的存在让 CLI-Anything 生成的 20+ CLI 对 agent 看起来像同一套工具——是一种针对 agent 的"交互层标准化"。

## CLI-Hub：Agent 可自主发现的 CLI 注册中心

2026-03-17 CLI-Hub 上线，2026-03-23 又加了 **meta-skill**，二者合起来构成 agent 的"自助商店"：

```
Find appropriate CLI software in CLI-Hub and complete the task: <任务>
```

Agent 拿到这句 prompt 后：
1. 读取 `https://hkuds.github.io/CLI-Anything/SKILL.txt`（20+ CLI 的分类目录 + 一行 `pip install` 命令）
2. 选择匹配任务的 CLI，`pip install cli-anything-<software>`
3. 读取该 CLI 安装后自带的 `SKILL.md` 学习具体用法
4. 开干

Registry 由 `registry.json` 驱动，PR 合并后 hub 自动更新。这是一个非常干净的 [agent-skills](../concepts/agent-skills.md) 实现——把"发现-安装-学习"这三步折叠成几乎零人类介入。

## 已覆盖的软件矩阵（截至 2026-04-10）

项目已生成并测试的 CLI harness（2,130 测试，100% 通过率）：

| 类别 | 软件示例 |
|---|---|
| 🎨 创意/媒体 | GIMP · Blender · Inkscape · Krita · Audacity · Kdenlive · Shotcut · OBS Studio · Openscreen · MuseScore |
| 🧠 AI 平台 | ComfyUI · Ollama · AnyGen · NotebookLM · VideoCaptioner · Exa |
| 💼 办公/协作 | LibreOffice · Mubu · Zotero · Zoom · Dify Workflow |
| 📐 图示 | Draw.io · Mermaid · Sketch |
| 🎮 游戏/仿真 | Godot Engine · Slay the Spire II |
| 🔬 科学/调试 | FreeCAD · RenderDoc · CloudAnalyzer · CloudCompare |
| 🛡️ 基础设施 | AdGuard Home · WireMock · IntelWatch · iTerm2 · Teltonika RMS · Browser (DOMShell) |

所有 CLI 都遵循 `cli-anything-<software>` 命名，都在 `cli_anything.*` 包命名空间下避免冲突。

## 测试哲学：Don't Trust That It Exits Successfully

HARNESS.md 对测试的要求非常严格，反映了作者对"agent 用的软件必须真正能跑"的坚持：

- **单元测试**（合成数据）：每个核心函数独立测试
- **E2E 中间文件测试**：验证生成的项目文件结构正确（合法 ZIP、ODF、MLT XML……）
- **E2E 真实后端测试**：**必须调用真实软件**。创建项目 → 通过实际后端导出 → 验证输出（PDF magic bytes `%PDF-`、DOCX/XLSX OOXML ZIP 结构、音频 RMS 谱、视频像素亮度……）。**如果软件没装，测试失败而非跳过**——不许 graceful degradation
- **CLI subprocess 测试**：像真实用户/agent 一样调用已安装命令，用 `_resolve_cli` helper 强制走 `shutil.which`
- **打印 artifact 路径**：便于人类手动复查

这套测试纪律是整个项目的质量护城河。对 [harness-engineering](../concepts/harness-engineering.md) 社区来说，这是"给 agent 造工具时该有多严格"的一个具体范例。

## 生态延伸：CLI-Anything-WEB

[ItamarZand88/CLI-Anything-WEB](https://github.com/ItamarZand88/CLI-Anything-WEB) 是一个独立贡献者发起的并行项目（135 stars, 17 CLIs, 2026-04 活跃），主题完全不同：

- **本体项目**：处理有源代码/有后端进程的桌面/开源软件
- **WEB 分叉**：处理只能通过浏览器访问的 web 应用（没有公开 API），通过 Playwright 捕获实时 HTTP 流量 → 逆向内部端点 → 生成 CLI
- 项目作者明确标注"实验性 + 使用未公开 API + 需尊重 TOS"

这揭示出一个生态事实：**"为任意软件生成 agent CLI" 这个愿景一旦成立，自然会延伸出"为任意 web 服务生成 agent CLI" 的分支**——技术手段不同（代码分析 vs 流量捕获），但哲学同构。

## 关键时间线（2026-03 ~ 2026-04）

| 日期 | 事件 |
|---|---|
| 2026-03-11 | Zoom harness（11 个软件） |
| 2026-03-12 | Codex skill 集成 |
| 2026-03-13 | Qodercli 插件社区合并 |
| 2026-03-15 | OpenClaw 支持 |
| 2026-03-17 | **CLI-Hub 注册中心上线** |
| 2026-03-23 | **CLI-Hub meta-skill 发布**——agent 可自主发现 CLI |
| 2026-03-30 | v0.2.0：HARNESS.md 渐进式披露重设计 |
| 2026-04-03 | WireMock harness |
| 2026-04-06 | Godot + Exa harness |
| 2026-04-08 | Openscreen harness（2,130 测试通过） |

短短一个月从单 CLI 工具生长为多平台生态——说明"生成 agent-ready CLI" 这件事本身对社区贡献者有极强的吸引力。

## 与 wiki 现有内容的交集

这份材料触及若干已有概念和实体，每个都有增量视角：

- [harness-engineering](../concepts/harness-engineering.md)：**CLI-Anything 把"harness"一词用得最直白——生成的 agent 可调工具包本身就叫 `agent-harness/`**。为 harness 社区贡献了"测试纪律"（无 graceful degradation、真实后端验证）和"统一交互皮肤"两个具体模式
- [aci](../concepts/aci.md)：Agent-Computer Interface 的一个极端立场——宣称 CLI 就是 agent 与世界交互的最优接口
- [tool-design](../concepts/tool-design.md)：双模式（REPL + subcommand）和双输出（human table + `--json`）是一套值得收录的具体 pattern
- [agent-skills](../concepts/agent-skills.md)：SKILL.md 文件内嵌到 Python 包里，REPL banner 自动显示绝对路径——Agent Skills 标准的一个"零 glue" 实现
- [claude-code](../entities/claude-code.md)：CLI-Anything 的首发宿主平台，验证了 Claude Code plugin marketplace 作为分发通道的有效性
- [mcp](../entities/mcp.md)：CLI-Anything 对 MCP 是某种"冷对抗"——作者的立场是"别给我另一套协议，就用 CLI + JSON 就够了"。两条路线的对比值得独立分析

## Novel contributions（wiki 以前没有的）

这份材料第一次带入 wiki 的概念：

1. **Agent-Native Software 范式**——软件产品层面直接针对 agent 设计接口（而不是先为人设计再适配 agent），详见 [agent-native-software](../concepts/agent-native-software.md)
2. **CLI vs GUI-Automation 的路线对比**——CLI-Anything 是"放弃 computer-use 路线"的最激进推手之一，详见 [cli-vs-gui-automation](../concepts/cli-vs-gui-automation.md)
3. **REPL-for-Agents 交互模式**——REPL 作为 agent 的"有状态工作台"，详见 [repl-for-agents](../concepts/repl-for-agents.md)

## Key Takeaways

- **一个反直觉的主张**：不要等 agent 变得更聪明（会点鼠标），而要让**软件变得更"听话"**——给它加一层 agent 能理解的 CLI。这是对"谁应该改变"的根本性换位
- **工具泛型化的模板**：7 阶段流水线 + HARNESS.md 方法论把"给一个软件造 CLI" 这件传统上需要数周的活变成一个 agent 任务，每次迭代只需要几小时
- **Skill 发现即 `--help`**：`cli-anything-foo --help` 是 Agent Skills 的最小实现——文档和能力描述压缩到同一个命令里
- **测试即可信度**：无 graceful degradation 的测试纪律，是 agent-oriented 工具区别于"玩具 demo" 的分水岭
- **生态自增殖**：项目一旦定义好贡献模板（registry.json + PR 流程），社区会以惊人速度补齐长尾软件——是 agent-native 工具分发的可行证据

## 未解问题（值得追踪）

- **对 MCP 的长期定位**：CLI-Anything 用 CLI+JSON 解决"工具接入"，MCP 用 JSON-RPC 解决。两者会合流、竞争、还是分层？（CLI 做工具实现，MCP 做 agent 间/宿主间通信？）
- **非英文 / 非 POSIX 平台**：Windows 上需要 `cygpath` 保护；深度 Linux 集成（bpy、dbus）是否能稳定移植？
- **对闭源软件的适用性**：目前示例都是开源软件（可读源码），对闭源专业软件（Adobe 全家桶、Final Cut、Office）这套流水线还能用吗？（CLI-Anything-WEB 分叉给了一个答案：改用流量捕获）
- **与 agent-native 编程语言/运行时的边界**：如果未来出现原生为 agent 设计的编程语言（不仅是接口），CLI-Anything 的"给存量软件套皮" 路线还有多长生命周期？

## References

- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) — 主仓库 README、HARNESS.md 方法论、架构原则
- [CLI-Hub 注册中心](https://hkuds.github.io/CLI-Anything/) — 社区 CLI 发现入口
- [HKUDS/CLI-Anything CONTRIBUTING](https://github.com/HKUDS/CLI-Anything/blob/main/CONTRIBUTING.md)
- [ItamarZand88/CLI-Anything-WEB](https://github.com/ItamarZand88/CLI-Anything-WEB) — web 应用生态分叉
- [Alphamatch 深度分析](https://www.alphamatch.ai/blog/cli-anything-github-ai-agents) — 第三方技术解读
