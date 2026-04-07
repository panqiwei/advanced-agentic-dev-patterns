---
name: llm-wiki-ingest
description: Use when a source document needs to be digested into the wiki. Without this, raw sources sit unconnected — no summary, no concept extraction, no cross-references, no discoverability. Takes a local file path or URL.
argument-hint: <source-path-or-url>
user-invocable: true
---

# LLM Wiki Ingest

## Overview

A source that isn't ingested is invisible to the wiki. Ingest reads a source, extracts its knowledge, and weaves it into the wiki's concept/entity graph — creating new pages, enriching existing ones, maintaining cross-references, index, and log.

**Core principle:** The wiki is a knowledge graph, not a file dump. Every ingest must leave the graph more connected than before.

## Constraints (read these first — they shape every step)

1. **Write scope**: Only touch `wikis/` and `INTERNAL_REFERENCES.md`. Never modify `docs/`, `patterns/`, or `sources/`.
2. **Language**: All wiki pages in Chinese. The wiki serves a Chinese-language project.
3. **One source per ingest**. If the user passes multiple, process them sequentially (or suggest parallel agents).
4. **Links are relative-path markdown**: `[text](../category/slug.md)`. Absolute paths break portability.
5. **Enrichment over replacement**: When updating an existing page, add the new source's perspective. Never overwrite content from earlier sources — the wiki accumulates multi-source synthesis.
6. **Source fidelity**: Summarize faithfully. If the source contradicts existing wiki content, record both views with citations. The wiki is not an opinion engine.

## Process

### 1. Read the source and detect type

- Local path → Read the file directly.
- URL → Use WebFetch to retrieve content.
- Failure → Report error and stop. Do not guess at content.

**Source type detection** — check the file path and content to classify:

| Signal | Type | Specialized handling |
|---|---|---|
| Path under `sources/arxiv_papers/` or content starts with arXiv metadata | **arXiv paper** | Use ljg-paper enhancement (see step 3a) |
| Path under `sources/anthropic_official/` or `sources/openai_official/` | **Industry article** | Standard ingest |
| Everything else | **General source** | Standard ingest |

### 2. Survey existing wiki state

Read `wikis/index.md` to understand what pages already exist and their scope. This determines whether you create new pages or enrich existing ones. Skipping this step causes duplicate pages and orphaned concepts — the most common ingest failure.

### 3. Extract knowledge structure

#### 3a. arXiv papers — ljg-paper enhanced extraction

If the source is an arXiv paper, invoke `/ljg-paper` on the source. ljg-paper uses a Feynman-style 8-step framework: find the real problem → outsider translation → one anchoring metaphor → core concept breakdown → crystallized insight → advisor review → implications → quality pass.

**Product handling**: ljg-paper outputs an org-mode file to `~/Documents/notes/` (Denote format). After it completes:
1. Read the org file to extract: problem statement, anchoring metaphor, core concepts, crystallized insight, implications.
2. Use these as the basis for the source summary page and concept pages (steps 4a and 4b) instead of doing generic extraction.
3. Copy the org file to `wikis/sources/{slug}.org` as a reference artifact alongside the markdown summary.
4. Delete the original from `~/Documents/notes/` to avoid clutter.

The ljg-paper output is richer than generic extraction — it forces structured thinking about what the paper actually contributes.

#### 3b. General sources — standard extraction

From the source, identify:

- **Core concepts and terms** — candidates for `wikis/concepts/` pages
- **Entities** — people, projects, frameworks, tools → candidates for `wikis/entities/`
- **Intersections** — where this source touches existing wiki pages (agreements, extensions, contradictions)
- **Novel contributions** — what this source adds that the wiki doesn't yet cover

### 4. Write/update wiki pages

Execute in this order (dependencies flow downward):

**a) Source summary** → `wikis/sources/{slug}.md`

Contents: title, source path/URL, structured summary, key takeaways, connections to other sources. This is the source's "home page" in the wiki.

**b) Concept pages** → `wikis/concepts/{slug}.md`

For each significant concept:
- Existing page → Read it, append a new section with this source's perspective. Update the `## References` section.
- New concept → Create page with: definition, context from this source, links to related concepts. Even new pages should link to existing wiki content where relevant.

**c) Entity pages** → `wikis/entities/{slug}.md`

Same create-or-update logic as concepts. Entity pages cover people, projects, frameworks, tools.

