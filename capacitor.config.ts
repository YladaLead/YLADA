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
    // contentInset 'automatic' removido: causava layout shift (e flickering no iOS 26)
    // quando o teclado aparece, ajustando o scroll inset continuamente.
    // appendUserAgent removido anteriormente: causava tela branca no WebView.
  }
};

export default config;
