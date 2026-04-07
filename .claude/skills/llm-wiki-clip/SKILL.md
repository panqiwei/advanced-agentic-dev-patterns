---
name: llm-wiki-clip
description: "Use when you have a URL and want to preserve it locally before it disappears or changes. Web content is ephemeral; local markdown is permanent."
argument-hint: <url> [url2] [url3...]
user-invocable: true
---

# LLM Wiki Clip

Clip web URLs to local markdown in `sources/` using defuddle (the Obsidian Web Clipper engine). Three-level fallback chain guarantees content extraction even against bot protection and JS-rendered pages.

## Input

`$ARGUMENTS` — one or more URLs, space-separated.

## Procedure

### 1. Fetch each URL (three-level fallback)

Try in order. Stop at the first level that succeeds.

**Level 1 — defuddle direct fetch**

```bash
npx defuddle parse "URL" --json
```

Returns JSON with `title`, `author`, `published`, `domain`, `contentMarkdown`. If it times out or returns empty content, fall through.

**Level 2 — curl + defuddle on local HTML**

Many sites block defuddle's fetch but accept browser-like requests. Download HTML with a real user-agent, then parse locally:

```bash
curl -sL -o /tmp/{slug}.html \
  -A "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36" \
  "URL"
npx defuddle parse "/tmp/{slug}.html" --json
```

Verify HTTP status and file size (>1KB) before parsing. If curl fails or HTML is too small, fall through.

**Level 3 — Playwright non-headless + anti-detection → defuddle**

For sites with aggressive bot protection (e.g., OpenAI returns 403 to curl). Launch a real Chromium browser with anti-detection flags:

```bash
# Find Playwright module path
PW_PATH=$(find ~/.npm/_npx -path "*/node_modules/playwright/index.js" -maxdepth 5 2>/dev/null | head -1)
PW_DIR=$(dirname $(dirname $(dirname "$PW_PATH")))
```

Then run inline Node.js from that directory:

```javascript
const { chromium } = require('$PW_DIR/node_modules/playwright');
const browser = await chromium.launch({
  headless: false,
  args: ['--disable-blink-features=AutomationControlled', '--no-sandbox']
});
const ctx = await browser.newContext({
  userAgent: 'Mozilla/5.0 ...',
  viewport: { width: 1440, height: 900 },
  locale: 'en-US'
});
await ctx.addInitScript(() => {
  Object.defineProperty(navigator, 'webdriver', { get: () => false });
});
const page = await ctx.newPage();
await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
await page.waitForTimeout(5000);
// Save HTML, then defuddle parse locally
```

Key: `headless: false` + `webdriver: false` + real UA bypasses most bot detection. The browser window opens briefly then closes.

**Level 4 — WebFetch (quality degraded)**

Use Claude Code's built-in WebFetch tool. Prompt: "Return the complete article content as markdown, preserving all headings, code blocks, lists, and structure. Do not summarize."

WebFetch output is AI-processed — lower fidelity than defuddle, but may capture content other methods can't.

**All four fail** — report the error, skip the URL, continue with remaining URLs.

### 2. Assemble markdown with frontmatter

```markdown
---
title: {title}
author: {author}
published: {published}
domain: {domain}
url: {original URL}
clipped: {today YYYY-MM-DD}
---

{contentMarkdown}
```

**Complete missing metadata** — defuddle often returns empty fields when HTML lacks meta tags:

- `title`: extract from first `#` heading in content; failing that, derive from URL path
- `author`: derive organization name from domain (`anthropic.com` → `Anthropic`)
- `published`: scan content for dates; if none found, use `—`
- `domain`: parse from URL

### 3. Route to correct directory

| Domain pattern | Directory | Filename example |
|---|---|---|
| `anthropic.com`, `transformer-circuits.pub`, `claude.com`, `platform.claude.com` | `sources/anthropic_official/` | `building-effective-agents.md` |
| `openai.com` | `sources/openai_official/` | `harness-engineering.md` |
| `arxiv.org` | `sources/arxiv_papers/` | `2310.04444-control-theory-llm-prompting.md` |
| Everything else | `sources/` (flat) | `george-zhang-harness-engineering-cybernetics.md` |

Use kebab-case slugs. Prefix arxiv filenames with the paper ID. If the file already exists, ask the user before overwriting.

### 4. Handle images (optional)

If markdown contains image links `![alt](url)`, ask whether to download them:

- Yes: curl each image to `sources/assets/`, replace remote URLs with relative paths `assets/filename.jpg`
- No: keep remote URLs as-is

### 5. Update INTERNAL_REFERENCES.md

- If the URL already has an entry, update its `Local` field to the new file path.
- If not, add an entry under the appropriate category with all fields filled, `Status` set to `pending`.

### 6. Self-review — clip 质量验证

每篇 clip 完成后，立即做一轮质量自检。一次爬取终生受益，不要吝啬多跑一层 fallback 来确保质量。

**自检项**（任一不通过则触发 re-clip）：

| 检查 | 不通过的信号 | 原因 |
|---|---|---|
| **内容长度** | markdown <2KB 且原文是长文/论文 | 大概率被截断或拿到了摘要而非正文 |
| **语言匹配** | 原文是中文但 clip 出来是英文（或反过来） | 站点根据请求 locale 返回了非预期语言版本 |
| **内容完整性** | 正文在明显的中间位置断开（句子未结束、段落未完成） | 渲染超时或 JS 未完全加载 |
| **非内容页** | markdown 主要是导航栏、菜单、footer 而非文章正文 | defuddle 提取主体失败，拿到了页面 chrome |
| **登录墙/付费墙** | 内容包含 "sign in"、"subscribe"、"login to continue" 等提示 | 需要认证才能看到完整内容 |

**Re-clip 策略**：如果自检不通过，用当前 level 的下一级 fallback 重新 clip 同一个 URL。比如 Level 2 的结果质量不行，自动升级到 Level 3（Playwright）重试。如果最高级 fallback 的结果仍然不通过，保留最佳结果并在报告中标记质量警告。

**语言问题的特殊处理**：如果检测到语言不匹配，在 Playwright（Level 3）重试时设置 `locale` 参数匹配期望语言（如 `locale: 'zh-CN'` 或 `locale: 'en-US'`）。

### 7. Report results

For each URL, output:
- File path and size
- Title and author extracted
- Which fallback level succeeded (Level 1 / 2 / 3 / 4)
- Self-review result: PASS or WARNING (with reason)
- Whether INTERNAL_REFERENCES.md was updated
- Suggest: run `/llm-wiki-ingest {path}` to digest into the wiki

## Dependencies

- `npx defuddle` (auto-resolved via npx, no global install needed)
- `curl` (system)

## Constraints

- Only write to `sources/` and `INTERNAL_REFERENCES.md`. Never touch `wikis/` or `docs/`.
- Temporary HTML files go in `/tmp/`. Clean up after clip completes.
- Don't skip clip and feed URLs directly to ingest — local copies are higher quality and won't break when the URL dies.
- Clip and ingest are separate operations. After clipping, suggest `/llm-wiki-ingest` as the natural next step.
