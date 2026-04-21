/* =====================================================================
   AVIATE WITH MAX — site.js
   Overview page logic: mega menu, lesson sub-tabs, card rendering.
   ===================================================================== */

/* ---------- Data: briefings (paths are relative to the site root) ----- */
const LESSONS = {
  pmentor: [
    { code: "DGH 00",  tag: "",      title: "Familiarisation & Preflight",            href: "briefings/lessons/p-mentor/atp-dgh-00-pmentor.html" },
    { code: "DGH 01",  tag: "",      title: "Taxi & Basic Handling",                  href: "briefings/lessons/p-mentor/atp-dgh-01-pmentor.html" },
    { code: "DGH 01N", tag: "night", title: "Night Flying Introduction",              href: "briefings/lessons/p-mentor/atp-dgh-01n-pmentor.html" },
    { code: "DGH 02",  tag: "",      title: "Basic Manoeuvres & Emergencies",         href: "briefings/lessons/p-mentor/atp-dgh-02-pmentor.html" },
    { code: "DGH 02N", tag: "night", title: "Night Landing Consolidation",            href: "briefings/lessons/p-mentor/atp-dgh-02n-pmentor.html" },
    { code: "DGH 03",  tag: "",      title: "Climbing, Descending & Circuit Intro",   href: "briefings/lessons/p-mentor/atp-dgh-03-pmentor.html" },
    { code: "DGH 04",  tag: "",      title: "Slow Flight & Stall Recognition",        href: "briefings/lessons/p-mentor/atp-dgh-04-pmentor.html" },
    { code: "DGH 05",  tag: "",      title: "Circuit Consolidation",                  href: "briefings/lessons/p-mentor/atp-dgh-05-pmentor.html" },
    { code: "DGH 06",  tag: "",      title: "Landing Circuit & Flare",                href: "briefings/lessons/p-mentor/atp-dgh-06-pmentor.html" },
    { code: "DGH 07",  tag: "",      title: "Power-Off Approach & Landing",           href: "briefings/lessons/p-mentor/atp-dgh-07-pmentor.html" },
    { code: "DGH 08",  tag: "",      title: "Emergency Procedures & Decision",        href: "briefings/lessons/p-mentor/atp-dgh-08-pmentor.html" },
    { code: "DGH 09",  tag: "",      title: "Circuit Consolidation & Flapless",       href: "briefings/lessons/p-mentor/atp-dgh-09-pmentor.html" },
    { code: "DGH 10",  tag: "",      title: "Solo Check",                             href: "briefings/lessons/p-mentor/atp-dgh-10-pmentor.html" },
    { code: "DGH 11",  tag: "",      title: "VOR Intro & Short-Field Landings",       href: "briefings/lessons/p-mentor/atp-dgh-11-pmentor.html" },
    { code: "DIF 01",  tag: "dif",   title: "Basic T Instrument Flying",              href: "briefings/lessons/p-mentor/atp-dif-01-pmentor.html" },
    { code: "DIF 02",  tag: "dif",   title: "Basic T Consolidation",                  href: "briefings/lessons/p-mentor/atp-dif-02-pmentor.html" },
    { code: "DIF 03",  tag: "dif",   title: "Nav Aid Setup & ILS",                    href: "briefings/lessons/p-mentor/atp-dif-03-pmentor.html" },
    { code: "DIF 04",  tag: "dif",   title: "GPS Holding & Approach",                 href: "briefings/lessons/p-mentor/atp-dif-04-pmentor.html" },
    { code: "DIF 05",  tag: "dif",   title: "Approaches Consolidation",               href: "briefings/lessons/p-mentor/atp-dif-05-pmentor.html" },
    { code: "DIF 06",  tag: "dif",   title: "Route Training — EKRK",                  href: "briefings/lessons/p-mentor/atp-dif-06-pmentor.html" },
    { code: "DIF 07",  tag: "dif",   title: "Route Training — ESMS",                  href: "briefings/lessons/p-mentor/atp-dif-07-pmentor.html" },
    { code: "DIF 08",  tag: "dif",   title: "Route Training — ESSA",                  href: "briefings/lessons/p-mentor/atp-dif-08-pmentor.html" },
    { code: "DIF 09",  tag: "dif",   title: "Route Training — EKOD",                  href: "briefings/lessons/p-mentor/atp-dif-09-pmentor.html" },
    { code: "DIF 10",  tag: "dif",   title: "Route Training — ESTA Consolidation",    href: "briefings/lessons/p-mentor/atp-dif-10-pmentor.html" },
    { code: "DIF 11",  tag: "dif",   title: "LCTR/LLZ Approaches & Circling",         href: "briefings/lessons/p-mentor/atp-dif-11-pmentor.html" }
  ],
  pa28: [
    { code: "DGH 00",  tag: "",      title: "Familiarisation & Preflight",            href: "briefings/lessons/pa28/atp-dgh-00-pa28.html" },
    { code: "DGH 01",  tag: "",      title: "Taxi & Basic Handling",                  href: "briefings/lessons/pa28/atp-dgh-01-pa28.html" },
    { code: "DGH 01N", tag: "night", title: "Night Flying Introduction",              href: "briefings/lessons/pa28/atp-dgh-01n-pa28.html" },
    { code: "DGH 02",  tag: "",      title: "Basic Manoeuvres & Emergencies",         href: "briefings/lessons/pa28/atp-dgh-02-pa28.html" },
    { code: "DGH 02N", tag: "night", title: "Night Landing Consolidation",            href: "briefings/lessons/pa28/atp-dgh-02n-pa28.html" },
    { code: "DGH 03",  tag: "",      title: "Climbing, Descending & Circuit Intro",   href: "briefings/lessons/pa28/atp-dgh-03-pa28.html" },
    { code: "DGH 04",  tag: "",      title: "Slow Flight & Stall Recognition",        href: "briefings/lessons/pa28/atp-dgh-04-pa28.html" },
    { code: "DGH 05",  tag: "",      title: "Circuit Consolidation",                  href: "briefings/lessons/pa28/atp-dgh-05-pa28.html" },
    { code: "DGH 06",  tag: "",      title: "Landing Circuit & Flare",                href: "briefings/lessons/pa28/atp-dgh-06-pa28.html" },
    { code: "DGH 07",  tag: "",      title: "Power-Off Approach & Landing",           href: "briefings/lessons/pa28/atp-dgh-07-pa28.html" },
    { code: "DGH 08",  tag: "",      title: "Emergency Procedures & Decision",        href: "briefings/lessons/pa28/atp-dgh-08-pa28.html" },
    { code: "DGH 09",  tag: "",      title: "Circuit Consolidation & Flapless",       href: "briefings/lessons/pa28/atp-dgh-09-pa28.html" },
    { code: "DGH 10",  tag: "",      title: "Solo Check",                             href: "briefings/lessons/pa28/atp-dgh-10-pa28.html" },
    { code: "DGH 11",  tag: "",      title: "VOR Intro & Short-Field Landings",       href: "briefings/lessons/pa28/atp-dgh-11-pa28.html" },
    { code: "DIF 01",  tag: "dif",   title: "Basic T Instrument Scan",                href: "briefings/lessons/pa28/lesson-dif01-pa28.html" },
    { code: "DIF 02",  tag: "dif",   title: "Basic T Consolidation",                  href: "briefings/lessons/pa28/lesson-dif02-pa28.html" },
    { code: "UPRT",    tag: "uprt",  title: "Unusual Attitude Recovery Training",     href: "briefings/lessons/pa28/lesson-dghuprt-bl8.html" },
    { code: "Extra",   tag: "extra", title: "DIF Extra — PA28 / DA40",                href: "briefings/lessons/pa28/lesson-difextra-pa28da40.html" }
  ]
};

