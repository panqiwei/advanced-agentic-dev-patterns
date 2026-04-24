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

### Gotcha — day/night inversion of `--paper` and `--ink`

In light mode `--paper` is cream, `--ink` is near-black.
In dark mode they flip: `--paper` is near-black, `--ink` is cream.

So a rule like `color: var(--paper)` on an "ink-dark band" gives cream text in
light mode but near-black text in dark mode — invisible either way depending
on the band.

**Always inherit the enclosing band's text color for body/chip text** —
use `color: currentColor` (the band already sets the correct text color
via `<Band>`'s own CSS, flipped for both modes).

For semi-transparent variants use `color-mix(in oklab, currentColor 70%, transparent)`
or simply `opacity: 0.75` — both track the band's text direction.

Never write `color: var(--paper)` / `color: var(--ink)` directly inside a
card's `<style>` block unless you are 100% sure which band encloses it AND
you want the value to flip with theme mode.

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
