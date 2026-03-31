// content.js — Claude Peak Monitor v2.0
// Outil communautaire non officiel — non affilié à Anthropic

const PEAK_START_UTC = 13;
const PEAK_END_UTC   = 19;
const BADGE_ID       = 'cpm-peak-badge';
const SNOOZE_KEY     = 'cpm_snoozed_until';
const SNOOZE_MS      = 30 * 60 * 1000; // 30 minutes

// ── Helpers ──────────────────────────────────────────────────────────────────

function isWeekend() {
  const day = new Date().getUTCDay();
  return day === 0 || day === 6;
}

function isPeakHour() {
  if (isWeekend()) return false;
  const hour = new Date().getUTCHours();
  return hour >= PEAK_START_UTC && hour < PEAK_END_UTC;
}

function isSnoozed() {
  const until = localStorage.getItem(SNOOZE_KEY);
  return until && Date.now() < parseInt(until, 10);
}

function snooze() {
  localStorage.setItem(SNOOZE_KEY, Date.now() + SNOOZE_MS);
}

// ── Badge ─────────────────────────────────────────────────────────────────────

function injectStyles() {
  if (document.getElementById('cpm-styles')) return;
  const style = document.createElement('style');
  style.id = 'cpm-styles';
  style.textContent = `
    @keyframes cpm-pulse {
      0%, 100% { opacity: 1;   transform: scale(1); }
      50%       { opacity: 0.3; transform: scale(0.65); }
    }
    @keyframes cpm-slide-in {
      from { opacity: 0; transform: translateY(-14px) scale(0.95); }
      to   { opacity: 1; transform: translateY(0)    scale(1);    }
    }
    #cpm-peak-badge {
      position: fixed;
      top: 14px;
      right: 14px;
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px 8px 10px;
      background: rgba(14, 10, 8, 0.9);
      border: 1px solid rgba(255, 90, 48, 0.35);
      border-radius: 10px;
      box-shadow: 0 0 0 1px rgba(0,0,0,0.4), 0 8px 28px rgba(0,0,0,0.45);
      backdrop-filter: blur(14px);
      -webkit-backdrop-filter: blur(14px);
      z-index: 2147483647;
      cursor: default;
      user-select: none;
      animation: cpm-slide-in 0.35s cubic-bezier(0.4, 0, 0.2, 1) forwards;
      font-family: 'Menlo', 'Monaco', 'SF Mono', 'Courier New', monospace !important;
    }
    #cpm-peak-badge .cpm-dot {
      width: 7px;
      height: 7px;
      border-radius: 50%;
      background: #FF5230;
      box-shadow: 0 0 6px #FF5230;
      flex-shrink: 0;
      animation: cpm-pulse 1.8s ease-in-out infinite;
    }
    #cpm-peak-badge .cpm-label {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: #FF7A5A;
    }
    #cpm-peak-badge .cpm-sub {
      font-size: 10.5px;
      font-weight: 400;
      color: rgba(240, 200, 180, 0.5);
      letter-spacing: 0.02em;
    }
    #cpm-peak-badge .cpm-close {
      margin-left: 4px;
      background: none;
      border: none;
      color: rgba(240, 200, 180, 0.4);
      cursor: pointer;
      font-size: 12px;
      line-height: 1;
      padding: 1px 3px;
      border-radius: 4px;
      transition: color 0.2s, background 0.2s;
      font-family: inherit !important;
    }
    #cpm-peak-badge .cpm-close:hover {
      color: rgba(240, 200, 180, 0.9);
      background: rgba(255,255,255,0.07);
    }
  `;
  document.head.appendChild(style);
}

function removeBadge(animate = true) {
  const badge = document.getElementById(BADGE_ID);
  if (!badge) return;
  if (!animate) { badge.remove(); return; }

  badge.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  badge.style.opacity    = '0';
  badge.style.transform  = 'translateY(-10px) scale(0.95)';
  setTimeout(() => badge.remove(), 320);
}

function createBadge() {
  if (document.getElementById(BADGE_ID)) return;

  injectStyles();

  const badge = document.createElement('div');
  badge.id = BADGE_ID;

  const dot   = document.createElement('span');
  dot.className = 'cpm-dot';

  const label = document.createElement('span');
  label.className   = 'cpm-label';
  label.textContent = 'Heure de pointe';

  const sub = document.createElement('span');
  sub.className   = 'cpm-sub';
  sub.textContent = '— ralentissements possibles';

  const close = document.createElement('button');
  close.className = 'cpm-close';
  close.textContent = '✕';
  close.title = 'Masquer pendant 30 min';
  close.addEventListener('click', (e) => {
    e.stopPropagation();
    snooze();
    removeBadge();
  });

  badge.append(dot, label, sub, close);
  document.body.appendChild(badge);
}

// ── Tick loop ─────────────────────────────────────────────────────────────────

function tick() {
  if (!document.body) return;

  if (isPeakHour() && !isSnoozed()) {
    createBadge();
  } else {
    removeBadge();
  }
}

tick();
setInterval(tick, 30_000);

document.addEventListener('visibilitychange', () => {
  if (!document.hidden) tick();
});
