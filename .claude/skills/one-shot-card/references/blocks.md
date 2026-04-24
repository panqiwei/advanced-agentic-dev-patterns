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

## Escape hatch

Anything else is fair game: plain markdown, `<p>`, `<ul>`, inline SVG,
`<Mermaid>` (if you import it). The A4 frame will clip overflow — that's
your feedback loop.
