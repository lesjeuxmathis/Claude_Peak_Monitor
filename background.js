// background.js — Claude Peak Monitor v2.0
// Outil communautaire non officiel — non affilié à Anthropic

const PEAK_START_UTC = 13;
const PEAK_END_UTC   = 19;

function isWeekend() {
  const day = new Date().getUTCDay();
  return day === 0 || day === 6;
}

function isPeakHour() {
  if (isWeekend()) return false;
  const hour = new Date().getUTCHours();
  return hour >= PEAK_START_UTC && hour < PEAK_END_UTC;
}

function syncIcon() {
  const icon = isPeakHour() ? 'icon-peak.png' : 'icon.png';
  chrome.action.setIcon({
    path: { '16': icon, '48': icon, '128': icon }
  });
}

// Sync on install/startup
chrome.runtime.onInstalled.addListener(syncIcon);
chrome.runtime.onStartup.addListener(syncIcon);
syncIcon();

// Sync every minute via alarms (battery-efficient vs setInterval)
chrome.alarms.create('syncIcon', { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
  if (alarm.name === 'syncIcon') syncIcon();
});
