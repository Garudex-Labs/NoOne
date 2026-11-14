"""Stamp only release metadata consumed by external package builders.

The project version is mirrored into package metadata and native builder inputs.
Install stamps keep build provenance separate from the public release label.
"""
from __future__ import annotations

import argparse
import json
import re
import tomllib
from pathlib import Path
from collections.abc import Callable


def _rewrite(path: Path, pattern: str, replacement: str | Callable[[re.Match[str]], str], *, count: int = 0, flags: int = 0) -> bool:
    if not path.exists():
        return False
    raw = path.read_bytes()
    newline = "\r\n" if b"\r\n" in raw else "\n"
    text = raw.decode("utf-8-sig").replace("\r\n", "\n")
    updated = re.sub(pattern, replacement, text, count=count, flags=flags)
    path.write_bytes(updated.replace("\n", newline).encode("utf-8"))
    return True


def _stamp_lock_package(path: Path, name: str, version: str) -> bool:
    """Only the local project record changes; registry dependencies stay frozen."""
    text = path.read_text(encoding="utf-8-sig")
    for match in re.finditer(r"(?ms)^\[\[package\]\]\n.*?(?=^\[\[package\]\]|\Z)", text):
        row = tomllib.loads(match.group())["package"][0]
        local = row.get("source") == {"editable": "."} if path.name == "uv.lock" else "source" not in row
        if row.get("name") == name and local:
            updated = re.sub(r'^version\s*=\s*"[^\"]+"', f'version = "{version}"',
                             match.group(), count=1, flags=re.MULTILINE)
            return _rewrite(path, re.escape(match.group()), lambda _match: updated, count=1)
    return False


def stamp(tree: Path, version: str) -> list[Path]:
    """Rewrite external builder version inputs under ``tree``."""
    version = version.split("+", 1)[0].split("-", 1)[0]
    written: list[Path] = []

    if _rewrite(tree / "pyproject.toml", r'^version\s*=\s*"[^"]+"',
                f'version = "{version}"', count=1, flags=re.MULTILINE):
        written.append(tree / "pyproject.toml")
        lock = tree / "uv.lock"
        if lock.is_file():
            name = tomllib.loads((tree / "pyproject.toml").read_text(encoding="utf-8-sig"))["project"]["name"]
            if _stamp_lock_package(lock, name, version):
                written.append(lock)
    for relative in (
        "package.json", "apps/desktop/package.json", "apps/shared/package.json",
        "apps/bootstrap-installer/package.json",
        "web/package.json", "website/package.json",
        "scripts/whatsapp-bridge/package.json", "plugins/platforms/photon/sidecar/package.json",
    ):
        path = tree / relative
        if _rewrite(path, r'("version"\s*:\s*)"[^"]+"', rf'\g<1>"{version}"', count=1):
            written.append(path)
            lock = path.with_name("package-lock.json")
            if lock.is_file():
                data = json.loads(lock.read_text(encoding="utf-8-sig"))
                data["version"] = version
                if "" in data.get("packages", {}):
                    data["packages"][""]["version"] = version
                lock.write_text(json.dumps(data, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
                written.append(lock)

    nix_package = tree / "nix" / "agent.nix"
    if _rewrite(
        nix_package,
        r'^  version \? "[^"]+",',
        f'  version ? "{version}",',
        count=1,
        flags=re.MULTILINE,
    ):
        written.append(nix_package)

    installer = tree / "apps" / "bootstrap-installer" / "src-tauri"
    json_version = rf'\g<1>"{version}"'
    for path, pattern, replacement, flags in (
        (
            installer / "tauri.conf.json",
            r'("version"\s*:\s*)"[^"]+"',
            json_version,
            0,
        ),
        (
            installer / "Cargo.toml",
            r'^version\s*=\s*"[^"]+"',
            f'version = "{version}"',
            re.MULTILINE,
        ),
    ):
        if _rewrite(path, pattern, replacement, count=1, flags=flags):
            written.append(path)

    if installer.is_dir():
        lock = installer / "Cargo.lock"
        if lock.is_file():
            package = tomllib.loads((installer / "Cargo.toml").read_text(encoding="utf-8-sig"))["package"]
            if package.get("name") and _stamp_lock_package(lock, package["name"], version):
                written.append(lock)
        validate_bootstrap_version(tree, version)
    return written


def validate_bootstrap_version(tree: Path, version: str) -> None:
    installer = tree / "apps" / "bootstrap-installer" / "src-tauri"
    tauri = json.loads((installer / "tauri.conf.json").read_text(encoding="utf-8-sig"))
    cargo = tomllib.loads((installer / "Cargo.toml").read_text(encoding="utf-8-sig"))
    values = {
        "Tauri config": tauri.get("version"),
        "Cargo package": cargo.get("package", {}).get("version"),
    }
    mismatches = {name: value for name, value in values.items() if value != version}
    if mismatches:
        raise ValueError(f"Bootstrap installer version differs from {version}: {mismatches}")


def main(argv: list[str] | None = None) -> None:
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("--tree", type=Path, required=True)
    parser.add_argument("--version", required=True)
    args = parser.parse_args(argv)
    stamp(args.tree.resolve(), args.version)


if __name__ == "__main__":
    main()
