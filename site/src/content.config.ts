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

/**
 * One-shot cards (TL;DR 一图流) for every main-content page.
 * Entries live at `src/content/cards/{lang}/{kind}/{slug}.mdx`.
 * Consumed by `<OneShotCard of="{kind}/{slug}" />` in atlas grid, detail
 * page splash, and CardTrigger modal overlays.  Free-form MDX body — the
 * component shell imposes the A4-vertical frame, palette, seal, and
 * overflow:hidden; authors pick the layout inside.
 */
const cards = defineCollection({
  loader: glob({
    pattern: "{en,zh}/{concepts,entities,sources,chapters}/*.mdx",
    base: "./src/content/cards",
  }),
  schema: z
    .object({
      schemaVersion: z.literal("one-shot-card/v1"),
      title: z.string(),
      titleAlt: z.string().optional(),
      seal: z.string().optional(),
      tagline: z.string().optional(),
      refs: z.array(z.string()).optional(),
      sourceLine: z.string().optional(),
      author: z.string().optional(),
      year: z.union([z.string(), z.number()]).optional(),
      url: z.string().url().optional(),
      /**
       * `default` (or missing): shell renders kind badge + seal + title +
       * tagline + footer refs/source; body slots into a padded region.
       * `bleed`: shell renders ONLY the frame (A4 + overflow:hidden +
       * palette).  The body composes everything edge-to-edge via `<Band>`,
       * `<Kicker>`, `<HeroHan>`, `<CoreDef>`, SVG, etc.  Use when the card
       * needs a poster/infographic composition with color zones.
       */
      /**
       * @deprecated Use `cardLayout` instead — `layout` conflicts with
       * Astro MDX's built-in layout-import convention.
       */
      layout: z.enum(["default", "bleed"]).optional(),
      /**
       * `default` (or missing): shell renders kind badge + seal + title +
       * tagline + footer refs/source; body slots into a padded region.
       * `bleed`: shell renders ONLY the frame.  Body composes everything
       * edge-to-edge via `<Band>`, `<Kicker>`, etc.
       * NOTE: use `cardLayout` not `layout` in MDX frontmatter — Astro MDX
       * treats `layout:` as a component-import path, causing build failures.
       */
      cardLayout: z.enum(["default", "bleed"]).optional(),
    })
    .passthrough(),
});

export const collections = { mm, lab, wiki, cards };
