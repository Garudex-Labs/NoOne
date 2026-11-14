"""--no-changelog keeps the release body's frame and drops the commit sections."""


def test_no_changelog_keeps_the_frame_without_commit_sections():
    from scripts import release

    commits = [{
        "sha": "a" * 40, "short_sha": "a" * 8, "author_name": "Dev", "author_email": "dev@example.test",
        "subject": "feat: something (#5)", "category": "features", "github_author": "@dev", "coauthors": [],
    }]

    body = release.generate_changelog(commits, "rc.1-v1.2.4", "1.2.4", repo_url="https://github.com/o/r",
                                      prev_tag="v1.2.3", no_changelog=True)

    assert "Something" not in body and "@dev" not in body
    assert "<!-- HERMES_BUILDS_TABLE -->" in body
    assert "https://github.com/o/r/compare/v1.2.3...rc.1-v1.2.4" in body


def test_contributor_footer_uses_declared_roster_without_fabricating_commit_counts(monkeypatch):
    from scripts import release

    monkeypatch.setattr(release, "declared_contributors", lambda: {"rawx18.dev@gmail.com": "RAWx18"})
    commits = [{
        "sha": "b" * 40, "short_sha": "b" * 8,
        "subject": "fix: retain actual provenance", "category": "fixes",
        "github_author": "@original", "coauthors": ["@coauthor", "@original"],
    }]
    body = release.generate_changelog(commits, "v1.2.4", "1.2.4")
    entries, footer = body.split("## 👥 Contributors", 1)
    assert "— @original, @coauthor" in entries
    assert "- RAWx18 (<rawx18.dev@gmail.com>)" in footer
    assert "@original" not in footer and "@coauthor" not in footer
    assert "1 commit" not in footer


def test_no_changelog_does_not_include_the_roster(monkeypatch):
    from scripts import release

    monkeypatch.setattr(release, "declared_contributors", lambda: {"rawx18.dev@gmail.com": "RAWx18"})
    body = release.generate_changelog([], "v1.2.4", "1.2.4", no_changelog=True)
    assert "## 👥 Contributors" not in body
    assert "RAWx18" not in body