**Page format requirements:**
- Every page ends with `## References` listing all sources that contributed to it
- Internal cross-references use relative markdown links: `[concept-name](../concepts/slug.md)`
- Slug format: kebab-case, descriptive, stable (don't rename slugs on update)

### 5. Update index.md

Add an entry for each new page under its category in `wikis/index.md`:

```
- [slug](category/slug.md) — one-line Chinese description
```

If an existing entry's description is now incomplete (because this source expanded the concept), update the description.

### 6. Append to log.md

Append at the end of `wikis/log.md`:

```
## [YYYY-MM-DD] ingest | {Source Title}
- Source: `{path-or-url}`
- Pages created: `wikis/sources/xxx.md`, `wikis/concepts/yyy.md`, ...
- Pages updated: `wikis/concepts/zzz.md`, ...
- Lint: N issues
```

Use today's actual date.

### 7. Update INTERNAL_REFERENCES.md

Find the matching entry (by title or URL) and update:
- `Status` → `ingested`
- `Ingested` → today's date
- `Wiki pages touched` → list all pages created and updated

If no entry exists for this source, create one in the appropriate category section.

### 8. Local lint

Check all pages touched in this ingest plus their link neighbors:

- **Broken links**: markdown links pointing to nonexistent files
- **Index consistency**: every new page has an index entry
- **Contradictions**: new content conflicting with linked pages (LLM judgment — report suspects, don't need certainty)

Report issues in the log entry's `Lint` field. If issues found, warn the user in terminal output. Do not auto-fix — that's `/llm-wiki-lint`'s job.

### 9. Concept deepening with ljg-learn (optional)

After ingest, if a newly created concept page covers a core domain concept (not a minor term), offer to deepen it with `/ljg-learn`. ljg-learn anatomizes a concept through 8 dimensions: history, dialectics, phenomenology, linguistics, formalization, existentialism, aesthetics, meta-reflection.

**When to offer**: The concept is foundational (e.g., "requisite variety", "harness engineering", "context management") — not every concept page needs this. If unsure, ask the user.

**Product handling**: ljg-learn outputs an org file to `~/Documents/notes/`.
1. Read the org output, extract dimensions that add genuine depth beyond what the ingest already captured.
2. Merge relevant insights into the existing concept page as additional sections (don't replace, enrich).
3. Delete the org file from `~/Documents/notes/`.

### 10. Visual card with ljg-card

For **every newly created concept page**, generate an infograph card with `/ljg-card -i`. This is not optional — concept cards power the docs site's image/text toggle view.

**Input**: Pass the concept page's markdown content to `/ljg-card -i`.

**Footer 替换**: ljg-card 模板的 `.colophon` 硬编码了李继刚的 logo 和署名。生成 HTML 后、截图前，必须替换 footer 内容：
- 将 `.who` 区域替换为：`<span style="font: 400 24px/1 var(--sans); color: var(--ink-light);">Generated with ljg-card</span>`
- 移除 logo `<img>` 标签
- `{{SOURCE_LINE}}` 保留，填写 concept 引用的主要来源

**Product handling**: ljg-card outputs a PNG to `~/Downloads/`.
1. Create `wikis/concepts/assets/` if it doesn't exist.
2. Copy the PNG to `wikis/concepts/assets/{slug}.png` — the filename **must** match the concept page slug exactly (e.g., `harness-engineering.png` for `harness-engineering.md`).
3. Delete the original from `~/Downloads/`.
4. Do NOT embed the image in the wiki page itself. The `scripts/build_docs.py` build step automatically wraps concept pages with image/text tabs when a matching PNG exists in `assets/`.

**Why this naming matters**: `build_docs.py` looks for `wikis/concepts/assets/{stem}.png` where `{stem}` is the concept page's filename without `.md`. A mismatch means the card won't show up in the docs site.

**For source summaries**: Cards are optional. If generated, store in `wikis/sources/assets/{slug}.png` and embed directly: `![description](assets/filename.png)`.

## Validation — how to know you did it right

- [ ] `wikis/sources/{slug}.md` exists and has a complete summary
- [ ] Every significant concept has a page in `wikis/concepts/` (new or updated)
- [ ] Every entity mentioned prominently has a page in `wikis/entities/` (new or updated)
- [ ] All new pages appear in `wikis/index.md`
- [ ] All pages have `## References` sections citing their sources
- [ ] Cross-reference links resolve (no broken links among touched pages)
- [ ] `wikis/log.md` has the new entry
- [ ] `INTERNAL_REFERENCES.md` shows `ingested` status
- [ ] Wiki pages are in Chinese

## Red flags — shortcuts that break the wiki

| Shortcut | Why it fails |
|----------|-------------|
| Skipping step 2 (survey wiki) | Creates duplicate concept pages, misses enrichment opportunities |
| Writing pages without cross-links | Produces isolated islands instead of a connected graph |
| Overwriting existing page content | Destroys multi-source synthesis — the wiki's core value |
| Using absolute file paths in links | Breaks when repo moves or renders on GitHub |
| Skipping lint (step 8) | Broken links accumulate silently until the wiki is unusable |
| Writing wiki pages in English | Project language is Chinese — English pages confuse the graph |
| Ingesting without updating INTERNAL_REFERENCES.md | Source appears unprocessed, gets ingested again |

## Skill chain

- **Before ingest**: Use `/llm-wiki-clip` to convert a web URL into a local markdown source. Local sources produce better ingests (full content, no fetch issues).
- **After ingest**: Run `/llm-wiki-lint` on the touched pages to catch issues the local lint missed.
- **To query results**: Use `/llm-wiki-query` to ask questions against the updated wiki.
- **Orchestrator**: `/llm-wiki` routes natural-language requests to the right sub-skill.
