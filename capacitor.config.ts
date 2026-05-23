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
    contentInset: 'automatic'
  }
};

export default config;
