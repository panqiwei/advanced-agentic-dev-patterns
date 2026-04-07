"""Tests for build_docs.py — pattern docs copy and wiki docs copy."""

from pathlib import Path

from scripts.build_docs import copy_pattern_docs, copy_wiki_docs, get_lang_from_suffix


class TestGetLangFromSuffix:
    def test_no_suffix_returns_en(self):
        assert get_lang_from_suffix("overview.md") == "en"

    def test_zh_suffix(self):
        assert get_lang_from_suffix("overview.zh.md") == "zh"

    def test_ja_suffix(self):
        assert get_lang_from_suffix("overview.ja.md") == "ja"

    def test_ko_suffix(self):
        assert get_lang_from_suffix("overview.ko.md") == "ko"

    def test_gitkeep_returns_none(self):
        assert get_lang_from_suffix(".gitkeep") is None

    def test_non_md_returns_none(self):
        assert get_lang_from_suffix("image.png") is None

    def test_unknown_lang_suffix_treated_as_en(self):
        assert get_lang_from_suffix("overview.fr.md") == "en"


class TestCopyPatternDocs:
    def test_copies_en_doc_to_en_dir(self, tmp_path: Path):
        src = tmp_path / "patterns" / "tools" / "design-patterns" / "docs"
        src.mkdir(parents=True)
        (src / "overview.md").write_text("# Design Patterns")

        docs_dir = tmp_path / "docs"
        copy_pattern_docs(tmp_path, docs_dir)

        dest = docs_dir / "en" / "patterns" / "tools" / "design-patterns" / "overview.md"
        assert dest.exists()
        assert dest.read_text() == "# Design Patterns"

    def test_copies_zh_doc_to_zh_dir(self, tmp_path: Path):
        src = tmp_path / "patterns" / "tools" / "design-patterns" / "docs"
        src.mkdir(parents=True)
        (src / "overview.zh.md").write_text("# 设计模式")

        docs_dir = tmp_path / "docs"
        copy_pattern_docs(tmp_path, docs_dir)

        dest = docs_dir / "zh" / "patterns" / "tools" / "design-patterns" / "overview.md"
        assert dest.exists()
        assert dest.read_text() == "# 设计模式"

    def test_skips_gitkeep(self, tmp_path: Path):
        src = tmp_path / "patterns" / "tools" / "design-patterns" / "docs"
        src.mkdir(parents=True)
        (src / ".gitkeep").write_text("")

        docs_dir = tmp_path / "docs"
        copy_pattern_docs(tmp_path, docs_dir)

        assert not (docs_dir / "en" / "patterns" / "tools" / "design-patterns" / ".gitkeep").exists()

    def test_cleans_dest_before_copy(self, tmp_path: Path):
        src = tmp_path / "patterns" / "tools" / "design-patterns" / "docs"
        src.mkdir(parents=True)
        (src / "overview.md").write_text("# New")

        docs_dir = tmp_path / "docs"
        stale = docs_dir / "en" / "patterns" / "tools" / "design-patterns" / "stale.md"
        stale.parent.mkdir(parents=True)
        stale.write_text("# Stale")

        copy_pattern_docs(tmp_path, docs_dir)

        assert not stale.exists()

    def test_multiple_topics_and_categories(self, tmp_path: Path):
        for topic, cat in [("tools", "design-patterns"), ("context", "compact-patterns")]:
            src = tmp_path / "patterns" / topic / cat / "docs"
            src.mkdir(parents=True)
            (src / "overview.md").write_text(f"# {cat}")

        docs_dir = tmp_path / "docs"
        copy_pattern_docs(tmp_path, docs_dir)

        assert (docs_dir / "en" / "patterns" / "tools" / "design-patterns" / "overview.md").exists()
        assert (docs_dir / "en" / "patterns" / "context" / "compact-patterns" / "overview.md").exists()


class TestCopyWikiDocs:
    def _make_wiki(self, root: Path) -> Path:
        """Create a minimal wikis/ tree and return the project root."""
        wikis = root / "wikis"
        wikis.mkdir()
        (wikis / "index.md").write_text("# Wiki Index\n")
        (wikis / "log.md").write_text("# Log\n")

        concepts = wikis / "concepts"
        concepts.mkdir()
        (concepts / "agentic-systems.md").write_text("# Agentic Systems\n")
        (concepts / "routing.md").write_text("# Routing\n")

        entities = wikis / "entities"
        entities.mkdir()
        (entities / "anthropic.md").write_text("# Anthropic\n")

        sources = wikis / "sources"
        sources.mkdir()
        (sources / "openai-harness-engineering.md").write_text("# Harness\n")

        return root

    def test_copies_index_and_sections(self, tmp_path: Path):
        root = self._make_wiki(tmp_path)
        docs_dir = root / "docs"

        copy_wiki_docs(root, docs_dir)

        wiki_dest = docs_dir / "zh" / "wiki"
        # index.md is overwritten by _generate_gallery_index with gallery HTML
        index_content = (wiki_dest / "index.md").read_text()
        assert "title: Wiki" in index_content
        assert "Knowledge Atlas" in index_content
        assert (wiki_dest / "concepts" / "agentic-systems.md").exists()
        assert (wiki_dest / "concepts" / "routing.md").exists()
        assert (wiki_dest / "entities" / "anthropic.md").exists()
        assert (wiki_dest / "sources" / "openai-harness-engineering.md").exists()

    def test_skips_log_md(self, tmp_path: Path):
        root = self._make_wiki(tmp_path)
        docs_dir = root / "docs"

        copy_wiki_docs(root, docs_dir)

        assert not (docs_dir / "zh" / "wiki" / "log.md").exists()

    def test_generates_pages_files(self, tmp_path: Path):
        root = self._make_wiki(tmp_path)
        docs_dir = root / "docs"

        copy_wiki_docs(root, docs_dir)

        wiki_dest = docs_dir / "zh" / "wiki"
        # Root .pages
        root_pages = (wiki_dest / ".pages").read_text()
        assert "title: Wiki" in root_pages
        assert "index.md" in root_pages
        assert "concepts" in root_pages

        # Section .pages
        concepts_pages = (wiki_dest / "concepts" / ".pages").read_text()
        assert "title: 概念" in concepts_pages
        assert "agentic-systems.md" in concepts_pages

    def test_cleans_dest_before_copy(self, tmp_path: Path):
        root = self._make_wiki(tmp_path)
        docs_dir = root / "docs"

        # Pre-populate stale file
        stale = docs_dir / "zh" / "wiki" / "stale.md"
        stale.parent.mkdir(parents=True)
        stale.write_text("# Stale")

        copy_wiki_docs(root, docs_dir)

        assert not stale.exists()

    def test_noop_when_wikis_missing(self, tmp_path: Path):
        docs_dir = tmp_path / "docs"
        copy_wiki_docs(tmp_path, docs_dir)
        assert not (docs_dir / "zh" / "wiki").exists()
