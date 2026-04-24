# Source Card Variant

Source cards (kind = `sources` in the folder path) have richer frontmatter
than concepts / entities — they cite external work with structured
metadata.

## Extra frontmatter

```yaml
author: Anthropic Applied AI team
year: 2026
url: https://www.anthropic.com/engineering/...
```

The `<OneShotCard>` shell does not yet surface these visually (phase 3
work — an "author · year" line in the header). For now, the author
field is still authoritative in the mdx and will be picked up by later
shell enhancements.

## Body pattern

A source card shines when it distills the source into:

1. **One killer quote** (the most quotable sentence in the source),
   rendered via `<Quote>`.
2. **2-3 takeaways** (the author's 讨论 of why it matters), as a
   `<Stack>` of bullet/prose lines.

Avoid listing every section of the source — that's the source's job,
not the card's.
