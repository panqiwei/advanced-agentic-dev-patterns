# Claude Code 权限系统（官方文档）

## 基本信息

- **来源**: `sources/anthropic_official/claude-code-permissions.md`
- **原文 URL**: https://code.claude.com/docs/en/permissions
- **作者**: Anthropic
- **采集日期**: 2026-04-08

## 摘要

本文档是 Anthropic 官方的 Claude Code 权限系统完整参考。Claude Code 是一款 AI 编码 agent，权限系统是其核心安全机制——精确控制 agent 被允许做什么、不能做什么。

## 核心主题

### 1. 分层权限系统（Tiered Permission System）

Claude Code 将工具分为三类，审批要求不同：

| 工具类型 | 示例 | 需要审批 | "不再询问"行为 |
|---|---|---|---|
| 只读工具 | 文件读取、Grep | 否 | N/A |
| Bash 命令 | Shell 执行 | 是 | 永久记录（按项目目录+命令） |
| 文件修改 | 编辑/写入文件 | 是 | 会话结束前有效 |

这个三级结构体现了风险分层：只读操作无需确认，文件修改需要一次会话级授权，Bash 命令风险最高因而需要永久级审批（保存到 settings）。

### 2. Allow/Ask/Deny 规则层次

Claude Code 使用三类规则管理权限：
- **Allow**：无需手动确认，直接允许使用指定工具
- **Ask**：每次使用前提示确认
- **Deny**：阻止使用

**评估顺序**：deny → ask → allow。第一个匹配的规则生效，因此 deny 规则总是优先。这是"拒绝优先"（deny-first）语义——只有没有 deny 规则匹配时，才考虑 ask，再才考虑 allow。

### 3. 六种权限模式

通过 `defaultMode` 配置：

| 模式 | 描述 |
|---|---|
| `default` | 标准行为：每个工具首次使用时提示 |
| `acceptEdits` | 自动接受文件编辑权限（受保护目录除外） |
| `plan` | 计划模式：只能分析，不能修改文件或执行命令 |
| `auto` | 自动审批，后台安全检查验证操作是否符合请求意图 |
| `dontAsk` | 自动拒绝，除非通过 `/permissions` 或 allow 规则预先授权 |
| `bypassPermissions` | 跳过权限提示（受保护目录仍提示）|

`bypassPermissions` 最危险，仅应用于容器/VM 等隔离环境。管理员可在托管设置中禁用此模式。

### 4. 规则指定符（Specifiers）

规则格式：`Tool` 或 `Tool(specifier)`

**工具级**（匹配所有使用）：
- `Bash`、`Read`、`WebFetch`

**精细匹配**：
- `Bash(npm run build)` — 精确匹配命令
- `Read(./.env)` — 精确匹配文件路径
- `WebFetch(domain:example.com)` — 按域名匹配

**通配符**：`Bash(npm run *)` 匹配所有以 `npm run` 开头的命令。空格前的 `*` 强制单词边界：`Bash(ls *)` 匹配 `ls -la` 但不匹配 `lsof`。

**MCP 工具**：`mcp__puppeteer`、`mcp__puppeteer__puppeteer_navigate`

**子 Agent**：`Agent(Explore)`、`Agent(my-custom-agent)`

### 5. 作用域层次（Settings Precedence）

优先级从高到低：
1. **托管设置**（Managed）：不可被任何其他层覆盖
2. **命令行参数**：临时会话覆盖
3. **本地项目设置**（`.claude/settings.local.json`）
4. **共享项目设置**（`.claude/settings.json`）
5. **用户设置**（`~/.claude/settings.json`）

关键语义：**任意层级的 deny 都不可被其他层的 allow 覆盖**。例如，托管 deny 无法通过 `--allowedTools` 绕过。

### 6. 权限与沙箱：两层互补安全

- **权限**：控制 Claude Code 可以使用哪些工具、访问哪些文件/域名（适用于所有工具）
- **沙箱**：OS 级强制隔离，限制 Bash 工具的文件系统和网络访问（仅适用于 Bash 命令及其子进程）

纵深防御逻辑：权限规则阻止 Claude 发起受限访问请求，沙箱在 prompt injection 绕过模型决策时作为最后防线。

### 7. Hooks 扩展权限

PreToolUse hooks 在权限提示前运行，可动态：
- 拒绝工具调用（exit 2）
- 强制提示
- 跳过提示（但不绕过 deny 规则）

### 8. Auto 模式分类器

Auto 模式使用分类器模型判断每个操作是否安全。分类器读取 `autoMode` 配置：
- `environment`：描述可信基础设施
- `allow`：例外规则
- `soft_deny`：阻止规则

设置 `allow` 或 `soft_deny` 会替换全部默认值，需先运行 `claude auto-mode defaults` 获取内置规则。

### 9. 托管设置（Managed Settings）

组织管理员可通过 MDM/OS 级策略部署不可覆盖的设置。托管专属设置包括：
- `allowManagedPermissionRulesOnly`：阻止用户和项目定义权限规则
- `allowManagedHooksOnly`：阻止加载用户/项目/插件钩子
- `allowManagedMcpServersOnly`：仅允许托管 MCP 服务器

## 关键洞察

1. **规则层次是 deny-first，不是 allow-first**：匹配优先级 deny > ask > allow 的"第一匹配"语义意味着阻止比允许更容易实现和更难绕过
2. **权限与沙箱是互补而非替代**：Read 规则阻止读工具，但不阻止 `cat file` 的 Bash 命令——需要沙箱补足
3. **Auto 模式分类器是可配置的**：内置规则不够时可通过 environment/allow/soft_deny 调整
4. **Bash 权限规则不可靠用于参数约束**：通配符模式对变量、空格、重定向等变体无效——应使用 WebFetch+域名规则或 PreToolUse hooks

## 与其他来源的关联

- 与 [Agent Sandboxing](../concepts/agent-sandboxing.md) 的 OS 级沙箱研究形成互补——本文档提供了沙箱之上的应用层权限控制
- 与 [Guardrails](../concepts/guardrails.md) 的分层防御模式一致——Claude Code 的权限系统是专门化的 guardrails 实现
- `bypassPermissions` 模式印证了 [Agent OS](../concepts/agent-os.md) 讨论中的容器/VM 隔离部署模式
- 托管设置机制对应 [Harness Engineering](../concepts/harness-engineering.md) 中"组织级约束编码进 harness"的思路

## References

- `sources/anthropic_official/claude-code-permissions.md`
