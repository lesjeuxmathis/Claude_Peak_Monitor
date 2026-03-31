const START_PEAK_UTC = 13;
const END_PEAK_UTC   = 19;

function isPeakHour() {
    const now = new Date();
    
    const localHour = now.getHours();        
    const utcHour   = now.getUTCHours();     

    const offset = localHour - utcHour;
    
    let peakStartLocal = (START_PEAK_UTC + offset + 24) % 24;
    let peakEndLocal   = (END_PEAK_UTC + offset + 24) % 24;

    if (peakEndLocal < peakStartLocal) {
        return localHour >= peakStartLocal || localHour < peakEndLocal;
    }

    return localHour >= peakStartLocal && localHour < peakEndLocal;
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