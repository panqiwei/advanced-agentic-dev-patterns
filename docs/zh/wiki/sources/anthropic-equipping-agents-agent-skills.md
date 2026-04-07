# Equipping Agents for the Real World with Agent Skills

- **来源**: `sources/anthropic_official/equipping-agents-agent-skills.md`
- **URL**: https://www.anthropic.com/engineering/equipping-agents-for-the-real-world-with-agent-skills
- **作者**: Barry Zhang, Keith Lazuka, Mahesh Murag (Anthropic)

## 概述

本文介绍 Agent Skills——一种将领域知识打包为 agent 可发现、可加载的可组合资源的开放标准。核心比喻：为新员工准备的入职指南，而非为每个场景定制一个专门 agent。

## Agent Skills 的结构

### 三层渐进式披露（Progressive Disclosure）

1. **第一层**：`name` + `description`（YAML frontmatter），启动时预加载到 system prompt
2. **第二层**：`SKILL.md` 正文，agent 判断相关时才读取
3. **第三层**：技能目录中的附加文件（`reference.md`、`forms.md` 等），按需发现和加载

这意味着技能可以打包的 context 量**理论上无限**——agent 有文件系统和代码执行能力，不需要一次性读入全部内容。

### 代码执行

技能可以包含预写的脚本供 agent 执行。某些操作（排序、PDF 解析等）用代码比用 token 生成更高效、更确定。代码同时是工具和文档。

## 开发最佳实践

1. **从评估开始**：先观察 agent 在哪些任务上挣扎，再针对性构建技能
2. **Scale 时拆分**：`SKILL.md` 过大时，拆分为互斥的独立文件
3. **从 Claude 视角思考**：监控 agent 如何使用技能，关注 name/description 对触发行为的影响
4. **与 Claude 迭代**：让 Claude 把成功方法和常见错误编码到技能中

## 安全考量

技能是指令 + 代码的组合，恶意技能可能引入漏洞或指示 agent 窃取数据。建议只安装来自受信任来源的技能，不受信任的需审计。

## 与其他概念的关联

- [Agent skills](../concepts/agent-skills.md) — 本文定义的核心概念
- [ACI](../concepts/aci.md) — 技能是 agent-tool 接口的高层抽象
- [Tool design](../concepts/tool-design.md) — progressive disclosure 是工具设计原则的延伸
- [Claude Agent SDK](../entities/claude-agent-sdk.md) — 技能运行在 SDK 之上
- [Context management](../concepts/context-management.md) — progressive disclosure 作为 context 管理策略
- [MCP](../entities/mcp.md) — 技能与 MCP 互补：技能教 agent 复杂工作流，MCP 提供外部工具集成

## References

- `sources/anthropic_official/equipping-agents-agent-skills.md`
