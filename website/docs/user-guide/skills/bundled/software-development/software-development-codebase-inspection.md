---
title: "Codebase Inspection — Inspect codebases w/ pygount: LOC, languages, ratios"
sidebarTitle: "Codebase Inspection"
description: "Inspect codebases w/ pygount: LOC, languages, ratios"
---

{/* This page is auto-generated from the skill's SKILL.md by website/scripts/generate-skill-docs.py. Edit the source SKILL.md, not this page. */}

# Codebase Inspection {#codebase-inspection}

Inspect codebases w/ pygount: LOC, languages, ratios.

## Skill metadata {#skill-metadata}

| | |
|---|---|
| Source | Bundled (installed by default) |
| Path | `skills/software-development/codebase-inspection` |
| Version | `1.0.0` |
| Author | {{app-name}} |
| License | MIT |
| Platforms | linux, macos, windows |
| Tags | `LOC`, `Code Analysis`, `pygount`, `Codebase`, `Metrics`, `Repository` |
| Related skills | [`github`](../../bundled/software-development/software-development-github.md) |

## Reference: full SKILL.md {#reference-full-skillmd}

<Info>

<div className="doc-callout-title">

INFO

</div>

The following is the complete skill definition that {{app-name}} loads when this skill is triggered. This is what the agent sees as instructions when the skill is active.

</Info>

# Codebase Inspection with pygount {#codebase-inspection-with-pygount}

Analyze repositories for lines of code, language breakdown, file counts, and code-vs-comment ratios using `pygount`.

## When to Use {#when-to-use}

- User asks for LOC (lines of code) count
- User wants a language breakdown of a repo
- User asks about codebase size or composition
- User wants code-vs-comment ratios
- General "how big is this repo" questions

## Prerequisites {#prerequisites}

```bash
pip install --break-system-packages pygount 2>/dev/null || pip install pygount
```

## 1. Basic Summary (Most Common) {#1-basic-summary-most-common}

Get a full language breakdown with file counts, code lines, and comment lines:

```bash
cd /path/to/repo
pygount --format=summary \
  --folders-to-skip=".git,node_modules,venv,.venv,__pycache__,.cache,dist,build,.next,.tox,.eggs,*.egg-info" \
  .
```

**IMPORTANT:** Always use `--folders-to-skip` to exclude dependency/build directories, otherwise pygount will crawl them and take a very long time or hang.

## 2. Common Folder Exclusions {#2-common-folder-exclusions}

Adjust based on the project type:

```bash
# Python projects
--folders-to-skip=".git,venv,.venv,__pycache__,.cache,dist,build,.tox,.eggs,.mypy_cache"

# JavaScript/TypeScript projects
--folders-to-skip=".git,node_modules,dist,build,.next,.cache,.turbo,coverage"

# General catch-all
--folders-to-skip=".git,node_modules,venv,.venv,__pycache__,.cache,dist,build,.next,.tox,vendor,third_party"
```

## 3. Filter by Specific Language {#3-filter-by-specific-language}

```bash
# Only count Python files
pygount --suffix=py --format=summary .

# Only count Python and YAML
pygount --suffix=py,yaml,yml --format=summary .
```

## 4. Detailed File-by-File Output {#4-detailed-file-by-file-output}

```bash
# Default format shows per-file breakdown
pygount --folders-to-skip=".git,node_modules,venv" .

# Sort by code lines (pipe through sort)
pygount --folders-to-skip=".git,node_modules,venv" . | sort -t$'\t' -k1 -nr | head -20
```

## 5. Output Formats {#5-output-formats}

```bash
# Summary table (default recommendation)
pygount --format=summary .

# JSON output for programmatic use
pygount --format=json .

# Pipe-friendly: Language, file count, code, docs, empty, string
pygount --format=summary . 2>/dev/null
```

## 6. Interpreting Results {#6-interpreting-results}

The summary table columns:
- **Language** — detected programming language
- **Files** — number of files of that language
- **Code** — lines of actual code (executable/declarative)
- **Comment** — lines that are comments or documentation
- **%** — percentage of total

Special pseudo-languages:
- `__empty__` — empty files
- `__binary__` — binary files (images, compiled, etc.)
- `__generated__` — auto-generated files (detected heuristically)
- `__duplicate__` — files with identical content
- `__unknown__` — unrecognized file types

## Pitfalls {#pitfalls}

1. **Always exclude .git, node_modules, venv** — without `--folders-to-skip`, pygount will crawl everything and may take minutes or hang on large dependency trees.
2. **Markdown shows 0 code lines** — pygount classifies all Markdown content as comments, not code. This is expected behavior.
3. **JSON files show low code counts** — pygount may count JSON lines conservatively. For accurate JSON line counts, use `wc -l` directly.
4. **Large monorepos** — for very large repos, consider using `--suffix` to target specific languages rather than scanning everything.
