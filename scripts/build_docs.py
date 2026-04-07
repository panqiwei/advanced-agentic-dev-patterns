"""Copy pattern docs and wiki pages into the MkDocs source tree.

- Pattern docs: patterns/*/docs/ → docs/{lang}/patterns/ (by language suffix)
- Wiki pages:   wikis/           → docs/zh/wiki/         (Chinese-only knowledge base)

Usage:
    python -m scripts.build_docs [--project-root PATH]
"""

import argparse
import html
import re
import shutil
from pathlib import Path

# Known language suffixes. Files without a known suffix are treated as English.
KNOWN_LANGS = {"zh", "ja", "ko"}


def get_lang_from_suffix(filename: str) -> str | None:
    """Determine language from file suffix convention.

    Returns:
        "en" for plain .md files (no lang suffix).
        The lang code for .{lang}.md files (e.g., "zh" for overview.zh.md).
        None for non-.md files (e.g., .gitkeep, .png).
    """
    if not filename.endswith(".md"):
        return None

    stem = filename.removesuffix(".md")
    parts = stem.rsplit(".", 1)
    if len(parts) == 2 and parts[1] in KNOWN_LANGS:
        return parts[1]

    return "en"


def copy_pattern_docs(project_root: Path, docs_dir: Path) -> None:
    """Copy pattern docs to language-specific docs directories.

    Scans patterns/{topic}/{category}/docs/ for .md files, determines language
    from suffix, and copies to docs/{lang}/patterns/{topic}/{category}/{filename}.

    The lang suffix is stripped from the destination filename:
    overview.zh.md -> docs/zh/patterns/.../overview.md
    """
    patterns_dir = project_root / "patterns"
    if not patterns_dir.exists():
        return

    for lang in ["en", *KNOWN_LANGS]:
        dest = docs_dir / lang / "patterns"
        if dest.exists():
            shutil.rmtree(dest)

    for topic_dir in sorted(patterns_dir.iterdir()):
        if not topic_dir.is_dir():
            continue
        for category_dir in sorted(topic_dir.iterdir()):
            if not category_dir.is_dir():
                continue
            docs_src = category_dir / "docs"
            if not docs_src.exists():
                continue

            for md_file in sorted(docs_src.iterdir()):
                if not md_file.is_file():
                    continue

                lang = get_lang_from_suffix(md_file.name)
                if lang is None:
                    continue

                if lang != "en":
                    dest_name = md_file.name.removesuffix(f".{lang}.md") + ".md"
                else:
                    dest_name = md_file.name

                dest_dir = docs_dir / lang / "patterns" / topic_dir.name / category_dir.name
                dest_dir.mkdir(parents=True, exist_ok=True)
                shutil.copy2(md_file, dest_dir / dest_name)


# Subdirectories of wikis/ to include in the docs site, in display order.
_WIKI_SECTIONS = ["concepts", "entities", "sources"]

# Section titles for .pages navigation files.
_WIKI_SECTION_TITLES: dict[str, str] = {
    "concepts": "概念",
    "entities": "实体",
    "sources": "来源",
}

# Sections visible in sidebar navigation (sources hidden but still accessible).
_NAV_SECTIONS = ["concepts", "entities"]


def _wrap_concept_with_card_tabs(md_path: Path, assets_dir: Path) -> None:
    """Wrap a concept page with image/text tabs if a matching card PNG exists.

    If wikis/concepts/assets/{slug}.png exists, the page content is wrapped in
    MkDocs Material content tabs with the image tab first (default visible).
    If no PNG exists, the page is left untouched.
    """
    slug = md_path.stem
    png_name = f"{slug}.png"
    png_src = assets_dir / png_name

    if not png_src.exists():
        return

    content = md_path.read_text(encoding="utf-8")

    # Extract title line (first # heading) to keep it above tabs
    lines = content.split("\n")
    title_line = ""
    body_start = 0
    for i, line in enumerate(lines):
        if line.startswith("# "):
            title_line = line
            body_start = i + 1
            break

    body = "\n".join(lines[body_start:])

    # Indent body for tab content (4 spaces)
    # Always indent — even blank lines need 4 spaces to stay inside the tab block
    indented_body = "\n".join(f"    {line}" for line in body.split("\n"))

    wrapped = f"""{title_line}

=== "图"

    ![{slug}](assets/{png_name}){{ loading=lazy width="100%" }}

=== "文"

{indented_body}
"""
    md_path.write_text(wrapped, encoding="utf-8")


