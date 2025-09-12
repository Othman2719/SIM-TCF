// Utility functions for Electron-specific features
declare global {
  interface Window {
    electronAPI?: {
      showSaveDialog: () => Promise<{ canceled: boolean; filePath?: string }>;
      showMessageBox: (options: any) => Promise<{ response: number }>;
      getAppVersion: () => Promise<string>;
      onMenuNewTest: (callback: () => void) => void;
      platform: string;
      removeAllListeners: (channel: string) => void;
      validateLicense: () => Promise<{
        valid: boolean;
        type: 'demo' | 'commercial' | 'enterprise';
        features: string[];
        expiresAt: string | null;
      }>;
    };
  }
}

export const isElectron = () => {
  return typeof window !== 'undefined' && window.electronAPI !== undefined;
};

export const showSaveDialog = async (): Promise<{ canceled: boolean; filePath?: string }> => {
  if (isElectron() && window.electronAPI) {
    return await window.electronAPI.showSaveDialog();
  }
  return { canceled: true };
};

export const showMessageBox = async (options: {
  type: 'info' | 'warning' | 'error' | 'question';
  title: string;
  message: string;
  detail?: string;
  buttons?: string[];
}): Promise<{ response: number }> => {
  if (isElectron() && window.electronAPI) {
    return await window.electronAPI.showMessageBox(options);
  }
  // Fallback for web
  alert(`${options.title}\n\n${options.message}${options.detail ? '\n\n' + options.detail : ''}`);
  return { response: 0 };
};

export const getAppVersion = async (): Promise<string> => {
  if (isElectron() && window.electronAPI) {
    return await window.electronAPI.getAppVersion();
  }
  return '1.0.0';
};

export const getPlatform = (): string => {
  if (isElectron() && window.electronAPI) {
    return window.electronAPI.platform;
  }
  return 'web';
};

export const onMenuNewTest = (callback: () => void): void => {
  if (isElectron() && window.electronAPI) {
    window.electronAPI.onMenuNewTest(callback);
  }
};

export const removeAllListeners = (channel: string): void => {
  if (isElectron() && window.electronAPI) {
    window.electronAPI.removeAllListeners(channel);
  }
};