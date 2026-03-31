// popup.js — Claude Peak Monitor v2.0
// Outil communautaire non officiel — non affilié à Anthropic

'use strict';

const PEAK_START_UTC = 13;
const PEAK_END_UTC   = 19;

// ── DOM refs ──────────────────────────────────────────────────────────────────

const $weekendBanner = document.getElementById('weekend-banner');
const $statusCard    = document.getElementById('status-card');
const $statusPill    = document.getElementById('status-pill');
const $statusLabel   = document.getElementById('status-label');
const $utcClock      = document.getElementById('utc-clock');
const $timerLabel    = document.getElementById('timer-label');
const $timerValue    = document.getElementById('timer-value');
const $progressWrap  = document.getElementById('progress-wrap');
const $progressFill  = document.getElementById('progress-fill');
const $infoPanel     = document.getElementById('info-panel');
const $footerText    = document.getElementById('footer-text');

// ── Utilities ─────────────────────────────────────────────────────────────────

function pad(n) {
  return String(n).padStart(2, '0');
}

/** Format a duration in milliseconds as "HHh MMm SSs". */
function formatDuration(ms) {
  if (ms <= 0) return '00h 00m 00s';
  const totalSec = Math.floor(ms / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const s = totalSec % 60;
  return `${pad(h)}h ${pad(m)}m ${pad(s)}s`;
}

function isWeekend(date) {
  const day = date.getUTCDay();
  return day === 0 || day === 6;
}

/**
 * Returns the peak window (start / end) for the UTC day of `date`.
 */
function getPeakWindowFor(date) {
  const y  = date.getUTCFullYear();
  const mo = date.getUTCMonth();
  const d  = date.getUTCDate();
  return {
    start: new Date(Date.UTC(y, mo, d, PEAK_START_UTC, 0, 0, 0)),
    end:   new Date(Date.UTC(y, mo, d, PEAK_END_UTC,   0, 0, 0)),
  };
}

/**
 * Returns the start of the next weekday peak window after `now`.
 * Correctly skips Saturdays and Sundays.
 */
function getNextPeakStart(now) {
  const candidate = new Date(now);
  candidate.setUTCDate(candidate.getUTCDate() + 1);
  candidate.setUTCHours(0, 0, 0, 0);

  // Advance past any weekend days
  while (isWeekend(candidate)) {
    candidate.setUTCDate(candidate.getUTCDate() + 1);
  }

  return new Date(Date.UTC(
    candidate.getUTCFullYear(),
    candidate.getUTCMonth(),
    candidate.getUTCDate(),
    PEAK_START_UTC, 0, 0, 0
  ));
}

/**
 * Returns local-timezone start/end formatted as "15h30" and the short TZ name.
 */
function getLocalPeakLabel() {
  const now = new Date();
  const { start, end } = getPeakWindowFor(now);

  const fmt = (d) => {
    const h = d.getHours();
    const m = d.getMinutes();
    return m === 0 ? `${h}h` : `${h}h${pad(m)}`;
  };

  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  const tzShort = new Intl.DateTimeFormat('fr-FR', {
    timeZone: tz,
    timeZoneName: 'short',
  }).formatToParts(now).find((p) => p.type === 'timeZoneName')?.value ?? 'locale';

  return `${fmt(start)} – ${fmt(end)} (${tzShort})`;
}

// ── Render ────────────────────────────────────────────────────────────────────

function render() {
  const now = new Date();
  const h   = now.getUTCHours();
  const m   = now.getUTCMinutes();
  const s   = now.getUTCSeconds();

  // Live UTC clock (always visible)
  $utcClock.textContent = `${pad(h)}:${pad(m)}:${pad(s)} UTC`;

  const weekend = isWeekend(now);

  if (weekend) {
    $weekendBanner.style.display = 'block';
    $statusCard.style.display    = 'none';
    $infoPanel.style.display     = 'none';
    return;
  }

  $weekendBanner.style.display = 'none';
  $statusCard.style.display    = '';
  $infoPanel.style.display     = '';

  const { start, end } = getPeakWindowFor(now);
  const isPeak = now >= start && now < end;

  // ── Peak mode ──
  if (isPeak) {
    $statusPill.className  = 'status-pill peak';
    $statusCard.className  = 'status-card peak';
    $infoPanel.className   = 'info-panel peak';
    $statusLabel.textContent = '⚠ HEURE DE POINTE';
    $timerLabel.textContent  = 'FIN DANS';
    $timerValue.className    = 'timer-value peak';
    $timerValue.textContent  = formatDuration(end - now);

    // Progress bar
    const elapsed = now - start;
    const total   = end - start;
    const pct     = Math.min(100, (elapsed / total) * 100);
    $progressWrap.style.display = 'block';
    $progressFill.style.width   = `${pct.toFixed(2)}%`;

    $infoPanel.innerHTML = `
      <div class="info-item"><span class="info-arrow">›</span><span>Réponses plus lentes qu'en heures creuses</span></div>
      <div class="info-item"><span class="info-arrow">›</span><span>Risque accru de bugs et d'interruptions</span></div>
      <div class="info-item"><span class="info-arrow">›</span><span>Quotas d'utilisation consommés plus vite</span></div>
    `;

  // ── Calm mode ──
  } else {
    $statusPill.className  = 'status-pill calm';
    $statusCard.className  = 'status-card calm';
    $infoPanel.className   = 'info-panel calm';
    $statusLabel.textContent = '✓ ZONE CALME';
    $timerLabel.textContent  = 'PROCHAIN PIC DANS';
    $timerValue.className    = 'timer-value calm';
    $progressWrap.style.display = 'none';

    // Time until next peak (today if before start, otherwise next weekday)
    const nextPeak = now < start ? start : getNextPeakStart(now);
    $timerValue.textContent = formatDuration(nextPeak - now);

    $infoPanel.innerHTML = `
      <div class="info-item"><span class="info-arrow">›</span><span>Meilleure période pour utiliser Claude</span></div>
      <div class="info-item"><span class="info-arrow">›</span><span>Réponses plus rapides et plus stables</span></div>
      <div class="info-item"><span class="info-arrow">›</span><span>Moins de risques d'erreurs ou de coupures</span></div>
    `;
  }
}

// ── Boot ──────────────────────────────────────────────────────────────────────

// Footer shows local-timezone equivalent of peak hours
$footerText.innerHTML = `Pointe : ${getLocalPeakLabel()} <span class="footer-sep">·</span> Outil communautaire`;

// Run immediately, then every second
render();
setInterval(render, 1000);
