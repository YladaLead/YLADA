/**
 * Demo fitness: onde você atua + fluxo no lugar de quem busca treino.
 */

export const FITNESS_DEMO_CLIENTE_BASE_PATH = '/pt/fitness/exemplo-cliente' as const

export const FITNESS_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'academia', label: 'Academia ou estúdio próprio' },
  { value: 'online', label: 'Treino online (live ou app)' },
  { value: 'domicilio', label: 'Personal em domicílio ou parques' },
  { value: 'grupo', label: 'Turmas ou equipes' },
  { value: 'redes', label: 'Instagram e redes (direct)' },
  { value: 'outro', label: 'Outro formato' },
]

export const STORAGE_KEY_FITNESS_DEMO_LOCAL = 'ylada_fitness_demo_local' as const

export const STORAGE_KEY_FITNESS_DEMO_NICHO = 'ylada_fitness_demo_nicho' as const

export const STORAGE_KEY_FITNESS_CONTINUAR_TOUR = 'ylada_fitness_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const FITNESS_LANDING_STEP_APOS_DEMO = 7
