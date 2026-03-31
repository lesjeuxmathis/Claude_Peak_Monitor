const START_PEAK_UTC = 13;
const END_PEAK_UTC   = 19;

function isWeekend() {
    const day = new Date().getUTCDay();
    return day === 0 || day === 6;
}

function isPeakHour() {
    if (isWeekend()) return false;

    const now = new Date();
    const utcHour = now.getUTCHours();
    
    return utcHour >= START_PEAK_UTC && utcHour < END_PEAK_UTC;
}

function updateIcon() {
    const isPeak = isPeakHour();

    if (isPeak) {
        chrome.action.setIcon({
            path: {
                "16":  "icon-peak.png",
                "48":  "icon-peak.png",
                "128": "icon-peak.png"
            }
        });
    } else {
        chrome.action.setIcon({
            path: {
                "16":  "icon.png",
                "48":  "icon.png",
                "128": "icon.png"
            }
        });
    }
}

updateIcon();
setInterval(updateIcon, 300000);

chrome.alarms.create("updateIcon", { periodInMinutes: 1 });
chrome.alarms.onAlarm.addListener((alarm) => {
    if (alarm.name === "updateIcon") updateIcon();
});