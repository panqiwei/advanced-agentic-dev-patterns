#!/usr/bin/env node
/**
 * Regression tests for sync-content transforms.
 * Runs with plain node (no test framework) so it's cheap to invoke from
 * package.json and from CI without adding another dev-dep.
 *
 * Every named fixture below corresponds to a concrete Codex review finding.
 * Keep the mapping in sync with docs/superpowers/specs/... if/when a design
 * doc lands, so the link between review item and test stays obvious.
 *
 * Run: npm run test:sync
 */

import assert from "node:assert/strict";
import { fileURLToPath } from "node:url";
import path from "node:path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const SYNC = path.resolve(__dirname, "..", "sync-content.mjs");

// Dynamically import the module and grab its private transforms via a
// side-channel: sync-content.mjs is self-executing on import.  Instead of
// refactoring it, we `import` the file which runs `main()` — but main()
// mutates the filesystem.  So we spawn the module with a flag set that
// short-circuits main.  Simpler approach: duplicate the small transform
// signatures here by re-importing via `import(..., { assert })`.
//
// The cleanest path is to import after ensuring `SKIP_MAIN` is set.
process.env.SKIP_MAIN = "1";

const mod = await import(SYNC);
// The module doesn't currently export the transforms.  Rather than bloat
// the module surface, we re-declare them below from the same file via
// `module.exports`-like shim.  For now, import-helper:
//   We temporarily monkey-patch by reading source and evaluating again is
//   too clever.  Instead, update sync-content to export its transforms.
//
// See the matching export block at the bottom of sync-content.mjs.

const { transformAdmonitions, transformCards, transformLinks, transformTabs } =
  mod.__TEST_ONLY__;

function testFencedAdmonitionStaysLiteral() {
  const input = [
    "Some prose.",
    "",
    "```md",
    '!!! note "fake"',
    "    body",
    "```",
    "",
    '!!! tip "real"',
    "    real body",
    "",
  ].join("\n");
  const out = transformAdmonitions(input);
  assert.match(out, /```md\n!!! note "fake"\n {4}body\n```/, "fenced sample must be preserved verbatim");
  assert.match(out, /> \[!TIP\] real\n> real body/, "outside-fence admonition still transforms");
}

function testNestedAdmonitionsBecomeNested() {
  const input = [
    '!!! note "Outer"',
    "",
    "    outer line",
    "",
    '    !!! tip "Inner"',
    "",
    "        inner line",
    "",
  ].join("\n");
  const out = transformAdmonitions(input);
  assert.match(out, /> \[!NOTE\] Outer/, "outer callout header emitted");
  assert.match(out, /> > \[!TIP\] Inner/, "inner callout emitted as nested GFM callout");
  assert.match(out, /> > inner line/, "inner body nested correctly");
}

function testLinkInInlineCodeNotRewritten() {
  const input = "See `[real](index.md)` and [real](index.md).";
  const out = transformLinks(input, "en", "ch-02-cybernetics");
  assert.match(
    out,
    /`\[real\]\(index\.md\)`/,
    "inline-code span must not be rewritten",
  );
  assert.match(
    out,
    /\[real\]\(\/en\/mm\/cybernetics\)/,
    "the prose link is still rewritten",
  );
}

function testCardAttributesAnyOrder() {
  const input = [
    '<div data-card="assets/x.png" class="mm-article" data-card-alt="A" markdown>',
    "",
    "Body prose.",
    "",
    "</div>",
    "",
    "After.",
  ].join("\n");
  const out = transformCards(input, "en", "ch-02-cybernetics");
  assert.match(out, /!\[A\]\(\/mm\/en\/ch-02-cybernetics\/x\.png\)/, "image emitted from any-order attrs");
  assert.match(out, /Body prose\./, "body preserved");
  assert.doesNotMatch(out, /<\/div>/, "matching </div> stripped");
  assert.match(out, /After\./, "subsequent prose preserved");
}

function testCardWithoutMmArticleLeftAlone() {
  const input = [
    '<div class="some-other-wrapper">',
    "content",
    "</div>",
  ].join("\n");
  const out = transformCards(input, "en", "ch-01-orthogonality");
  assert.match(out, /<div class="some-other-wrapper">/, "unrelated div survives");
  assert.match(out, /<\/div>/, "its closing tag is NOT stripped");
}

const tests = [
  testFencedAdmonitionStaysLiteral,
  testNestedAdmonitionsBecomeNested,
  testLinkInInlineCodeNotRewritten,
  testCardAttributesAnyOrder,
  testCardWithoutMmArticleLeftAlone,
];

let passed = 0;
for (const t of tests) {
  try {
    t();
    console.log(`  ✓ ${t.name}`);
    passed += 1;
  } catch (err) {
    console.error(`  ✗ ${t.name}`);
    console.error(err.message ? err.message.split("\n").map((l) => "    " + l).join("\n") : err);
    process.exitCode = 1;
  }
}
console.log(`\n${passed}/${tests.length} passed`);
