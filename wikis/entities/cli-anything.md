# CLI-Anything

开源项目，HKUDS 团队 2026-03 推出，主张通过自动生成结构化 CLI 把任意现有软件转换为 agent 原生可调用的工具。同时是一个跨平台的 agent 插件生态（Claude Code / Pi / OpenClaw / OpenCode / Codex / Qodercli / GitHub Copilot CLI / Goose），截至 2026-04-10 有 29,804 GitHub stars，覆盖 20+ 主流软件，生成的 harness 累计 2,130 测试全部通过。

## 身份数据

| 字段 | 值 |
|---|---|
| 仓库 | [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) |
| 首页 | [clianything.cc](https://clianything.cc/) / [hkuds.github.io/CLI-Anything](https://hkuds.github.io/CLI-Anything/) |
| 主导团队 | HKUDS（Hong Kong University Data Science Lab） |
| 许可证 | MIT |
| 诞生 | 2026-03 |
| 规模 | 20+ 生成 CLI · 2,130 测试 · 29K+ stars |
| 核心口号 | "Today's Software Serves Humans. Tomorrow's Users will be Agents." |

## 工作方式

一条命令触发 7 阶段全自动流水线：

```
/cli-anything:cli-anything ./gimp
```

产出放在 `<software>/agent-harness/`，pip 安装后 `cli-anything-gimp` 直接进 PATH。每个生成的 CLI 具备：

- `--json` 双输出模式（human table + machine JSON）
- REPL + subcommand 双交互模式（由 `ReplSkin` 统一皮肤）
- Undo/redo + 会话状态持久化
- 自动生成的 `SKILL.md`（Agent Skills 发现入口）
- 多层测试（单元 + 合成 E2E + 真实后端 E2E + CLI subprocess）

详细方法论见源代码中的 `cli-anything-plugin/HARNESS.md`；流水线细节与设计原则见 [cli-anything source summary](../sources/cli-anything.md)。

## 生态定位

CLI-Anything 在 agent 基础设施生态里的位置，可以从三条坐标轴理解：

### 1. 宿主 agent 平台（被消费的一侧）

CLI-Anything 作为插件/技能部署到多个 agent coding 平台：

| 平台 | 形态 | 状态 |
|---|---|---|
| [Claude Code](claude-code.md) | Plugin marketplace（`/plugin install cli-anything`） | 首发 / 最完整支持 |
| Pi Coding Agent | `.pi-extension/cli-anything/` + `install.sh` | 官方支持 |
| OpenClaw | Native SKILL.md | 社区 |
| OpenCode | Commands + HARNESS.md | 实验性 |
| Codex | `codex-skill/` + install 脚本 | 实验性 / 社区 |
| Qodercli | `~/.qoder.json` 插件注册 | 社区 |
| GitHub Copilot CLI | `copilot plugin install` | 社区 |
| Goose | 通过 CLI 上游 provider 继承 | 社区 |

跨平台策略的关键：方法论（HARNESS.md）是平台中立的，只需要把 slash command 和 skill 文件按各平台的约定放好。这让 CLI-Anything 天然是多个 [agent-skills](../concepts/agent-skills.md) 标准之间的一个现实测试场。

### 2. 生成的工具集（被生产的一侧）

CLI-Anything 给 "agent 可用软件" 清单带来了一大批新成员，很多原本完全没有 agent 接入路径：

- **创意工具**（GIMP/Blender/Inkscape/Krita/Audacity/Kdenlive/Shotcut/OBS/MuseScore/Openscreen）——原本只有 GUI
- **AI 平台**（ComfyUI/Ollama/AnyGen/NotebookLM/VideoCaptioner/Exa）——有 API 但使用方式各异，CLI-Anything 做了统一
- **办公协作**（LibreOffice/Zotero/Mubu/Zoom/Dify Workflow）
- **图示/设计**（Draw.io/Mermaid/Sketch）
- **游戏引擎**（Godot/Slay the Spire II）——headless 化
- **科学/调试**（FreeCAD/RenderDoc/CloudAnalyzer/CloudCompare）
- **基础设施/测试**（AdGuard Home/WireMock/IntelWatch/iTerm2/Teltonika RMS/Browser DOMShell）

每个 CLI 都在 `cli_anything.*` 命名空间下、统一命名为 `cli-anything-<software>`，用一致的命令分组骨架（project / 核心动作 / import / export / session）。这种**同构的产出**让 agent 学会一个 CLI 后可以迁移经验到其他的——某种意义上是在对 [tool-design](../concepts/tool-design.md) 的"同构性"做实践验证。

### 3. CLI-Hub：Agent 可自主发现的注册中心

2026-03-17 上线的 [CLI-Hub](https://hkuds.github.io/CLI-Anything/) 是一个 web 端注册中心 + `SKILL.txt` 目录。Agent 可以通过 meta-skill 自主浏览并 `pip install` 任意 CLI：

```
Find appropriate CLI software in CLI-Hub and complete the task: <任务>
```

这是一个 agent-native 的软件分发层——零人类介入、`registry.json` PR 触发 hub 自动更新、`SKILL.txt` 是纯文本、`pip install` 是 POSIX 原语。整个发现-安装-学习链路使用的是 agent 已经掌握的工具，不需要新 SDK。

## 核心技术资产

| 资产 | 作用 |
|---|---|
| `HARNESS.md` | 方法论 spec：7 阶段 SOP、命令分组、状态模型、测试要求 |
| `repl_skin.py` → `ReplSkin` | 所有生成 CLI 共享的 REPL 交互皮肤，banner/history/formatting 统一化 |
| `skill_generator.py` | 从 Click decorators + setup.py + README 抽元数据生成 SKILL.md |
| 7 阶段流水线 | Analyze → Design → Implement → Plan Tests → Write Tests → Document → Publish |
| `refine` 命令 | 增量扩展：对比软件全能力 vs 当前 CLI 覆盖，补缺口 |
| `registry.json` | CLI-Hub 的 source of truth，driving 社区贡献流程 |
| `_resolve_cli` helper | 强制测试走 `shutil.which`，避免 dev 路径伪通过 |

## 设计哲学

四条核心设计原则（HARNESS.md 明确列出）：

1. **Authentic Software Integration**——生成合法项目文件（ODF/MLT XML/SVG），渲染交给真实软件。**不做替代品，只做结构化接口**
2. **Flexible Interaction Models**——REPL + 子命令两种模式，无参进 REPL，有参做脚本
3. **Consistent User Experience**——`ReplSkin` 强制所有 CLI 用同一套视觉语言
4. **Agent-Native Design**——`--json` 内建、`--help` 自文档、`which` 可发现——只用 POSIX 原语

这四条合起来构成 [agent-native-software](../concepts/agent-native-software.md) 的一份具体实践 checklist。

## 贡献者社区信号

- 多个 CLI 是由独立贡献者用 CLI-Anything 自己生成并 PR 合并的（@zhangxilong-43 Draw.io、@TianyuFan0504 Slay the Spire II、@WEIFENG2333 VideoCaptioner）——项目"自举"起来了
- Contributor 报名用 GitHub Issue 模板（`contributor-signup.yml`）
- Wishlist 请求也是 Issue 模板（`cli-wishlist.yml`）——把"想要某软件有 CLI" 的需求变成公共队列
- 每日更新节奏（News 板块几乎天天有合并条目）

## 关联实体与分叉

- **[ItamarZand88/CLI-Anything-WEB](https://github.com/ItamarZand88/CLI-Anything-WEB)**（135 stars）——独立分叉，目标是 web 应用而非桌面软件，通过 Playwright 流量捕获生成 CLI。与主项目形成"桌面 / web" 的技术路线互补
- **宿主平台**：[Claude Code](claude-code.md)（首发平台）
- **比较对象**：[MCP](mcp.md)（协议中心 vs CLI-Anything 的命令中心，两种 agent-tool 接入范式）

## Key Takeaways

- **愿景**：让 agent 用得上的软件从数十个（有原生 MCP / SDK）扩展到成百上千个（任意有代码的软件）
- **战略**：HARNESS.md 方法论 + 自动流水线 + 多平台插件 + 社区 registry——四件套让"给软件加 agent 能力" 变成一个可复制、可分发的范式
- **信号**：它的快速成长验证了 agent 社区对"专业软件接入" 的饥渴，也验证了"CLI 而不是 GUI 自动化" 这条路线在工程上是可行的
- **风险**：对 MCP 生态的战略关系未明；对闭源软件的覆盖依赖 web 分叉路线

## References

- [cli-anything source summary](../sources/cli-anything.md) — 完整方法论、设计原则、流水线细节
- [HKUDS/CLI-Anything](https://github.com/HKUDS/CLI-Anything) — 主仓库
- [CLI-Hub](https://hkuds.github.io/CLI-Anything/) — 社区注册中心
