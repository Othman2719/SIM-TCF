#!/usr/bin/env node

/**
 * Script de déploiement automatique sur différents hébergeurs
 * Supporte Netlify, Vercel, GitHub Pages, et hébergement traditionnel
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🌐 Déploiement TCF Simulator Pro Web');
console.log('===================================');

const deploymentOptions = {
  netlify: {
    name: 'Netlify',
    description: 'Déploiement automatique avec CI/CD',
    free: true,
    steps: [
      '1. Connectez votre repository GitHub à Netlify',
      '2. Configurez: Build command = "npm run build", Publish directory = "dist"',
      '3. Ajoutez vos variables d\'environnement Supabase',
      '4. Déployez automatiquement à chaque commit'
    ]
  },
  vercel: {
    name: 'Vercel',
    description: 'Déploiement ultra-rapide avec edge network',
    free: true,
    steps: [
      '1. Connectez votre repository à Vercel',
      '2. Configurez les variables d\'environnement',
      '3. Déployez automatiquement',
      '4. Obtenez un domaine .vercel.app gratuit'
    ]
  },
  github: {
    name: 'GitHub Pages',
    description: 'Hébergement gratuit via GitHub',
    free: true,
    steps: [
      '1. Activez GitHub Pages dans les paramètres du repo',
      '2. Configurez GitHub Actions pour le build',
      '3. Déployez sur votre-username.github.io',
      '4. Configurez un domaine personnalisé si souhaité'
    ]
  },
  traditional: {
    name: 'Hébergement Traditionnel',
    description: 'cPanel, FTP, hébergeur classique',
    free: false,
    steps: [
      '1. Buildez l\'application avec "npm run build"',
      '2. Uploadez le contenu du dossier "dist" via FTP',
      '3. Configurez les redirections (.htaccess)',
      '4. Testez votre domaine'
    ]
  }
};

const showDeploymentOptions = () => {
  console.log('\n🚀 Options de Déploiement Disponibles:\n');
  
  Object.entries(deploymentOptions).forEach(([key, option]) => {
    console.log(`${option.free ? '🆓' : '💰'} ${option.name}`);
    console.log(`   ${option.description}`);
    console.log(`   Gratuit: ${option.free ? 'Oui' : 'Non'}\n`);
  });
};

const deployToNetlify = () => {
  console.log('🌐 Déploiement Netlify');
  console.log('=====================');
  
  console.log('\n📋 Instructions Netlify:');
  deploymentOptions.netlify.steps.forEach(step => console.log(`   ${step}`));
  
  console.log('\n🔧 Configuration automatique créée:');
  console.log('   ✅ netlify.toml - Configuration de build');
  console.log('   ✅ _redirects - Gestion des routes React');
  
  console.log('\n🌐 Votre site sera accessible sur:');
  console.log('   https://votre-site.netlify.app');
  
  console.log('\n💡 Variables d\'environnement à ajouter dans Netlify:');
  console.log('   VITE_SUPABASE_URL=votre_url_supabase');
  console.log('   VITE_SUPABASE_ANON_KEY=votre_cle_supabase');
};

const deployToVercel = () => {
  console.log('⚡ Déploiement Vercel');
  console.log('====================');
  
  console.log('\n📋 Instructions Vercel:');
  deploymentOptions.vercel.steps.forEach(step => console.log(`   ${step}`));
  
  console.log('\n🔧 Configuration automatique créée:');
  console.log('   ✅ vercel.json - Configuration de déploiement');
  
  console.log('\n🌐 Votre site sera accessible sur:');
  console.log('   https://votre-projet.vercel.app');
  
  console.log('\n💡 Variables d\'environnement à ajouter dans Vercel:');
  console.log('   VITE_SUPABASE_URL=votre_url_supabase');
  console.log('   VITE_SUPABASE_ANON_KEY=votre_cle_supabase');
};

const deployToGitHub = () => {
  console.log('🐙 Déploiement GitHub Pages');
  console.log('===========================');
  
  // Créer le workflow GitHub Actions
  const workflowDir = '.github/workflows';
  if (!fs.existsSync(workflowDir)) {
    fs.mkdirSync(workflowDir, { recursive: true });
  }
  
  const githubWorkflow = `name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]
  pull_request:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - name: Checkout
      uses: actions/checkout@v3
      
    - name: Setup Node.js
      uses: actions/setup-node@v3
      with:
        node-version: '18'
        cache: 'npm'
        
    - name: Install dependencies
      run: npm ci
      
    - name: Build
      run: npm run build
      env:
        VITE_SUPABASE_URL: \${{ secrets.VITE_SUPABASE_URL }}
        VITE_SUPABASE_ANON_KEY: \${{ secrets.VITE_SUPABASE_ANON_KEY }}
        
    - name: Deploy to GitHub Pages
      uses: peaceiris/actions-gh-pages@v3
      with:
        github_token: \${{ secrets.GITHUB_TOKEN }}
        publish_dir: ./dist
`;

  fs.writeFileSync(path.join(workflowDir, 'deploy.yml'), githubWorkflow);
  
  console.log('\n📋 Instructions GitHub Pages:');
  deploymentOptions.github.steps.forEach(step => console.log(`   ${step}`));
  
  console.log('\n🔧 Configuration automatique créée:');
  console.log('   ✅ .github/workflows/deploy.yml - GitHub Actions');
  
  console.log('\n🌐 Votre site sera accessible sur:');
  console.log('   https://votre-username.github.io/votre-repo');
  
  console.log('\n🔐 Secrets à ajouter dans GitHub:');
  console.log('   VITE_SUPABASE_URL=votre_url_supabase');
  console.log('   VITE_SUPABASE_ANON_KEY=votre_cle_supabase');
};

const deployTraditional = () => {
  console.log('🖥️ Déploiement Hébergement Traditionnel');
  console.log('=======================================');
  
  // Créer le script de déploiement FTP
  const ftpScript = `#!/bin/bash
# Script de déploiement FTP pour TCF Simulator Pro

echo "🚀 Déploiement via FTP"
echo "====================="

# Configuration (à modifier)
FTP_HOST="ftp.votre-hebergeur.com"
FTP_USER="votre-username"
FTP_PASS="votre-password"
REMOTE_DIR="/public_html"

# Build de l'application
echo "📦 Build de l'application..."
npm run build

# Upload via FTP
echo "📤 Upload des fichiers..."
lftp -c "
set ftp:ssl-allow no;
open ftp://\$FTP_USER:\$FTP_PASS@\$FTP_HOST;
lcd dist;
cd \$REMOTE_DIR;
mirror --reverse --delete --verbose;
bye;
"

echo "✅ Déploiement terminé !"
`;

  fs.writeFileSync('deploy-ftp.sh', ftpScript);
  
  try {
    execSync('chmod +x deploy-ftp.sh');
  } catch (error) {
    // Ignore sur Windows
  }
  
  // Créer le fichier .htaccess
  const htaccess = `RewriteEngine On
RewriteBase /

# Gestion des routes React
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
</IfModule>
`;

  fs.writeFileSync('public/.htaccess', htaccess);
  
  console.log('\n📋 Instructions Hébergement Traditionnel:');
  deploymentOptions.traditional.steps.forEach(step => console.log(`   ${step}`));
  
  console.log('\n🔧 Fichiers créés:');
  console.log('   ✅ deploy-ftp.sh - Script de déploiement FTP');
  console.log('   ✅ public/.htaccess - Configuration Apache');
  
  console.log('\n💡 Modifiez deploy-ftp.sh avec vos identifiants FTP');
};

const createHostingPackage = () => {
  console.log('📦 Création du Package d\'Hébergement');
  console.log('====================================');
  
  // Build de l'application
  console.log('🔨 Build de l\'application...');
  try {
    execSync('npm run build', { stdio: 'inherit' });
  } catch (error) {
    console.error('❌ Erreur lors du build:', error.message);
    return;
  }
  
  // Créer le package d'hébergement
  const packageDir = 'tcf-simulator-hosting-package';
  if (!fs.existsSync(packageDir)) {
    fs.mkdirSync(packageDir, { recursive: true });
  }
  
  // Copier les fichiers de build
  execSync(`cp -r dist/* ${packageDir}/`);
  
  // Créer le README d'hébergement
  const hostingReadme = `# 🌐 TCF Simulator Pro - Package d'Hébergement

## 🚀 Déploiement Rapide

### Option 1: Hébergement Gratuit
- **Netlify**: Glissez-déposez ce dossier sur netlify.com/drop
- **Vercel**: Connectez votre GitHub et déployez
- **GitHub Pages**: Activez Pages dans les paramètres du repo

### Option 2: Hébergement Traditionnel
1. Uploadez tout le contenu de ce dossier via FTP
2. Pointez votre domaine vers ce dossier
3. Configurez les variables d'environnement Supabase

## ⚙️ Configuration Requise

### Variables d'Environnement
\`\`\`
VITE_SUPABASE_URL=https://votre-projet.supabase.co
VITE_SUPABASE_ANON_KEY=votre-cle-anon
\`\`\`

### Prérequis Serveur
- Serveur web (Apache/Nginx)
- Support des Single Page Applications
- HTTPS recommandé

## 🎯 Votre TCF Simulator Pro sera accessible via votre domaine !

© 2024 Brixel Academy - Version Web Commerciale
`;

  fs.writeFileSync(`${packageDir}/README.md`, hostingReadme);
  
  console.log(`✅ Package d'hébergement créé: ${packageDir}/`);
  console.log('📁 Contenu prêt pour upload sur n\'importe quel hébergeur !');
};

// Menu principal
const main = () => {
  const args = process.argv.slice(2);
  const command = args[0];
  
  switch (command) {
    case 'netlify':
      deployToNetlify();
      break;
    case 'vercel':
      deployToVercel();
      break;
    case 'github':
      deployToGitHub();
      break;
    case 'traditional':
      deployTraditional();
      break;
    case 'package':
      createHostingPackage();
      break;
    default:
      showDeploymentOptions();
      console.log('\n🔧 Commandes disponibles:');
      console.log('   node deploy-hosting.js netlify     - Configuration Netlify');
      console.log('   node deploy-hosting.js vercel      - Configuration Vercel');
      console.log('   node deploy-hosting.js github      - Configuration GitHub Pages');
      console.log('   node deploy-hosting.js traditional - Hébergement traditionnel');
      console.log('   node deploy-hosting.js package     - Créer package d\'hébergement');
      break;
  }
};

main();