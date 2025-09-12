const { contextBridge, ipcRenderer } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld('electronAPI', {
  // File operations
  showSaveDialog: () => ipcRenderer.invoke('show-save-dialog'),
  
  // Dialog operations
  showMessageBox: (options) => ipcRenderer.invoke('show-message-box', options),
  
  // App info
  getAppVersion: () => ipcRenderer.invoke('app-version'),
  
  // License validation
  validateLicense: () => ipcRenderer.invoke('validate-license'),
  
  // Menu events
  onMenuNewTest: (callback) => ipcRenderer.on('menu-new-test', callback),
  
  // Platform info
  platform: process.platform,
  
  // Remove listeners
  removeAllListeners: (channel) => ipcRenderer.removeAllListeners(channel)
});

// Prevent new window creation
window.addEventListener('DOMContentLoaded', () => {
  // Override window.open to prevent new windows
  window.open = (url) => {
    console.log('Blocked window.open for:', url);
    return null;
  };
});