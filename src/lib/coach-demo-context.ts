/**
 * Demo coach: onde você atua + fluxo no lugar de quem busca coaching.
 */

export const COACH_DEMO_CLIENTE_BASE_PATH = '/pt/coach/exemplo-cliente' as const

export const COACH_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'individual', label: 'Coach individual (1:1)' },
  { value: 'corporativo', label: 'Empresas ou equipes' },
  { value: 'grupos', label: 'Grupos ou programas online' },
  { value: 'redes', label: 'Instagram e redes (direct)' },
  { value: 'hibrido', label: 'Presencial e online' },
  { value: 'outro', label: 'Outro formato' },
]

export const STORAGE_KEY_COACH_DEMO_LOCAL = 'ylada_coach_demo_local' as const

export const STORAGE_KEY_COACH_DEMO_NICHO = 'ylada_coach_demo_nicho' as const

export const STORAGE_KEY_COACH_CONTINUAR_TOUR = 'ylada_coach_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const COACH_LANDING_STEP_APOS_DEMO = 7
