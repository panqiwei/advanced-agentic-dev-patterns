import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import pagefind from 'astro-pagefind';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';
import rehypeCallouts from 'rehype-callouts';

// `site` + `base` together tell Astro where the site will live.
// For GitHub Pages under a repo path, set SITE_BASE=/advanced-agentic-dev-patterns.
// Local dev leaves SITE_BASE unset so everything serves from `/`.
// IMPORTANT: keep SITE_BASE in lockstep with scripts/sync-content.mjs —
// that script bakes the prefix into rewritten markdown URLs.
const SITE_BASE = (process.env.SITE_BASE ?? '').replace(/\/+$/, '');

export default defineConfig({
  site: 'https://panqiwei.github.io',
  base: SITE_BASE || undefined,
  // GitHub Pages auto-301s paths like /en/mm/cybernetics → /en/mm/cybernetics/
  // 'ignore' lets both forms work without the extra network hop on nav.
  trailingSlash: 'ignore',

  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'zh'],
    routing: {
      prefixDefaultLocale: true,
      redirectToDefaultLocale: false,
    },
  },

  integrations: [
    react(),
    mdx(),
    sitemap(),
    pagefind(),
  ],

  markdown: {
    remarkPlugins: [remarkMath],
    rehypePlugins: [rehypeKatex, rehypeCallouts],
    shikiConfig: {
      themes: { light: 'github-light', dark: 'github-dark-dimmed' },
      wrap: true,
      excludeLangs: ['mermaid'],
    },
  },

  vite: {
    resolve: {
      alias: { '~': '/src' },
    },
  },
});
