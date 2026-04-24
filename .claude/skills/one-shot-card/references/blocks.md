# Block Kit Catalog

All blocks live in `site/src/components/card/blocks/`. Import in MDX:

```mdx
import Pillar from '~/components/card/blocks/Pillar.astro';
```

## `<PillarGrid cols={2|3|4}>` + `<Pillar label="…">`

3-column structural breakdown. Each pillar carries a short mono-label +
a 1-line body. Use for: concepts with 2-4 cases/modes/patterns.

```mdx
<PillarGrid cols={3}>
  <Pillar label="Chain">`A → B → C` 条件化 B 阻断</Pillar>
  <Pillar label="Fork">`A ← B → C` B 是混淆</Pillar>
  <Pillar label="Collider">`A → B ← C` 条件化反而打开</Pillar>
</PillarGrid>
```

## `<KV label="…">`

Key-value stack. Use for: entities (biographical), sources (metadata).

```mdx
<KV label="生年">1936—</KV>
<KV label="图灵奖">2011 · 因果推理</KV>
```

## `<Formula>`

Centered mono block for equations.

```mdx
<Formula>P(Y | do(X)) = Σ<sub>z</sub> P(Y | X, z) P(z)</Formula>
```

## `<Quote cite="…">`

Vermilion left-bar pull quote. Use for: sources (the killer line).

```mdx
<Quote cite="Pearl 2009">没有因果就没有反事实。</Quote>
```

## `<Caption>`

Small caps muted line. Use for: aside notes under a formula / pillar row.

```mdx
<Caption>Rule 3 covers a special case of Rule 1 under intervention.</Caption>
```

## `<Chip tone="vermilion|gold|celadon|ink">`

Inline tag. Use sparingly.

```mdx
<Chip tone="vermilion">核心</Chip>
```

## `<Divider dot={true}/>`

A hairline (optional center dot in vermilion).

```mdx
<Divider/>
```

## `<Stack gap={12}>`

Vertical rhythm control. Replaces manual `<br/>` sequences.

```mdx
<Stack gap={10}>
  <div>line 1</div>
  <div>line 2</div>
</Stack>
```

## Layout primitives (for `layout: bleed` cards)

These enable color-zoned / bento composition — see `references/layouts.md`
for worked examples.

### `<Band tone cols dense grow>`

A full-width horizontal band. Each band carries its own background tone.
When composing a bleed-mode card, the body is a vertical stack of
`<Band>`s. Tones: `paper` / `paper-raised` / `paper-sunk` / `ink` / `tan`
/ `celadon` / `gold`. `cols={2|3}` splits the band into columns.
`dense` shrinks vertical padding. `grow` makes this band absorb any
leftover vertical space (usually the hero band).

```mdx
<Band tone="ink" dense><Kicker>概念 · CAUSAL DAG</Kicker></Band>
<Band tone="paper-raised" grow>…hero content…</Band>
<Band tone="tan"><CoreDef>d-分离就是 ...</CoreDef></Band>
<Band tone="paper-sunk" cols={2}><div>left</div><div>right</div></Band>
```

### `<Kicker>`

Small mono all-caps label. A quiet top-line that says "meta".

```mdx
<Kicker>概念 · 因果 · REF-2026-03</Kicker>
```

### `<HeroHan size="md|lg|xl">`

Oversized Han-display character(s) — visual anchor. Use once per card.
Typical placement: top-left of an ink-toned band.

```mdx
<HeroHan size="xl">舵</HeroHan>
<HeroHan size="lg">Pearl</HeroHan>
```

### `<CoreDef>`

Italic emphasized core-definition line. Typical placement: inside a
`tone="tan"` or `tone="paper-sunk"` band between hero and detail. Signals
"this is the crystallized one-liner".

```mdx
<CoreDef>如果 c 没有发生，e 就不会发生 —— 最接近实际世界的可能世界中亦然。</CoreDef>
```

## Escape hatch

Anything else is fair game: plain markdown, `<p>`, `<ul>`, inline SVG,
`<Mermaid>` (if you import it). The A4 frame will clip overflow — that's
your feedback loop.

## MDX gotchas

- **`<style>` blocks must wrap CSS in a JSX template literal** to avoid
  MDX's parser treating `{ margin: 0 }` as an object literal:
  ```mdx
  <style>{`
    .my-class { margin: 0; color: var(--ink); }
  `}</style>
  ```
- **Avoid `{/* comments */}` inside deeply nested SVG** — strip them.
- **Don't set `kind` or `slug` in frontmatter** — derived from path.
