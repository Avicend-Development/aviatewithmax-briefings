#!/usr/bin/env python3
"""
inject-auth.py
──────────────
Inject the auth.js password-wall script into index.html and every
briefing HTML file under briefings/. Idempotent — safe to run multiple
times; skips files that already have the script tag.

Run from the site root:
    python3 scripts/inject-auth.py

Dry run (show what would change without writing):
    python3 scripts/inject-auth.py --dry-run
"""
from __future__ import annotations
import argparse
import sys
from pathlib import Path

ROOT      = Path(__file__).resolve().parent.parent
BRIEFINGS = ROOT / "briefings"

MARKER    = "auth.js"   # idempotency check — skip if already present

SCRIPT_TAG = '<script src="{rel}assets/js/auth.js"></script>'


def relative_prefix(file: Path) -> str:
    """Return the relative prefix to reach the site root from `file`.
    e.g.  briefings/lessons/pa28/x.html  →  '../../../'
          index.html                      →  ''
    """
    depth = len(file.relative_to(ROOT).parts) - 1
    return "../" * depth


def inject(content: str, file: Path) -> tuple[str, bool]:
    """Inject auth.js <script> into <head>. Returns (new_content, changed)."""
    if MARKER in content:
        return content, False

    tag = SCRIPT_TAG.format(rel=relative_prefix(file))

    # Prefer inserting as the very first thing inside <head>
    if "<head>" in content:
        content = content.replace("<head>", f"<head>\n  {tag}", 1)
        return content, True

    # Fallback: before </head>
    if "</head>" in content:
        content = content.replace("</head>", f"  {tag}\n</head>", 1)
        return content, True

    # Last resort: prepend to file
    return tag + "\n" + content, True


def process_file(file: Path, dry: bool) -> str:
    try:
        src = file.read_text(encoding="utf-8")
    except Exception as e:
        return f"  [SKIP]  {file.relative_to(ROOT)} — read error: {e}"

    updated, changed = inject(src, file)

    if not changed:
        return f"  [ok]    {file.relative_to(ROOT)} (already up-to-date)"

    if dry:
        return f"  [DRY]   {file.relative_to(ROOT)}"

    try:
        file.write_text(updated, encoding="utf-8")
    except Exception as e:
        return f"  [FAIL]  {file.relative_to(ROOT)} — write error: {e}"

    return f"  [write] {file.relative_to(ROOT)}"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="report changes without writing")
    args = ap.parse_args()

    # Collect: index.html + all briefing HTML files
    files: list[Path] = []
    index = ROOT / "index.html"
    if index.exists():
        files.append(index)
    if BRIEFINGS.is_dir():
        files.extend(sorted(BRIEFINGS.rglob("*.html")))

    if not files:
        print("ERROR: no HTML files found. Run from site root.", file=sys.stderr)
        return 1

    print(f"Found {len(files)} HTML files to process")
    print("")

    for f in files:
        print(process_file(f, dry=args.dry_run))

    print("")
    print("Done." if not args.dry_run else "Dry run — no files written.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
