You are performing a multi-step review, optimization, and content enrichment pipeline on documentation articles. This pipeline catches rules violations, AI writing patterns, and build syntax issues, fixes everything found, then enriches the content with visual assets and readability validation.

## Step 0: Determine Scope

Ask the user which documents to review. Present these options:

1. **Infer from session context** — look at the conversation history, find articles written or edited in this session, and review those
2. **User specifies scope** — the user provides specific file paths, directories, or glob patterns (e.g., `docs/zh/mental-models/ch-02-cybernetics/`)

Wait for the user's answer before proceeding. Do not guess.

## Step 1: Three Parallel Reviews

Launch three review agents **simultaneously in a single message** (this is important for speed — don't run them sequentially):

### Agent A: Rules Review (superpowers:code-reviewer)

Tell the agent to read and enforce:

- `.claude/rules/writing-style.md` — tone, rigor, structure, 道 vs 术 (mental-model docs reveal structure, never prescribe), organic transitions (no mechanical "[上一篇]说X...但Y..." recaps)
- `.claude/rules/claim-verification.md` — claim classification, contested questions, engineering pivot

Check these cross-document concerns:
- **harness** used consistently as the entire feedback control system (controller + observer), never just controller
- OCP terminology consistent
- Cross-references present where needed, links correct
- 延伸阅读 / Further Reading: no duplicate references across articles
- Tail hooks: each article ends with a natural hook to the next
- No prescriptive language in mental-model docs ("你应该...", "最佳实践是...", "best practice is...")

### Agent B: Humanizer (general-purpose agent)

Tell the agent to read the target files and identify AI writing patterns. It should NOT rewrite — only report issues with file, line number, problematic text, pattern name, and suggested fix.

**Language-specific skill**: The agent must invoke the correct humanizer skill based on the document language:

- **Chinese documents** (`docs/zh/`): Use `/humanizer-zh` — tuned for Chinese AI writing patterns and natural Chinese prose
- **English documents** (`docs/en/`): Use `/humanizer` — tuned for English AI writing patterns

If the review scope includes both languages, the agent should run the appropriate skill for each file based on its language. Do not apply the English humanizer to Chinese text or vice versa.

Tell it to also read a ch-01 article (e.g., `01-the-forces.md`) in the same language as a voice reference.

### Agent C: Syntax & Build Review (superpowers:code-reviewer)

Tell the agent to check:
- mkdocs-material syntax: admonitions (`!!!`, `???`, `???+`), tabs (`===`), mermaid code blocks, tables
- Admonition indentation (exactly 4 spaces)
- Table column count consistency
- Internal links point to existing files
- Build passes `uv run mkdocs build --strict -f mkdocs.{lang}.yml`
- CI/CD compatibility (check `.github/workflows/ci.yml` and `deploy-docs.yml`)

Point the agent at `mkdocs.en.yml` and `mkdocs.zh.yml` for config reference.

## Step 2: Consolidate and Present

When all three agents return, consolidate their findings into a single table:

| # | Source | Severity | File:Line | Issue | Suggested Fix |
|---|--------|----------|-----------|-------|---------------|

Group by severity: Critical → Important → Suggestion. Remove duplicates across agents (same issue flagged by both Rules and Humanizer).

Present the table to the user. Ask: "Fix all, or are there items you want to skip?"

## Step 3: Fix

After user confirmation, work through the list:

1. Fix Critical and Important items first
2. Fix Suggestions second
3. For each fix, edit the file directly — no batching across files unless the fixes are trivially related
4. After all fixes, run `uv run mkdocs build --strict` for both en and zh configs to verify nothing broke

Report: "Done. N issues fixed, build passes."

## Step 4: Content Enrichment (ljg- skills)

After fixes are complete, enrich the documentation with visual and analytical assets using available ljg- skills. Run applicable enrichments in parallel where possible.

### 4a: Visual Assets — ljg-card

**Bilingual rule**: Chinese and English infographics are designed independently, not copy-pasted with translated text. English text is 30-50% longer than Chinese — SVG viewBoxes, font sizes, text positions, and element spacing must all adapt. Design each language version from the content outward.

For each chapter in scope, generate two tiers of visual cards:

#### Tier 1: Chapter overview (one per chapter)

`/ljg-card -i` infograph from the chapter's `index.md`. **Inline embed** in `index.md` (placed between intro text and article table) — index pages don't use the toggle.

#### Tier 2: Article-level TL;DR cards (every article)

**Every article gets a card.** The card serves as a TL;DR visual overview for the reader and makes articles easy to share. No selective filtering — generate one for every article in the chapter.

Each card should capture the article's core insight in a visual form that is self-explanatory without reading the full article. Design each card independently based on the article's content structure (not from a template).

#### Generating and placing (both tiers)

After generating, for each PNG:

1. **Replace the ljg-card footer branding.** The generated PNG has a `.colophon` footer with the skill author's personal branding (name + logo). Edit the intermediate HTML file (`/tmp/ljg_cast_*.html`):
   - Replace the `.who` content: remove the `<img>` logo, change `<span>` text to `Generated with ljg-card`
   - Keep `.info-source` as the project name: `Advanced Agentic Dev Patterns`
   - Re-run `capture.js` to generate the updated PNG
   The goal: credit the tool (ljg-card), not the tool author's personal IP. The author is credited in README Acknowledgments instead.
2. **Copy** from `~/Downloads/` to the chapter's assets directory: `docs/{lang}/mental-models/{chapter}/assets/`. Create the `assets/` directory if it doesn't exist.
   **Compress to ≤ 2MB** immediately after copying: `pngquant --quality=65-80 --force --ext .png --skip-if-larger <file>`. If still > 2MB, retry with `--quality=40-60 --speed 1`. This is a hard repo constraint (see AGENTS.md).
3. **Register** the card in the article — the approach depends on the tier:
   - **Tier 1 (index)**: Inline embed with `![Card description](assets/filename.png)`
   - **Tier 2 (articles)**: Use the **图/文 toggle** pattern. Articles use `<div class="mm-article" data-card="assets/filename.png" data-card-alt="description" markdown>` to wrap the article body. The JS component (`article-toggle.js`) adds a toggle button (📖文/🗺️图 in ZH, 📖Text/🗺️Image in EN) that switches between text and card view. **Do NOT inline-embed the card PNG in article text.** The card lives behind the toggle.
   ```markdown
   # Title

   <div class="mm-article" data-card="assets/filename.png" data-card-alt="Description" markdown>

   Article body here...

   </div>

   ---

   ## 延伸阅读
   ...
   ```
4. **Verify** the build still passes with `uv run mkdocs build --strict`

#### Text-mode visual compensation

When a card is behind the toggle, the text-mode view has NO images. For articles with inherently spatial/structural concepts, add **inline visual aids** so the text mode is self-sufficient:

- **Feedback loops, causal diagrams** → mermaid `graph` or `flowchart`
- **Comparisons, mappings, taxonomies** → markdown tables
- **Dual perspectives** → content tabs (`=== "View A"` / `=== "View B"`)
- **Step-by-step processes** → numbered lists or mermaid `sequenceDiagram`

The test: can a reader in text mode fully understand the concept without switching to card mode? If not, the text mode needs a visual aid. These inline aids (mermaid, tables, tabs) coexist with the card — they serve different purposes. The card is a TL;DR overview; the inline aids support specific concepts within the article flow.

#### English card review (mandatory for EN cards)

English infographics break more easily than Chinese ones. English text is 30-50% longer, so SVG viewBoxes, fixed-width containers, and text positions designed for Chinese will clip, overflow, or overlap when filled with English. This happened repeatedly in practice and is the #1 source of visual bugs in the bilingual pipeline.

**After capturing every English PNG, before embedding:**

1. **Open the PNG and visually inspect** (use the Read tool on the PNG file). Check:
   - Is any text truncated or cut off at a container edge? (e.g., "Model cap..." instead of "Model capability")
   - Do any labels overlap each other?
   - Are any SVG elements pushed outside the visible area?
   - Does text wrap awkwardly inside fixed-width boxes?
2. **If any issue is found**, fix the HTML source:
   - Widen SVG viewBox or container
   - Reduce font-size (typically 2-4px smaller than Chinese equivalent)
   - Shorten label text where possible without losing meaning
   - Reposition text elements to avoid overlap
   - Re-capture and re-inspect
3. **Do NOT skip this step.** Do not assume "it worked for Chinese so it works for English." The two languages have fundamentally different text metrics. Every English card must be visually verified independently.

**Why this is a hard step and not a suggestion:** In earlier iterations, all 12 English article infographics shipped with clipped SVG text because the HTML was generated by copying Chinese layouts and swapping text. The fix required a dedicated agent pass across all 12 files. This review step prevents that from happening again.

Do NOT leave PNGs in `~/Downloads/` for the user to manually place — the entire copy + embed + verify cycle is your job.

### 4b: Readability Pressure Test — ljg-plain

Pick 1-2 of the densest articles in scope (the ones with the most technical concepts per paragraph). Run `/ljg-plain` on each.

This is NOT to replace the article — it's a diagnostic. Compare the plain output to the original:

- If the plain version preserves the core argument with minimal information loss → the original is already accessible enough.
- If the plain version drops key ideas or distorts the logic → flag which sections of the original are too dense or jargon-heavy, and suggest targeted simplifications.

Report findings to the user. Do not auto-edit based on this — just flag.

### 4c: Concept Depth Check — ljg-learn (optional, on request)

If the user asks for deeper validation, run `/ljg-learn` on 1-2 core concepts from the chapter (e.g., "requisite variety", "second-order cybernetics"). Compare the 8-dimension anatomy output against what the article covers:

- Dimensions the article already covers well → no action
- Dimensions with unexplored angles that would strengthen the article → suggest as additions

This is advisory only. Present findings, let the user decide.

### 4d: Structure Validation — ljg-rank (optional, on request)

For validating an entire mental-models series (not individual articles), run `/ljg-rank` on the domain (e.g., "agentic system engineering"). Compare its irreducible generators against the chapter topics:

- Generators covered by existing chapters → confirmed
- Generators missing from the series → flag as potential future chapters
- Chapter topics that map to the same generator → flag as potential redundancy

This is a series-level check, not per-article. Only run when the user is evaluating the overall mental-models roadmap.

## Step 5: Cleanup

**CRITICAL: Only clean up artifacts produced by THIS run of the pipeline. Never delete pre-existing files. If in doubt, ask the user.**

After all enrichment steps are done, clean up intermediate artifacts that are NOT part of the project:

1. **List** all artifacts produced during this run:
   - `/tmp/ljg_cast_*.html` — intermediate HTML files from ljg-card
   - `~/Downloads/*.png` — PNG files that have already been copied into `docs/` assets
   - `~/Documents/notes/*__plain.org` — ljg-plain diagnostic outputs
   - `~/Documents/notes/*__concept.org` — ljg-learn outputs (if run)
   - `~/Documents/notes/*__rank.org` — ljg-rank outputs (if run)

2. **Present the list** to the user with exact file paths. Ask: "These are intermediate artifacts from this session. OK to clean up?"

3. **Wait for explicit confirmation** before deleting anything. Do NOT proceed on silence or ambiguity.

4. **Delete only confirmed files**. Use `rm` on individual files, never `rm -rf` on directories. If a directory needs cleaning, list its contents first and get per-file confirmation.

5. **Verify** no project files were touched: run `git status` in the project root and confirm only expected changes are present.

## Step 6: Summary

Report everything done:

```
## Review & Optimization Complete

### Fixes Applied
- N issues fixed (X critical, Y important, Z suggestions)
- Build: ✅ en / ✅ zh

### Visual Assets Generated
- [list of cards with project-internal file paths]

### Readability Assessment
- [article name]: [pass/flag summary]

### Optional Checks Run
- [ljg-learn / ljg-rank results if applicable]

### Cleanup
- [list of deleted intermediate artifacts, or "skipped by user"]
```
