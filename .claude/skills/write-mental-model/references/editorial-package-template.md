# Editorial Package Template

This template defines the structure for chapter drafts saved to `superpowers/drafts/ch-{NN}-{topic}.md`. Extracted from the ch-02 (cybernetics) and ch-03 (entropy) packages that were successfully used to produce published chapters.

The editorial package is the writing blueprint. Every decision about scope, sequence, evidence, and formatting gets made here, before a single article is written. This front-loads the hard thinking and makes the actual writing phase faster and more consistent.

---

## Template

```markdown
# Ch-{NN}: {Topic} — Editorial Package

**Status**: draft | review | approved | complete
**Date**: {YYYY-MM-DD}
**Author**: {who prepared this package}

## Core Thesis

{2-3 sentences. The structural truth this chapter reveals. Not what the chapter covers — what it argues.}

Example (ch-02):
> Harness engineering is cybernetics. Not a metaphor — a structural isomorphism. An agentic system is a fundamentally different kind of system — non-deterministic, high-variety, natural-language-driven — and you are part of it.

## Article Structure

| # | Filename | Title (ZH) | Title (EN) | One-liner |
|---|----------|-------------|------------|-----------|
| 01 | 01-{slug}.md | {中文标题} | {English title} | {一句话概括} |
| 02 | 02-{slug}.md | ... | ... | ... |
| ... | ... | ... | ... | ... |

### Reading flow

{1-2 sentences describing how the articles build on each other. What's the narrative arc?}

## Prerequisites

- Assumes reader has read: {list prior chapters}
- Concepts carried forward: {list specific concepts from prior chapters that get extended}

## Per-Article Outlines

### Article 01: {Title}

**Thesis**: {What this article argues, in one sentence}

**Sections**:
1. {Section heading} — {What this section covers and why it's here}
2. {Section heading} — ...
3. ...

**Key paragraph drafts**:

Opening:
> {Draft the opening 2-3 sentences. This anchors the voice and sets the hook.}

{Hardest section}:
> {Draft the paragraph that makes the core argument. This is where rigor matters most.}

**Evidence sources**:
- {Source name} → {What it provides for this article}
- ...

**Cross-references**:
- Links to: {Which other articles in this chapter}
- Links from: {Which prior chapter articles}

**📝 批注**:
- {Any open questions, terminology decisions, placement debates}

---

{Repeat for each article}

---

### Index page

**Structure**:
- Opening paragraph: {What the chapter is about, for someone scanning}
- Chapter overview visual: {Will be generated with ljg-card -i}
- Article table: {Links to each article with one-line descriptions}

## References

### Article 01
- {Author} ({Year}). {Title}. *{Publication}*. {DOI/URL}
- ...

### Article 02
- ...

{Organize by article. Each reference appears under the ONE article where it's most needed — no duplicates.}

## Formatting Plan

### mkdocs-material features by article

| Article | Admonitions | Tabs | Mermaid | Tables | Code blocks |
|---------|-------------|------|---------|--------|-------------|
| 01 | tip, note | — | — | 1 | — |
| 02 | — | — | 1 (OCP loop) | 2 | — |
| ... | ... | ... | ... | ... | ... |

### Directory structure

```
docs/{lang}/mental-models/ch-{NN}-{topic}/
├── index.md
├── 01-{slug}.md
├── 02-{slug}.md
├── ...
├── assets/
│   ├── {topic}-overview.png
│   └── ...
└── .pages
```

### .pages file

```yaml
title: {Chapter title}
nav:
  - index.md
  - 01-{slug}.md
  - 02-{slug}.md
  - ...
```

## Length Estimates

- Target: {N} articles, ~{word count} words per article (ZH), ~{1.3-1.5x} for EN
- Relative to ch-{prev}: {percentage, e.g., "~120% of ch-01"}
```

---

## Notes on usage

- The 📝 批注 annotations are for the editorial phase only — they do NOT appear in published articles
- Key paragraph drafts are starting points, not final text. They anchor voice and argument but will evolve during writing
- The references section is a working bibliography. During writing, some references may be added or removed as the argument develops
- The formatting plan prevents ad-hoc decisions during writing. Decide mkdocs features upfront based on content needs
