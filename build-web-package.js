#!/usr/bin/env node

/**
 * Script de création du package web commercial
 * Génère un package web prêt pour déploiement client
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌐 Création du Package Web TCF Simulator Pro');
console.log('=============================================');

// Configuration
const packageName = 'TCF-Simulator-Pro-Web-Package';
const version = '1.0.0';
const buildDate = new Date().toISOString().split('T')[0];

// Créer la structure de dossiers
const createDirectoryStructure = () => {
  console.log('📁 Création de la structure de dossiers...');
  
  const dirs = [
    packageName,
    `${packageName}/web-app`,
    `${packageName}/documentation`,
    `${packageName}/server-configs`,
    `${packageName}/deployment-scripts`,
    `${packageName}/templates`
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  ✅ ${dir}`);
    }
  });
};

// Construire l'application web
const buildWebApp = () => {
  console.log('🔨 Construction de l\'application web...');
  
  try {
    execSync('npm run build:web', { stdio: 'inherit' });
    console.log('  ✅ Application web construite');
  } catch (error) {
    console.error('❌ Erreur lors de la construction:', error.message);
    process.exit(1);
  }
};

// Copier les fichiers construits
const copyBuiltFiles = () => {
  console.log('📋 Copie de l\'application web...');
  
  const sourceDir = 'dist';
  const targetDir = `${packageName}/web-app`;
  
  if (fs.existsSync(sourceDir)) {
    // Copier récursivement tous les fichiers
    const copyRecursive = (src, dest) => {
      const stats = fs.statSync(src);
      if (stats.isDirectory()) {
        if (!fs.existsSync(dest)) {
          fs.mkdirSync(dest, { recursive: true });
        }
        fs.readdirSync(src).forEach(file => {
          copyRecursive(path.join(src, file), path.join(dest, file));
        });
      } else {
        fs.copyFileSync(src, dest);
      }
    };
    
    copyRecursive(sourceDir, targetDir);
    console.log('  ✅ Application web copiée');
  }
};

// Créer les configurations serveur
const createServerConfigs = () => {
  console.log('⚙️ Création des configurations serveur...');
  
  // Configuration Apache
  const apacheConfig = `# Configuration Apache pour TCF Simulator Pro
<VirtualHost *:80>
    ServerName tcf-simulator.votre-domaine.com
    DocumentRoot /var/www/tcf-simulator
    
    # Gestion des routes React
    <Directory /var/www/tcf-simulator>
        Options -Indexes +FollowSymLinks
        AllowOverride All
        Require all granted
        
        # Redirection pour React Router
        RewriteEngine On
        RewriteBase /
        RewriteRule ^index\\.html$ - [L]
        RewriteCond %{REQUEST_FILENAME} !-f
        RewriteCond %{REQUEST_FILENAME} !-d
        RewriteRule . /index.html [L]
    </Directory>
    
    # Compression GZIP
    <IfModule mod_deflate.c>
        AddOutputFilterByType DEFLATE text/plain
        AddOutputFilterByType DEFLATE text/html
        AddOutputFilterByType DEFLATE text/xml
        AddOutputFilterByType DEFLATE text/css
        AddOutputFilterByType DEFLATE application/xml
        AddOutputFilterByType DEFLATE application/xhtml+xml
        AddOutputFilterByType DEFLATE application/rss+xml
        AddOutputFilterByType DEFLATE application/javascript
        AddOutputFilterByType DEFLATE application/x-javascript
    </IfModule>
    
    # Cache des assets
    <IfModule mod_expires.c>
        ExpiresActive On
        ExpiresByType text/css "access plus 1 year"
        ExpiresByType application/javascript "access plus 1 year"
        ExpiresByType image/png "access plus 1 year"
        ExpiresByType image/jpg "access plus 1 year"
        ExpiresByType image/jpeg "access plus 1 year"
        ExpiresByType image/gif "access plus 1 year"
        ExpiresByType image/ico "access plus 1 year"
        ExpiresByType image/icon "access plus 1 year"
        ExpiresByType text/ico "access plus 1 year"
        ExpiresByType application/ico "access plus 1 year"
    </IfModule>
</VirtualHost>`;

  fs.writeFileSync(`${packageName}/server-configs/apache.conf`, apacheConfig);

  // Configuration Nginx
  const nginxConfig = `# Configuration Nginx pour TCF Simulator Pro
server {
    listen 80;
    server_name tcf-simulator.votre-domaine.com;
    root /var/www/tcf-simulator;
    index index.html;
    
    # Gestion des routes React
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # Cache des assets statiques
    location ~* \\.(js|css|png|jpg|jpeg|gif|ico|svg)$ {
        expires 1y;
        add_header Cache-Control "public, immutable";
    }
    
    # Compression GZIP
    gzip on;
    gzip_vary on;
    gzip_min_length 1024;
    gzip_proxied expired no-cache no-store private must-revalidate auth;
    gzip_types
        text/plain
        text/css
        text/xml
        text/javascript
        application/javascript
        application/xml+rss
        application/json;
    
    # Sécurité
    add_header X-Frame-Options "SAMEORIGIN" always;
    add_header X-XSS-Protection "1; mode=block" always;
    add_header X-Content-Type-Options "nosniff" always;
    add_header Referrer-Policy "no-referrer-when-downgrade" always;
    add_header Content-Security-Policy "default-src 'self' https: data: 'unsafe-inline' 'unsafe-eval';" always;
}`;

  fs.writeFileSync(`${packageName}/server-configs/nginx.conf`, nginxConfig);

  // Configuration .htaccess
  const htaccessConfig = `# Configuration .htaccess pour TCF Simulator Pro
RewriteEngine On

# Redirection HTTPS (optionnel)
# RewriteCond %{HTTPS} off
# RewriteRule ^(.*)$ https://%{HTTP_HOST}%{REQUEST_URI} [L,R=301]

# Gestion des routes React Router
RewriteBase /
RewriteRule ^index\\.html$ - [L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Compression GZIP
<IfModule mod_deflate.c>
    AddOutputFilterByType DEFLATE text/plain
    AddOutputFilterByType DEFLATE text/html
    AddOutputFilterByType DEFLATE text/xml
    AddOutputFilterByType DEFLATE text/css
    AddOutputFilterByType DEFLATE application/xml
    AddOutputFilterByType DEFLATE application/xhtml+xml
    AddOutputFilterByType DEFLATE application/rss+xml
    AddOutputFilterByType DEFLATE application/javascript
    AddOutputFilterByType DEFLATE application/x-javascript
</IfModule>

# Cache des fichiers statiques
<IfModule mod_expires.c>
    ExpiresActive On
    ExpiresByType text/css "access plus 1 year"
    ExpiresByType application/javascript "access plus 1 year"
    ExpiresByType image/png "access plus 1 year"
    ExpiresByType image/jpg "access plus 1 year"
    ExpiresByType image/jpeg "access plus 1 year"
    ExpiresByType image/gif "access plus 1 year"
    ExpiresByType image/ico "access plus 1 year"
</IfModule>

# Sécurité
<IfModule mod_headers.c>
    Header always set X-Frame-Options SAMEORIGIN
    Header always set X-Content-Type-Options nosniff
    Header always set X-XSS-Protection "1; mode=block"
</IfModule>`;

  fs.writeFileSync(`${packageName}/web-app/.htaccess`, htaccessConfig);
  
  console.log('  ✅ Configurations serveur créées');
};

// Créer les scripts de déploiement
const createDeploymentScripts = () => {
  console.log('🚀 Création des scripts de déploiement...');
  
  // Script de déploiement FTP
  const ftpScript = `#!/bin/bash
# Script de déploiement FTP pour TCF Simulator Pro

echo "🚀 Déploiement TCF Simulator Pro via FTP"
echo "========================================"

# Configuration (à modifier selon vos besoins)
FTP_HOST="ftp.votre-hebergeur.com"
FTP_USER="votre-username"
FTP_PASS="votre-password"
REMOTE_DIR="/public_html/tcf-simulator"
LOCAL_DIR="./web-app"

# Vérification des prérequis
if ! command -v lftp &> /dev/null; then
    echo "❌ lftp n'est pas installé. Installation..."
    sudo apt-get update && sudo apt-get install -y lftp
fi

echo "📤 Upload des fichiers..."
lftp -c "
set ftp:ssl-allow no;
open ftp://$FTP_USER:$FTP_PASS@$FTP_HOST;
lcd $LOCAL_DIR;
cd $REMOTE_DIR;
mirror --reverse --delete --verbose --exclude-glob .git* --exclude-glob .DS_Store;
bye;
"

echo "✅ Déploiement terminé !"
echo "🌐 Votre application est maintenant en ligne"`;

  fs.writeFileSync(`${packageName}/deployment-scripts/deploy-ftp.sh`, ftpScript);

  // Script de déploiement cPanel
  const cpanelScript = `#!/bin/bash
# Script de déploiement cPanel pour TCF Simulator Pro

echo "🚀 Déploiement TCF Simulator Pro via cPanel"
echo "==========================================="

# Configuration
CPANEL_URL="https://votre-domaine.com:2083"
CPANEL_USER="votre-username"
CPANEL_PASS="votre-password"
DOMAIN="tcf-simulator.votre-domaine.com"

echo "📁 Préparation de l'archive..."
cd web-app
zip -r ../tcf-simulator-web.zip . -x "*.DS_Store*" "*.git*"
cd ..

echo "📤 Upload via cPanel File Manager..."
echo "1. Connectez-vous à $CPANEL_URL"
echo "2. Ouvrez le File Manager"
echo "3. Naviguez vers public_html/$DOMAIN"
echo "4. Uploadez tcf-simulator-web.zip"
echo "5. Extrayez l'archive"
echo "6. Supprimez l'archive"

echo "✅ Instructions de déploiement affichées"
echo "🌐 Votre application sera accessible sur https://$DOMAIN"`;

  fs.writeFileSync(`${packageName}/deployment-scripts/deploy-cpanel.sh`, cpanelScript);

  // Rendre les scripts exécutables
  try {
    execSync(`chmod +x ${packageName}/deployment-scripts/*.sh`);
  } catch (error) {
    // Ignore sur Windows
  }

  console.log('  ✅ Scripts de déploiement créés');
};

// Créer la documentation web
const createWebDocumentation = () => {
  console.log('📚 Création de la documentation web...');
  
  const webInstallGuide = `# 🌐 Guide d'Installation Web - TCF Simulator Pro

## 🎯 **DÉPLOIEMENT WEB PROFESSIONNEL**

### 📋 **Prérequis**
- **Hébergement web** avec support PHP (optionnel)
- **Nom de domaine** configuré
- **Accès FTP** ou panneau de contrôle
- **Base de données Supabase** configurée

---

## 🚀 **MÉTHODES DE DÉPLOIEMENT**

### 📁 **Méthode 1: Upload FTP**
1. **Connectez-vous** à votre FTP
2. **Naviguez** vers le dossier public_html
3. **Uploadez** tout le contenu du dossier \`web-app/\`
4. **Configurez** le domaine vers ce dossier

### 🖥️ **Méthode 2: cPanel/Plesk**
1. **Connectez-vous** à votre panneau de contrôle
2. **Ouvrez** le gestionnaire de fichiers
3. **Uploadez** l'archive ZIP
4. **Extrayez** dans le bon dossier

### ⚡ **Méthode 3: Script Automatique**
\`\`\`bash
# Utilisez notre script de déploiement
chmod +x deployment-scripts/deploy-ftp.sh
./deployment-scripts/deploy-ftp.sh
\`\`\`

---

## ⚙️ **CONFIGURATION SERVEUR**

### 🔧 **Apache (.htaccess inclus)**
- ✅ **Redirection** des routes React
- ✅ **Compression GZIP** activée
- ✅ **Cache** des assets statiques
- ✅ **Sécurité** renforcée

### 🔧 **Nginx**
- Copiez \`server-configs/nginx.conf\`
- Adaptez le nom de domaine
- Redémarrez Nginx

---

## 🌐 **CONFIGURATION DOMAINE**

### 📝 **DNS à Configurer**
\`\`\`
Type: A
Nom: tcf-simulator (ou @)
Valeur: IP_DE_VOTRE_SERVEUR
TTL: 3600
\`\`\`

### 🔒 **SSL/HTTPS (Recommandé)**
- **Let's Encrypt** (gratuit)
- **Certificat payant**
- **Cloudflare** (gratuit)

---

## 🎯 **AVANTAGES VERSION WEB**

### ✅ **Pour Vos Clients**
- **Accès universel** - Depuis n'importe quel navigateur
- **Pas d'installation** - Fonctionne immédiatement
- **Multi-plateforme** - Windows, Mac, Linux, tablettes
- **Mises à jour automatiques** - Toujours la dernière version

### ✅ **Pour Vous (Vendeur)**
- **Déploiement simple** - Un seul upload
- **Maintenance centralisée** - Mises à jour instantanées
- **Support simplifié** - Moins de problèmes techniques
- **Évolutivité** - Facile d'ajouter des fonctionnalités

---

## 💰 **MODÈLES COMMERCIAUX WEB**

### 🏷️ **Hébergement Inclus (3,500€)**
- Application web complète
- Hébergement 1 an inclus
- Domaine personnalisé
- Support technique

### 🏷️ **Licence Web (2,000€)**
- Fichiers web à déployer
- Documentation complète
- Support installation
- Mises à jour 1 an

### 🏷️ **SaaS Hébergé (500€/mois)**
- Application hébergée chez vous
- Maintenance incluse
- Support prioritaire
- Personnalisation

---

## 🔧 **SUPPORT TECHNIQUE**

### 📞 **Assistance Déploiement**
- **Email:** support@brixelacademy.com
- **Installation à distance** disponible
- **Formation** équipes incluse
- **Documentation** complète fournie

### 🆘 **Problèmes Courants**
- **Routes ne fonctionnent pas** → Vérifier .htaccess
- **Assets ne se chargent pas** → Vérifier les permissions
- **Erreurs Supabase** → Vérifier la configuration

---

## ✅ **CHECKLIST DÉPLOIEMENT**

### 🎯 **Avant Déploiement**
- [ ] Hébergement web configuré
- [ ] Domaine pointé vers l'hébergement
- [ ] Base de données Supabase prête
- [ ] Certificat SSL installé

### 🎯 **Après Déploiement**
- [ ] Application accessible via le domaine
- [ ] Connexion base de données OK
- [ ] Tests de fonctionnement complets
- [ ] Formation équipe client réalisée

---

## 🎉 **DÉPLOIEMENT RÉUSSI !**

Votre TCF Simulator Pro est maintenant accessible en ligne !

**Avantages de la version web :**
- ✅ **Accès universel** depuis tout navigateur
- ✅ **Pas d'installation** requise
- ✅ **Mises à jour centralisées**
- ✅ **Support simplifié**

---

*© 2024 Brixel Academy. Guide de déploiement web.*`;

  fs.writeFileSync(`${packageName}/documentation/WEB-INSTALLATION-GUIDE.md`, webInstallGuide);

  const webSalesGuide = `# 💼 Guide de Vente Web - TCF Simulator Pro

## 🌐 **VERSION WEB - ARGUMENTS DE VENTE**

### 🎯 **Avantages Uniques Version Web**

#### ⚡ **Accès Immédiat**
- **"Vos étudiants accèdent au test depuis n'importe quel navigateur"**
- **"Pas d'installation, pas de mise à jour à gérer"**
- **"Fonctionne sur PC, Mac, tablettes, smartphones"**

#### 🔄 **Maintenance Simplifiée**
- **"Mises à jour automatiques et transparentes"**
- **"Un seul point de maintenance pour tous vos utilisateurs"**
- **"Support technique simplifié"**

#### 💰 **Coût Total Réduit**
- **"Pas de déploiement sur chaque poste"**
- **"Économies sur la maintenance IT"**
- **"Évolutivité sans limite"**

---

## 💵 **GRILLE TARIFAIRE WEB**

### 🏷️ **Packages Web Commerciaux**

#### 🌐 **WEB STARTER** - 2,000€
- **Application web complète**
- **Jusqu'à 100 utilisateurs simultanés**
- **Documentation déploiement**
- **Support email 6 mois**
- **Mises à jour 1 an**

#### 🌐 **WEB PROFESSIONAL** - 3,500€
- **Application web + hébergement 1 an**
- **Jusqu'à 500 utilisateurs simultanés**
- **Domaine personnalisé inclus**
- **Installation par nos soins**
- **Support prioritaire 12 mois**
- **Formation équipe incluse**

#### 🌐 **WEB ENTERPRISE** - 5,000€
- **Solution complète hébergée**
- **Utilisateurs illimités**
- **Personnalisation interface**
- **Intégration systèmes existants**
- **Support dédié**
- **SLA 99.9% uptime**

### 💰 **Options SaaS**
- **SaaS Hébergé** - **300€/mois**
- **Maintenance incluse**
- **Mises à jour automatiques**
- **Support technique continu**

---

## 🎯 **ARGUMENTS COMMERCIAUX**

### 💡 **Face à la Concurrence Desktop**
**"Pourquoi choisir la version web ?"**
- ✅ **Accès universel** - Pas de limite d'OS
- ✅ **Déploiement instantané** - En ligne en 1 heure
- ✅ **Maintenance zéro** - Tout est automatique
- ✅ **Évolutivité** - Grandit avec vos besoins

### 💡 **Face aux Solutions Existantes**
**"Pourquoi TCF Simulator Pro Web ?"**
- ✅ **Temps réel** - Seule solution avec sync instantanée
- ✅ **Complet** - Toutes les sections TCF incluses
- ✅ **Professionnel** - Interface moderne et intuitive
- ✅ **Support** - Équipe technique dédiée

---

## 📞 **SCRIPTS DE VENTE WEB**

### 🎯 **Accroche Téléphonique**
> "Bonjour [Nom], nous avons développé la première solution web TCF qui permet à vos étudiants de passer des examens depuis n'importe quel navigateur, avec des résultats instantanés. Vos étudiants peuvent même passer le test depuis chez eux. Avez-vous 5 minutes pour une démonstration ?"

### 🎯 **Démonstration Web (10 minutes)**
1. **Accès universel** (2 min) - Montrer sur différents appareils
2. **Interface admin** (3 min) - Création d'examen en direct
3. **Expérience étudiant** (3 min) - Test complet
4. **Résultats temps réel** (2 min) - Certificats automatiques

### 🎯 **Closing Web**
> "Imaginez : demain matin, vous envoyez un simple lien à vos étudiants, et ils peuvent immédiatement passer leurs examens TCF. Pas d'installation, pas de configuration, juste un lien. Voulez-vous que nous mettions cela en place pour vous cette semaine ?"

---

## 🏢 **CLIENTS CIBLES WEB**

### 🎯 **Priorité 1 - Écoles Distantes**
- **Cours en ligne** - Étudiants dispersés géographiquement
- **Formation à distance** - Besoin d'accès universel
- **Écoles internationales** - Multi-sites

### 🎯 **Priorité 2 - Centres Modernes**
- **BYOD (Bring Your Own Device)** - Étudiants avec leurs appareils
- **Flexibilité** - Tests à domicile possibles
- **Innovation** - Centres technologiquement avancés

---

## 📊 **MÉTRIQUES DE SUCCÈS WEB**

### 📈 **Objectifs Commerciaux**
- **30 clients web** première année
- **Chiffre d'affaires:** 100,000€
- **Taux de conversion:** 35% (plus élevé que desktop)
- **Satisfaction:** >95% (facilité d'accès)

### 🎯 **Avantages Vendeur**
- **Démonstration plus facile** - Juste un lien à envoyer
- **Déploiement plus rapide** - En ligne en quelques heures
- **Support simplifié** - Moins de problèmes techniques
- **Évolutivité** - Facile d'ajouter des fonctionnalités

---

## 🎉 **VERSION WEB PRÊTE !**

**Votre TCF Simulator Pro Web est une solution moderne et accessible qui répond aux besoins actuels de formation à distance et de flexibilité d'accès.**

**Commencez à vendre dès aujourd'hui !** 🚀💰

---

*© 2024 Brixel Academy. Guide de vente web confidentiel.*`;

  fs.writeFileSync(`${packageName}/documentation/WEB-SALES-GUIDE.md`, webSalesGuide);
  
  console.log('  ✅ Documentation web créée');
};

// Créer le README du package web
const createWebPackageReadme = () => {
  console.log('📄 Création du README web...');
  
  const readme = `# 🌐 TCF Simulator Pro - Package Web Commercial

**Version:** ${version}  
**Date de création:** ${buildDate}  
**Type:** Application Web Commerciale  
**Développé par:** Brixel Academy  

## 🎯 **SOLUTION WEB COMPLÈTE**

### ✅ **Avantages de la Version Web**
- 🌐 **Accès universel** - Depuis tout navigateur
- ⚡ **Déploiement instantané** - En ligne en 1 heure
- 🔄 **Mises à jour automatiques** - Toujours la dernière version
- 📱 **Multi-plateforme** - PC, Mac, tablettes, smartphones
- 💰 **Coût réduit** - Pas d'installation sur chaque poste

---

## 📦 **Contenu du Package**

### 🌐 **Application Web**
- **Fichiers optimisés** pour production
- **Compression GZIP** activée
- **Cache des assets** configuré
- **Routes React** gérées

### ⚙️ **Configurations Serveur**
- **Apache** - Configuration .htaccess
- **Nginx** - Fichier de configuration
- **Sécurité** - Headers et protections

### 🚀 **Scripts de Déploiement**
- **FTP automatique** - Upload en une commande
- **cPanel** - Instructions détaillées
- **Vérifications** - Tests post-déploiement

### 📚 **Documentation Complète**
- **Guide d'installation web**
- **Guide de vente web**
- **Support technique**
- **Dépannage**

---

## 🚀 **Déploiement Rapide**

### ⚡ **Méthode Express (5 minutes)**
1. **Uploadez** le dossier \`web-app/\` sur votre serveur
2. **Configurez** votre domaine
3. **Testez** l'accès
4. **C'est prêt !**

### 🔧 **Méthode Automatique**
\`\`\`bash
# Configuration FTP dans le script
./deployment-scripts/deploy-ftp.sh
\`\`\`

---

## 💰 **Modèles Commerciaux**

### 🏷️ **Vente Directe**
- **Licence web:** 2,000€ - 5,000€
- **Installation incluse**
- **Support 12 mois**

### 🏷️ **SaaS Hébergé**
- **Abonnement mensuel:** 300€ - 800€
- **Maintenance incluse**
- **Évolutivité garantie**

### 🏷️ **Hébergement Inclus**
- **Package complet:** 3,500€
- **Domaine + hébergement 1 an**
- **Installation par nos soins**

---

## 🎯 **Clients Cibles**

### 🏫 **Écoles et Centres de Formation**
- Formation à distance
- Accès multi-sites
- BYOD (appareils personnels)

### 🌍 **Organisations Internationales**
- Étudiants dispersés géographiquement
- Besoin de flexibilité d'accès
- Tests à domicile

### 🏢 **Entreprises**
- Formation des employés
- Évaluation linguistique
- Accès depuis différents bureaux

---

## 📞 **Support et Contact**

### 🆘 **Support Technique**
- **Email:** support@brixelacademy.com
- **Installation à distance** disponible
- **Formation** équipes incluse

### 📚 **Ressources**
- **Documentation:** Complète et détaillée
- **Scripts:** Déploiement automatisé
- **Exemples:** Configurations serveur

---

## ✅ **Prérequis Techniques**

### 🌐 **Hébergement Web**
- **Serveur web** (Apache/Nginx)
- **PHP** optionnel (pour certaines fonctionnalités)
- **HTTPS** recommandé
- **Domaine** configuré

### 💾 **Base de Données**
- **Supabase** (inclus dans le package)
- **Configuration** automatique
- **Sauvegarde** cloud

---

## 🎉 **PRÊT POUR LA VENTE !**

**Votre TCF Simulator Pro Web est une solution moderne, accessible et rentable qui répond aux besoins actuels du marché de la formation linguistique.**

### 🚀 **Avantages Concurrentiels**
- ✅ **Seule solution TCF web temps réel**
- ✅ **Interface moderne et intuitive**
- ✅ **Déploiement en quelques heures**
- ✅ **Support technique inclus**
- ✅ **Évolutivité sans limite**

**Commencez à vendre dès maintenant !** 💰

---

*© 2024 Brixel Academy. Tous droits réservés. Solution web commerciale.*`;

  fs.writeFileSync(`${packageName}/README.md`, readme);
  console.log('  ✅ README web créé');
};

// Créer l'archive finale
const createFinalArchive = () => {
  console.log('📦 Création de l\'archive web finale...');
  
  try {
    const archiveName = `${packageName}-v${version}-${buildDate}.zip`;
    execSync(`zip -r "${archiveName}" "${packageName}"`, { stdio: 'inherit' });
    console.log(`  ✅ Archive créée: ${archiveName}`);
    
    // Afficher la taille
    const stats = fs.statSync(archiveName);
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2);
    console.log(`  📊 Taille: ${sizeMB} MB`);
    
  } catch (error) {
    console.error('❌ Erreur lors de la création de l\'archive:', error.message);
    console.log('💡 Vous pouvez créer l\'archive manuellement');
  }
};

// Fonction principale
const main = async () => {
  try {
    createDirectoryStructure();
    buildWebApp();
    copyBuiltFiles();
    createServerConfigs();
    createDeploymentScripts();
    createWebDocumentation();
    createWebPackageReadme();
    createFinalArchive();
    
    console.log('');
    console.log('🎉 PACKAGE WEB CRÉÉ AVEC SUCCÈS !');
    console.log('==================================');
    console.log(`🌐 Dossier: ${packageName}/`);
    console.log(`📋 Archive: ${packageName}-v${version}-${buildDate}.zip`);
    console.log('');
    console.log('✅ Votre application web est prête pour le déploiement !');
    console.log('🚀 Déployez sur n\'importe quel hébergeur web');
    console.log('💰 Vendez comme solution SaaS ou licence web');
    console.log('');
    console.log('📁 Contenu du package :');
    console.log('  🌐 web-app/ - Application prête à déployer');
    console.log('  ⚙️ server-configs/ - Configurations Apache/Nginx');
    console.log('  🚀 deployment-scripts/ - Scripts de déploiement');
    console.log('  📚 documentation/ - Guides complets');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du package web:', error.message);
    process.exit(1);
  }
};

// Exécuter le script
main();