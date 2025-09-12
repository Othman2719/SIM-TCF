#!/usr/bin/env node

/**
 * Script de création automatique du package client
 * Génère un package complet prêt pour la livraison
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('🚀 Création du Package Client TCF Simulator Pro');
console.log('================================================');

// Configuration
const packageName = 'TCF-Simulator-Pro-Client-Package';
const version = '1.0.0';
const buildDate = new Date().toISOString().split('T')[0];

// Créer la structure de dossiers
const createDirectoryStructure = () => {
  console.log('📁 Création de la structure de dossiers...');
  
  const dirs = [
    packageName,
    `${packageName}/Applications`,
    `${packageName}/Applications/Windows`,
    `${packageName}/Applications/macOS`,
    `${packageName}/Applications/Linux`,
    `${packageName}/Documentation`,
    `${packageName}/Videos`,
    `${packageName}/Templates`,
    `${packageName}/Tools`,
    `${packageName}/License`
  ];

  dirs.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
      console.log(`  ✅ ${dir}`);
    }
  });
};

// Compiler les applications
const buildApplications = () => {
  console.log('🔨 Compilation des applications...');
  
  try {
    // Build pour toutes les plateformes
    console.log('  📦 Building Windows...');
    execSync('npm run dist-win', { stdio: 'inherit' });
    
    console.log('  📦 Building macOS...');
    execSync('npm run dist-mac', { stdio: 'inherit' });
    
    console.log('  📦 Building Linux...');
    execSync('npm run dist-linux', { stdio: 'inherit' });
    
    console.log('  ✅ Toutes les applications compilées');
  } catch (error) {
    console.error('❌ Erreur lors de la compilation:', error.message);
    process.exit(1);
  }
};

// Copier les fichiers compilés
const copyBuiltFiles = () => {
  console.log('📋 Copie des applications compilées...');
  
  const sourceDir = 'dist-electron';
  const targetDir = `${packageName}/Applications`;
  
  if (fs.existsSync(sourceDir)) {
    // Copier les fichiers Windows
    const windowsFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.exe'));
    windowsFiles.forEach(file => {
      fs.copyFileSync(
        path.join(sourceDir, file),
        path.join(targetDir, 'Windows', file)
      );
      console.log(`  ✅ ${file} → Windows/`);
    });

    // Copier les fichiers macOS
    const macFiles = fs.readdirSync(sourceDir).filter(f => f.endsWith('.dmg'));
    macFiles.forEach(file => {
      fs.copyFileSync(
        path.join(sourceDir, file),
        path.join(targetDir, 'macOS', file)
      );
      console.log(`  ✅ ${file} → macOS/`);
    });

    // Copier les fichiers Linux
    const linuxFiles = fs.readdirSync(sourceDir).filter(f => 
      f.endsWith('.AppImage') || f.endsWith('.deb')
    );
    linuxFiles.forEach(file => {
      fs.copyFileSync(
        path.join(sourceDir, file),
        path.join(targetDir, 'Linux', file)
      );
      console.log(`  ✅ ${file} → Linux/`);
    });
  }
};

// Copier la documentation
const copyDocumentation = () => {
  console.log('📚 Copie de la documentation...');
  
  const docs = [
    'INSTALLATION-GUIDE.md',
    'CLIENT-DEPLOYMENT-PACKAGE.md',
    'README-COMMERCIAL.md',
    'SALES-GUIDE.md',
    'LICENSE-COMMERCIAL.md'
  ];

  docs.forEach(doc => {
    if (fs.existsSync(doc)) {
      fs.copyFileSync(doc, `${packageName}/Documentation/${doc}`);
      console.log(`  ✅ ${doc}`);
    }
  });
};

// Créer les templates
const createTemplates = () => {
  console.log('📋 Création des templates...');
  
  // Template comptes utilisateurs
  const userTemplate = `Nom d'utilisateur,Email,Mot de passe,Rôle,Actif
admin,admin@ecole.com,motdepasse123,admin,true
professeur1,prof1@ecole.com,motdepasse123,client,true
etudiant1,etudiant1@ecole.com,motdepasse123,client,true
etudiant2,etudiant2@ecole.com,motdepasse123,client,true`;

  fs.writeFileSync(
    `${packageName}/Templates/user-accounts-template.csv`,
    userTemplate
  );

  // Template structure examen
  const examTemplate = `Section,Question,Option A,Option B,Option C,Option D,Bonne Réponse,Niveau
listening,Écoutez l'enregistrement et répondez,Option 1,Option 2,Option 3,Option 4,1,A1
grammar,Complétez la phrase,Option 1,Option 2,Option 3,Option 4,2,A2
reading,Lisez le texte et répondez,Option 1,Option 2,Option 3,Option 4,3,B1`;

  fs.writeFileSync(
    `${packageName}/Templates/exam-structure-template.csv`,
    examTemplate
  );

  console.log('  ✅ Templates créés');
};

// Créer le script d'installation
const createInstallScript = () => {
  console.log('🔧 Création du script d'installation...');
  
  const installScript = `#!/bin/bash
# Script d'installation automatique TCF Simulator Pro
# © 2024 Brixel Academy

echo "🚀 Installation TCF Simulator Pro v${version}"
echo "============================================="

# Détection de l'OS
if [[ "$OSTYPE" == "msys" || "$OSTYPE" == "win32" ]]; then
    echo "📱 Installation Windows..."
    if [ -f "Applications/Windows/TCF-Simulator-Pro-Setup.exe" ]; then
        ./Applications/Windows/TCF-Simulator-Pro-Setup.exe
        echo "✅ Installation Windows terminée"
    else
        echo "❌ Fichier Windows non trouvé"
        exit 1
    fi
elif [[ "$OSTYPE" == "darwin"* ]]; then
    echo "📱 Installation macOS..."
    if [ -f "Applications/macOS/TCF-Simulator-Pro.dmg" ]; then
        open Applications/macOS/TCF-Simulator-Pro.dmg
        echo "✅ Ouvrez le fichier DMG et glissez l'app vers Applications"
    else
        echo "❌ Fichier macOS non trouvé"
        exit 1
    fi
else
    echo "📱 Installation Linux..."
    if [ -f "Applications/Linux/TCF-Simulator-Pro.AppImage" ]; then
        chmod +x Applications/Linux/TCF-Simulator-Pro.AppImage
        echo "✅ Fichier AppImage prêt à l'exécution"
        echo "💡 Exécutez: ./Applications/Linux/TCF-Simulator-Pro.AppImage"
    else
        echo "❌ Fichier Linux non trouvé"
        exit 1
    fi
fi

echo ""
echo "🎉 Installation terminée !"
echo "📖 Consultez Documentation/INSTALLATION-GUIDE.md pour plus d'infos"
echo "📞 Support: support@brixelacademy.com"
`;

  fs.writeFileSync(`${packageName}/install.sh`, installScript);
  
  // Rendre le script exécutable
  try {
    execSync(`chmod +x ${packageName}/install.sh`);
  } catch (error) {
    // Ignore sur Windows
  }

  console.log('  ✅ Script d\'installation créé');
};

// Créer le fichier README du package
const createPackageReadme = () => {
  console.log('📄 Création du README du package...');
  
  const readme = `# 📦 TCF Simulator Pro - Package Client

**Version:** ${version}  
**Date de création:** ${buildDate}  
**Développé par:** Brixel Academy  

## 🎯 Contenu du Package

### 📱 Applications
- **Windows:** \`Applications/Windows/TCF-Simulator-Pro-Setup.exe\`
- **macOS:** \`Applications/macOS/TCF-Simulator-Pro.dmg\`
- **Linux:** \`Applications/Linux/TCF-Simulator-Pro.AppImage\`

### 📚 Documentation
- **Guide d'installation:** \`Documentation/INSTALLATION-GUIDE.md\`
- **Guide de déploiement:** \`Documentation/CLIENT-DEPLOYMENT-PACKAGE.md\`
- **Documentation commerciale:** \`Documentation/README-COMMERCIAL.md\`
- **Licence:** \`Documentation/LICENSE-COMMERCIAL.md\`

### 🔧 Outils
- **Script d'installation:** \`install.sh\` (Linux/macOS) ou \`install.bat\` (Windows)
- **Templates:** \`Templates/\` (comptes utilisateurs, structure examens)

## 🚀 Installation Rapide

### Linux/macOS
\`\`\`bash
chmod +x install.sh
./install.sh
\`\`\`

### Windows
Double-cliquez sur \`Applications/Windows/TCF-Simulator-Pro-Setup.exe\`

## 📞 Support

- **Email:** support@brixelacademy.com
- **Documentation:** https://docs.brixelacademy.com
- **Support:** Inclus pendant 12 mois

## ✅ Prérequis Système

### Windows
- Windows 10/11 (64-bit)
- 4 GB RAM minimum
- 500 MB espace disque

### macOS
- macOS 10.15+ (Catalina ou plus récent)
- 4 GB RAM minimum
- 500 MB espace disque

### Linux
- Ubuntu 18.04+ / Debian 10+ / CentOS 7+
- 4 GB RAM minimum
- 500 MB espace disque

---

**© 2024 Brixel Academy. Tous droits réservés.**
`;

  fs.writeFileSync(`${packageName}/README.md`, readme);
  console.log('  ✅ README du package créé');
};

// Créer l'archive finale
const createFinalArchive = () => {
  console.log('📦 Création de l\'archive finale...');
  
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
    console.log('💡 Vous pouvez créer l\'archive manuellement avec votre outil préféré');
  }
};

// Fonction principale
const main = async () => {
  try {
    createDirectoryStructure();
    buildApplications();
    copyBuiltFiles();
    copyDocumentation();
    createTemplates();
    createInstallScript();
    createPackageReadme();
    createFinalArchive();
    
    console.log('');
    console.log('🎉 PACKAGE CLIENT CRÉÉ AVEC SUCCÈS !');
    console.log('=====================================');
    console.log(`📦 Dossier: ${packageName}/`);
    console.log(`📋 Archive: ${packageName}-v${version}-${buildDate}.zip`);
    console.log('');
    console.log('✅ Votre package est prêt pour la livraison client !');
    console.log('💰 Vous pouvez maintenant vendre et déployer TCF Simulator Pro');
    
  } catch (error) {
    console.error('❌ Erreur lors de la création du package:', error.message);
    process.exit(1);
  }
};

// Exécuter le script
main();