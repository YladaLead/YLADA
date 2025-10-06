// YLADA Logos Configuration
// Use este arquivo para importar os logos no seu projeto

export const logos = {
  // Logo principal horizontal (com gráfico verde)
  horizontal: '/logos/ylada-logo-horizontal.png',
  horizontalSvg: '/logos/ylada-logo-horizontal.svg',
  
  // Logo apenas texto
  textOnly: '/logos/ylada-logo-text-only.png',
  textOnlySvg: '/logos/ylada-logo-text-only.svg',
  
  // Ícones
  icon: '/logos/ylada-icon.png',
  iconDark: '/logos/ylada-icon-dark.png',
  iconSvg: '/logos/ylada-icon.svg',
  
  // Favicons
  favicon16: '/logos/ylada-favicon-16.png',
  favicon32: '/logos/ylada-favicon-32.png',
  faviconIco: '/favicon.ico'
}

// Cores da marca
export const brandColors = {
  primary: '#10B981',      // Verde principal
  primaryDark: '#059669',  // Verde escuro
  primaryLight: '#6EE7B7', // Verde claro
  grayDark: '#374151',     // Cinza escuro
  grayMedium: '#6B7280',   // Cinza médio
  grayLight: '#F3F4F6',    // Cinza claro
  white: '#FFFFFF',        // Branco
  black: '#000000'         // Preto
}

// Tamanhos recomendados
export const logoSizes = {
  horizontal: { width: 400, height: 120 },
  vertical: { width: 200, height: 300 },
  icon: { width: 64, height: 64 },
  favicon: { width: 32, height: 32 }
}

// Exemplo de uso:
// import { logos } from './logos-config'
// <img src={logos.horizontal} alt="YLADA Logo" />
