// YLADA Logos Configuration
// Use este arquivo para importar os logos no seu projeto

export const logos = {
  // Logo principal horizontal
  horizontal: '/logos/ylada-logo-horizontal.png',
  horizontalWhite: '/logos/ylada-logo-horizontal-white.png',
  
  // Logo vertical
  vertical: '/logos/ylada-logo-vertical.png',
  verticalWhite: '/logos/ylada-logo-vertical-white.png',
  
  // Ícones
  icon: '/logos/ylada-icon.png',
  iconWhite: '/logos/ylada-icon-white.png',
  iconDark: '/logos/ylada-icon-dark.png',
  
  // Favicons
  favicon16: '/logos/ylada-favicon-16.png',
  favicon32: '/logos/ylada-favicon-32.png',
  favicon192: '/logos/ylada-favicon-192.png',
  favicon512: '/logos/ylada-favicon-512.png',
  
  // Impressão
  printPdf: '/logos/ylada-logo-print.pdf',
  printJpg: '/logos/ylada-logo-print.jpg'
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
