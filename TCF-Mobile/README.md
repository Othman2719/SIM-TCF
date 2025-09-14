# TCF Test Simulator - Mobile App

Une application mobile React Native/Expo pour le simulateur de Test de Connaissance du Français (TCF).

## Fonctionnalités

### Pour les Utilisateurs
- **Authentification sécurisée** avec comptes utilisateur
- **Interface mobile optimisée** pour smartphones et tablettes
- **Test TCF complet** avec trois sections :
  - Compréhension Orale (avec simulation audio)
  - Structures de la Langue (grammaire)
  - Compréhension Écrite
- **Minuteur automatique** de 90 minutes
- **Navigation intuitive** entre les questions
- **Sauvegarde automatique** des réponses
- **Résultats détaillés** avec niveau CECR
- **Révision complète** des questions et réponses

### Pour les Administrateurs
- **Panel d'administration** complet
- **Gestion des utilisateurs** (création, modification, suppression)
- **Statistiques d'utilisation**
- **Interface dédiée** pour la gestion du contenu

## Technologies Utilisées

- **React Native** avec Expo
- **TypeScript** pour la sécurité des types
- **React Navigation** pour la navigation
- **AsyncStorage** pour la persistance des données
- **Expo Vector Icons** pour les icônes
- **Context API** pour la gestion d'état

## Installation et Démarrage

### Prérequis
- Node.js (version 16 ou supérieure)
- Expo CLI installé globalement
- Un émulateur Android/iOS ou l'app Expo Go sur votre téléphone

### Installation
```bash
cd TCF-Mobile
npm install
```

### Démarrage
```bash
npm start
```

Puis scannez le QR code avec l'app Expo Go ou lancez sur un émulateur.

## Comptes de Test

### Administrateur
- **Nom d'utilisateur :** admin
- **Mot de passe :** admin123

### Client
- **Nom d'utilisateur :** client
- **Mot de passe :** client123

## Structure du Projet

```
TCF-Mobile/
├── src/
│   ├── components/          # Composants réutilisables
│   ├── contexts/           # Contextes React (Auth, Test)
│   ├── data/              # Données mockées
│   ├── screens/           # Écrans de l'application
│   └── utils/             # Utilitaires
├── assets/                # Images et ressources
└── App.tsx               # Point d'entrée principal
```

## Fonctionnalités Spécifiques Mobile

- **Interface tactile optimisée** pour les interactions mobiles
- **Gestion des orientations** portrait/paysage
- **Navigation par gestes** native
- **Stockage local** avec AsyncStorage
- **Alertes natives** pour les confirmations
- **Modales adaptées** aux écrans mobiles

## Différences avec la Version Web

- **Audio simulé** (dans un vrai déploiement, intégrer des fichiers audio réels)
- **Stockage local** au lieu de localStorage
- **Navigation native** au lieu du routeur web
- **Composants natifs** optimisés pour mobile
- **Gestion des permissions** pour l'audio (si implémenté)

## Développement Futur

- Intégration d'audio réel avec Expo AV
- Synchronisation avec un backend
- Notifications push pour les rappels
- Mode hors ligne complet
- Partage de certificats
- Analytics d'utilisation

## Support

Cette application est compatible avec :
- **iOS** 11.0+
- **Android** API 21+
- **Expo Go** pour le développement

## Licence

Projet éducatif - Tous droits réservés