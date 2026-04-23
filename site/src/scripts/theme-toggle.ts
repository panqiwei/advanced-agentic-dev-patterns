/**
 * Theme manager.
 *
 * Two jobs:
 *   1. Keep `<html data-theme>` in sync with the user's choice (localStorage)
 *      or OS preference, surviving ClientRouter view-transitions.
 *   2. Wire the topbar toggle button that persists the choice.
 *
 * Why this file exists on TOP of the inline head-script in Hall.astro:
 *   - The inline script (marked `is:inline`) runs on initial full-page load
 *     and sets the theme BEFORE first paint — no flash.
 *   - But Astro's ClientRouter swaps the root <html> attributes on
 *     client-side navigation, re-pulling the template's hardcoded
 *     `data-theme="light"` from the fetched page.  That's why a user who
 *     toggled dark mode sees the theme reset when they click a nav link.
 *   - `astro:after-swap` fires after DOM swap but BEFORE paint, giving us a
 *     flash-free window to reapply the saved theme.
 */

function applyTheme() {
  try {
    const saved = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const theme = saved || (prefersDark ? "dark" : "light");
    document.documentElement.setAttribute("data-theme", theme);
  } catch (_) {
    // localStorage can throw in private mode / sandboxed iframes — ignore.
  }
}

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

// Run immediately (first module evaluation).
applyTheme();
wireThemeToggle();

// Re-apply on every client-side navigation, before paint.
document.addEventListener("astro:after-swap", applyTheme);
// Re-wire on every navigation (the button is a fresh DOM node after swap).
document.addEventListener("astro:page-load", wireThemeToggle);
