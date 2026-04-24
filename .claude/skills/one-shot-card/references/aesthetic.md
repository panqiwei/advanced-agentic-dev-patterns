# Card Aesthetic — Palette & Voice

## Palette (tokens.css)

- `--paper` — main background (宣纸底)
- `--paper-raised` — card body background (展签纸)
- `--paper-sunk` — recessed slots (contained code, chips)
- `--ink` — primary text
- `--ink-soft` — body prose
- `--ink-faint` — captions, meta labels
- `--rule` — hairlines
- `--vermilion` — seal, accent; use sparingly (印章 only, or one chip)
- `--gold` — quieter accent (entity seal, source year)
- `--celadon` — rarest accent (rare structural emphasis)

The dark-mode palette flips automatically via `[data-theme="dark"]`.
Your card should not hard-code any hex value.

## Voice (for tagline + body)

- 留白是美德 — if a pillar or bullet can be cut, cut it
- 表达清楚优先于字数 — clarity > conciseness when they conflict
- Chinese: prefer 意象 over 说教. "舵手" beats "the thing that steers".
- English: terse, concrete. Avoid "allows" / "enables" — use active verbs.
- Inline code (`A → B → C`) for symbols; block `<Formula>` only for
  multi-symbol equations.

## Card-kind personality

- `concept` — structural; the card should show what the concept IS (its
  components, invariants, mechanisms). `<PillarGrid>` default.
- `entity` — biographical; who they are, what they did. `<KV>` default.
- `source` — distill; one killer quote + 2-3 takeaways. `<Quote>` default.
- `chapter` — narrative; prose + a divider + a final punchline. `<Stack>`
  default.

These are starting points, not rules. Content decides.