const MANOEUVRES = [
  { code: "GND",  title: "Taxi & Run-Up",                       href: "briefings/manoeuvres/manoeuvres-briefing-taxi-runup.html" },
  { code: "TO",   title: "Line-Up & Take-Off",                  href: "briefings/manoeuvres/manoeuvres-briefing-lineup-takeoff.html" },
  { code: "S&L",  title: "Straight & Level Flight",             href: "briefings/manoeuvres/manoeuvres-briefing-straight-level.html" },
  { code: "CLB",  title: "Climb & Level-Off",                   href: "briefings/manoeuvres/manoeuvres-briefing-climb-leveloff.html" },
  { code: "SPD",  title: "Speed Changes",                       href: "briefings/manoeuvres/manoeuvres-briefing-speed-changes.html" },
  { code: "30°",  title: "Turns — 30° Bank",                    href: "briefings/manoeuvres/manoeuvres-briefing-turns-30-bank.html" },
  { code: "45°",  title: "Turns — 45° Bank",                    href: "briefings/manoeuvres/manoeuvres-briefing-turns-45-bank.html" },
  { code: "SLO",  title: "Slow Flight",                         href: "briefings/manoeuvres/manoeuvres-briefing-slow-flight.html" },
  { code: "STL",  title: "Stall",                               href: "briefings/manoeuvres/manoeuvres-briefing-stall.html" },
  { code: "SPN",  title: "Spin",                                href: "briefings/manoeuvres/manoeuvres-briefing-spin.html" },
  { code: "GLD",  title: "Gliding Descent",                     href: "briefings/manoeuvres/manoeuvres-briefing-gliding-descent.html" },
  { code: "CCT",  title: "Landing Circuit",                     href: "briefings/manoeuvres/manoeuvres-briefing-landing-circuit.html" },
  { code: "LDG",  title: "Normal Landings",                     href: "briefings/manoeuvres/manoeuvres-briefing-normal-landings.html" },
  { code: "XWL",  title: "Crosswind Landing",                   href: "briefings/manoeuvres/manoeuvres-briefing-crosswind-landing.html" },
  { code: "FL",   title: "Forced Landing",                      href: "briefings/manoeuvres/manoeuvres-briefing-forced-landing.html" },
  { code: "PL",   title: "Precautionary Landing",               href: "briefings/manoeuvres/manoeuvres-briefing-precautionary-landing.html" },
  { code: "NGT",  title: "Night Flying",                        href: "briefings/manoeuvres/manoeuvres-briefing-night-flying.html" },
  { code: "NAV",  title: "Navigation",                          href: "briefings/manoeuvres/manoeuvres-briefing-navigation.html" },
  { code: "UNC",  title: "Uncontrolled Aerodrome",              href: "briefings/manoeuvres/manoeuvres-briefing-uncontrolled-aerodrome.html" },
  { code: "INS",  title: "Instrument Cross-Scan",               href: "briefings/manoeuvres/manoeuvres-briefing-instrument-cross-scan.html" },
  { code: "VOR",  title: "Use of VOR",                          href: "briefings/manoeuvres/manoeuvres-briefing-use-of-vor.html" },
  { code: "REF",  title: "P-Mentor Technical Reference",        href: "briefings/manoeuvres/manoeuvres-briefing-p-mentor-technical-ref.html" }
];