def _parse_index_descriptions(wikis_dir: Path) -> dict[str, str]:
    """Parse slug → description from wikis/index.md."""
    index_path = wikis_dir / "index.md"
    if not index_path.exists():
        return {}

    descriptions: dict[str, str] = {}
    for line in index_path.read_text(encoding="utf-8").split("\n"):
        m = re.match(r"- \[[^\]]+\]\(([^)]+)\)\s*—\s*(.+)", line)
        if m:
            slug = Path(m.group(1)).stem
            descriptions[slug] = m.group(2).strip()
    return descriptions


def _extract_title(md_path: Path) -> str:
    """Extract the first H1 title from a markdown file."""
    for line in md_path.read_text(encoding="utf-8").split("\n"):
        if line.startswith("# "):
            return line[2:].strip()
    return md_path.stem.replace("-", " ").title()


def _generate_gallery_index(wikis_dir: Path, dest_root: Path) -> None:
    """Generate a gallery-style wiki/index.md with card HTML and metadata."""
    descriptions = _parse_index_descriptions(wikis_dir)

    # Collect card data from concepts and entities
    cards: list[dict[str, str]] = []
    for section in ["concepts", "entities"]:
        section_dir = wikis_dir / section
        if not section_dir.is_dir():
            continue
        assets_dir = section_dir / "assets"
        for md_file in sorted(section_dir.glob("*.md")):
            slug = md_file.stem
            title = _extract_title(md_file)
            desc = descriptions.get(slug, "")
            mtime = str(int(md_file.stat().st_mtime))
            href = f"{section}/{slug}/"
            # Check for card PNG background
            card_img = ""
            if assets_dir.is_dir() and (assets_dir / f"{slug}.png").exists():
                card_img = f"{section}/assets/{slug}.png"
            cards.append(
                {
                    "slug": slug,
                    "section": section,
                    "title": title,
                    "desc": desc,
                    "mtime": mtime,
                    "href": href,
                    "card_img": card_img,
                }
            )

    badge_map = {"concepts": "概念", "entities": "实体"}

    # Build card HTML
    # Note: card-back divs and wg-flippable class are NOT in the static HTML
    # because MkDocs' Python-Markdown parser strips nested divs unpredictably.
    # Instead, the image URL is stored as data-card-img and JS creates the
    # back div + adds wg-flippable at runtime (see wiki-gallery.js).
    card_html_parts: list[str] = []
    for c in cards:
        esc_title = html.escape(c["title"])
        esc_desc = html.escape(c["desc"])
        badge = badge_map.get(c["section"], c["section"])
        img_attr = ""
        if c["card_img"]:
            esc_img = html.escape(c["card_img"], quote=True)
            img_attr = f' data-card-img="{esc_img}"'
        card_html_parts.append(
            f'  <a class="wg-card" href="{c["href"]}" '
            f'data-slug="{c["slug"]}" data-section="{c["section"]}" '
            f'data-mtime="{c["mtime"]}"{img_attr}>'
            f'<span class="wg-card-badge">{badge}</span>'
            f'<span class="wg-card-title">{esc_title}</span>'
            f'<span class="wg-card-desc">{esc_desc}</span>'
            f'<span class="wg-card-heat">'
            f'<span class="wg-heat-bar"><span class="wg-heat-fill"></span></span>'
            f"</span>"
            f"</a>"
        )

    cards_html = "\n".join(card_html_parts)
    concept_count = sum(1 for c in cards if c["section"] == "concepts")
    entity_count = sum(1 for c in cards if c["section"] == "entities")

    index_content = f"""---
title: Wiki
hide:
  - navigation
  - toc
---

<div class="wg-page">

<div class="wg-header">
  <h1>Knowledge Atlas</h1>
  <p>{concept_count} 个概念 · {entity_count} 个实体 · 持续生长中</p>
</div>

<div class="wg-toolbar">
  <button class="wg-filter-btn active" data-filter="all">全部</button>
  <button class="wg-filter-btn" data-filter="concepts">概念</button>
  <button class="wg-filter-btn" data-filter="entities">实体</button>
  <button class="wg-gacha-btn">🎴 抽卡</button>
</div>

<div class="wg-grid">
{cards_html}
</div>

<!-- Gacha overlay -->
<div class="wg-gacha-overlay">
  <div class="wg-gacha-stage">
    <div class="wg-gacha-card">
      <button class="wg-gacha-close">&times;</button>
      <span class="wg-card-badge">概念</span>
      <span class="wg-card-title"></span>
      <span class="wg-card-desc"></span>
      <div class="wg-gacha-actions">
        <a class="wg-gacha-go" href="#">去了解</a>
        <button class="wg-gacha-again">再抽一张</button>
      </div>
    </div>
  </div>
</div>

</div>
"""
    (dest_root / "index.md").write_text(index_content, encoding="utf-8")


