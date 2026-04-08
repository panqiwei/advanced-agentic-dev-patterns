# llms.txt

## 定义

`llms.txt` 是一个放置在网站根路径 `/llms.txt` 的 Markdown 文件，为 LLM 提供关于该网站的结构化、精简的文档导航。由 [Jeremy Howard](../entities/jeremy-howard.md)（[Answer.AI](../entities/answer-ai.md)）于 2024 年 9 月提出。

类比关系：`robots.txt` 告诉爬虫"可以爬什么"；`llms.txt` 告诉 LLM "这个网站是什么、重要内容在哪里"。

## 格式规范

文件内容为 Markdown，按顺序包含以下节（仅 H1 为必填）：

1. **H1**：项目或站点名称
2. **Blockquote**：一段简短摘要，包含理解其余内容所必需的关键信息
3. **自由 Markdown 段落**（零或多个，不含标题）：补充背景
4. **H2 分节**（零或多个）：每节为一个"文件列表"，包含带说明的超链接

```markdown
# 项目名

> 一句话描述项目

更详细的说明（可选）

## 文档

- [快速入门](https://example.com/docs/quickstart.md): 核心功能概览
- [API 参考](https://example.com/docs/api.md): 完整接口文档

## Optional

- [完整示例](https://example.com/examples/): 次要资源，context 紧张时可跳过
```

`Optional` 节有特殊语义：当 context window 有限时，该节的 URL 可以跳过，适合放次要资源。

## 配套约定：`.md` 页面

网站可在原 HTML 页面 URL 后加 `.md` 提供同内容的 Markdown 版，例如：
- `https://example.com/docs/api.html` → `https://example.com/docs/api.html.md`
- 无文件名的 URL → 加 `index.html.md`

这让 LLM 可以直接获取干净的文档内容，无需解析 HTML。

## 与现有标准的关系

| 标准 | 目的 | 面向对象 | 使用时机 |
|------|------|----------|----------|
| `robots.txt` | 爬取访问控制 | 搜索爬虫 | 索引时（训练前）|
| `sitemap.xml` | 全站页面索引 | 搜索引擎 | 索引时 |
| `llms.txt` | 精选内容导航 | LLM | 推理时（用户请求时）|

作者的期望：`llms.txt` 主要用于**推理（inference）**——当用户主动向 LLM 询问某个话题时（如"帮我用这个库写代码"），而非用于训练。

## 工具链

- `llms_txt2ctx`：将 `llms.txt` 展开为 LLM context 文件的 CLI 工具；支持两种模式——不含 Optional 节的精简版和含所有链接的完整版
- 各框架插件：VitePress、Docusaurus、Drupal、nbdev 等均有对应插件自动生成

## 在 ACI 框架中的位置

[Karpathy](../entities/andrej-karpathy.md) 的"Meeting LLMs halfway"论断中，`llms.txt` 是 ACI 从单工具接口扩展到整个互联网基础设施的具体案例：网站主动提供 LLM 可解析格式，而非等待 LLM 自行抓取和解析 HTML。

见 [ACI](aci.md) — 基础设施层的 ACI 一节。

## 相关概念

- [ACI](aci.md) — llms.txt 是基础设施层 ACI 的典型实践
- [Context engineering](context-engineering.md) — llms.txt 提供的是外部文档的 just-in-time 访问入口
- [Agent skills](agent-skills.md) — 两者都是"可组合的知识打包"，llms.txt 面向网站，agent skills 面向 agent 能力
- [MCP](../entities/mcp.md) — MCP 是工具/服务的标准化协议；llms.txt 是文档/内容的标准化索引

## References

- `sources/llmstxt-org-the-llms-txt-file.md`
