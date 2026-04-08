---
name: write-mental-model
description: "End-to-end pipeline for writing mental-model chapters: brainstorming \u2192 research & wiki building \u2192 editorial drafting \u2192 bilingual writing \u2192 review/optimize/enrich \u2192 wrap-up. Use this skill whenever the user wants to write a new mental-model chapter, continue work on an in-progress chapter, or asks about the mental-model writing workflow. Triggers on: \u201C\u5199 ch-XX\u201D, \u201Cstart chapter\u201D, \u201Cmental model\u201D, \u201C\u5FC3\u667A\u6A21\u578B\u201D, \u201Cnew chapter\u201D, \u201C\u4E0B\u4E00\u7BC7\u201D, \u201C\u8FDB\u5165\u6B63\u5F0F\u64B0\u5199\u201D."
argument-hint: "[chapter-topic or ch-XX identifier]"
user-invocable: true
---

# write-mental-model

Write a complete mental-model chapter from direction to publication. Six phases, each with a clear gate before the next.

Mental-model chapters are the **道 (dao)** layer of this project: they reveal the structure of a problem domain so clearly that the reader independently derives engineering strategies. They never prescribe practices, never say "you should", never offer "best practices." Patterns (术/shu) live elsewhere. This distinction is the single most important quality signal. If you catch yourself writing prescriptive language, stop and reframe as structural revelation.

## Before you start

1. Read the project's writing rules — these are non-negotiable:
   - `.claude/rules/writing-style.md` — tone, rigor, 道 vs 术, bilingual principle, organic transitions
   - `.claude/rules/claim-verification.md` — claim classification, contested questions, engineering pivot
2. Read at least one completed article from a published chapter (e.g., `docs/zh/mental-models/ch-01-orthogonality/01-the-forces.md`) as a voice reference
3. Check `INTERNAL_REFERENCES.md` for existing source registry and ingestion status
4. Check the roadmap in memory (`project_mental_models_roadmap.md`) for chapter thesis context

## Phase 0: Direction (定向)

**Goal**: Align on chapter thesis, article arc, and key concepts before any writing happens.

**This phase is conversational.** Do not rush through it. Multiple rounds of clarification with the user are expected and necessary — a chapter is 5-7 articles of deep content; getting the direction wrong wastes enormous effort.

### Step 0a: Brainstorming

Invoke the `superpowers:brainstorming` skill to explore the chapter topic. Feed it:
- The chapter topic and any existing thesis from the roadmap
- The published chapter sequence so far (what came before, what comes after)
- Cross-chapter dependencies (concepts that bridge chapters)

Present the brainstorming output to the user. This is a starting point, not a plan.

### Step 0b: Intent clarification loop

Work with the user to converge on:

1. **Core thesis** — 2-3 sentences capturing the chapter's central argument. What structural truth does this chapter reveal? (Example from ch-02: "Harness engineering is cybernetics. Not a metaphor — a structural isomorphism.")
2. **Article arc** — Ordered list of articles, each with a one-sentence thesis. The sequence should build: each article assumes the previous ones. The arc should feel like a single argument unfolding, not a collection of loosely related essays.
3. **Key concepts** — The 3-5 concepts the chapter introduces. For each: what it is, why it matters for agentic systems, and where the reader's intuition will likely be wrong.
4. **Cross-chapter bridges** — Which concepts from previous chapters get extended or reframed? Which concepts set up future chapters?
5. **Candidate sources** — Academic papers, blog posts, production experience that ground the chapter's claims. Check `INTERNAL_REFERENCES.md` for what's already ingested vs pending.

**Iterate** until the user confirms direction. Do not proceed to Phase 1 without explicit "go" from the user.

### Step 0c: Check for existing drafts

Look in `superpowers/drafts/` for existing editorial packages (e.g., `ch-03-entropy.md`, `ch-03-entropy-research.md`). If they exist, present their content to the user:
- What's already decided vs what needs revision?
- Do the existing drafts align with the direction just confirmed?
- What's missing?

This saves significant work — drafts may already contain article outlines, key paragraph sketches, and curated references.

**Gate**: User confirms chapter direction. Output is a clear thesis + article arc + source list.

---

## Phase 1: Research & Wiki Building (素材搜集)

**Goal**: Build the knowledge foundation. Every claim in the chapter must trace back to a source; every source must be accessible in the wiki.

### Step 1a: Source collection

