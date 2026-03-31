// content.js - Version finale recommandée

const START_PEAK_UTC = 13;
const END_PEAK_UTC   = 19;

function isWeekend() {
    const day = new Date().getUTCDay(); // 0 = dimanche, 6 = samedi
    return day === 0 || day === 6;
}

function isPeakHour() {
    if (isWeekend()) return false;   // Rien les week-ends

    const hour = new Date().getUTCHours();
    return hour >= START_PEAK_UTC && hour < END_PEAK_UTC;
}

function createWarningBadge() {
    if (document.getElementById('claude-peak-badge')) return;

    const badge = document.createElement('div');
    badge.id = 'claude-peak-badge';
    badge.style.cssText = `
        position: fixed;
        top: 16px;
        right: 16px;
        background: rgba(225, 115, 60, 0.95);
        color: white;
        padding: 8px 14px;
        border-radius: 9999px;
        font-size: 13px;
        font-weight: 600;
        box-shadow: 0 4px 15px rgba(225, 115, 60, 0.3);
        z-index: 999999;
        display: flex;
        align-items: center;
        gap: 7px;
        backdrop-filter: blur(8px);
        border: 1px solid rgba(255,255,255,0.2);
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        cursor: default;
        user-select: none;
        opacity: 0;
        transform: translateY(-10px);
    `;

    badge.innerHTML = `
        ⚠️ <span>Heure de pointe</span>
        <span style="font-size:11px; opacity:0.9;">(ralentissements & bugs fréquents)</span>
    `;

    // Bouton fermer
    const closeBtn = document.createElement('span');
    closeBtn.textContent = '✕';
    closeBtn.style.cssText = `
        margin-left: 8px;
        font-size: 16px;
        opacity: 0.75;
        cursor: pointer;
        padding: 2px 6px;
        border-radius: 50%;
    `;
    closeBtn.onmouseover = () => closeBtn.style.opacity = '1';
    closeBtn.onmouseout = () => closeBtn.style.opacity = '0.75';
    closeBtn.onclick = (e) => {
        e.stopPropagation();
        badge.style.opacity = '0';
        badge.style.transform = 'translateY(-10px)';
        setTimeout(() => badge.remove(), 400);
        
        // Masquer pendant 30 minutes
        localStorage.setItem('claude_peak_badge_hidden_until', Date.now() + 30 * 60 * 1000);
    };

    badge.appendChild(closeBtn);
    document.body.appendChild(badge);

    // Animation d'apparition
    setTimeout(() => {
        badge.style.opacity = '1';
        badge.style.transform = 'translateY(0)';
    }, 10);
}

function checkAndShowBadge() {
    // Respecter le masquage temporaire
    const hiddenUntil = localStorage.getItem('claude_peak_badge_hidden_until');
    if (hiddenUntil && Date.now() < parseInt(hiddenUntil)) {
        return;
    }

    if (isPeakHour()) {
        createWarningBadge();
    } else {
        const existing = document.getElementById('claude-peak-badge');
        if (existing) existing.remove();
    }
}

// Vérification régulière + au chargement
setInterval(checkAndShowBadge, 25000);
checkAndShowBadge();

// Quand l'utilisateur revient sur l'onglet
document.addEventListener('visibilitychange', () => {
    if (!document.hidden) checkAndShowBadge();
});