/**
 * Lightweight theme toggle wired to the button in Topbar.astro.
 * Re-initialises on Astro view transitions via the `astro:page-load` event.
 */

function wireThemeToggle() {
  const btn = document.getElementById("theme-toggle");
  if (!btn || btn.dataset.wired === "true") return;
  btn.dataset.wired = "true";
  btn.addEventListener("click", () => {
    const current = document.documentElement.getAttribute("data-theme") ?? "light";
    const next = current === "dark" ? "light" : "dark";
    document.documentElement.setAttribute("data-theme", next);
    try {
      localStorage.setItem("theme", next);
    } catch (_) {}
  });
}

document.addEventListener("astro:page-load", wireThemeToggle);
wireThemeToggle();
