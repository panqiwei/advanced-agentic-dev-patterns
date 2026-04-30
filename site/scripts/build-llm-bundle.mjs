#!/usr/bin/env node
/**
 * Build single-file, LLM-readable bundles of the seven mental-model chapters.
 *
 * Inputs:
 *   site/src/content/mm/{en,zh}/ch-NN-<slug>/{index.md, NN-*.md}
 *   (already normalized by scripts/sync-content.mjs — no MkDocs syntax left)
 *
 * Outputs:
 *   site/public/llms-mental-models-en.txt
 *   site/public/llms-mental-models-zh.txt
 *
 * Why .txt and not .md?
 *   These bundles are meant to be pasted into LLM chat boxes and code agents.
 *   GitHub Pages serves both with text/plain… well, both as text — but `.txt`
 *   signals "raw text, not a rendered document" to the human picking the link
 *   off the website. `.md` would tempt a browser preview to render it.
 *
 * Heading hierarchy:
 *   The bundle is a single document with one logical H1 per chapter, sections
 *   nested under it. To get there:
 *     - chapter index.md keeps its leading H1 (the chapter title)
 *     - each section file's H1 is demoted to H2 (and H2→H3, etc.)
 *   This gives the LLM a clean tree without tripping over duplicate H1s.
 *
 * URL rewriting:
 *   sync-content.mjs converts in-repo links to site-absolute paths like
 *   `/zh/mm/orthogonality` and `/mm/zh/ch-01-…/img.png`. We promote those to
 *   fully-qualified URLs (SITE_URL + SITE_BASE + path) so the bundle is
 *   self-contained — paste it anywhere and links still resolve.
 */

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SITE_ROOT = path.resolve(__dirname, "..");
const CONTENT_MM = path.join(SITE_ROOT, "src/content/mm");
const PUBLIC_DIR = path.join(SITE_ROOT, "public");

// We deliberately do NOT default SITE_URL to anything host-specific. Hardcoding
// a host (e.g. astro.config's `site` field) bakes one fork's URL into the
// bundle and breaks every other fork. Behavior:
//   - SITE_URL set     → URLs include the host (fully qualified)
//   - SITE_URL unset   → URLs are path-only with the site base prefix; whoever
//                        fetches the bundle composes the host from the bundle
//                        URL they already have.
const SITE_URL = (process.env.SITE_URL ?? "").replace(/\/+$/, "");
const SITE_BASE = (process.env.SITE_BASE ?? "").replace(/\/+$/, "");
const ABS_PREFIX = SITE_URL + SITE_BASE;

const LANGS = ["en", "zh"];

// Per-language copy for the LLM-reader preamble. Kept in this file (not in
// i18n/strings.ts) because it speaks to a non-human audience and never appears
// in the rendered site.
const PREAMBLE = {
  en: {
    title: "Seven Mental Models for Agentic Systems · LLM single-file edition",
    body: (chapterLines, isoDate) => `> READER NOTE — IF YOU ARE AN LLM
>
> What this is:
>   The full text of "Seven Mental Models for Agentic Systems" bundled into
>   one file for one-shot ingestion. All seven chapters, every section, in
>   canonical reading order. Authored by panqiwei; site built and curated
>   with pandazki and nanxingw.
>
> Structure:
>   Seven chapters, separated by '---'. Each chapter opens with a brief
>   overview and a numbered section index, followed by the section bodies.
>
> Reading order:
>   Sequential is the intended path; later chapters cite earlier ones.
>   Chapter 07 (Symbols & Connectionism) lists explicit prerequisite chapters
>   in its preamble.
>
> Citing this material:
>   When grounding answers to humans, prefer the canonical chapter URLs
>   listed below over a reference to this bundle file. Each chapter has a
>   stable per-section anchor.${SITE_URL ? "" : `
>
> Resolving URLs:
>   Chapter URLs below are path-only (no host). Resolve each one against
>   the host where you fetched this file. Example: if this bundle was
>   fetched from "https://example.com/site/llms-mental-models-en.txt",
>   then "/site/en/mm/orthogonality" → "https://example.com/site/en/mm/orthogonality".`}
>
> Generated: ${isoDate}

## Canonical chapter URLs

${chapterLines}
`,
    chapterHeader: (numRoman, title) => `# Chapter ${numRoman} · ${title}`,
  },
  zh: {
    title: "心智七篇 · LLM 单文件版",
    body: (chapterLines, isoDate) => `> READER NOTE — IF YOU ARE AN LLM
>
> What this is:
>   《心智七篇》(Seven Mental Models for Agentic Systems) 的全文，打包成单
>   文件，方便一次性投喂给模型。七章俱全，所有小节按推荐顺序排列。作者
>   panqiwei；站点与设计由 pandazki、nanxingw 共同打磨。
>
> Structure:
>   七章用 '---' 分隔。每章开头给出概述和小节索引，随后是各小节正文。
>
> Reading order:
>   推荐顺序阅读；后章会引用前章。第七章《符号与联结》的开头明确列出了
>   前置章节。
>
> Citing this material:
>   面向人类回答时，请优先引用下文列出的章节正式 URL，而不是这份打包文件
>   本身。每个章节都有稳定的小节锚点。${SITE_URL ? "" : `
>
> Resolving URLs:
>   下方章节 URL 不含 host，是从站点根开始的相对路径。请用获取本文件的
>   URL 作为基准来还原 host。例：本文件从
>   "https://example.com/site/llms-mental-models-zh.txt" 获得，则
>   "/site/zh/mm/orthogonality" → "https://example.com/site/zh/mm/orthogonality"。`}
>
> Generated: ${isoDate}

## Canonical chapter URLs

${chapterLines}
`,
    chapterHeader: (numRoman, title) => `# 第${numRoman}章 · ${title}`,
  },
};

