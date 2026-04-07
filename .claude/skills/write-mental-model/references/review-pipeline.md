# Review & Optimization Pipeline

This is the inlined review pipeline. The authoritative version lives at `.claude/commands/review-and-optimize-doc.md` — if that file exists, invoke it instead of following this document. This version serves as a fallback and reference.

---

## Step 1: Three Parallel Reviews

Launch all three simultaneously in a single message (speed matters — don't serialize).

### Agent A: Rules Review (superpowers:code-reviewer)

Tell the agent to read and enforce:

- `.claude/rules/writing-style.md` — tone, rigor, structure, 道 vs 術, organic transitions
- `.claude/rules/claim-verification.md` — claim classification, contested questions, engineering pivot

Cross-document concerns to check:
- **Harness** used consistently as entire feedback control system (controller + observer), never just controller
- OCP terminology consistent
- Cross-references present where needed, links correct
- 延伸阅读 / Further Reading: no duplicate references across articles
- Tail hooks: each article ends with natural hook to next
- No prescriptive language in mental-model docs ("你应该...", "最佳实践是...", "best practice is...")

### Agent B: Humanizer (general-purpose agent)

Scan for AI writing patterns. Report only — do not rewrite. For each finding: file, line number, problematic text, pattern name, suggested fix.

Patterns to scan:
- Repetitive sentence structures or formulaic templates
- "这不是X——它是Y" / "This is not X — it is Y" denial-assertion pairs
- Rule-of-three abuse / identical parallel structures
- One-sentence dramatic paragraphs as reveals
- Meta-signposting ("让我们来看...", "Let's explore...")
- Mirror-structure paragraph pairs
- Persuasive authority tropes ("核心在于...", "At its core...")
- Generic positive conclusions ("答案藏在...", "The future looks bright")
- Soulless neutral reporting without personality

Tell the humanizer to also read a ch-01 article in the same language as a voice reference.

### Agent C: Syntax & Build Review (superpowers:code-reviewer)

Check:
- mkdocs-material syntax: admonitions (`!!!`, `???`, `???+`), tabs (`===`), mermaid code blocks, tables
- Admonition indentation (exactly 4 spaces)
- Table column count consistency
- Internal links point to existing files
- Build passes: `uv run mkdocs build --strict -f mkdocs.{lang}.yml`
- CI/CD compatibility: check `.github/workflows/ci.yml` and `deploy-docs.yml`

Point the agent at `mkdocs.en.yml` and `mkdocs.zh.yml` for config reference.

## Step 2: Consolidate

Merge findings into a single table:

| # | Source | Severity | File:Line | Issue | Suggested Fix |
|---|--------|----------|-----------|-------|---------------|

Group by severity: Critical > Important > Suggestion. Remove duplicates across agents.

Present to user. Ask: "Fix all, or skip some?"

## Step 3: Fix

After user confirmation:

1. Fix Critical and Important items first
2. Fix Suggestions second
3. Edit files directly — no batching unless fixes are trivially related
4. Rebuild both languages:
   ```bash
   uv run mkdocs build --strict -f mkdocs.zh.yml
   uv run mkdocs build --strict -f mkdocs.en.yml
   ```

Report: "Done. N issues fixed, build passes."

## Step 4: Visual Enrichment

### ljg-card infographics

**Bilingual rule**: Chinese and English infographics are designed independently. English text is 30-50% longer — SVG viewBoxes, font sizes, text positions, element spacing must all adapt. Design each language version from the content outward.

#### Tier 1: Chapter overview (one per chapter)

`/ljg-card -i` from the chapter's `index.md`. **Inline embed** in `index.md` between intro text and article table (index pages don't use the toggle).

#### Tier 2: Concept-level visuals (selective, per article)

Generate only when the concept is inherently spatial, structural, or layered:

| Signal | Generate? |
|--------|-----------|
| Concept has a shape (loop, hierarchy, nested layers) | Yes |
| Concept is a dense comparison/mapping table | Maybe |
| Concept is narrative/argumentative (no spatial structure) | No |
| Article already has mermaid diagram covering the concept | No |

Present shortlist to user: "These articles would benefit from concept visuals: [list]. Generate all, or select?"

#### Generating and embedding

For each PNG generated:

1. **Replace footer branding**: Edit the intermediate HTML file (`/tmp/ljg_cast_*.html`):
   - Replace `.who` content: remove `<img>` logo, change `<span>` text to `Generated with ljg-card`
   - Keep `.info-source` as the project name: `Advanced Agentic Dev Patterns`
   - Re-run `capture.js` to generate updated PNG

2. **Copy** from `~/Downloads/` to `docs/{lang}/mental-models/{chapter}/assets/`

3. **Register** the card — approach depends on tier:
   - **Tier 1 (index)**: Inline embed `![Card description](assets/filename.png)`
   - **Tier 2 (articles)**: Use the 图/文 toggle pattern. Articles wrap body in `<div class="mm-article" data-card="assets/filename.png" data-card-alt="description" markdown>`. The JS component (`article-toggle.js`) adds a toggle button. **Do NOT inline-embed card PNGs in article text.**

4. **Text-mode visual compensation**: When card is behind toggle, text mode has no images. For concepts that are inherently spatial/structural, add inline visual aids:
   - Feedback loops, causal diagrams → mermaid `graph`
   - Comparisons, mappings → markdown tables
   - Dual perspectives → content tabs (`=== "View A"`)
   - The test: can a text-mode reader fully understand the concept without switching to card mode?

5. **Verify** build passes

#### English card review (mandatory)

After capturing every English PNG, before embedding:

1. Open the PNG and visually inspect (Read the PNG file). Check:
   - Text truncation at container edges
   - Label overlap
   - SVG elements pushed outside visible area
   - Awkward text wrapping in fixed-width boxes

2. If any issue found, fix the HTML:
   - Widen SVG viewBox or container
   - Reduce font-size (typically 2-4px smaller than Chinese)
   - Shorten label text without losing meaning
   - Reposition text elements
   - Re-capture and re-inspect

3. Do NOT skip this step. Every English card must be visually verified independently.

**Why this is mandatory**: In ch-02, all 12 English infographics shipped with clipped SVG text because HTML was generated by copying Chinese layouts and swapping text. The fix required a dedicated agent pass across all 12 files.

### ljg-plain readability diagnostic

Pick 1-2 densest articles (most technical concepts per paragraph). Run `/ljg-plain` on each.

Compare plain output to original:
- Plain version preserves core argument → original is accessible enough
- Plain version drops key ideas → flag dense sections, suggest simplifications

Report findings. Do not auto-edit.

### ljg-learn / ljg-rank (optional, on request)

- **ljg-learn**: Run on 1-2 core concepts. Compare 8-dimension anatomy to article coverage. Advisory only.
- **ljg-rank**: Run on the domain to validate series-level structure. Generators vs chapter topics. Series-level check only.
