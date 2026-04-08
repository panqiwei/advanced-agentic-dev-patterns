---
name: llm-wiki-lint
description: Health-check the wiki for contradictions, broken links, orphan pages, and missing concepts
argument-hint: [scope: all | directory | file]
user-invocable: true
---

# LLM Wiki Lint

对 wiki 做体检。Use after ingest, before committing wikis/, or when wiki quality feels off.

Lint 是纯只读操作（除了追加 `wikis/log.md`）。绝不自动修复任何东西——修复是人的决策。

## 输入

`$ARGUMENTS` 是 lint 范围：
- 空或 `all`（默认）：扫描整个 `wikis/`
- 目录路径（如 `wikis/concepts/`）：只扫描该目录
- 文件路径（如 `wikis/concepts/tool-use.md`）：扫描该文件 + 所有被它链接的页面 + 所有链接到它的页面

## 流程

### 1. 确定扫描范围

- `all`：Glob 列出 `wikis/` 下所有 `.md`（排除 `index.md`、`log.md`）。
- 目录：列出该目录下所有 `.md`。
- 文件：读取该文件，提取所有 markdown 链接目标，再反向搜索引用该文件的页面，一并纳入范围。

### 2. 读取所有待扫描页面

逐一读取内容。

### 3. 检查断链

对每个页面中的 `[text](path)` 链接，解析相对路径为绝对路径，检查目标文件是否存在。

断链意味着知识在无声地断裂——有人顺着链接走过去，什么都找不到。

### 4. 检查 orphan 页面

构建页面间的引用关系图。找出零 inbound link 的页面。`index.md` 中的链接不算 inbound（index 是导航页，不代表知识关联）。

Orphan 页面意味着它和 wiki 的知识网络完全脱节——存在但不可达。

### 5. 检查 index 一致性

Glob 列出 `wikis/sources/`、`wikis/concepts/`、`wikis/entities/` 的所有 `.md`，与 `wikis/index.md` 的 entry 对比。找出：
- 文件存在但 index 无 entry（被遗忘的页面）
- index 有 entry 但文件不存在（幽灵条目）

Index 不一致意味着导航是骗人的——用户看到的 wiki 地图和实际 wiki 对不上。

### 6. 检测事实矛盾

读取页面内容，用 LLM 判断找出对同一概念的不一致描述。重点：
- 同一术语在不同页面的定义冲突
- 数据或日期矛盾
- 对同一 source 的不同解读

这步依赖 LLM 判断。标记为"可疑矛盾"即可，不要求 100% 确定。

矛盾意味着 wiki 在对同一个问题给出两个答案——查询者不知道该信谁。

### 7. 发现候选新页面

扫描所有页面，找出被提到 ≥3 次但没有独立页面的概念或实体。

频繁提及但没有页面，意味着有一个重要概念散落在各处却没有汇聚点。

### 7a. Concept card 完整性检查

每个 concept 页面应有对应的 infograph card PNG 存放在 `wikis/concepts/assets/{slug}.png`。检查两类问题：

**缺失 card**：concept 页面存在但 `assets/{slug}.png` 不存在。这意味着文档站上该 concept 没有图文切换功能。

**card 内容过时**：当 card PNG 存在时，比较 PNG 的修改时间和 concept `.md` 文件的修改时间。如果 `.md` 比 `.png` 更新，说明 concept 内容已更新但 card 未重新生成。标记为"card 可能过时"。

在 report 中加一节：

```
### Concept Cards (N missing, M stale)
- Missing: `harness-engineering.md` (no PNG)
- Stale: `context-management.md` (md: 2026-04-07, png: 2026-04-01)
```

在 log 条目中加：`Card: N missing, M stale`

### 7b. Entity card 完整性检查

与 7a 相同的检查逻辑，但针对 entity 页面。每个 entity 页面应有对应的 infograph card PNG 存放在 `wikis/entities/assets/{slug}.png`。

检查两类问题：

**缺失 card**：entity 页面存在但 `assets/{slug}.png` 不存在。

**card 内容过时**：entity `.md` 比 `.png` 更新。

在 report 中加一节：

```
### Entity Cards (N missing, M stale)
- Missing: `anthropic.md` (no PNG)
- Stale: `openai.md` (md: 2026-04-07, png: 2026-04-01)
```