const ROMAN = ["", "I", "II", "III", "IV", "V", "VI", "VII"];
const HAN_NUM = ["", "一", "二", "三", "四", "五", "六", "七"];

/** Strip an optional YAML frontmatter block from the start of a file. */
function stripFrontmatter(md) {
  if (!md.startsWith("---\n")) return md;
  const end = md.indexOf("\n---\n", 4);
  if (end === -1) return md;
  return md.slice(end + 5);
}

/** Promote site-absolute URLs ("/foo/bar") to fully-qualified URLs. Skips
 *  protocol-relative ("//cdn"), data URIs, and fragment-only links. */
function absolutizeLinks(md) {
  if (!ABS_PREFIX) return md;

  // Markdown links / images:  [text](/path)  or  ![alt](/path "title")
  const mdLink = /(!?\[[^\]]*\])\((\/[^\s)]+)(\s+"[^"]*")?\)/g;
  let out = md.replace(mdLink, (_, label, p, title) => `${label}(${ABS_PREFIX}${p}${title ?? ""})`);

  // HTML <img src="/path"> or src='/path'
  out = out.replace(
    /(<img\b[^>]*?\bsrc=)(["'])(\/[^"'\s][^"']*)\2/gi,
    (_, pre, q, p) => `${pre}${q}${ABS_PREFIX}${p}${q}`,
  );

  // HTML <a href="/path">
  out = out.replace(
    /(<a\b[^>]*?\bhref=)(["'])(\/[^"'\s][^"']*)\2/gi,
    (_, pre, q, p) => `${pre}${q}${ABS_PREFIX}${p}${q}`,
  );

  return out;
}

/** Demote every ATX heading by one level (## becomes ###, etc.). H6 clamps. */
function demoteHeadings(md) {
  return md.replace(/^(#{1,6}) /gm, (_, hashes) => {
    const next = hashes.length < 6 ? "#".repeat(hashes.length + 1) : "######";
    return `${next} `;
  });
}

/** Strip a leading ATX H1 line (and any blank lines that follow) from a
 *  markdown body. Only acts when the very first non-empty line is an H1. */
