/**
 * Client-side mermaid renderer.
 * Because we tell Shiki to excludeLangs:['mermaid'], fenced ```mermaid blocks
 * come through as <pre><code class="language-mermaid">SRC</code></pre>.
 * We convert each to <pre class="mermaid">SRC</pre> and run mermaid.run().
 * Re-hook on every Astro view-transition navigation.
 */

let mermaidPromise: Promise<typeof import("mermaid").default> | null = null;

async function getMermaid() {
  if (!mermaidPromise) {
    mermaidPromise = import("https://cdn.jsdelivr.net/npm/mermaid@11/dist/mermaid.esm.min.mjs" as string)
      .then((m: any) => {
        const isDark = document.documentElement.getAttribute("data-theme") === "dark";
        m.default.initialize({
          startOnLoad: false,
          theme: isDark ? "dark" : "neutral",
          fontFamily: 'var(--font-mono), "IBM Plex Mono", monospace',
          securityLevel: "strict",
        });
        return m.default;
      });
  }
  return mermaidPromise;
}

async function renderMermaid() {
  // Astro's shiki `excludeLangs: ['mermaid']` marks mermaid fences with
  // `data-language="mermaid"` on the <pre> (no language-* class on <code>).
  const preList = document.querySelectorAll<HTMLElement>(
    'pre[data-language="mermaid"], pre > code.language-mermaid',
  );
  if (preList.length === 0) return;
  const mermaid = await getMermaid();
  for (const node of preList) {
    const pre = node.tagName === "PRE" ? node : node.parentElement!;
    if (!pre || pre.dataset.mermaidProcessed === "true") continue;
    const src = pre.textContent ?? "";
    const wrapper = document.createElement("div");
    wrapper.className = "mermaid-diagram";
    wrapper.textContent = src;
    pre.replaceWith(wrapper);
  }
  try {
    await mermaid.run({ querySelector: ".mermaid-diagram" });
  } catch (err) {
    console.warn("[mermaid] render failed", err);
  }
}

document.addEventListener("astro:page-load", renderMermaid);
renderMermaid();
