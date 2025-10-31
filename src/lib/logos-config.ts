// YLADA Logos Configuration
// Estrutura organizada: formato/cor/variacao

export const logos = {
  // ===== LOGOS HORIZONTAIS =====
  horizontal: {
    // Azul Claro (LOGO OFICIAL - Horizontal)
    azulClaro: {
      oficial: '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png', // ⭐ LOGO OFICIAL
      todas: [
        '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-28.png',
        '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png' // ⭐ OFICIAL
      ]
    },
    // Verde
    verde: {
      principal: '/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png',
      todas: [
        '/images/logo/ylada/horizontal/verde/ylada-horizontal-verde-2.png'
      ]
    },
    // Laranja
    laranja: {
      principal: '/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-14.png',
      todas: [
        '/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-14.png',
        '/images/logo/ylada/horizontal/laranja/ylada-horizontal-laranja-15.png'
      ]
    },
    // Roxo
    roxo: {
      principal: '/images/logo/ylada/horizontal/roxo/ylada-horizontal-roxo-20.png',
      todas: [
        '/images/logo/ylada/horizontal/roxo/ylada-horizontal-roxo-20.png',
        '/images/logo/ylada/horizontal/roxo/ylada-horizontal-roxo-21.png',
        '/images/logo/ylada/horizontal/roxo/ylada-horizontal-roxo-22.png',
        '/images/logo/ylada/horizontal/roxo/ylada-horizontal-roxo-23.png',
        '/images/logo/ylada/horizontal/roxo/ylada-horizontal-roxo-24.png',
        '/images/logo/ylada/horizontal/roxo/ylada-horizontal-roxo-25.png',
        '/images/logo/ylada/horizontal/roxo/ylada-horizontal-roxo-34.png'
      ]
    }
  },

  // ===== LOGOS QUADRADOS =====
  quadrado: {
    // Azul Claro (LOGO OFICIAL - Quadrado)
    azulClaro: {
      oficial: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png', // ⭐ LOGO OFICIAL QUADRADO
      todas: [
        '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-29.png',
        '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png' // ⭐ OFICIAL
      ]
    },
    // Verde
    verde: {
      principal: '/images/logo/ylada/quadrado/verde/ylada-quadrado-verde-3.png',
      todas: [
        '/images/logo/ylada/quadrado/verde/ylada-quadrado-verde-3.png'
      ]
    },
    // Laranja
    laranja: {
      principal: '/images/logo/ylada/quadrado/laranja/ylada-quadrado-laranja-12.png',
      todas: [
        '/images/logo/ylada/quadrado/laranja/ylada-quadrado-laranja-12.png',
        '/images/logo/ylada/quadrado/laranja/ylada-quadrado-laranja-13.png'
      ]
    },
    // Vermelho
    vermelho: {
      principal: '/images/logo/ylada/quadrado/vermelho/ylada-quadrado-vermelho-16.png',
      todas: [
        '/images/logo/ylada/quadrado/vermelho/ylada-quadrado-vermelho-16.png',
        '/images/logo/ylada/quadrado/vermelho/ylada-quadrado-vermelho-17.png'
      ]
    },
    // Roxo
    roxo: {
      principal: '/images/logo/ylada/quadrado/roxo/ylada-quadrado-roxo-18.png',
      todas: [
        '/images/logo/ylada/quadrado/roxo/ylada-quadrado-roxo-18.png',
        '/images/logo/ylada/quadrado/roxo/ylada-quadrado-roxo-19.png'
      ]
    }
  },
  
  // ===== ATALHOS RÁPIDOS (LOGO OFICIAL) =====
  // ⭐ Logo principal horizontal (AZUL 30 - OFICIAL)
  principal: '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png',
  
  // ⭐ Logo horizontal padrão
  horizontal: '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png',
  
  // ⭐ Logo quadrado oficial (AZUL 31 - OFICIAL)
  quadrado: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
  
  // ⭐ Logo padrão para uso geral (horizontal)
  padrao: '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png',
  
  // ⭐ Logo para favicon (usar quadrado azul 31)
  favicon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
  
  // Logo para dark mode (mesmo azul claro)
  dark: '/images/logo/ylada/horizontal/azul-claro/ylada-horizontal-azul-claro-30.png',
  
  // Ícone (quadrado azul 31)
  icon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png'
}

// Cores identificadas nos logos
export const cores = {
  verde: '#10B981',
  laranja: '#F97316',
  vermelho: '#EF4444',
  roxo: '#A855F7',
  azulClaro: '#60A5FA' // ⭐ Cor oficial (azul claro)
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
    original: { width: 1080, height: 1080 }
  }
}

// Função helper para obter logo por cor e formato
export function getLogoPorCor(cor = 'azul-claro', formato = 'horizontal'): string {
  // Mapear nomes de cores para as chaves do objeto
  const corMap: Record<string, keyof typeof logos.horizontal> = {
    'verde': 'verde',
    'laranja': 'laranja',
    'roxo': 'roxo',
    'vermelho': 'vermelho',
    'azul-claro': 'azulClaro',
    'azul': 'azulClaro'
  }
  
  const corKey = corMap[cor] || 'azulClaro'
  
  if (formato === 'horizontal') {
    if (corKey === 'azulClaro') {
      return logos.horizontal.azulClaro?.oficial || logos.principal
    }
    // Verificar se a cor existe no formato horizontal (vermelho não existe em horizontal)
    if (corKey === 'vermelho') {
      // Vermelho só existe em quadrado, usar azul como fallback
      return logos.horizontal.azulClaro?.oficial || logos.principal
    }
    const logoCor = logos.horizontal[corKey] as { principal?: string } | undefined
    return logoCor?.principal || logos.horizontal.azulClaro?.oficial || logos.principal
  } else {
    if (corKey === 'azulClaro') {
      return logos.quadrado.azulClaro?.oficial || logos.quadrado
    }
    const logoCor = logos.quadrado[corKey as keyof typeof logos.quadrado] as { principal?: string } | undefined
    return (logoCor as any)?.principal || logos.quadrado.azulClaro?.oficial || logos.quadrado
  }
}

// Função helper para obter logo oficial
export function getLogoOficial(formato: 'horizontal' | 'quadrado' = 'horizontal'): string {
  if (formato === 'horizontal') {
    return logos.horizontal.azulClaro.oficial
  }
  return logos.quadrado.azulClaro.oficial
}

