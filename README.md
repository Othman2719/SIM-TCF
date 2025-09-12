# Simulateur TCF - Desktop Application

Test de Connaissance du Français - Application de bureau construite avec Electron et React.

## 🚀 Développement

### Prérequis
- Node.js (version 16 ou supérieure)
- npm ou yarn

### Installation
```bash
npm install
```

### Lancement en mode développement
```bash
# Démarrer l'application web uniquement
npm run dev

# Démarrer l'application Electron en mode développement
npm run electron-dev
```

### Construction et packaging
```bash
# Construire l'application web
npm run build

# Lancer Electron avec l'application construite
npm run electron-build

# Créer un installateur pour toutes les plateformes
npm run dist

# Créer un installateur pour Windows uniquement
npm run dist-win

# Créer un installateur pour macOS uniquement
npm run dist-mac

# Créer un installateur pour Linux uniquement
npm run dist-linux
```

## 📦 Structure du projet

- `src/` - Code source React
- `electron-main.js` - Processus principal Electron
- `electron-preload.js` - Script de préchargement Electron
- `assets/` - Icônes de l'application
- `dist/` - Application React construite
- `electron-dist/` - Installateurs générés

## 🖥️ Fonctionnalités Desktop

- Interface native avec menus système
- Raccourcis clavier
- Boîtes de dialogue natives pour sauvegarder les fichiers
- Support multi-plateforme (Windows, macOS, Linux)
- Pas besoin de navigateur web

## 📋 Scripts disponibles

- `npm run dev` - Serveur de développement Vite
- `npm run build` - Construction pour production
- `npm run electron` - Lancer Electron (nécessite une construction préalable)
- `npm run electron-dev` - Développement Electron avec rechargement automatique
- `npm run electron-build` - Construire et lancer Electron
- `npm run dist` - Créer les installateurs
- `npm run dist-win` - Installateur Windows (.exe)
- `npm run dist-mac` - Installateur macOS (.dmg)
- `npm run dist-linux` - Installateur Linux (.AppImage)

## 🎯 Prochaines étapes

1. Ajouter des icônes d'application dans le dossier `assets/`
2. Configurer la signature de code pour la distribution
3. Implémenter les mises à jour automatiques
4. Ajouter plus de fonctionnalités desktop-spécifiques
