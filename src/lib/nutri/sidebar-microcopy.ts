/**
 * MICROCOPY OFICIAL DO SIDEBAR - YLADA NUTRI
 * 
 * Baseado na proposta do ChatGPT
 * 
 * PRINCÍPIOS:
 * - Sidebar não explica tudo, orienta o momento
 * - Sidebar gera clareza de progresso
 * - Sidebar nunca faz a nutri se sentir travada
 * - Tudo bloqueado tem motivo + tempo
 */

export interface SidebarItemMicrocopy {
  label: string
  tooltip: string
}

export interface SidebarMicrocopy {
  items: Record<string, SidebarItemMicrocopy>
  blocked: {
    label: string
    tooltip: string
    tooltipContextual?: string
  }
  phase: {
    1: string
    2: string
    3: string
  }
  status: {
    currentPhase: (phase: number) => string
    progress: (day: number, total: number) => string
    nextFocus: (phase: number) => string
  }
}

/**
 * Microcopy completo do Sidebar
 */
export const SIDEBAR_MICROCOPY: SidebarMicrocopy = {
  items: {
    home: {
      label: 'Home',
      tooltip: 'Seu ponto de partida diário na YLADA.'
    },
    jornada: {
      label: 'Trilha Empresarial',
      tooltip: 'Sua capacitação empresarial, passo a passo (30 dias).'
    },
    pilares: {
      label: 'Sobre o Método',
      tooltip: 'A filosofia por trás de tudo. A LYA aplica com você.'
    },
    ferramentas: {
      label: 'Captar',
      tooltip: 'Recursos práticos para atrair e organizar novos clientes.'
    },
    gsal: {
      label: 'Gestão GSAL',
      tooltip: 'Organização simples para acompanhar clientes e processos.'
    },
    biblioteca: {
      label: 'Materiais de Apoio',
      tooltip: 'PDFs e recursos extras. Use quando precisar, a LYA te orienta.'
    },
    anotacoes: {
      label: 'Minhas Anotações',
      tooltip: 'Suas ideias, decisões e registros estratégicos.'
    },
    perfil: {
      label: 'Perfil Nutri-Empresária',
      tooltip: 'Base profissional, posicionamento e clareza do seu papel.'
    },
    configuracoes: {
      label: 'Configurações',
      tooltip: 'Dados básicos e preferências da sua conta.'
    }
  },

  blocked: {
    label: '🔒 Em breve',
    tooltip: 'Disponível após concluir sua fase atual.',
    tooltipContextual: 'A LYA libera isso quando fizer sentido para o seu momento.'
  },

  phase: {
    1: 'Fase atual: Fundamentos',
    2: 'Nova fase liberada: Captação & Posicionamento',
    3: 'Você entrou na fase de Gestão & Escala'
  },

  status: {
    currentPhase: (phase: number) => {
      const phases = {
        1: 'Fundamentos',
        2: 'Captação & Posicionamento',
        3: 'Gestão & Escala'
      }
      return `Fase atual: ${phases[phase as keyof typeof phases] || 'Fundamentos'}`
    },
    progress: (day: number, total: number = 30) => {
      return `Progresso: Dia ${day} de ${total}`
    },
    nextFocus: (phase: number) => {
      const focuses = {
        1: 'Organização profissional',
        2: 'Posicionamento e captação',
        3: 'Gestão e escala'
      }
      return `Próximo foco: ${focuses[phase as keyof typeof focuses] || 'Organização profissional'}`
    }
  }
}

/**
 * Retorna microcopy de um item específico
 */
export function getItemMicrocopy(itemKey: string): SidebarItemMicrocopy | null {
  return SIDEBAR_MICROCOPY.items[itemKey] || null
}

/**
 * Retorna mensagem de bloqueio
 */
export function getBlockedMicrocopy(contextual: boolean = false): { label: string; tooltip: string } {
  return {
    label: SIDEBAR_MICROCOPY.blocked.label,
    tooltip: contextual 
      ? (SIDEBAR_MICROCOPY.blocked.tooltipContextual || SIDEBAR_MICROCOPY.blocked.tooltip)
      : SIDEBAR_MICROCOPY.blocked.tooltip
  }
}

/**
 * Retorna mensagem de fase
 */
export function getPhaseMessage(phase: 1 | 2 | 3): string {
  return SIDEBAR_MICROCOPY.phase[phase]
}

/**
 * Retorna status completo (fase + progresso + foco)
 */
export function getStatusMessage(phase: 1 | 2 | 3, currentDay: number): string {
  const phaseMsg = SIDEBAR_MICROCOPY.status.currentPhase(phase)
  const progressMsg = SIDEBAR_MICROCOPY.status.progress(currentDay)
  const focusMsg = SIDEBAR_MICROCOPY.status.nextFocus(phase)
  
  return `${phaseMsg} • ${progressMsg} • ${focusMsg}`
}