From the confirmed source list (Phase 0), identify:
- **Already ingested** — check `INTERNAL_REFERENCES.md` status field
- **Local but not ingested** — files in `sources/` not yet processed
- **Need to acquire** — web articles, papers, docs to fetch

For sources that need acquiring:
- Use `/llm-wiki-clip` to archive web sources to `sources/`
- For papers, use WebFetch or WebSearch to locate, then clip

### Step 1b: Wiki ingestion

For each source not yet ingested, run `/llm-wiki-ingest`:
- This creates/updates wiki pages in `wikis/sources/`, `wikis/concepts/`, `wikis/entities/`
- Updates `wikis/index.md` and `wikis/log.md`
- Updates `INTERNAL_REFERENCES.md` with ingestion status

Run ingestions in parallel where sources are independent.

### Step 1c: Wiki lint

After all ingestions, run `/llm-wiki-lint all` to check:
- Cross-reference consistency
- Orphan pages
- Contradictions between sources
- Missing concept pages

Fix any critical issues. Report findings to user.

### Step 1d: Knowledge synthesis

Use `/llm-wiki-query` to test that the wiki can answer key questions the chapter will address. This validates coverage. Example queries:
- "What is [core concept] and how does it relate to agent systems?"
- "What evidence supports [chapter thesis]?"
- "What are the counterarguments to [key claim]?"

If the wiki can't answer these well, identify gaps and ingest additional sources.

**Gate**: All sources ingested, wiki lint passes, key questions answerable. User confirms readiness.

---

## Phase 2: Editorial Package (草案)

**Goal**: Produce a complete editorial package in `superpowers/drafts/` that serves as the writing blueprint.

Read `references/editorial-package-template.md` for the template structure.

### Step 2a: Generate the editorial package

Create `superpowers/drafts/ch-{NN}-{topic}.md` containing:

1. **Status & metadata** — date, chapter number, status (draft/review/final)
2. **Core thesis** — from Phase 0, refined
3. **Article structure table** — sequence, filenames, one-line thesis per article
4. **Front matter dependencies** — which prior chapters are prerequisites
5. **Per-article outlines** — section headings, key arguments, evidence sources
6. **Key paragraph drafts** — 2-3 paragraph sketches per article for the hardest/most important sections. These anchor the voice and argument.
7. **References** — organized by article, with full citations
8. **Formatting plan** — mkdocs-material features to use (admonitions, tabs, mermaid, etc.)
9. **Length estimates** — relative to existing chapters

Annotate with 📝 批注 where:
- A claim needs verification or stronger evidence
- Cross-document terminology must be aligned
- A section's placement between articles is debatable
- A concept bridges to future chapters

### Step 2b: User review

Present the editorial package to the user. This is a critical gate — the package defines the entire chapter. Expect and invite feedback on:
- Article ordering and scoping
- Thesis strength
- Missing perspectives
- Reference adequacy

**Gate**: User approves the editorial package. No writing begins without this approval.

---

## Phase 3: Writing (正式撰写)

**Goal**: Write all articles in both languages. Chinese first, English as native rewrite.

### Writing principles (apply to every article)

Read `.claude/rules/writing-style.md` before each writing session. Key reminders:

- **道 not 术**: Reveal structure, never prescribe. Test: can the reader independently derive engineering strategies they've never seen before?
- **Organic transitions**: No "[上一篇]说X...但Y..." mechanical recaps. Flow like conversation — connect through ideas, not references.
- **Claim rigor**: Every claim classifiable per claim-verification.md. Contested questions pivot to engineering frame.
- **Harness consistency**: "Harness" = entire feedback control system (controller + observer). Plant (LLM) is the only thing NOT part of harness.
- **延伸阅读 (Further Reading)**: This is NOT a source reference list — it is a curated recommendation of 1-3 reads the author genuinely believes are worth the reader's time. Selection criteria (all must be met):
  1. **High relevance**: directly extends or deepens the article's core argument, not merely tangentially related
  2. **Standalone value**: a reader who follows this link gets a complete, rewarding read — not a landing page, not a 2-paragraph blog post
  3. **Non-obvious**: if the reader would find it trivially by searching the article's title, it doesn't belong here — recommend what they'd miss
  - Annotate each entry with a 1-sentence reason why it's worth reading (not a summary of the source, but why THIS reader should care)
  - No duplicates across articles in the same chapter. Each recommendation lives in the article where it's most needed.
  - Cap at 3. If nothing meets all three criteria, it's fine to have 1 or even 0.
