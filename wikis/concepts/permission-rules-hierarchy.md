# Allow/Ask/Deny 规则层次（Deny-First 权限语义）

## 定义

Allow/Ask/Deny 规则层次是 Claude Code 权限系统的核心评估机制——三类规则按照固定优先级顺序评估，第一个匹配的规则决定结果。

## 三类规则

| 规则类型 | 效果 |
|---|---|
| **Allow** | 工具无需手动确认即可使用 |
| **Ask** | 每次使用前弹出确认提示 |
| **Deny** | 阻止工具使用，不可被其他规则覆盖 |

## 评估顺序：Deny → Ask → Allow

```
规则列表（按配置顺序）
    ↓
检查是否有 deny 规则匹配 → 匹配 → 阻止，结束
    ↓（无匹配）
检查是否有 ask 规则匹配 → 匹配 → 提示确认，结束
    ↓（无匹配）
检查是否有 allow 规则匹配 → 匹配 → 直接允许，结束
    ↓（无匹配）
默认行为（取决于当前权限模式）
```

**关键语义**：这不是"最高优先级 wins"，而是"第一个类别匹配 wins"。即使 allow 规则列在 deny 规则之前，deny 仍先被检查。

## Deny-First 的安全含义

Deny-first 语义意味着**阻止比允许更容易实现、更难绕过**：

1. **跨层级不可覆盖**：任意作用域层级（包括托管设置）的 deny 无法被其他层的 allow 覆盖——这是[设置作用域层次](settings-scope-hierarchy.md)中"任意层级 deny 都封锁"规则的根基
2. **Hooks 的 deny 更强**：PreToolUse hook 的 exit 2（阻止）在 deny/ask/allow 评估之前运行，即使有 allow 规则也无法绕过 hook 的阻止
3. **托管 deny 的不可穿透性**：组织管理员在托管设置中设置的 deny 规则，不受命令行 `--allowedTools` 影响

## 规则粒度示例

规则支持从全工具到精确命令的粒度：

```json
{
  "permissions": {
    "allow": [
      "Bash(npm run *)",
      "Bash(git commit *)",
      "WebFetch(domain:github.com)"
    ],
    "deny": [
      "Bash(git push *)"
    ]
  }
}
```

这个配置的效果：允许 npm 命令和 git commit，但即使有前面的 allow，`git push` 仍被阻止——因为 deny 先被检查。

## 规则模式与 Deny 的交互

**通配符**：`Bash(npm *)` 匹配所有以 `npm ` 开头的命令（有空格边界）。

**重要局限**：Bash 规则的通配符模式对以下情况无效：
- 选项顺序变化：`curl -X GET http://...` vs `curl http://... -X GET`
- 变量展开：`URL=http://... && curl $URL`
- 重定向和管道：`curl -L http://bit.ly/xyz`

因此，复杂的参数级 deny 规则应优先考虑 PreToolUse hooks 实现。

## 与权限模式的关系

[权限模式](permission-modes.md)设定了全局默认行为，规则层次在其上叠加：
- `bypassPermissions` 模式跳过大部分提示，但 deny 规则仍生效
- `dontAsk` 模式默认拒绝，allow 规则作为例外

## 相关概念

- [Claude Code 权限系统](claude-code-permission-system.md) — 分层工具审批机制全貌
- [权限模式](permission-modes.md) — 六种预设全局策略
- [设置作用域层次](settings-scope-hierarchy.md) — 规则在多层次设置间的继承关系
- [Guardrails](guardrails.md) — 通用 agent 安全约束框架

## References

- `sources/anthropic_official/claude-code-permissions.md`
