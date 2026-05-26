import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.ylada.app',
  appName: 'YLADA',
  webDir: 'out',
  server: {
    url: 'https://www.ylada.com',
    cleartext: false,
    allowNavigation: ['*.ylada.com']
  },
  ios: {
    contentInset: 'automatic',
    // User agent customizado para identificar o app nativo
    // Usado para desabilitar cookie banners e outros comportamentos web-only
    appendUserAgent: 'YladaApp/iOS Capacitor'
  }
};

export default config;