- **概念与实体 (Chinese only)**: Every Chinese article (except `index.md`) ends with a `## 概念与实体` section linking to relevant wiki pages. See Step 3a for details.
- **Tail hooks**: Each article ends with a natural hook to the next — a question raised, a tension unresolved, a concept half-introduced.

### Step 3a: Write Chinese articles

Write articles in sequence (01 through last). For each article:

1. **Draft** — Write the full article following the editorial package outline. Use wiki pages (`/llm-wiki-query`) for fact-checking as you write.
2. **Self-check** — Before presenting to user:
   - Run the 道-vs-术 test: grep for prescriptive language ("你应该", "最佳实践", "更好的做法是")
   - Check cross-references to other articles are correct
   - Verify all claims have backing in wiki or references
   - Verify 延伸阅读 has at most 3 entries, each with annotation, each meeting all three selection criteria
3. **Micro-review** — After every 2-3 articles, do a quick consistency pass:
   - Terminology consistent across articles written so far?
   - Transitions organic?
   - No duplicate 延伸阅读 entries?

#### 概念与实体 section (Chinese articles only)

Every Chinese article (except `index.md`) ends with a `## 概念与实体` section, placed **after** `## 延伸阅读`. This section links to wiki pages that are directly relevant to the article's content.

**How to populate:**

1. Identify the key concepts and entities discussed in the article
2. Check `wikis/concepts/` and `wikis/entities/` for matching pages (use glob/grep)
3. Select only pages that are **directly relevant** — a concept merely mentioned in passing doesn't qualify; it must be substantively discussed or structurally important to the article's argument
4. Link using relative paths from the article to the wiki: `../../../../../../wikis/concepts/xxx.md` or use the wiki page title as display text

**Format:**

```markdown
## 概念与实体

本文涉及的核心概念与实体，在项目知识库中有更详细的资料：

- [概念名](relative-path-to-wikis/concepts/xxx.md) — 一句话说明与本文的关联
- [实体名](relative-path-to-wikis/entities/yyy.md) — 一句话说明与本文的关联
```

**Rules:**
- Do NOT add this section to `index.md` files
- Do NOT add this section to English articles — this is a Chinese-only feature that leverages our Chinese wiki knowledge base
- Keep it concise: typically 3-6 links. Not a dump of every tangentially related wiki page.
- The annotation explains the relevance to THIS article, not a generic description of the concept

Write the chapter `index.md` after all articles are done — it needs the full picture.

Create `.pages` navigation file for the chapter directory.

### Step 3b: Write English articles

English articles are **natively written, not translated**. Read the Chinese version for content and argument structure, then write English from scratch in an English-native voice.

Key differences from Chinese:
- English text is 30-50% longer for the same concept
- Different metaphors may work better (cultural context matters)
- Sentence structure, rhythm, and idiom should feel natural to an English reader
- Academic citation conventions may differ

Write in sequence, same micro-review cadence as Chinese.

Create `.pages` navigation file and `index.md` for the English chapter directory.

### Step 3c: Build verification

After all articles are written:
```bash
uv run mkdocs build --strict -f mkdocs.zh.yml
uv run mkdocs build --strict -f mkdocs.en.yml
```

Fix any build errors before proceeding.

**Gate**: All articles written in both languages, builds pass. User has seen the articles.

---

## Phase 4: Review & Enrichment (审校)

**Goal**: Catch all issues, fix them, then enrich with visual assets and readability validation.

### Review pipeline

Check if `.claude/commands/review-and-optimize-doc.md` exists in this project. If it does, invoke it — it contains the authoritative, up-to-date review pipeline and may have evolved since this skill was written.

If the command does not exist, read `references/review-pipeline.md` and execute the inlined pipeline, which covers:

1. **Three parallel reviews**:
   - **Rules review** (superpowers:code-reviewer) — enforce writing-style.md, claim-verification.md, cross-document concerns
   - **Humanizer** (general-purpose agent) — use `/humanizer-zh` for Chinese documents, `/humanizer` for English documents. Identify AI writing patterns per the language-specific skill.
   - **Syntax & build review** (superpowers:code-reviewer) — mkdocs-material syntax, admonition indentation, link validity, build pass, CI/CD compatibility

2. **Consolidate** — Single table grouped by severity (Critical > Important > Suggestion), deduplicated

3. **Present to user** — "Fix all, or skip some?"

