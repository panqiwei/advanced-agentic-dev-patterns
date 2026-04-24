---
name: one-shot-card
description: Use when a wiki concept/entity/source page or a mm chapter needs a visual TL;DR card. Produces a `.mdx` file that renders through `<OneShotCard>` in the Astro site. Design-first workflow — different cards should LOOK different.
argument-hint: <source-file-path-or-slug> [lang=zh|en]
user-invocable: true
---

# One-Shot Card

Generate a TL;DR "一图流" card — a poster-style visual summary of any
main-content page — as a `.mdx` file consumed by Astro's `cards`
collection and rendered through `<OneShotCard>`.

## Core principle (north star)

> **充分利用有效面积，用版面体现重要性，最后再叠加审美。**

Before you pick blocks, do **design-first thinking**. An A4 vertical
card is a *poster*, not a document. Content does NOT simply flow from
top to bottom in paragraphs — the visual weight of each region should
mirror how important that content is. If there's a hero idea, give it a
hero zone. If there's a core one-liner, give it its own band. If there
are siblings, put them side-by-side.

Never let a card finish at 60% height with a half-empty bottom. Fill the
surface, or cut content until what remains fills it gracefully.

**Different cards should LOOK different.** Do not default to the same
template each time. The point of one-shot cards is that each is a
dedicated poster, not a row in a uniform grid.

## Inputs

- Source file path — e.g. `wikis/concepts/causal-dag.md`,
  `docs/zh/mental-models/ch-02-cybernetics/01-helmsman.md`, or a mm
  chapter root.
- Target language — `zh` (default) or `en`.

## Process (MANDATORY ORDER — do not skip design)

### 1 · Read the source

Parse the source file. Note: title, tagline candidates, core structure
(h2/h3 + first bullet of each), cross-references, cited sources,
(for source kind) author/year/URL.

### 2 · Design-first: rank and allocate

Before writing a single line of MDX, answer these questions:

1. **What are the 3–5 things this card must communicate?** Rank by
   importance (most → least).
2. **Which is the hero?** The single most important idea / the
   signature visual. This gets the biggest surface area.
3. **Is there a signature visual?** (An SVG topology, a compare table, a
   formula, a timeline, a matrix.) If yes, it IS the hero.
4. **What natural structure does this content have?** (N-case breakdown
   / compare-contrast / timeline / hierarchical / quote + takeaways / KV
   biographical.) This picks the layout pattern.
5. **What is the 1-line core definition?** The sentence that if a reader
   reads nothing else, they got the concept. This deserves its own band.

### 3 · Pick a layout approach — let different cards look different

Do **NOT** default to the same template for every card. Choose per-content:

| Content signature | Layout approach | Good fit for |
|---|---|---|
| One signature SVG + elaboration | **Hero-on-top** (bleed): large hero band, then tan core band, then small detail/refs band | concepts with a structural diagram (causal-dag, fractal) |
| Compare/contrast two sides | **Dual-column split** (bleed, `<Band cols={2}>`): two panels side-by-side | pros vs cons, challenges vs strengths, symbol vs connectionist |
| N ordered steps / rules | **Rule-stack** (bleed with stacked bands; ink accent for 1st) | `do-calculus` three rules, multi-step processes |
| One person + their facts | **Portrait-KV** (bleed; 2-col top: hero-han + KV stack; bottom caption) | `entities/judea-pearl`, historical figures |
| One killer quote + 2–3 takeaways | **Quote-hero + takeaways-foot** (bleed; tan band with `<CoreDef>` quote on top; paper-sunk band with numbered takeaways) | source cards, paper digests |
| Narrative chapter TL;DR | **Band-rhythm** (bleed; alternating tone bands each carrying one idea) | `chapters/ch-*`, overview cards |

None are mandatory — the table is a *menu*. If a card's content
suggests a different composition, follow that.

### 4 · Decide: `default` or `bleed` layout

- **`default`** (layout field omitted): shell renders kind badge + seal +
  title block + footer refs/source; body slots into a padded middle
  region. Good when the card is small and you want the shell to frame
  it.
- **`bleed`** (`layout: bleed` in frontmatter): shell renders ONLY the
  A4 frame + palette lock. The body composes everything edge-to-edge
  using `<Band>` / `<Kicker>` / `<HeroHan>` / `<CoreDef>` and inline
  SVG/KV/Quote/etc. You are responsible for putting the title, kind
  tag, and footer refs somewhere in the composition (usually: an ink or
  tan top-band for title+kicker, and a paper-sunk or ink bottom-band
  for refs+source).

**Default for rich cards is `bleed`.** It's the only way to get real
infographic composition with color zones.

### 5 · Compose the MDX

- Start from a layout skeleton (menu in §3 or invent one).
- Fill content into zones. Each zone's content should be the minimum
  needed to do its job — no filler to "fill space". If content doesn't
  fit, adjust zone sizes.
- Use `<Band grow>` on the zone that should absorb any leftover vertical
  space (typically the hero / compare zone, never the footer).
- Inline SVG is encouraged — 400×100 of 3 topologies tells more than
  three text pillars. Use `currentColor` and token-driven fill/stroke
  so dark mode flips automatically.
- Unusual compositions welcome: rotated text, vertical rails, hero
  number accents, compare-matrix tables. The A4 frame is the only hard
  limit.

### 6 · Write to disk

Path: `site/src/content/cards/{lang}/{kind-plural}/{slug}.mdx`

`{kind-plural}` ∈ `concepts` / `entities` / `sources` / `chapters`.

**Never set `kind` or `slug` in frontmatter** — derived from path.

### 7 · Hand off

Return:
- Path of the file written.
- 1-sentence statement of the layout approach chosen and *why*.
- Review URL:
  - wiki entries: `http://localhost:4321/{lang}/wiki/{kind-plural}/{slug}`
  - any card (isolated view): `http://localhost:4321/card-fragment/{lang}/{kind-plural}/{slug}?theme=dark`

The author will eyeball and iterate.

## Hard constraints (imposed by the component — can't escape)

- A4 vertical aspect ratio (1 : 1.414).
- `max-height: calc(100vh - 120px)`.
- `overflow: hidden` — the card clips. If content overflows, the author
  sees it and will trim. Do NOT add internal scrolling.
- Palette locked to `tokens.css`. Never hard-code hex values.

## Non-constraints (you choose freely)

- Number of zones / bands / SVG panels.
- Vertical rhythm — bleed bands can be any height you want.
- Typographic weights/sizes within the provided fonts.
- Whether the kind tag / title / footer lives in the shell's default
  chrome (default layout) or inside a band you author (bleed layout).

## Background

- `references/aesthetic.md` — tokens + voice
- `references/blocks.md` — block kit catalog (incl. new `<Band>`,
  `<Kicker>`, `<HeroHan>`, `<CoreDef>`)
- `references/layouts.md` — the 6 layout approaches above with worked
  MDX skeletons
- `references/sources-card.md` — source-kind special fields
- `references/exemplars/` — real mdx files annotated with *why* each
  layout choice was made

## Skill chain

- Produce one sample; author reviews.
- If layout is wrong (feels flat, feels crowded, feels samey), iterate:
  swap the approach, re-generate.
- Phase-2 targets ~5 异质 samples, one per archetype. Batch-regen for
  P3 is a separate spec — don't try to mass-produce here.
