# Developer Setup Guide

New machine? New contributor? Everything you need to go from `git clone` to a working development environment.

## System Prerequisites

### Required

| Tool | Min Version | Purpose | Install |
|------|-------------|---------|---------|
| **Python** | 3.12 | Runtime (`.python-version` enforces this) | `brew install python@3.12` or [python.org](https://www.python.org/) |
| **uv** | 0.8+ | Python dependency management | `brew install uv` or `curl -LsSf https://astral.sh/uv/install.sh \| sh` |
| **Node.js** | 22+ | defuddle, Playwright (LLM Wiki clip pipeline) | `brew install node` or [nodejs.org](https://nodejs.org/) |
| **Git** | 2.40+ | Version control | `brew install git` |

### Required by LLM Wiki Skills

| Tool | Purpose | Install | Verify |
|------|---------|---------|--------|
| **defuddle** | Web → markdown (Obsidian Web Clipper engine) | Auto-resolved via `npx` | `npx defuddle --version` |
| **Playwright + Chromium** | Real browser rendering for clip fallback | `npx playwright install chromium` (~200MB one-time) | `npx playwright --version` |
| **curl** | HTTP fetch with custom user-agent | Ships with macOS | `curl --version` |

### Optional

| Tool | Purpose | When you need it |
|------|---------|-----------------|
| **Homebrew** | macOS package manager | For installing everything else |
| **Obsidian** | Browse `wikis/` with graph view | Wiki exploration, not required for dev |
| **Obsidian Web Clipper** | Browser extension for manual web → markdown | When all automated clip levels fail (rare) |

## Project Setup

```bash
git clone https://github.com/panqiwei/advanced-agentic-dev-patterns.git
cd advanced-agentic-dev-patterns

# Python dependencies (all extras: docs + test + lint)
uv sync --extra dev

# Playwright browser (for clip Level 3)
npx playwright install chromium
```

### Verify

```bash
uv run ruff check .                              # Lint passes
uv run pytest -v -m "not requires_api_key"       # Tests pass (no API key needed)
uv run mkdocs build --strict -f mkdocs.en.yml    # Docs build passes
npx defuddle --version                           # Clip tool available
```

## Common Commands

### Testing

```bash
uv run pytest -v                                 # All tests
uv run pytest -v -m "not requires_api_key"       # Skip API-dependent tests
uv run pytest scripts/tests/ -v                  # Build script tests only
uv run pytest patterns/tools/ -v                 # Tests for a specific topic
```

Test markers:
- `requires_api_key` — test needs an API key (e.g. `ANTHROPIC_API_KEY`) to run

### Linting & Formatting

```bash
uv run ruff check .          # Lint
uv run ruff format .         # Format
uv run ruff check --fix .    # Lint with auto-fix
```

### Documentation

```bash
uv run python -m scripts.build_docs              # Copy pattern docs by language
uv run mkdocs serve -f mkdocs.en.yml             # Local preview at localhost:8000
uv run mkdocs build --strict -f mkdocs.en.yml    # Build English (strict)
uv run mkdocs build --strict -f mkdocs.zh.yml    # Build Chinese (strict)
```

## Environment Variables

| Variable | Required | Purpose |
|----------|----------|---------|
| `ANTHROPIC_API_KEY` | For API tests only | Tests marked `@pytest.mark.requires_api_key` |

No other API keys needed. The LLM Wiki pipeline runs entirely locally.

## Claude Code Setup

### Plugins

Install from the Claude Code plugin marketplace:

| Plugin | Purpose |
|--------|---------|
| [**superpowers**](https://github.com/obra/superpowers) by Jesse Vincent | Development workflow methodology |
| [**ljg-skills**](https://github.com/lijigang/ljg-skills) by 李继刚 | Content enhancement and visualization |

#### superpowers skills used

| Skill | Where used |
|-------|-----------|
| `brainstorming` | Spec design before implementation |
| `writing-plans` | Implementation plan creation |
| `subagent-driven-development` | Task-per-subagent execution with review |
| `executing-plans` | Inline plan execution |
| `requesting-code-review` | Two-stage review (spec compliance + quality) |
| `verification-before-completion` | Evidence-based completion claims |
| `test-driven-development` | TDD for code tasks |
| `systematic-debugging` | Structured bug investigation |

#### ljg-skills used in wiki pipeline

| Skill | Where used | What it does |
|-------|-----------|-------------|
| `ljg-paper` | `/llm-wiki-ingest` (arXiv papers) | Feynman-style 8-step paper analysis |
| `ljg-learn` | `/llm-wiki-ingest` (concept deepening) | 8-dimension concept anatomy |
| `ljg-plain` | `/llm-wiki-lint` (readability check) | 9 red-line readability test |
| `ljg-rank` | `/llm-wiki-lint` (structural analysis) | Irreducible generator decomposition |
| `ljg-roundtable` | `/llm-wiki-query` (contested topics) | Multi-perspective dialectical debate |
| `ljg-card` | `/llm-wiki-ingest`, `/llm-wiki-query` | Visual infograph card generation |

### Project Skills

Auto-discovered from `.claude/skills/` when working in this repo:

| Command | Purpose |
|---------|---------|
| `/llm-wiki` | Orchestrator — routes natural language to sub-skills |
| `/llm-wiki-clip` | Web URL → local markdown in `sources/` |
| `/llm-wiki-ingest` | Source → wiki pages in `wikis/` |
| `/llm-wiki-lint` | Wiki health check |
| `/llm-wiki-query` | Answer questions from wiki content |

### MCP Servers (optional)

| Server | Purpose | When needed |
|--------|---------|-------------|
| **computer-use** | Desktop automation | Only if clip Level 1-3 all fail (very rare) |

## Git Strategy — What's Tracked vs Local

| Directory | Tracked | Why |
|-----------|---------|-----|
| `docs/` | Yes | Published documentation |
| `patterns/` | Yes | Pattern docs, examples, tests (source of truth) |
| `wikis/` | Yes | LLM-maintained knowledge base (accumulating asset) |
| `.claude/skills/` | Yes | Project-level Claude Code skills |
| `/sources/` | No | Raw source materials (may contain copyrighted content) |
| `superpowers/` | No | Specs, plans, drafts (working documents) |
| `INTERNAL_REFERENCES.md` | No | Source registry with local paths and internal references |
| `docs/{en,zh}/patterns/` | No | Generated by `scripts/build_docs.py` |
| `_site/` | No | MkDocs build output |

## LLM Wiki Clip Pipeline

The `/llm-wiki-clip` skill uses a 4-level fallback chain:

```
Level 1: npx defuddle parse URL --json            fastest, works for most sites
   ↓ timeout / bot protection
Level 2: curl + UA → defuddle on local HTML        bypasses simple bot checks
   ↓ 403 / JS-rendered
Level 3: Playwright non-headless + anti-detect      real browser, defeats aggressive protection
   ↓ very rare failures
Level 4: WebFetch                                   AI-processed, quality degraded
```

After each clip, a self-review checks content quality (length, language, completeness). Failures auto-retry at the next level.

## ljg-skills Product Handling

ljg-skills produce outputs to their own locations. Wiki skills harvest them into the project:

| Output | Default location | Moved to |
|--------|-----------------|----------|
| org-mode files | `~/Documents/notes/*.org` | Content extracted into `wikis/`, original deleted |
| PNG cards | `~/Downloads/*.png` | Copied to `wikis/*/assets/`, original deleted |

## Troubleshooting

**`npx defuddle` hangs** — First run downloads the package (~2MB). Check: `npm ping`

**Playwright browser not found** — Run: `npx playwright install chromium`

**Playwright clip returns wrong language** — The clip skill's self-review detects this and retries with correct `locale`.

**OpenAI URLs return 403** — Level 3 handles this. If it still fails after Playwright update, the site added new bot detection.

**uv sync fails** — Ensure Python 3.12 is available: `python3.12 --version`. Check `.python-version`.

**MkDocs build fails with strict** — Usually a broken internal link. Check the error output for the specific file and link.
