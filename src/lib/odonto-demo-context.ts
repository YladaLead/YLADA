/**
 * Demo odonto: onde o profissional atua + rota do fluxo no lugar do paciente.
 */

export const ODONTO_DEMO_CLIENTE_BASE_PATH = '/pt/odonto/exemplo-cliente' as const

export const ODONTO_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'consultorio', label: 'Consultório ou clínica' },
  { value: 'online', label: 'Triagem ou teleconsulta' },
  { value: 'hospital', label: 'Hospital ou ambulatório' },
  { value: 'grupo', label: 'Rede ou franquia' },
  { value: 'domicilio', label: 'Atendimento em domicílio' },
  { value: 'outro', label: 'Outro formato' },
]

export const STORAGE_KEY_ODONTO_DEMO_LOCAL = 'ylada_odonto_demo_local' as const

export const STORAGE_KEY_ODONTO_DEMO_NICHO = 'ylada_odonto_demo_nicho' as const

export const STORAGE_KEY_ODONTO_CONTINUAR_TOUR = 'ylada_odonto_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const ODONTO_LANDING_STEP_APOS_DEMO = 7