4. **Fix** — Critical and Important first, then Suggestions. Rebuild after fixes.

### Visual enrichment

After fixes, generate infographics using `ljg-card`:

**Chapter overview** (one per chapter, both languages):
- `/ljg-card -i` from the chapter's `index.md`
- Embed in `index.md` between intro and article table

**Article-level TL;DR cards** (every article):
- Every article gets a card — serves as TL;DR visual for readers and makes articles easy to share
- Design each card independently based on the article's content structure (not from a template)
- Each language designed independently — never copy Chinese layout for English

**For every visual**:
1. Replace ljg-card footer branding: change `.who` content to "Generated with ljg-card", keep `.info-source` as project name
2. Copy PNG from `~/Downloads/` to chapter's `assets/` directory
3. Embed in markdown with `![description](assets/filename.png)`
4. Verify build passes

**English card visual review (mandatory)**:
English text is 30-50% longer than Chinese. After capturing every English PNG, visually inspect it (Read the PNG file) for:
- Text truncation at container edges
- Label overlap
- SVG elements pushed outside visible area
- Awkward text wrapping in fixed-width boxes

If any issue found, fix HTML source (widen viewBox, reduce font-size, shorten labels, reposition), re-capture, and re-inspect. Do NOT skip this step.

### Readability diagnostic

Pick 1-2 of the densest articles. Run `/ljg-plain` on each. Compare plain output to original:
- If core argument preserved with minimal loss → original is accessible enough
- If key ideas dropped or logic distorted → flag dense sections, suggest targeted simplifications

Report findings. Do not auto-edit.

**Gate**: All issues fixed, visuals embedded, builds pass, readability assessed.

---

## Phase 5: Wrap-up (收尾)

### Step 5a: Artifact cleanup

List ALL intermediate artifacts produced during this run:
- `/tmp/ljg_cast_*.html`, `/tmp/ljg_infograph_*.html` — intermediate HTML from ljg-card
- `~/Downloads/*.png` — PNGs already copied into `docs/` assets
- `~/Documents/notes/*__plain.org` — ljg-plain diagnostic outputs
- `~/Documents/notes/*__concept.org` — ljg-learn outputs (if run)
- `~/Documents/notes/*__rank.org` — ljg-rank outputs (if run)

**Present the list with exact file paths.** Ask: "These are intermediate artifacts from this session. OK to clean up?"

**Wait for explicit confirmation.** Delete only confirmed files. Use `rm` on individual files, never `rm -rf` on directories. Only clean up artifacts from THIS run — never delete pre-existing files.

### Step 5b: Final verification

```bash
uv run mkdocs build --strict -f mkdocs.zh.yml
uv run mkdocs build --strict -f mkdocs.en.yml
git status
```

Confirm only expected files are modified/added.

### Step 5c: Summary report

```
## Chapter Complete: ch-{NN} {Topic}

### Articles Written
- ZH: {count} articles + index
- EN: {count} articles + index

### Review & Fixes
- {N} issues fixed ({X} critical, {Y} important, {Z} suggestions)
- Build: {status} en / {status} zh

### Visual Assets
- {list of generated cards with paths}

### Readability Assessment
- {article}: {pass/flag summary}

### Wiki Pages Created/Updated
- {list from llm-wiki-ingest operations}

### Cleanup
- {list of deleted artifacts, or "skipped by user"}
```

---

## Cross-cutting concerns

These apply throughout all phases:

| Concern | Rule |
|---------|------|
| Harness definition | Controller + observer = harness. Plant (LLM) is NOT part of harness. |
| 道 vs 術 | Mental models reveal structure. Never prescribe. |
| Bilingual | ZH and EN independently written and designed. No literal translation. |
| Transitions | Organic flow through ideas. No "[上一篇]说X..." recaps. |
| Contested claims | Never take sides on AI philosophy. Pivot to engineering mechanism. |
| Cross-references | Present where needed, links verified, no orphaned mentions. |
| 延伸阅读 | Curated 1-3 recommendations (not a reference list). Each must be highly relevant, standalone value, non-obvious. Annotated with why. No duplicates across chapter. |
| 概念与实体 | Chinese articles only (not index.md). Links to relevant `wikis/concepts/` and `wikis/entities/` pages. 3-6 links, annotated with relevance to the article. |
| INTERNAL_REFERENCES | Never mention internal project names (omne-next, OMNE) in tracked files. |
