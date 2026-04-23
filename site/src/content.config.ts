import { defineCollection, z } from "astro:content";
import { glob } from "astro/loaders";

/**
 * Mental-model chapters live in the repo's existing `docs/{en,zh}/mental-models/`
 * tree. We pull them through Astro's glob loader so the new site can read the
 * same markdown files MkDocs currently serves — no duplication during migration.
 */
const mm = defineCollection({
  // Populated by `scripts/sync-content.mjs` which transforms MkDocs-specific
  // syntax (admonitions, mm-article cards, cross-chapter links) into forms
  // Astro's pipeline understands. Run `npm run sync` after editing the source
  // markdown; `predev` + `prebuild` do it automatically.
  loader: glob({
    pattern: "{en,zh}/ch-*/*.md",
    base: "./src/content/mm",
  }),
  schema: z
    .object({
      title: z.string().optional(),
    })
    .passthrough(),
});

/**
 * Patterns (technical annex).
 * Point at `patterns/<topic>/<category>/docs/{overview.md,overview.zh.md}`
 * (the source-of-truth location before build_docs copies them into docs/{en,zh}).
 */
const lab = defineCollection({
  loader: glob({
    pattern: "*/*/docs/overview*.md",
    base: "../patterns",
  }),
  schema: z
    .object({
      title: z.string().optional(),
    })
    .passthrough(),
});

/**
 * Wiki (Knowledge Atlas). Populated by sync-content.mjs from wikis/.
 * 263 entries across concepts/entities/sources; cards (infograph PNGs) copy
 * to public/wiki/<kind>/. The sidecar `_manifest.json` (also written by
 * sync-content.mjs) carries derived metadata for the atlas index page.
 */
const wiki = defineCollection({
  loader: glob({
    pattern: "{concepts,entities,sources}/*.md",
    base: "./src/content/wiki",
  }),
  schema: z
    .object({
      title: z.string().optional(),
    })
    .passthrough(),
});

export const collections = { mm, lab, wiki };
