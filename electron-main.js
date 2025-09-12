const { app, BrowserWindow, Menu, shell, ipcMain, dialog } = require('electron');
const path = require('path');
const isDev = process.env.NODE_ENV === 'development';

// Keep a global reference of the window object
let mainWindow;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1200,
    minHeight: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      preload: path.join(__dirname, 'electron-preload.js')
    },
    icon: path.join(__dirname, 'assets', 'icon.png'),
    show: false,
    titleBarStyle: 'default',
    autoHideMenuBar: false,
    fullscreenable: true
  });

  // Load the app
  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }

  // Show window when ready
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    
    // Show welcome message in production
    if (!isDev) {
      setTimeout(() => {
        dialog.showMessageBox(mainWindow, {
          type: 'info',
          title: 'Bienvenue dans TCF Simulator Pro',
          message: 'TCF Simulator Pro - Version Commerciale',
          detail: 'Simulateur professionnel du Test de Connaissance du Français\n\n• Multi-utilisateurs en temps réel\n• Gestion complète des examens\n• Certificats officiels\n• Support technique inclus\n\nDéveloppé par Brixel Academy\nLicence commerciale activée'
        });
      }, 1000);
    }
  });

  // Handle window closed
  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  // Handle external links
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Create application menu
function createMenu() {
  const template = [
    {
      label: 'Fichier',
      submenu: [
        {
          label: 'Nouveau Test',
          accelerator: 'CmdOrCtrl+N',
          click: () => {
            mainWindow.webContents.send('menu-new-test');
          }
        },
        { type: 'separator' },
        {
          label: 'Exporter Résultats',
          accelerator: 'CmdOrCtrl+E',
          click: () => {
            mainWindow.webContents.send('menu-export-results');
          }
        },
        { type: 'separator' },
        {
          label: 'Quitter',
          accelerator: process.platform === 'darwin' ? 'Cmd+Q' : 'Ctrl+Q',
          click: () => {
            app.quit();
          }
        }
      ]
    },
    {
      label: 'Édition',
      submenu: [
        { role: 'undo', label: 'Annuler' },
        { role: 'redo', label: 'Rétablir' },
        { type: 'separator' },
        { role: 'cut', label: 'Couper' },
        { role: 'copy', label: 'Copier' },
        { role: 'paste', label: 'Coller' },
        { role: 'selectall', label: 'Tout sélectionner' }
      ]
    },
    {
      label: 'Administration',
      submenu: [
        {
          label: 'Panel Administrateur',
          accelerator: 'CmdOrCtrl+A',
          click: () => {
            mainWindow.webContents.send('menu-admin-panel');
          }
        },
        {
          label: 'Gestion Utilisateurs',
          accelerator: 'CmdOrCtrl+U',
          click: () => {
            mainWindow.webContents.send('menu-user-management');
          }
        },
        { type: 'separator' },
        {
          label: 'Sauvegarde Base de Données',
          click: () => {
            mainWindow.webContents.send('menu-backup-database');
          }
        }
      ]
    },
    {
      label: 'Affichage',
      submenu: [
        { role: 'reload', label: 'Actualiser' },
        { role: 'forceReload', label: 'Actualiser (forcé)' },
        { role: 'toggleDevTools', label: 'Outils de développement' },
        { type: 'separator' },
        { role: 'resetZoom', label: 'Zoom normal' },
        { role: 'zoomIn', label: 'Zoom avant' },
        { role: 'zoomOut', label: 'Zoom arrière' },
        { type: 'separator' },
        { role: 'togglefullscreen', label: 'Plein écran' }
      ]
    },
    {
      label: 'Aide',
      submenu: [
        {
          label: 'Guide d\'utilisation',
          click: () => {
            shell.openExternal('https://brixelacademy.com/tcf-simulator/guide');
          }
        },
        {
          label: 'Support Technique',
          click: () => {
            shell.openExternal('mailto:support@brixelacademy.com?subject=TCF Simulator Pro - Support');
          }
        },
        { type: 'separator' },
        {
          label: 'Vérifier les Mises à Jour',
          click: () => {
            shell.openExternal('https://brixelacademy.com/tcf-simulator/updates');
          }
        },
        { type: 'separator' },
        {
          label: 'À propos',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'À propos de TCF Simulator Pro',
              message: 'TCF Simulator Pro',
              detail: `Version 1.0.0 - Édition Commerciale
              
Test de Connaissance du Français - Simulateur Professionnel

✓ Multi-utilisateurs en temps réel
✓ Gestion complète des examens  
✓ Certificats officiels
✓ Analytics et rapports
✓ Support technique premium

Développé par Brixel Academy
© 2024 Tous droits réservés

Licence commerciale activée
Support: support@brixelacademy.com
Web: https://brixelacademy.com`
            });
          }
        }
      ]
    }
  ];

  // macOS specific menu adjustments
  if (process.platform === 'darwin') {
    template.unshift({
      label: 'TCF Simulator Pro',
      submenu: [
        { 
          label: 'À propos de TCF Simulator Pro',
          click: () => {
            dialog.showMessageBox(mainWindow, {
              type: 'info',
              title: 'À propos',
              message: 'TCF Simulator Pro v1.0.0',
              detail: 'Simulateur professionnel du Test de Connaissance du Français\nDéveloppé par Brixel Academy'
            });
          }
        },
        { type: 'separator' },
        { role: 'services', label: 'Services' },
        { type: 'separator' },
        { role: 'hide', label: 'Masquer TCF Simulator Pro' },
        { role: 'hideothers', label: 'Masquer les autres' },
        { role: 'unhide', label: 'Tout afficher' },
        { type: 'separator' },
        { role: 'quit', label: 'Quitter TCF Simulator Pro' }
      ]
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

// App event listeners
app.whenReady().then(() => {
  createWindow();
  createMenu();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

// IPC handlers for desktop-specific features
ipcMain.handle('show-save-dialog', async () => {
  const result = await dialog.showSaveDialog(mainWindow, {
    title: 'Sauvegarder le certificat',
    defaultPath: 'certificat-tcf.pdf',
    filters: [
      { name: 'PDF Files', extensions: ['pdf'] }
    ]
  });
  return result;
});

ipcMain.handle('show-message-box', async (event, options) => {
  const result = await dialog.showMessageBox(mainWindow, options);
  return result;
});

ipcMain.handle('app-version', () => {
  return app.getVersion();
});

// Commercial license validation
ipcMain.handle('validate-license', () => {
  return {
    valid: true,
    type: 'commercial',
    features: ['multi-user', 'real-time', 'certificates', 'analytics', 'support'],
    expiresAt: null // Perpetual license
  };
});