在 log 条目中加：`Entity Card: N missing, M stale`

### 8. 可读性抽查 — ljg-plain（仅 scope=all 时）

全局 lint 时，从 `wikis/concepts/` 和 `wikis/sources/` 各随机抽 1-2 篇信息密度最高的页面，调用 `/ljg-plain` 做可读性压力测试。

ljg-plain 用 9 条红线检验：嘴巴测试（会这样跟朋友说话吗？）、零术语、短词优先、一句一意、具体名词、开头要有吸引力、无废话、信任读者、诚实。

**产物处理**：ljg-plain 输出 org 文件到 `~/Documents/notes/`。
1. 对比 plain 版本和原文：信息保留度高 → 原文可读性已够；关键论点丢失 → 标记原文哪些段落太密或术语太重。
2. 在 lint report 中加一节 `### Readability Spot-Check`，列出抽查结果。
3. 删除 `~/Documents/notes/` 中的 org 文件。

这是诊断，不是修改。标记问题，让人决定是否改。

### 8a. 概念结构分析 — ljg-rank（仅 scope=all 且 concepts ≥20 时）

当 `wikis/concepts/` 页面数 ≥20 时，调用 `/ljg-rank` 对 wiki 覆盖的领域做降秩分析——找出不可约的生成器。

对比降秩结果和现有 concept pages：
- 生成器已有对应 concept page → 确认
- 生成器缺少 concept page → 标记为高优先候选新页面
- 多个 concept pages 映射到同一生成器 → 标记为潜在合并候选

**产物处理**：ljg-rank 输出 org 文件到 `~/Documents/notes/`。
1. 提取 generators 列表和四法官验证结果。
2. 在 lint report 中加一节 `### Structural Analysis (ljg-rank)`。
3. 删除 org 文件。

### 9. 输出报告

在终端输出结构化报告：

```
## Wiki Lint Report — [scope] — YYYY-MM-DD

### Broken Links (N)
- `wikis/concepts/foo.md` → `wikis/entities/bar.md` (not found)

### Orphan Pages (N)
- `wikis/entities/baz.md` (no inbound links)

### Index Inconsistencies (N)
- Missing from index: `wikis/concepts/new-concept.md`
- Ghost entry in index: `wikis/sources/deleted-source.md`

### Possible Contradictions (N)
- `wikis/concepts/tool-use.md` says "X", but `wikis/sources/anthropic.md` says "Y"

### Candidate New Pages (N)
- "prompt engineering" — mentioned in 4 pages, no dedicated page

### Concept Cards (N missing, M stale)
- Missing: `foo.md` (no PNG)
- Stale: `bar.md` (md: 2026-04-07, png: 2026-04-01)

### Readability Spot-Check (if scope=all)
- `wikis/concepts/xxx.md`: 可读性良好 / 第3-4段术语密度过高，建议简化

### Structural Analysis (if scope=all, concepts ≥20)
- Generators found: [list]
- Missing generator pages: [list]
- Merge candidates: [list]

### Summary
Total issues: N | Health: [HEALTHY / NEEDS ATTENTION / UNHEALTHY]
```

健康的 wiki：断链为零、orphan 极少、index 完全一致、矛盾为零或极少。
生病的 wiki：断链一堆、orphan 成群、index 和实际文件对不上、矛盾频繁。

### 9. 追加 log.md

在 `wikis/log.md` 末尾追加：

```
## [YYYY-MM-DD] lint | [scope]
- Broken links: N
- Orphan pages: N
- Index inconsistencies: N
- Contradictions: N
- Candidate pages: N
- Cards: N missing, M stale
- Readability: [N pages checked, M flagged] (if run)
- Structural: [N generators, M gaps] (if run)
```

## 约束

- **只读**。不修改任何 wiki 页面。唯一的写操作是追加 `wikis/log.md`。
- 只报告问题，不自动修复。修复交给人决定。
- wiki 页面内容用中文。

## Red Flags

- 你在 lint 的同时修改了页面内容 → 你 lint 错了。Lint 只报告，不动手。
- 一个 50+ 页的 wiki lint 结果是零问题 → 大概率是检查逻辑有遗漏，不是 wiki 真的完美。重新检查你的扫描范围和每一步的执行。
