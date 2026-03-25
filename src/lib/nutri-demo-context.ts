/**
 * Demo nutri: onde a profissional atua + rota do fluxo no lugar do paciente.
 */

export const NUTRI_DEMO_CLIENTE_BASE_PATH = '/pt/nutri/exemplo-cliente' as const

export const NUTRI_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'consultorio', label: 'Consultório ou clínica' },
  { value: 'online', label: 'Atendimento online' },
  { value: 'hospital', label: 'Hospital ou ambulatório' },
  { value: 'empresa', label: 'Empresas ou grupos' },
  { value: 'domicilio', label: 'Domicílio' },
  { value: 'outro', label: 'Outro formato' },
]

export const STORAGE_KEY_NUTRI_DEMO_LOCAL = 'ylada_nutri_demo_local' as const

export const STORAGE_KEY_NUTRI_DEMO_NICHO = 'ylada_nutri_demo_nicho' as const

export const STORAGE_KEY_NUTRI_CONTINUAR_TOUR = 'ylada_nutri_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const NUTRI_LANDING_STEP_APOS_DEMO = 7
