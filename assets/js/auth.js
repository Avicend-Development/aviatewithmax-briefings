/* =====================================================================
   auth.js — Aviate with Max · Password wall
   Runs on every page. Checks sessionStorage; if not authenticated,
   blocks rendering and shows a branded password overlay.
   Password persists for the browser session (cleared on restart).
   ===================================================================== */
(function () {
  'use strict';

  var KEY = 'awm_auth';
  var PWD = 'AviateWithMax1#';

  /* Already authenticated — nothing to do */
  if (sessionStorage.getItem(KEY) === '1') return;

  /* Hide the page immediately to prevent content flash */
  document.documentElement.style.visibility = 'hidden';

  /* ── Styles ──────────────────────────────────────────────────────── */
  var CSS = [
    '#awm-auth-overlay{',
      'position:fixed;inset:0;z-index:99999;',
      'background:#0b1b3a;',
      'display:flex;align-items:center;justify-content:center;',
      'font-family:"Inter",system-ui,-apple-system,Segoe UI,Roboto,sans-serif;',
      'padding:24px;',
    '}',
    '#awm-auth-overlay::before{',
      'content:"";',
      'position:absolute;top:0;left:0;right:0;height:3px;',
      'background:linear-gradient(90deg,#2f7dc4 0%,#5aa3da 55%,#d9881a 100%);',
    '}',
    '#awm-auth-card{',
      'background:#13274a;',
      'border:1px solid rgba(255,255,255,.1);',
      'border-radius:14px;',
      'padding:40px 36px 36px;',
      'width:100%;max-width:380px;',
      'box-shadow:0 24px 64px rgba(0,0,0,.45);',
      'text-align:center;',
    '}',
    '#awm-auth-brand{',
      'display:inline-flex;align-items:center;gap:10px;',
      'font-family:"Barlow Condensed","Inter",sans-serif;',
      'font-weight:700;font-size:18px;letter-spacing:.08em;text-transform:uppercase;',
      'color:#fff;margin-bottom:28px;',
    '}',
    '#awm-auth-dot{',
      'width:10px;height:10px;border-radius:50%;',
      'background:#d9881a;box-shadow:0 0 0 3px rgba(217,136,26,.25);',
      'flex-shrink:0;',
    '}',
    '#awm-auth-card h2{',
      'color:#fff;font-size:17px;font-weight:600;margin-bottom:6px;',
    '}',
    '#awm-auth-card p{',
      'color:rgba(255,255,255,.5);font-size:13.5px;margin-bottom:24px;',
    '}',
    '#awm-auth-input{',
      'width:100%;padding:11px 14px;',
      'background:rgba(255,255,255,.07);',
      'border:1px solid rgba(255,255,255,.15);',
      'border-radius:8px;',
      'color:#fff;font-size:15px;font-family:inherit;',
      'outline:none;',
      'transition:border-color .15s;',
      'margin-bottom:12px;',
    '}',
    '#awm-auth-input:focus{border-color:#2f7dc4;}',
    '#awm-auth-input::placeholder{color:rgba(255,255,255,.3);}',
    '#awm-auth-btn{',
      'width:100%;padding:11px;',
      'background:#2f7dc4;',
      'border:none;border-radius:8px;',
      'color:#fff;font-size:15px;font-weight:600;font-family:inherit;',
      'cursor:pointer;',
      'transition:background .15s;',
    '}',
    '#awm-auth-btn:hover{background:#5aa3da;}',
    '#awm-auth-error{',
      'color:#f87171;font-size:13px;',
      'margin-top:10px;min-height:18px;',
    '}',
  ].join('');

  /* ── HTML ────────────────────────────────────────────────────────── */
  var HTML = [
    '<div id="awm-auth-card">',
      '<div id="awm-auth-brand">',
        '<span id="awm-auth-dot"></span>',
        '<span>Aviate with Max</span>',
      '</div>',
      '<h2>Briefing Library</h2>',
      '<p>Enter your password to continue.</p>',
      '<input id="awm-auth-input" type="password" placeholder="Password" autocomplete="current-password" autofocus>',
      '<button id="awm-auth-btn">Unlock</button>',
      '<div id="awm-auth-error" aria-live="polite"></div>',
    '</div>',
  ].join('');

  /* ── Mount overlay ───────────────────────────────────────────────── */
  function mount() {
    /* Inject styles */
    var style = document.createElement('style');
    style.textContent = CSS;
    document.head.appendChild(style);

    /* Inject overlay */
    var overlay = document.createElement('div');
    overlay.id = 'awm-auth-overlay';
    overlay.innerHTML = HTML;
    document.body.appendChild(overlay);

    /* Restore visibility now that overlay is in place */
    document.documentElement.style.visibility = '';

    var input  = document.getElementById('awm-auth-input');
    var btn    = document.getElementById('awm-auth-btn');
    var errEl  = document.getElementById('awm-auth-error');

    function attempt() {
      if (input.value === PWD) {
        sessionStorage.setItem(KEY, '1');
        overlay.remove();
        style.remove();
      } else {
        errEl.textContent = 'Incorrect password — please try again.';
        input.value = '';
        input.focus();
      }
    }

    btn.addEventListener('click', attempt);
    input.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') attempt();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }

}());
