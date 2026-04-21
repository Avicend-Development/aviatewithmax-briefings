# Aviate with Max — Briefing Library

Static website hosting lesson, manoeuvre, and reference briefings for
P-Mentor and PA-28 flight training. Aligned with CAPA SOP Ed.2 Rev.1 and
the ATP INT. lesson prep.

## Structure

```
/
├── index.html                       # Overview page (landing)
│
├── assets/
│   ├── css/
│   │   ├── site.css                 # Overview page styles
│   │   └── briefing-chrome.css      # Top bar injected into each briefing
│   ├── js/
│   │   └── site.js                  # Overview dropdown, tabs, card render
│   └── img/                         # Logos, favicon (empty — to be added)
│
├── briefings/
│   ├── lessons/
│   │   ├── p-mentor/                # Tecnam P-Mentor lesson briefings
│   │   └── pa28/                    # Piper PA-28 lesson briefings
│   ├── manoeuvres/                  # Aircraft-agnostic technique briefings
│   └── misc/                        # Placeholder for future content
│
├── scripts/
│   └── inject-chrome.py             # Top-bar injector (idempotent)
│
└── _archive/                        # Unused briefing variants, kept for reference
    ├── p-mentor/                    # lesson-dif05 (not published)
    └── pa28/                        # lesson-dgh* series (not published)
```

The `_archive/` directory is **not** linked from the site. It holds the
alternative PA-28 `lesson-dgh*` series and a stray `lesson-dif05-pmentor.html`
that the current site doesn't publish. Delete or restore as needed.

## Briefing page chrome

Every briefing file has a sticky top bar injected at the top of `<body>`:

- **Back to overview** — same-window navigation to `index.html`
- **Open full size** — opens the briefing in a new window

The top bar uses `assets/css/briefing-chrome.css` and is hidden when the
page is printed.

## Adding a new briefing

1. Drop the HTML file into the appropriate folder:
   - Lesson → `briefings/lessons/{p-mentor,pa28}/`
   - Manoeuvre → `briefings/manoeuvres/`
   - Misc → `briefings/misc/`
2. Run the chrome injector to add the top bar and rebrand the `<title>`:
   ```bash
   python3 scripts/inject-chrome.py
   ```
   (Idempotent — safe to re-run; existing files are skipped.)
3. Add an entry to the appropriate array in `assets/js/site.js`:
   - `LESSONS.pmentor` / `LESSONS.pa28` for lessons
   - `MANOEUVRES` for manoeuvres
4. Update the counts in `index.html` (three places: mega menu, hero stats,
   category cards).

## Local preview

Any static HTTP server will work:

```bash
# Python 3
python3 -m http.server 8000

# Node (npx)
npx serve .
```

Then open http://localhost:8000/.

## Deploying to GitHub Pages

1. Push this folder to a GitHub repo (root as web root).
2. Repo → Settings → Pages → Source = `main` branch, `/ (root)`.
3. GitHub Pages will serve at `https://<user>.github.io/<repo>/`.
4. For a custom domain (`aviatewithmax.com`), add a `CNAME` file at the
   root containing the domain, then configure DNS per GitHub's docs.

## Sources

Content is aligned with (prioritised):

1. **CAPA SOP** (Ed.2 Rev.1) — primary operating reference
2. **ATP INT. Lesson Prep** — primary lesson structure reference
3. EGAST, FI Manuals, aircraft POH/AFM — supplementary
