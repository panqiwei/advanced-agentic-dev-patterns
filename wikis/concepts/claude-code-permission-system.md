# Claude Code 权限系统（分层审批机制）

## 定义

Claude Code 权限系统是一套针对 AI 编码 agent 工具调用的分层审批机制——根据操作风险将工具分级，对不同风险级别的工具适用不同的审批策略。

## 三级工具分类

| 工具类型 | 示例 | 审批要求 | "不再询问"效果 |
|---|---|---|---|
| 只读工具 | 文件读取、Grep、Glob | 无需审批 | N/A |
| 文件修改工具 | Edit、Write | 需要审批 | 会话内永久授权 |
| Bash 命令 | Shell 执行 | 需要审批 | 永久记录（按项目目录+命令） |

这个三级结构背后的设计逻辑是**可逆性**：只读操作无副作用，可自由执行；文件修改可以撤销（git），会话级授权够用；Bash 命令可能执行任意系统操作，需要永久记录以避免重复确认同一个已批准的安全命令。

## 规则系统

权限通过三类规则管理（详见 [allow/ask/deny 规则层次](permission-rules-hierarchy.md)）：
- **Allow**：工具不需要手动确认即可使用
- **Ask**：每次使用前弹出确认提示
- **Deny**：阻止工具使用

规则支持精细的工具匹配（详见 [规则指定符](#规则指定符)）。

## 规则指定符

规则格式：`Tool` 或 `Tool(specifier)`

**工具级**（匹配所有使用）：`Bash`、`Read`、`Edit`、`WebFetch`

**精细匹配**：
```json
{
  "permissions": {
    "allow": ["Bash(npm run *)", "WebFetch(domain:github.com)"],
    "deny": ["Bash(git push *)"]
  }
}
```

**路径模式**（遵循 gitignore 规范）：

| 模式 | 含义 | 示例 |
|---|---|---|
| `//path` | 绝对路径 | `Read(//Users/alice/secrets/**)` |
| `~/path` | 从主目录 | `Read(~/Documents/*.pdf)` |
| `/path` | 从项目根目录 | `Edit(/src/**/*.ts)` |
| `path` 或 `./path` | 从当前目录 | `Read(*.env)` |

**注意**：Read/Edit 的 deny 规则只阻止内置工具，不阻止 Bash 子进程（如 `cat .env`）。OS 级强制需要配合[沙箱](agent-sandboxing.md)。

## 权限持久化机制

"Yes, don't ask again" 的确认行为：
- **文件修改工具**：记录到当前会话，会话结束失效
- **Bash 命令**：保存为 allow 规则到 `settings.local.json`，永久生效

复合命令（`git status && npm test`）被拆分保存——每个需要审批的子命令单独保存一条规则（最多 5 条）。

## Hooks 扩展

[PreToolUse hooks](../sources/anthropic-claude-code-permissions.md) 在权限评估前运行，可动态控制：
- exit 2：阻止工具调用（即使有 allow 规则也生效）
- 返回 `"allow"`：跳过提示，但 deny 规则仍生效
- 返回 `"ask"`：强制提示

Hooks 是 [guardrails](guardrails.md) 的 runtime 扩展点——可实现超出静态规则覆盖范围的动态策略（如 URL 验证、参数检查）。

## 与其他安全层的关系

```
权限层（应用层）    → 控制 Claude 能调用哪些工具
沙箱层（OS 层）    → 控制 Bash 子进程能访问什么
Hooks 层（动态层） → 在权限评估前注入自定义逻辑
```

三层互补，形成纵深防御。详见[权限与沙箱的关系](agent-sandboxing.md)。

## 相关概念

- [Allow/Ask/Deny 规则层次](permission-rules-hierarchy.md) — 规则评估的优先级机制
- [权限模式](permission-modes.md) — 六种预设的全局审批策略
- [设置作用域层次](settings-scope-hierarchy.md) — 托管 > CLI > 本地 > 共享 > 用户
- [Agent 沙箱](agent-sandboxing.md) — OS 级补充安全层
- [Guardrails](guardrails.md) — 通用 agent 安全约束设计
- [Harness Engineering](harness-engineering.md) — harness 层面的约束编码

## References

- `sources/anthropic_official/claude-code-permissions.md`
