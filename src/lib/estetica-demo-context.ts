/**
 * Contexto do demo estética: onde a profissional atua + rota do fluxo no lugar da cliente.
 */

export const ESTETICA_DEMO_CLIENTE_BASE_PATH = '/pt/estetica/exemplo-cliente' as const

export const ESTETICA_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'salao', label: 'Salão ou espaço comercial' },
  { value: 'clinica', label: 'Clínica ou estética com espaço próprio' },
  { value: 'domicilio', label: 'Atendo em casa (domicílio)' },
  { value: 'studio', label: 'Studio ou sala individual' },
  { value: 'outro', label: 'Outro formato' },
]

/** @deprecated Fluxo antigo (dono). Preferir exemplo-cliente + nicho. */
export const ESTETICA_DEMO_QUIZ_PATH = '/pt/diagnostico?area=2&origem=demo-estetica' as const

export const STORAGE_KEY_ESTETICA_DEMO_LOCAL = 'ylada_estetica_demo_local' as const

export const STORAGE_KEY_ESTETICA_DEMO_NICHO = 'ylada_estetica_demo_nicho' as const

/** Após ver resultado do demo, retomar a landing /pt/estetica neste passo (ponte antes de “compartilha o link”). */
export const STORAGE_KEY_ESTETICA_CONTINUAR_TOUR = 'ylada_estetica_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo: ponte Noel + limites, depois “compartilha o link”. */
export const ESTETICA_LANDING_STEP_APOS_DEMO = 7
