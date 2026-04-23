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

const {
  transformAdmonitions,
  transformCards,
  transformLinks,
  transformTabs,
  transformWikiLinks,
} = mod.__TEST_ONLY__;

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
  // Info-cards retired: the data-card image is NO LONGER emitted.
  // The wrapper body unwraps; the card PNG gets re-introduced only as
  // a deliberate 配图 where the illustration bible says it should exist.
  assert.doesNotMatch(out, /!\[A\]\(/, "card image NOT emitted");
  assert.doesNotMatch(out, /x\.png/, "card PNG reference NOT emitted");
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

function testWikiCrossRefsAreRelative() {
  // A concept referencing an entity and a source.
  const input = [
    "See [MCP](../entities/mcp.md) for the tool protocol.",
    "Cited from [Codex harness](../sources/openai-unlocking-codex-harness.md#some-anchor).",
  ].join("\n");
  const out = transformWikiLinks(input, "concepts");
  // Locale-agnostic: emits relative URLs so they resolve under whatever
  // `/en/wiki` or `/zh/wiki` prefix the reader is on.
  assert.match(out, /\[MCP\]\(\.\.\/entities\/mcp\)/, "entity ref → relative, .md stripped");
  assert.match(
    out,
    /\[Codex harness\]\(\.\.\/sources\/openai-unlocking-codex-harness#some-anchor\)/,
    "source ref preserves anchor",
  );
  assert.doesNotMatch(out, /\/zh\/wiki/, "no /zh/ hardcoded in rewritten URL");
  assert.doesNotMatch(out, /\/en\/wiki/, "no /en/ hardcoded either");
}

function testWikiAssetPathsUseKind() {
  const input = '![Overview](assets/overview.png)';
  // When syncing the entities kind, assets resolve under /wiki/entities/.
  const out = transformWikiLinks(input, "entities");
  assert.match(out, /!\[Overview\]\(\/wiki\/entities\/overview\.png\)/, "asset resolved by kind");
  assert.doesNotMatch(out, /UNRESOLVED/, "no UNRESOLVED placeholder left behind");
}

function testWikiIndexFileLinks() {
  // From wiki/index.md: `[foo](concepts/foo.md)` — same-folder-style link.
  const input = "- [Foo Bar](concepts/foo-bar.md)";
  const out = transformWikiLinks(input, "concepts");
  assert.match(out, /\[Foo Bar\]\(\.\.\/concepts\/foo-bar\)/, "index-style link → relative");
}

const tests = [
  testFencedAdmonitionStaysLiteral,
  testNestedAdmonitionsBecomeNested,
  testLinkInInlineCodeNotRewritten,
  testCardAttributesAnyOrder,
  testCardWithoutMmArticleLeftAlone,
  testWikiCrossRefsAreRelative,
  testWikiAssetPathsUseKind,
  testWikiIndexFileLinks,
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
