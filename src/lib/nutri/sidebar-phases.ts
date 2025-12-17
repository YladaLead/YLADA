/**
 * Lógica de liberação progressiva do Sidebar da área Nutri
 * 
 * Baseado na proposta do ChatGPT e análise de UX:
 * - FASE 1 (Dias 1-7): Fundamentos
 * - FASE 2 (Dias 8-15): Captação & Posicionamento
 * - FASE 3 (Dias 16-30): Gestão & Escala
 */

export type SidebarItemKey = 
  | 'home'
  | 'jornada'
  | 'pilares'
  | 'ferramentas'
  | 'gsal'
  | 'biblioteca'
  | 'anotacoes'
  | 'perfil'
  | 'configuracoes'

export interface SidebarPhase {
  phase: 1 | 2 | 3
  name: string
  days: string
  items: SidebarItemKey[]
}

/**
 * Determina a fase atual baseado no dia da jornada
 * 🚨 CORREÇÃO: Quando currentDay é null ou 0, retorna fase 1 mas com itens mínimos
 */
export function getCurrentPhase(currentDay: number | null): 1 | 2 | 3 {
  // Se não tem progresso ou está no dia 0, ainda é fase 1 (mas com itens mínimos)
  if (!currentDay || currentDay <= 0) {
    return 1 // Sem progresso = Fase 1 (mas apenas Home e Jornada disponíveis)
  }
  
  if (currentDay <= 7) {
    return 1 // FASE 1: Fundamentos (Dias 1-7)
  } else if (currentDay <= 15) {
    return 2 // FASE 2: Captação & Posicionamento (Dias 8-15)
  } else {
    return 3 // FASE 3: Gestão & Escala (Dias 16-30)
  }
}

/**
 * Retorna os itens do sidebar disponíveis para uma fase específica
 * 🚨 CORREÇÃO: Quando currentDay é null ou 0, apenas Home e Jornada
 */
export function getSidebarItemsForPhase(phase: 1 | 2 | 3, currentDay: number | null = null): SidebarItemKey[] {
  // 🚨 CORREÇÃO: Se não tem progresso (null ou 0), apenas Home e Jornada
  if (!currentDay || currentDay <= 0) {
    return ['home', 'jornada']
  }
  
  const baseItems: SidebarItemKey[] = [
    'home',
    'jornada',
    'perfil',
    'configuracoes'
  ]

  switch (phase) {
    case 1:
      // FASE 1: Fundamentos (Dias 1-7)
      // Apenas itens essenciais
      return baseItems

    case 2:
      // FASE 2: Captação & Posicionamento (Dias 8-15)
      // Adiciona Ferramentas e Pilares
      return [
        ...baseItems,
        'ferramentas',
        'pilares'
      ]

    case 3:
      // FASE 3: Gestão & Escala (Dias 16-30)
      // Adiciona GSAL, Biblioteca e Anotações
      return [
        ...baseItems,
        'ferramentas',
        'pilares',
        'gsal',
        'biblioteca',
        'anotacoes'
      ]

    default:
      return baseItems
  }
}

/**
 * Verifica se um item específico está disponível na fase atual
 * 🚨 CORREÇÃO: Passa currentDay para getSidebarItemsForPhase
 */
export function isItemAvailable(
  item: SidebarItemKey,
  currentDay: number | null
): boolean {
  const phase = getCurrentPhase(currentDay)
  const availableItems = getSidebarItemsForPhase(phase, currentDay)
  return availableItems.includes(item)
}

/**
 * Retorna informações sobre a fase atual
 * 🚨 CORREÇÃO: Precisa receber currentDay para calcular corretamente
 */
export function getPhaseInfo(phase: 1 | 2 | 3, currentDay: number | null = null): SidebarPhase {
  const phases: Record<1 | 2 | 3, SidebarPhase> = {
    1: {
      phase: 1,
      name: 'Fundamentos',
      days: 'Dias 1-7',
      items: getSidebarItemsForPhase(1, currentDay)
    },
    2: {
      phase: 2,
      name: 'Captação & Posicionamento',
      days: 'Dias 8-15',
      items: getSidebarItemsForPhase(2, currentDay)
    },
    3: {
      phase: 3,
      name: 'Gestão & Escala',
      days: 'Dias 16-30',
      items: getSidebarItemsForPhase(3, currentDay)
    }
  }

  return phases[phase]
}




