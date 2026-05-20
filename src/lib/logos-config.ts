// YLADA Logos Configuration
// Identidade visual 2026 — novos logos em /images/logo/ylada/novo/

// =====================================================
// CAMINHOS CANÔNICOS (nova identidade visual)
// =====================================================
const NOVO = '/images/logo/ylada/novo'

export const logos = {
  // ===== NOVA IDENTIDADE (2026) =====
  // Horizontal — fundo claro/branco (uso padrão na web)
  claro: `${NOVO}/ylada-horizontal-claro.png`,
  // Horizontal — fundo escuro/navy
  escuro: `${NOVO}/ylada-horizontal-escuro.png`,
  // Wordmark apenas (sem símbolo) — claro
  wordmarkClaro: `${NOVO}/ylada-wordmark-claro.png`,
  // Wordmark apenas (sem símbolo) — escuro
  wordmarkEscuro: `${NOVO}/ylada-wordmark-escuro.png`,
  // Symbol mark apenas — fundo claro
  markClaro: `${NOVO}/ylada-mark-claro.png`,
  // Symbol mark apenas — fundo escuro
  markEscuro: `${NOVO}/ylada-mark-escuro.png`,
  // App icon quadrado 1024px (iOS/Android/App Stores)
  icon1024: `${NOVO}/ylada-icon-1024.png`,
  // App icon 512px (PWA manifest, OG)
  icon512: `${NOVO}/ylada-icon-512.png`,
  // App icon 192px (PWA manifest)
  icon192: `${NOVO}/ylada-icon-192.png`,
  // Open Graph image 1200×630
  og: `${NOVO}/ylada-og-1200x630.png`,

  // ===== ATALHOS RÁPIDOS (retrocompatibilidade) =====
  // ⭐ Logo principal horizontal (fundo claro — uso geral)
  principal: `${NOVO}/ylada-horizontal-claro.png`,
  // ⭐ Logo quadrado/ícone oficial
  quadrado: `${NOVO}/ylada-icon-512.png`,
  // ⭐ Logo para dark mode
  dark: `${NOVO}/ylada-horizontal-escuro.png`,
  // ⭐ Logo para favicon
  favicon: `${NOVO}/ylada-icon-192.png`,
  // ⭐ Ícone (quadrado)
  icon: `${NOVO}/ylada-icon-512.png`,
  // ⭐ Logo padrão para uso geral
  padrao: `${NOVO}/ylada-horizontal-claro.png`,

  // ===== ESTRUTURA POR FORMATO (retrocompatibilidade) =====
  horizontalObj: {
    azulClaro: {
      oficial: `${NOVO}/ylada-horizontal-claro.png`,
      todas: [`${NOVO}/ylada-horizontal-claro.png`, `${NOVO}/ylada-horizontal-escuro.png`]
    }
  },
  quadradoObj: {
    azulClaro: {
      oficial: `${NOVO}/ylada-icon-512.png`,
      todas: [`${NOVO}/ylada-icon-192.png`, `${NOVO}/ylada-icon-512.png`, `${NOVO}/ylada-icon-1024.png`]
    }
  }
}

// Cores da nova identidade
export const cores = {
  navy: '#0A1632',      // ⭐ Cor principal (navy escuro)
  azulGrad1: '#1E90FF', // Gradiente azul (círculo externo)
  azulGrad2: '#00BFFF', // Gradiente azul claro
  ouro: '#FFD700',      // Ouro (Noel)
  branco: '#FFFFFF'
}

// Tamanhos
export const tamanhos = {
  horizontal: {
    pequeno: { width: 200, height: 60 },
    medio: { width: 300, height: 90 },
    grande: { width: 400, height: 120 }
  },
  quadrado: {
    pequeno: { width: 64, height: 64 },
    medio: { width: 128, height: 128 },
    grande: { width: 256, height: 256 },
    original: { width: 1024, height: 1024 }
  }
}

// Função helper para obter logo por cor e formato
export function getLogoPorCor(cor = 'azul-claro', formato = 'horizontal'): string {
  if (formato === 'horizontal') {
    return logos.principal
  }
  return logos.quadrado
}

// Função helper para obter logo oficial
export function getLogoOficial(formato: 'horizontal' | 'quadrado' = 'horizontal'): string {
  if (formato === 'horizontal') {
    return logos.principal
  }
  return logos.quadrado
}
