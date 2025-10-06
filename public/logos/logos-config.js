// YLADA Logos Configuration
// Use este arquivo para importar os logos no seu projeto

export const logos = {
  // Logo principal horizontal
  horizontal: '/logos/ylada-logo-horizontal.png',
  
  // Logo principal completo
  main: '/logos/ylada-logo-main.png',
  
  // Logo apenas texto
  textOnly: '/logos/ylada-logo-text-only.png',
  
  // Logo de uso/exemplo
  usage: '/logos/ylada-logo-usage.png',
  
  // Ícone
  icon: '/logos/ylada-icon.png',
  
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
