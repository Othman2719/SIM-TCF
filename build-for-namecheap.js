const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Building TCF Simulator Pro for Namecheap deployment...\n');

// Step 1: Build the application
console.log('📦 Building application...');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('✅ Build completed successfully!\n');
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

// Step 2: Create .htaccess file
console.log('⚙️ Creating .htaccess file...');
const htaccessContent = `RewriteEngine On

# Handle React Router
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule . /index.html [L]

# Security headers
Header always set X-Frame-Options DENY
Header always set X-Content-Type-Options nosniff
Header always set Referrer-Policy "strict-origin-when-cross-origin"

# Cache static assets
<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 month"
</FilesMatch>

# Compress files
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
`;

fs.writeFileSync(path.join('dist', '.htaccess'), htaccessContent);
console.log('✅ .htaccess file created!\n');

// Step 3: Create deployment instructions
console.log('📋 Creating deployment instructions...');
const deploymentInstructions = `
# 🚀 DÉPLOIEMENT NAMECHEAP - TCF SIMULATOR PRO

## 📁 FICHIERS À UPLOADER
Uploadez TOUT le contenu du dossier 'dist/' vers votre hébergement Namecheap.

## 🎯 ÉTAPES DE DÉPLOIEMENT

### 1. Accès cPanel
- Connectez-vous à votre compte Namecheap
- Allez dans cPanel de votre hébergement

### 2. File Manager
- Ouvrez File Manager
- Naviguez vers public_html/ (ou votre dossier de domaine)

### 3. Upload des Fichiers
- Sélectionnez TOUS les fichiers du dossier 'dist/'
- Uploadez-les dans public_html/
- OU créez un sous-dossier (ex: public_html/tcf/)

### 4. Configuration
- Assurez-vous que le fichier .htaccess est présent
- Vérifiez les permissions (644 pour les fichiers, 755 pour les dossiers)

### 5. Variables d'Environnement
Avant le déploiement, configurez vos variables dans .env:
- VITE_SUPABASE_URL=https://votre-projet.supabase.co
- VITE_SUPABASE_ANON_KEY=votre-cle-anon

## ✅ VÉRIFICATION
Visitez votre domaine pour tester l'application.

## 🆘 SUPPORT
En cas de problème, vérifiez:
1. Tous les fichiers sont uploadés
2. Le fichier .htaccess est présent
3. Les variables d'environnement sont correctes
4. Supabase est configuré

Date de build: ${new Date().toLocaleString()}
`;

fs.writeFileSync('DEPLOYMENT-NAMECHEAP.txt', deploymentInstructions);
console.log('✅ Deployment instructions created!\n');

// Step 4: Create ZIP file for easy upload
console.log('📦 Creating ZIP file for easy upload...');
try {
  execSync('cd dist && zip -r ../tcf-simulator-namecheap.zip .', { stdio: 'inherit' });
  console.log('✅ ZIP file created: tcf-simulator-namecheap.zip\n');
} catch (error) {
  console.log('⚠️ ZIP creation failed (zip command not available)');
  console.log('   You can manually compress the dist/ folder\n');
}

console.log('🎉 BUILD COMPLETED FOR NAMECHEAP!');
console.log('📁 Files ready in: dist/');
console.log('📦 ZIP ready: tcf-simulator-namecheap.zip');
console.log('📋 Instructions: DEPLOYMENT-NAMECHEAP.txt');
console.log('\n🚀 Ready to deploy to Namecheap hosting!');