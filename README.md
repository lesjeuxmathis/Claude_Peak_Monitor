# 🪨 Claude Peak Monitor

**L'extension Chrome qui t'aide à éviter les heures de pointe sur Claude.ai**

Saviez-vous que Claude est **beaucoup plus lent et bug beaucoup plus souvent** entre **13h et 19h GMT** ?  
Cette extension te prévient en temps réel pour que tu puisses utiliser Claude au meilleur moment.

![Claude Peak Monitor](https://via.placeholder.com/800x400/ C15F3C/FFFFFF?text=Claude+Peak+Monitor)  
*(Ajoute ici une capture d'écran du popup ou du banner)*

## ✨ Fonctionnalités

- **Détection en temps réel** des heures de pointe (13h - 19h GMT)
- **Popup élégant** avec timer précis et barre de progression
- **Avertissement discret** directement sur les pages `claude.ai/chat/*` et `claude.ai/new`
- **Adaptation automatique** à ton fuseau horaire local
- Design moderne inspiré des couleurs officielles de Claude (terracotta orange)
- Mode clair / sombre automatique

## 📸 Aperçu

**Dans le popup :**

- Statut clair : "✅ Zone calme" ou "⚠️ Heure de pointe"
- Timer restant jusqu’à la fin ou jusqu’au prochain pic
- Messages utiles sur les ralentissements et bugs

**Sur claude.ai :**

Un badge élégant et non-intrusif apparaît en haut à droite pendant les heures de pointe avec la mention :
> ⚠️ Heure de pointe — Ralentissements & bugs fréquents

## 🚀 Installation

1. Télécharge ou clone ce repository
2. Ouvre Chrome et va sur `chrome://extensions/`
3. Active le **Mode développeur** (en haut à droite)
4. Clique sur **"Charger l'extension non empaquetée"**
5. Sélectionne le dossier de l'extension

C’est prêt ! L’extension fonctionne immédiatement.

## ⚙️ Configuration

Aucune configuration requise.  
L’extension détecte automatiquement :
- L’heure UTC pour les pics de charge
- Ton fuseau horaire local pour afficher les heures correctement

## 🛠 Technologies utilisées

- **Manifest V3**
- JavaScript vanilla
- CSS moderne avec variables et dark mode
- `Intl.DateTimeFormat` pour la détection du fuseau horaire

## 📋 Fichiers principaux

- `manifest.json` — Configuration de l’extension
- `popup.html` + `popup.js` — Interface du popup
- `content.js` — Banner discret sur claude.ai

## 👨‍💻 Auteur

Créé avec ❤️ pour la communauté Claude.ai

## 📄 Licence

[MIT License](LICENSE) — Tu es libre de l’utiliser, la modifier et la distribuer.

---

**Tu utilises déjà l’extension ?**  
Fais-moi un retour ou propose des améliorations !  
N’hésite pas à mettre une ⭐ si elle t’aide à gagner du temps avec Claude.

---

**Prochaines évolutions possibles :**
- Notifications push quand la pointe commence/finit
- Badge sur l’icône de l’extension
- Historique des jours chargés
- Support multi-langues

Tu veux que je t’aide à ajouter une de ces fonctionnalités ?
