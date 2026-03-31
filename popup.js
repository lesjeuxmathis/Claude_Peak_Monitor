const START_PEAK_UTC = 13;
const END_PEAK_UTC   = 19;

const statusBox = document.getElementById('status-box');
const timerEl = document.getElementById('timer');
const messageEl = document.getElementById('message');
const progressContainer = document.getElementById('progress-container');
const progressBar = document.getElementById('progress-bar');
const footerEl = document.getElementById('footer');

// Fonction pour obtenir les heures de pointe en heure locale
function getLocalPeakHours() {
    const now = new Date();
    
    // Créer des dates UTC pour le début et la fin
    const startUTC = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), START_PEAK_UTC, 0, 0));
    const endUTC   = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate(), END_PEAK_UTC, 0, 0));

    // Convertir en heure locale
    const startLocalHour = startUTC.getHours();
    const endLocalHour   = endUTC.getHours();

    // Nom du fuseau horaire (ex: CEST, EDT, etc.)
    const timeZoneName = Intl.DateTimeFormat().resolvedOptions().timeZone;
    const shortTZ = new Intl.DateTimeFormat('fr-FR', { 
        timeZone: timeZoneName, 
        timeZoneName: 'short' 
    }).formatToParts(now).find(part => part.type === 'timeZoneName')?.value || '';

    return {
        start: startLocalHour,
        end: endLocalHour,
        tz: shortTZ ? `(${shortTZ})` : '(heure locale)'
    };
}

// Mise à jour du footer avec les heures locales
function updateFooter() {
    const local = getLocalPeakHours();
    footerEl.innerHTML = `
        Heures de pointe • ${local.start}h – ${local.end}h ${local.tz}<br>
        Ralentissements & bugs plus fréquents
    `;
}

function pad(num) {
    return num.toString().padStart(2, '0');
}

function updateClock() {
    const now = new Date();
    const currentHour = now.getUTCHours();   // On garde UTC pour la logique interne
    const currentMin = now.getUTCMinutes();
    const currentSec = now.getUTCSeconds();

    const isPeak = currentHour >= START_PEAK_UTC && currentHour < END_PEAK_UTC;

    if (isPeak) {
        // ... (le reste du code reste exactement le même que dans ma version précédente)
        statusBox.textContent = "⚠️ HEURE DE POINTE";
        statusBox.className = "status peak";

        const remainingHours = END_PEAK_UTC - 1 - currentHour;
        const remainingMins = 59 - currentMin;
        const remainingSecs = 59 - currentSec;

        timerEl.textContent = `${pad(remainingHours)}h ${pad(remainingMins)}m ${pad(remainingSecs)}s`;

        const minutesIntoPeak = (currentHour - START_PEAK_UTC) * 60 + currentMin;
        const totalPeakMinutes = (END_PEAK_UTC - START_PEAK_UTC) * 60;
        const progress = Math.min(100, (minutesIntoPeak / totalPeakMinutes) * 100);

        progressContainer.style.display = 'block';
        progressBar.style.width = `${progress}%`;

        messageEl.innerHTML = `
            <strong>Attention :</strong> Claude est actuellement très chargé.<br>
            → Réponses plus lentes<br>
            → Bugs et erreurs plus fréquents<br>
            → Limites d'utilisation épuisées plus vite
        `;

    } else {
        // ... (le reste du code "zone calme" reste identique)
        statusBox.textContent = "✅ ZONE CALME";
        statusBox.className = "status normal";
        progressContainer.style.display = 'none';

        let hoursUntil = currentHour < START_PEAK_UTC 
            ? START_PEAK_UTC - currentHour - 1 
            : (24 - currentHour) + START_PEAK_UTC - 1;

        let minsUntil = 59 - currentMin;

        if (hoursUntil === 0) {
            const secsUntil = 59 - currentSec;
            timerEl.textContent = `Pic dans : ${pad(minsUntil)}m ${pad(secsUntil)}s`;
        } else {
            timerEl.textContent = `Pic dans : ${pad(hoursUntil)}h ${pad(minsUntil)}m`;
        }

        messageEl.textContent = "C'est le meilleur moment pour utiliser Claude (plus rapide et plus stable).";
    }
}

// Initialisation
updateFooter();
setInterval(updateClock, 1000);
updateClock();