# The /llms.txt file

- **来源**: `sources/llmstxt-org-the-llms-txt-file.md`
- **原始 URL**: https://llmstxt.org/
- **作者**: Jeremy Howard（Answer.AI / fast.ai）
- **发布时间**: 2024-09-03

## 核心主张

提出一个新的网站约定：在网站根路径放置 `/llms.txt` 文件，为 LLM 提供结构化、精简的文档入口。背景是 LLM 的 context window 无法容纳整个网站内容，而 HTML 页面对 LLM 来说信噪比低。

## 结构化摘要

### 问题
- LLM 的 context window 太小，无法装下大多数网站的完整内容
- HTML 页面含有大量导航、广告、JS，转换为纯文本时不精确
- LLM 需要简洁、专家级的信息集中入口，尤其是开发文档和 API 参考

### 解决方案
`/llms.txt` 是放在网站根路径的 Markdown 文件，格式规范如下（按顺序）：

1. H1：项目/站点名称（唯一必填字段）
2. Blockquote：项目的一段简短摘要
3. 零或多段 Markdown 内容（无标题），提供背景信息
4. 零或多个 H2 分节，每节包含"文件列表"——带说明的超链接集合

```markdown
# 项目名

> 项目简介

可选说明文字

## 文档

- [文档标题](https://url): 可选说明

## Optional

- [次要资源](https://url)
```

`Optional` 节有特殊语义：当需要更短的 context 时，该节的 URL 可以跳过。

### 配套约定
网站中适合 LLM 阅读的页面，可在原 URL 后加 `.md` 提供 Markdown 版（无文件名的 URL 改为 `index.html.md`）。这使得 LLM 可以在不解析 HTML 的情况下直接获取干净内容。

### 与现有标准的关系
- **robots.txt**：控制自动化工具的访问权限（爬取许可）；`llms.txt` 提供的是**推理时**的内容导航，两者互补
- **sitemap.xml**：面向搜索引擎，列出全部页面；`llms.txt` 是为 LLM 精心策展的子集，更小、更聚焦
- **结构化数据 markup**：`llms.txt` 可引用站内已有的 schema.org 标记，帮助 LLM 理解语义

## 主要用途
- 软件文档（开发环境中 LLM 快速访问 API 参考）
- 企业/机构介绍（结构化展示组织信息）
- 法律/政策文本（为利益相关方拆解复杂文件）
- 个人网站（简历/作品集的 LLM 可达版本）

## 工具链
- `llms_txt2ctx`：CLI + Python 模块，将 llms.txt 展开为 LLM context 文件（XML 或纯文本）
- 各 CMS/框架插件：VitePress、Docusaurus、Drupal 等均有官方或社区插件自动生成 llms.txt

## 关键联系
- 此标准与 [ACI](../concepts/aci.md) 的"Meeting LLMs halfway"思想直接对应——网站主动提供 LLM 友好格式，是 ACI 从工具接口层扩展到互联网基础设施层的具体实践
- 与 [context engineering](../concepts/context-engineering.md) 的 just-in-time context 原则吻合——`llms.txt` 提供的是外部文档的精简索引，而非全量内容
- 提出者 [Jeremy Howard](../entities/jeremy-howard.md) 来自 [Answer.AI](../entities/answer-ai.md)

## References

- `sources/llmstxt-org-the-llms-txt-file.md`