/* ---------- Rendering ------------------------------------------------- */
function encodeHref(href){
  return href.split('/').map(encodeURIComponent).join('/');
}

function cardHTML(item, extras = {}){
  const tagClass = item.tag ? ` ${item.tag}` : "";
  const ac = extras.aircraft ? `<span class="aircraft">${extras.aircraft}</span>` : "";
  const enc = encodeHref(item.href);
  return `
    <article class="card">
      <a class="surface" href="${enc}" aria-label="${item.title}"></a>
      <div class="top">
        <span class="tag${tagClass}">${item.code}</span>
        ${ac}
      </div>
      <h3>${item.title}</h3>
      <div class="actions">
        <a class="open" href="${enc}">Open briefing</a>
        <a class="ext" href="${enc}" target="_blank" rel="noopener" title="Open in new window" aria-label="Open in new window">↗</a>
      </div>
    </article>`;
}

function menuItemHTML(item, tagClass){
  const enc = encodeHref(item.href);
  const cls = tagClass || item.tag || "";
  return `<a class="mm-item" href="${enc}"><span class="tag${cls?' '+cls:''}">${item.code}</span><span class="t">${item.title}</span></a>`;
}

function renderGrids(){
  document.querySelector('[data-ac-grid="pmentor"]').innerHTML =
    LESSONS.pmentor.map(i => cardHTML(i, { aircraft: "Tecnam P-Mentor" })).join("");
  document.querySelector('[data-ac-grid="pa28"]').innerHTML =
    LESSONS.pa28.map(i => cardHTML(i, { aircraft: "Piper PA-28" })).join("");
  document.querySelector('#manoeuvres-grid').innerHTML =
    MANOEUVRES.map(i => cardHTML({ ...i, tag: "manoeuvre" })).join("");
}

