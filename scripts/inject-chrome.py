#!/usr/bin/env python3
"""
inject-chrome.py
────────────────
Inject the Aviate with Max top bar into every briefing HTML file under
briefings/. Idempotent — safe to run multiple times; skips files that
already have the chrome. Also rebrands the <title> tag to 'Aviate with Max'.

Run from the site root:
    python3 scripts/inject-chrome.py

Dry run (show what would change without writing):
    python3 scripts/inject-chrome.py --dry-run
"""
from __future__ import annotations
import argparse
import re
import sys
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
BRIEFINGS = ROOT / "briefings"

MARKER = "<!-- AWM-TOPBAR -->"          # idempotency marker
CSS_HREF_TOKEN = "briefing-chrome.css"  # idempotency marker for <link>

# ---------------------------------------------------------------------------
# Content templates
# ---------------------------------------------------------------------------

CSS_LINK = (
    '<link rel="stylesheet" href="{rel}assets/css/briefing-chrome.css">'
)

# The two action buttons: back to overview (same window) + open full size (new tab)
TOPBAR_HTML = """{marker}
<header class="awm-topbar" role="banner">
  <div class="awm-topbar-inner">
    <a class="awm-brand" href="{rel}index.html" aria-label="Aviate with Max — overview">
      <span class="awm-dot"></span>
      <span>Aviate with Max</span>
    </a>
    <div class="awm-spacer"></div>
    <a class="awm-action" href="{rel}index.html" title="Back to overview">
      <svg class="awm-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
      <span class="awm-label">Back to overview</span>
    </a>
    <a class="awm-action is-primary" href="{self_url}" target="_blank" rel="noopener" title="Open full size in new window">
      <svg class="awm-icon" viewBox="0 0 24 24" aria-hidden="true">
        <path d="M14 3h7v7M10 14 21 3M5 12v7a1 1 0 0 0 1 1h13"/>
      </svg>
      <span class="awm-label">Open full size</span>
    </a>
  </div>
</header>
""".rstrip()

# ---------------------------------------------------------------------------
# Title rebranding
# ---------------------------------------------------------------------------

# Patterns trimmed from the END of <title> content, in order of preference.
# First match wins. Anchor with optional leading separator (—, ·, -).
TRAILING_BRAND_PATTERNS = [
    r"\s*[—·-]\s*CAPA Briefing Package\s*$",
    r"\s*[—·-]\s*Center Air CAPA Flight School\s*$",
    r"\s*[—·-]\s*Center Air CAPA Flight Training\s*$",
    r"\s*[—·-]\s*Center Air CAPA\s*$",
    r"\s*[—·-]\s*CAPA\s*$",
]

REBRAND_SUFFIX = " — Aviate with Max"


def rebrand_title(content: str) -> tuple[str, bool]:
    """Replace trailing CAPA/Center Air branding in the <title> with Aviate with Max.
    Returns (new_content, changed)."""
    m = re.search(r"<title>(.*?)</title>", content, flags=re.IGNORECASE | re.DOTALL)
    if not m:
        return content, False
    title = m.group(1).strip()
    if "Aviate with Max" in title:
        return content, False  # already rebranded
    original = title
    for pat in TRAILING_BRAND_PATTERNS:
        title = re.sub(pat, "", title)
    title = title.rstrip(" —·-")
    new_title = f"{title}{REBRAND_SUFFIX}"
    if new_title == original:
        return content, False
    new_tag = f"<title>{new_title}</title>"
    return content[:m.start()] + new_tag + content[m.end():], True


# ---------------------------------------------------------------------------
# Chrome injection
# ---------------------------------------------------------------------------

def relative_prefix(file: Path) -> str:
    """Return the relative prefix to reach the site root from `file`.
    Example: briefings/lessons/p-mentor/x.html → '../../../'"""
    depth = len(file.relative_to(ROOT).parts) - 1
    return "../" * depth


def self_url(file: Path) -> str:
    """URL the 'Open full size' button points at — just the file name itself."""
    return file.name


def inject(content: str, file: Path) -> tuple[str, bool]:
    """Inject <link> and top bar into the HTML. Returns (new_content, changed)."""
    rel = relative_prefix(file)
    changed = False

    # 1. Add <link> to briefing-chrome.css if not already present
    if CSS_HREF_TOKEN not in content:
        link_tag = CSS_LINK.format(rel=rel)
        if "</head>" in content:
            content = content.replace("</head>", f"  {link_tag}\n</head>", 1)
            changed = True
        else:
            # No </head> found — prepend to <body>. Should not happen with our files.
            content = f"{link_tag}\n{content}"
            changed = True

    # 2. Inject top bar right after <body>, but only if the marker isn't there
    if MARKER not in content:
        body_open = re.search(r"<body[^>]*>", content, flags=re.IGNORECASE)
        if not body_open:
            return content, changed
        topbar = TOPBAR_HTML.format(
            marker=MARKER,
            rel=rel,
            self_url=self_url(file),
        )
        insert_at = body_open.end()
        content = content[:insert_at] + "\n" + topbar + "\n" + content[insert_at:]
        changed = True

    return content, changed


# ---------------------------------------------------------------------------
# Driver
# ---------------------------------------------------------------------------

def process_file(file: Path, dry: bool) -> str:
    try:
        src = file.read_text(encoding="utf-8")
    except Exception as e:
        return f"  [SKIP]  {file.relative_to(ROOT)} — read error: {e}"

    updated, chrome_changed = inject(src, file)
    updated, title_changed = rebrand_title(updated)

    if not (chrome_changed or title_changed):
        return f"  [ok]    {file.relative_to(ROOT)} (already up-to-date)"

    if dry:
        flags = []
        if chrome_changed: flags.append("chrome")
        if title_changed:  flags.append("title")
        return f"  [DRY]   {file.relative_to(ROOT)}  ({', '.join(flags)})"

    try:
        file.write_text(updated, encoding="utf-8")
    except Exception as e:
        return f"  [FAIL]  {file.relative_to(ROOT)} — write error: {e}"

    flags = []
    if chrome_changed: flags.append("chrome")
    if title_changed:  flags.append("title")
    return f"  [write] {file.relative_to(ROOT)}  ({', '.join(flags)})"


def main() -> int:
    ap = argparse.ArgumentParser()
    ap.add_argument("--dry-run", action="store_true", help="report changes without writing")
    args = ap.parse_args()

    if not BRIEFINGS.is_dir():
        print(f"ERROR: {BRIEFINGS} not found. Run from site root.", file=sys.stderr)
        return 1

    files = sorted(BRIEFINGS.rglob("*.html"))
    print(f"Found {len(files)} briefing HTML files under {BRIEFINGS.relative_to(ROOT)}/")
    print("")

    for f in files:
        print(process_file(f, dry=args.dry_run))

    print("")
    print("Done." if not args.dry_run else "Dry run — no files written.")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
