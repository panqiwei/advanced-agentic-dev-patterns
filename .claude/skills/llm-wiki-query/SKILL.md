---
name: llm-wiki-query
description: Use when asking questions about ingested knowledge, comparing concepts across sources, or checking what the wiki knows about a topic. Prevents relying on stale memory when curated knowledge exists.
argument-hint: <question>
user-invocable: true
---

# LLM Wiki Query

从 wiki 中检索信息回答问题。每个论点带页面引用，只用 wiki 内容作答。

## 输入

`$ARGUMENTS` 是用户的问题（自然语言）。

## 流程

### 1. 读取 index

读取 `wikis/index.md`，浏览所有 entry 的标题和简介，判断哪些页面与问题相关。

### 2. 读取相关页面

读取所有可能相关的 wiki 页面。如果一个页面引用了其他页面，且那些页面也可能相关，一并读取。宁可多读几个页面，不要遗漏关键信息。

### 3. 综合回答

基于读取的 wiki 内容回答问题。

- **引用**: 每个关键论点注明来源页面，格式：`（见 [page-name](wikis/category/slug.md)）`。没有引用支撑的论点不要写。
- **矛盾处理**: 如果 wiki 中存在矛盾观点，如实呈现两方，标注各自出处，不要选边。
- **信息不足**: 如果 wiki 中没有足够信息回答问题，明确说明信息不足，并建议可能需要 ingest 的 source。不要用 LLM 自身知识补充答案——除非 wiki 明确信息不足且用户主动要求。

### 4. 回写提示

如果回答综合了多个页面的分析、发现了页面之间未被记录的关联、或产生了新的概念梳理，在回答末尾提示用户：

> 这个回答可以回写为 wiki 页面 `wikis/concepts/[suggested-slug].md`。要回写吗？

如果用户同意：
- 将回答整理为标准 wiki 页面格式，写入对应位置。
- 更新 `wikis/index.md` 添加 entry。
- 在 `wikis/log.md` 末尾追加一条 query write-back 记录。

### 5. 争议性问题的多视角辩论 — ljg-roundtable（可选）

如果问题涉及比较或争议（如"隐式循环 vs 显式图哪个好？"、"context compaction 和 offloading 的取舍？"），wiki 内容可能只有各方各自的陈述而缺乏碰撞。

此时建议用户调用 `/ljg-roundtable` 做一次虚拟圆桌辩论——从 wiki 中挑选代表性立场（如 Anthropic 观点 vs LangChain 观点），让它们碰撞，提取最深层分歧。

**产物处理**：ljg-roundtable 输出 org 文件到 `~/Documents/notes/`。
1. 从 org 中提取辩论结论、核心分歧点、知识网络图。
2. 如果用户同意回写，将综合分析整理为 wiki concept page（如 `wikis/concepts/implicit-vs-explicit-loop.md`）。
3. 删除 `~/Documents/notes/` 中的 org 文件。

### 6. 回答可视化 — ljg-card（可选）

如果回答涉及结构性对比、流程、层级关系等空间性强的内容，offer 用 `/ljg-card -i` 生成信息图。

**产物处理**：ljg-card 输出 PNG 到 `~/Downloads/`。
1. 如果回答被回写为 wiki page，将 PNG 复制到对应的 `assets/` 目录并嵌入页面。
2. 如果不回写，告知用户 PNG 位置，由用户决定保留或删除。

## 约束

- 只基于 wiki 中已有的内容回答。wiki 是唯一信源。
- 不要在 query 过程中修改已有 wiki 页面。回写只在用户明确同意后进行。
- 只操作 `wikis/`，不碰 `docs/` 或 `patterns/`。

## Red Flags

- 你在用 LLM 通用知识回答而不是引用 wiki 内容 → 停下来，回到 wiki 页面找依据。
- 每个回答都说「信息不足」→ 问题可能不在 query，而是需要更多 ingest。
