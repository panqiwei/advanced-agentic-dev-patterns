/**
 * Client-side mermaid renderer.
 * Because we tell Shiki to excludeLangs:['mermaid'], fenced ```mermaid blocks
 * come through as <pre><code class="language-mermaid">SRC</code></pre>.
 * We convert each to <pre class="mermaid">SRC</pre> and run mermaid.run().
 * Re-hook on every Astro view-transition navigation AND on site theme flip.
 *
 * Palette is pulled from the site design tokens (`tokens.css`) so the graph
 * lives in the same warm-paper / warm-dark world as the rest of the page —
 * no pink/yellow mermaid defaults.
 */

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;
let lastTheme: string | null = null;

function siteTokens() {
  const cs = getComputedStyle(document.documentElement);
  const v = (k: string) => cs.getPropertyValue(k).trim();
  return {
    paper: v("--paper"),
    paperRaised: v("--paper-raised"),
    paperSunk: v("--paper-sunk"),
    ink: v("--ink"),
    inkSoft: v("--ink-soft"),
    inkFaint: v("--ink-faint"),
    rule: v("--rule"),
    vermilion: v("--vermilion"),
    gold: v("--gold"),
    celadon: v("--celadon"),
  };
}

function mermaidConfig() {
  const t = siteTokens();
  return {
    startOnLoad: false,
    theme: "base" as const,
    // Dual-script font stack so Latin stays monospaced (Plex) but the
    // occasional CJK label (稀释信号 / 放大噪声) rides on the body Han serif
    // and doesn't fall through to a generic system font.
    fontFamily:
      '"IBM Plex Mono", ui-monospace, "SF Mono", "LXGW WenKai", "Noto Serif SC", monospace',
    themeVariables: {
      background: t.paperRaised,
      primaryColor: t.paperSunk,
      primaryTextColor: t.ink,
      primaryBorderColor: t.rule,
      secondaryColor: t.paperRaised,
      secondaryTextColor: t.ink,
      secondaryBorderColor: t.rule,
      tertiaryColor: t.paperRaised,
      tertiaryTextColor: t.ink,
      tertiaryBorderColor: t.rule,
      lineColor: t.inkFaint,
      textColor: t.ink,
      mainBkg: t.paperSunk,
      nodeBorder: t.rule,
      edgeLabelBackground: t.paperRaised,
      clusterBkg: t.paperSunk,
      clusterBorder: t.rule,
      titleColor: t.ink,
      // Flowchart specifics
      nodeTextColor: t.ink,
      // Note / highlight blocks
      noteBkgColor: t.paperRaised,
      noteTextColor: t.ink,
      noteBorderColor: t.rule,
      // Accents — used by default style classes if any diagram opts in
      labelBackground: t.paperRaised,
      errorBkgColor: t.vermilion,
      errorTextColor: t.paper,
    },
    securityLevel: "strict" as const,
  };
}

async function getMermaid(force = false) {
  if (force) mermaidPromise = null;
  if (!mermaidPromise) {
    mermaidPromise = import(
      "https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs" as string
    ).then((m: any) => {
      m.default.initialize(mermaidConfig());
      return m.default;
    });
  }
  return mermaidPromise;
}

// Strip author-supplied `style X fill:#f9f` lines.  Those inline mermaid
// style directives hard-code the pink/yellow defaults and survive any theme
// we configure, so we drop them and rely on the token-driven themeVariables.
function cleanSource(src: string): string {
  return src
    .split("\n")
    .filter((line) => !/^\s*style\s+\w[\w-]*\s+/i.test(line))
    .join("\n");
}

async function renderMermaid(force = false) {
  // Astro's shiki `excludeLangs: ['mermaid']` marks mermaid fences with
  // `data-language="mermaid"` on the <pre> (no language-* class on <code>).
  // On theme flips we need to re-render existing diagrams too.
  if (force) {
    document
      .querySelectorAll<HTMLElement>(".mermaid-diagram")
      .forEach((el) => {
        const src = el.dataset.mermaidSrc;
        if (src) {
          el.innerHTML = "";
          el.removeAttribute("data-processed");
          el.textContent = src;
        }
      });
  }

  const preList = document.querySelectorAll<HTMLElement>(
    'pre[data-language="mermaid"], pre > code.language-mermaid',
  );
  const freshDiagrams: HTMLElement[] = [];
  for (const node of preList) {
    const pre = node.tagName === "PRE" ? node : node.parentElement!;
    if (!pre || pre.dataset.mermaidProcessed === "true") continue;
    const src = cleanSource(pre.textContent ?? "");
    const wrapper = document.createElement("div");
    wrapper.className = "mermaid-diagram";
    wrapper.dataset.mermaidSrc = src;
    wrapper.textContent = src;
    pre.replaceWith(wrapper);
    freshDiagrams.push(wrapper);
  }

  const needsRun =
    force
      ? document.querySelectorAll(".mermaid-diagram").length > 0
      : freshDiagrams.length > 0;
  if (!needsRun) return;

  const mermaid = await getMermaid(force);
  try {
    await mermaid.run({ querySelector: ".mermaid-diagram" });
  } catch (err) {
    console.warn("[mermaid] render failed", err);
  }
}

function onThemeMaybeChanged() {
  const theme = document.documentElement.getAttribute("data-theme");
  if (theme === lastTheme) return;
  lastTheme = theme;
  // Re-init with fresh token values and re-render existing diagrams.
  renderMermaid(true);
}

// Initial render.
lastTheme = document.documentElement.getAttribute("data-theme");
document.addEventListener("astro:page-load", () => {
  lastTheme = document.documentElement.getAttribute("data-theme");
  renderMermaid();
});
renderMermaid();

// Watch the theme attribute so mermaid flips when the user toggles day/night.
new MutationObserver(onThemeMaybeChanged).observe(document.documentElement, {
  attributes: true,
  attributeFilter: ["data-theme"],
});
