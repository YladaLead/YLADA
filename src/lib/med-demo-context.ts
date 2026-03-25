/**
 * Demo med: onde o médico atua + rota do fluxo no lugar do paciente.
 */

export const MED_DEMO_CLIENTE_BASE_PATH = '/pt/med/exemplo-cliente' as const

export const MED_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'consultorio', label: 'Consultório ou clínica própria' },
  { value: 'telemedicina', label: 'Telemedicina' },
  { value: 'hospital', label: 'Hospital ou pronto-socorro (eletivo)' },
  { value: 'grupo', label: 'Rede ou clínica em grupo' },
  { value: 'ambulatorio', label: 'Ambulatório ou ESF' },
  { value: 'outro', label: 'Outro formato' },
]

export const STORAGE_KEY_MED_DEMO_LOCAL = 'ylada_med_demo_local' as const

export const STORAGE_KEY_MED_DEMO_NICHO = 'ylada_med_demo_nicho' as const

export const STORAGE_KEY_MED_CONTINUAR_TOUR = 'ylada_med_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const MED_LANDING_STEP_APOS_DEMO = 7
