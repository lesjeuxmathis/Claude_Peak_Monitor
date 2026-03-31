// background.js — Claude Peak Monitor v3.0
// Outil communautaire non officiel — non affilié à Anthropic

const PEAK_START_UTC = 13;
const PEAK_END_UTC   = 19;

// ── Helpers ───────────────────────────────────────────────────────────────────

function isWeekend() {
  const day = new Date().getUTCDay();
  return day === 0 || day === 6;
}

function isPeakHour() {
  if (isWeekend()) return false;
  const hour = new Date().getUTCHours();
  return hour >= PEAK_START_UTC && hour < PEAK_END_UTC;
}

// ── Icon sync ─────────────────────────────────────────────────────────────────

function syncIcon() {
  const icon = isPeakHour() ? 'icon-peak.png' : 'icon.png';
  // FIX: utilise un path unique (string) pour éviter "Icon invalid"
  chrome.action.setIcon({ path: icon }, () => {
    if (chrome.runtime.lastError) {
      console.warn('[CPM] setIcon:', chrome.runtime.lastError.message);
    }
  });
}

// ── Listeners ─────────────────────────────────────────────────────────────────

chrome.runtime.onInstalled.addListener(() => {
  syncIcon();
  // FIX: crée l'alarme dans onInstalled pour éviter
  // "Cannot read properties of undefined (reading 'create')"
  if (chrome.alarms) {
    chrome.alarms.get('syncIcon', (alarm) => {
      if (!alarm) {
        chrome.alarms.create('syncIcon', { periodInMinutes: 1 });
      }
    });
  }
});

chrome.runtime.onStartup.addListener(syncIcon);

// Sync toutes les minutes via alarms (économe en batterie)
if (chrome.alarms) {
  chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === 'syncIcon') syncIcon();
  });
} else {
  // Fallback si l'API alarms est indisponible
  setInterval(syncIcon, 60_000);
}

// Sync immédiate au démarrage du service worker
syncIcon();