def copy_wiki_docs(project_root: Path, docs_dir: Path) -> None:
    """Copy wiki pages into docs/zh/wiki/ for the Chinese doc site.

    Copies index.md and each section subdirectory, generates .pages files
    for MkDocs awesome-pages navigation, and skips operational files like log.md.
    Concept pages are wrapped with image/text tabs if a card PNG exists.
    """
    wikis_dir = project_root / "wikis"
    if not wikis_dir.exists():
        return

    dest_root = docs_dir / "zh" / "wiki"
    if dest_root.exists():
        shutil.rmtree(dest_root)

    dest_root.mkdir(parents=True, exist_ok=True)

    # Copy each section
    for section in _WIKI_SECTIONS:
        section_src = wikis_dir / section
        if not section_src.is_dir():
            continue
        section_dest = dest_root / section
        shutil.copytree(section_src, section_dest)

        # Wrap pages with image/text tabs if matching card PNG exists
        if section in ("concepts", "entities"):
            assets_dir = wikis_dir / section / "assets"
            if assets_dir.is_dir():
                for md_file in section_dest.glob("*.md"):
                    _wrap_concept_with_card_tabs(md_file, assets_dir)

        # Generate .pages for section nav ordering
        md_files = sorted(f.name for f in section_dest.iterdir() if f.suffix == ".md")
        title = _WIKI_SECTION_TITLES.get(section, section.title())
        pages_content = f"title: {title}\nnav:\n"
        for name in md_files:
            pages_content += f"  - {name}\n"
        (section_dest / ".pages").write_text(pages_content)

    # Generate gallery index (replaces the plain index.md)
    _generate_gallery_index(wikis_dir, dest_root)

    # Generate top-level .pages — only show concepts and entities in sidebar
    pages_content = "title: Wiki\nnav:\n  - index.md\n"
    for section in _NAV_SECTIONS:
        if (dest_root / section).is_dir():
            pages_content += f"  - {section}\n"
    (dest_root / ".pages").write_text(pages_content)


def main() -> None:
    parser = argparse.ArgumentParser(description="Copy pattern docs for MkDocs build")
    parser.add_argument(
        "--project-root",
        type=Path,
        default=Path(__file__).resolve().parent.parent,
        help="Project root directory (default: auto-detected)",
    )
    args = parser.parse_args()

    project_root = args.project_root.resolve()
    docs_dir = project_root / "docs"

    print(f"Copying pattern docs from {project_root / 'patterns'} to {docs_dir}")
    copy_pattern_docs(project_root, docs_dir)

    print(f"Copying wiki docs from {project_root / 'wikis'} to {docs_dir / 'zh' / 'wiki'}")
    copy_wiki_docs(project_root, docs_dir)

    print("Done.")


if __name__ == "__main__":
    main()