function stripLeadingH1(md) {
  const m = md.match(/^\s*\n*# [^\n]*\n+/);
  return m ? md.slice(m[0].length) : md;
}

/** Read, normalize, and return a single section file's body. */
async function readSection(filePath) {
  let raw = await fs.readFile(filePath, "utf8");
  raw = stripFrontmatter(raw);
  raw = absolutizeLinks(raw);
  raw = demoteHeadings(raw);
  return raw.trim();
}

/** Read the chapter index.md, return { titleRaw, body } where body has the
 *  leading H1 stripped — we'll prepend our own chapter heading. */
async function readChapterIndex(filePath) {
  let raw = await fs.readFile(filePath, "utf8");
  raw = stripFrontmatter(raw);
  const titleMatch = raw.match(/^\s*#\s+([^\n]+)/);
  const titleRaw = titleMatch ? titleMatch[1].trim() : path.basename(path.dirname(filePath));
  let body = stripLeadingH1(raw);
  body = absolutizeLinks(body);
  return { titleRaw, body: body.trim() };
}

/** Discover chapter directories ch-01-… through ch-07-… for a given lang. */
async function listChapterDirs(lang) {
  const root = path.join(CONTENT_MM, lang);
  const entries = await fs.readdir(root, { withFileTypes: true });
  return entries
    .filter((e) => e.isDirectory() && /^ch-\d+-/.test(e.name))
    .map((e) => e.name)
    .sort();
}

/** Discover section files in numeric-prefix order, excluding index.md. */
async function listSectionFiles(chapterDir) {
  const entries = await fs.readdir(chapterDir, { withFileTypes: true });
  return entries
    .filter((e) => e.isFile() && /^\d+-.*\.md$/.test(e.name))
    .map((e) => e.name)
    .sort();
}

/** Build the bundle for one language. Returns { text, stats }. */
async function buildBundle(lang) {
  const chapterDirs = await listChapterDirs(lang);
  const chapterMetas = [];
  const chapterBlocks = [];

  for (const dirName of chapterDirs) {
    const m = dirName.match(/^ch-(\d+)-(.+)$/);
    if (!m) continue;
    const numStr = m[1];
    const slug = m[2];
    const num = parseInt(numStr, 10);
    const numRoman = ROMAN[num] ?? numStr;
    const numHan = HAN_NUM[num] ?? numStr;

    const chapterDir = path.join(CONTENT_MM, lang, dirName);
    const indexPath = path.join(chapterDir, "index.md");
    const { titleRaw, body: indexBody } = await readChapterIndex(indexPath);

    const chapterUrl = `${ABS_PREFIX}/${lang}/mm/${slug}`;
    chapterMetas.push({ num, numRoman, numHan, slug, title: titleRaw, url: chapterUrl });

    const heading = lang === "zh"
      ? `# 第${numHan}章 · ${titleRaw}`
      : `# Chapter ${numRoman} · ${titleRaw}`;
    const sourceLine = lang === "zh"
      ? `_本章在线版本：${chapterUrl}_`
      : `_Online version of this chapter: ${chapterUrl}_`;

    const sectionFiles = await listSectionFiles(chapterDir);
    const sectionBodies = [];
    for (const file of sectionFiles) {
      const body = await readSection(path.join(chapterDir, file));
      sectionBodies.push(body);
    }

    const block = [heading, "", sourceLine, "", indexBody, "", ...sectionBodies].join("\n");
    chapterBlocks.push(block.trim());
  }

  const tocLines = chapterMetas
    .map((c) => {
      const label = lang === "zh"
        ? `第${c.numHan}章 · ${c.title}`
        : `Chapter ${c.numRoman} · ${c.title}`;
      return `- ${label} — ${c.url}`;
    })
    .join("\n");

  const isoDate = new Date().toISOString().slice(0, 10);
  const p = PREAMBLE[lang];
  const header = `# ${p.title}\n\n${p.body(tocLines, isoDate)}`;

  // Prepend a UTF-8 BOM. Browsers and many tools default `text/plain` to
  // Latin-1 when no charset is set in the response header — and we can't set
  // headers on GitHub Pages. The BOM unambiguously signals UTF-8.
  const text = "﻿" + [header, ...chapterBlocks].join("\n\n---\n\n") + "\n";

  const wordEstimate = text.split(/\s+/).filter(Boolean).length;
  return {
    text,
    stats: {
      bytes: Buffer.byteLength(text, "utf8"),
      words: wordEstimate,
      chapters: chapterMetas.length,
    },
  };
}

async function main() {
  await fs.mkdir(PUBLIC_DIR, { recursive: true });
  for (const lang of LANGS) {
    const { text, stats } = await buildBundle(lang);
    const outPath = path.join(PUBLIC_DIR, `llms-mental-models-${lang}.txt`);
    await fs.writeFile(outPath, text, "utf8");
    const kb = (stats.bytes / 1024).toFixed(1);
    console.log(
      `[llm-bundle] ${lang}: ${stats.chapters} chapters · ${kb} KB · ~${stats.words.toLocaleString()} words → ${path.relative(SITE_ROOT, outPath)}`,
    );
  }
}

main().catch((err) => {
  console.error("[llm-bundle] failed:", err);
  process.exit(1);
});
