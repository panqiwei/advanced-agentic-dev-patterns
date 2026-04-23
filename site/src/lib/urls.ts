/**
 * Single source of truth for every internal href on the site.
 *
 * All callers (Astro pages, components, sync-content.mjs, Pagefind data-attrs)
 * should go through one of these helpers so that:
 *   1. Enabling/changing Astro `base` touches only this file.
 *   2. Trailing-slash policy stays consistent with astro.config.trailingSlash.
 *   3. We never concatenate `/${locale}/…` strings in three different places.
 *
 * Why a helper instead of `import.meta.env.BASE_URL` inline everywhere?
 *   - BASE_URL contains a trailing slash in Astro.  Raw concatenation like
 *     `${BASE_URL}/en` produces `//en`.
 *   - sync-content.mjs runs OUTSIDE Vite (no import.meta.env available). It
 *     reads `SITE_BASE` from process.env; the value MUST match Astro's
 *     `base` setting.  Keep them in lockstep by reading from here.
 */

import type { Locale } from "~/i18n/strings";

function stripTrailingSlash(s: string): string {
  return s.endsWith("/") ? s.slice(0, -1) : s;
}

/** Astro's configured base path, never trailing-slashed.  Empty string when base is '/'. */
export const BASE: string = stripTrailingSlash(import.meta.env.BASE_URL ?? "/");

/** Compose a site-absolute URL that respects base. */
export function url(path: string): string {
  const p = path.startsWith("/") ? path : `/${path}`;
  return `${BASE}${p}`;
}

/** Localized routes. */
export function home(locale: Locale): string {
  return url(`/${locale}`);
}
export function mmIndex(locale: Locale): string {
  return url(`/${locale}/mm`);
}
export function chapter(locale: Locale, slug: string): string {
  return url(`/${locale}/mm/${slug}`);
}
export function lab(locale: Locale): string {
  return url(`/${locale}/lab`);
}
export function wiki(locale: Locale): string {
  return url(`/${locale}/wiki`);
}

/** Swap the locale segment of a path without touching the rest. */
export function altPath(pathname: string, from: Locale, to: Locale): string {
  // Peel off BASE first so swaps happen on the logical path.
  const withoutBase = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) : pathname;
  const fromPrefix = `/${from}`;
  let logical: string;
  if (withoutBase.startsWith(fromPrefix + "/")) {
    logical = `/${to}` + withoutBase.slice(fromPrefix.length);
  } else if (withoutBase === fromPrefix) {
    logical = `/${to}`;
  } else {
    logical = `/${to}${withoutBase.startsWith("/") ? withoutBase : "/" + withoutBase}`;
  }
  return url(logical);
}
