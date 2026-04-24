---
name: one-shot-card
description: Use when a wiki concept/entity/source page or a mm chapter needs a visual TL;DR card. Produces a `.mdx` file that renders through `<OneShotCard>` in the Astro site. Phase 2 scope — sample iteration, not batch.
argument-hint: <source-file-path-or-slug> [lang=zh|en]
user-invocable: true
---

# One-Shot Card

Generate a TL;DR "一图流" card for any main-content page. Output is a `.mdx`
file consumed by Astro's `cards` content collection, rendered by
`<OneShotCard>` (A4 vertical, palette-locked, overflow-hidden).

## Core principle

A4 竖的信息密度 ≈ 一条 tweet + 一张支持图；留白是美德；表达清楚优先于字数。

## Inputs

- Source file path — e.g. `wikis/concepts/causal-dag.md`,
  `docs/zh/mental-models/ch-02-cybernetics/01-helmsman.md`, or a mm
  chapter root.
- Target language — `zh` (default) or `en` (requires EN source body).

## Process

1. **Read the source**. Identify kind from the path:
   - `wikis/concepts/…` → `concepts`
   - `wikis/entities/…` → `entities`
   - `wikis/sources/…` → `sources`
   - `docs/{lang}/mental-models/ch-*/…` → `chapters`
2. **Extract frontmatter fields**:
   - `title` — from h1 or existing frontmatter
   - `titleAlt` — cross-language subtitle if natural
   - `tagline` — one line summary; the source's first paragraph
     usually gives a serviceable one with a quick trim
   - `refs` — cross-references found in the body (pick top 2-4)
   - `sourceLine` — if sources are cited, the primary one
   - `author` / `year` / `url` — for `source` kind, parse from source
     frontmatter or first paragraph
   - (Do NOT include `kind` or `slug` — they're derived from the output path)
3. **Draft the body** — this is where you have freedom.
   - Read `references/blocks.md` for the block kit catalog.
   - Read `references/aesthetic.md` for the palette + writing voice.
   - Read the matching `references/exemplars/…` for a concrete model.
   - Pick a layout that fits the content, not a template. A concept
     with 3 structural cases → `<PillarGrid>`. An entity with biographical
     facts → `<KV>` stack. A source with a killer quote → `<Quote>` +
     3 takeaways. A chapter → mixed prose + `<Divider>`.
   - If none of the kit fits, write plain markdown or drop in any Astro
     component / inline SVG. The body is yours.
4. **Write the file** to
   `site/src/content/cards/{lang}/{kind-plural}/{slug}.mdx`
   (kinds plural in the folder: concepts/entities/sources/chapters).
5. **Return a review URL**:
   - wiki entries: `http://localhost:4321/{lang}/wiki/{kind-plural}/{slug}`
   - chapters: the relevant mm page, or `/card-fragment/{lang}/{kind-plural}/{slug}` for isolated view
6. **Tell the author to eyeball it**. The component's `overflow: hidden`
   is the hard floor — if body spills, trim or rethink.

## Constraints (hard — imposed by `<OneShotCard>`)

- A4 vertical aspect ratio
- `max-height: calc(100vh - 120px)`
- `overflow: hidden` — no scroll escape
- Palette locked to tokens.css (you don't set colors)

## Non-constraints

Not a checklist of "must have N pillars", "title ≤ X chars", etc. If the
content needs more or less, write more or less; if overflow, the card
will clip and the author will see the signal.

## Skill chain

- `one-shot-card` produces a sample.
- Author reviews in the browser.
- Author adjusts the mdx directly, or re-invokes with a different brief.
- After phase 2 samples pass review, P3 batch-regen 剩余 ~265 张 lives in a
  separate spec.