function renderMenuLists(){
  document.querySelector('[data-ac-list="pmentor"]').innerHTML =
    LESSONS.pmentor.map(i => menuItemHTML(i)).join("");
  document.querySelector('[data-ac-list="pa28"]').innerHTML =
    LESSONS.pa28.map(i => menuItemHTML(i)).join("");
  document.querySelector('[data-mm-list="manoeuvres"]').innerHTML =
    MANOEUVRES.map(i => menuItemHTML(i, "manoeuvre")).join("");
}

/* ---------- Mega menu ------------------------------------------------- */
function initMegaMenu(){
  const trigger = document.getElementById('briefings-trigger');
  const menu    = document.getElementById('megamenu');
  if (!trigger || !menu) return;

  const openMenu  = () => { menu.classList.add('is-open'); trigger.setAttribute('aria-expanded','true'); };
  const closeMenu = () => { menu.classList.remove('is-open'); trigger.setAttribute('aria-expanded','false'); };
  const toggle    = () => { menu.classList.contains('is-open') ? closeMenu() : openMenu(); };

  trigger.addEventListener('click', (e) => { e.stopPropagation(); toggle(); });
  document.addEventListener('click', (e) => {
    if (menu.classList.contains('is-open') && !menu.contains(e.target) && e.target !== trigger) closeMenu();
  });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeMenu(); });

  // Step 1 — category
  document.querySelectorAll('.mm-cat').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.mm-cat').forEach(c => c.classList.remove('is-selected'));
      btn.classList.add('is-selected');
      const cat = btn.dataset.cat;
      document.querySelectorAll('.mm-panel').forEach(p => p.classList.toggle('is-active', p.dataset.panel === cat));
    });
  });

  // Lesson aircraft switcher (within Lessons panel)
  document.querySelectorAll('#mm-lesson-tabs .mm-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#mm-lesson-tabs .mm-tab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const ac = tab.dataset.ac;
      document.querySelectorAll('[data-ac-list]').forEach(list => {
        list.style.display = list.dataset.acList === ac ? '' : 'none';
      });
    });
  });

  // Close on link click
  menu.addEventListener('click', (e) => {
    if (e.target.closest('.mm-item')) closeMenu();
  });
}

/* ---------- Lesson sub-tabs on the overview page --------------------- */
function initLessonSubtabs(){
  document.querySelectorAll('#lesson-subtabs .subtab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('#lesson-subtabs .subtab').forEach(t => t.classList.remove('is-active'));
      tab.classList.add('is-active');
      const ac = tab.dataset.ac;
      document.querySelectorAll('[data-ac-grid]').forEach(g => {
        g.style.display = g.dataset.acGrid === ac ? '' : 'none';
      });
    });
  });
}

/* ---------- Bootstrap ------------------------------------------------- */
document.addEventListener('DOMContentLoaded', () => {
  renderGrids();
  renderMenuLists();
  initMegaMenu();
  initLessonSubtabs();
});
