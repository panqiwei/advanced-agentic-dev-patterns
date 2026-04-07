---
name: llm-wiki
description: "Use for any wiki-related task — clipping sources, ingesting knowledge, checking health, or querying. Routes automatically so you don't need to remember sub-skill names."
argument-hint: <natural language instruction>
user-invocable: true
---

# LLM Wiki Router

Route `$ARGUMENTS` to the correct sub-skill by intent. Never execute ingest/lint/query logic yourself — always delegate via the Skill tool.

## Intent → Route

### Clip

User wants to save a web page locally as markdown.

Signals: "clip", "抓下来", "保存这个网页", "存到 sources", a bare URL with save intent, "archive this", "grab this page", "把这个存一下"

→ Invoke `/llm-wiki-clip` with the URL as argument.

### Ingest

User wants to digest material into the wiki.

Signals: "消化", "处理", "读一下这个", "加到 wiki", "ingest", "learn this", "把这篇文章吃掉", mentions a new article/paper/source to absorb

If given a URL with digest intent: recommend clip first for better quality, then ingest. Or chain both sequentially.

→ Invoke `/llm-wiki-ingest` with the source path or URL as argument.

### Lint

User wants a wiki health check.

Signals: "检查", "体检", "扫一下", "lint", "健康", "矛盾", "断链", "orphan", "any broken links?", "wiki 有没有问题"

→ Invoke `/llm-wiki-lint` with scope if user specified one.

### Query

User is asking a question and wants answers drawn from the wiki.

Signals: question syntax, "什么是", "怎么理解", "比较", "分析", "总结", "explain", "what is", "how does", "compare"

→ Invoke `/llm-wiki-query` with the question as argument.

### Status

User wants to see source processing status.

Signals: "状态", "status", "哪些还没处理", "进度", "what's pending"

→ Handle inline: read `INTERNAL_REFERENCES.md`, group by Status, output:

```
## Ingested (N)
- [Source Title] — ingested on YYYY-MM-DD, touched N wiki pages

## Pending (N)
- [Source Title] — Local: path | Remote: url

## Partial (N)
- [Source Title] — ...
```

## Ambiguity

If intent is unclear, list the five operations with one-line descriptions. Ask user to pick. Do not guess.

## Multi-intent

If the request contains multiple intents ("clip this then ingest it", "消化完扫一下"), execute sub-skills sequentially in natural order: clip → ingest → lint → query.

## ljg Skills Integration

Sub-skills internally leverage ljg- skills for enhanced quality. You don't need to invoke ljg skills directly — the sub-skills handle this. For awareness:

- **Ingest**: Uses `/ljg-paper` for arXiv papers (Feynman-style extraction), `/ljg-learn` for core concept deepening (8-dimension anatomy), `/ljg-card` for optional visual cards.
- **Lint**: Uses `/ljg-plain` for readability spot-checks (9 red-line criteria), `/ljg-rank` for structural analysis of concept space (irreducible generators).
- **Query**: Suggests `/ljg-roundtable` for multi-perspective debates on contested topics, `/ljg-card` for answer visualization.

All ljg product handling (org files in `~/Documents/notes/`, PNGs in `~/Downloads/`) is managed by the sub-skills — artifacts are harvested into the project structure and originals cleaned up.

## Constraints

- Never execute ingest, lint, or query logic directly. Always delegate through the Skill tool.
- Status check is the only operation handled inline.
- Route by what the user WANTS, not by keyword matching. A question containing the word "clip" is still a query if the user is asking about clipping, not requesting it.
