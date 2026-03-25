/**
 * Demo psi: onde a pessoa atua + rota do fluxo no lugar do paciente.
 */

export const PSI_DEMO_CLIENTE_BASE_PATH = '/pt/psi/exemplo-cliente' as const

export const PSI_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'consultorio', label: 'Consultório próprio ou sala' },
  { value: 'online', label: 'Atendimento online' },
  { value: 'clinica', label: 'Clínica ou espaço compartilhado' },
  { value: 'empresa', label: 'Empresas ou grupos' },
  { value: 'social', label: 'APS ou serviço público / social' },
  { value: 'outro', label: 'Outro formato' },
]

export const STORAGE_KEY_PSI_DEMO_LOCAL = 'ylada_psi_demo_local' as const

export const STORAGE_KEY_PSI_DEMO_NICHO = 'ylada_psi_demo_nicho' as const

export const STORAGE_KEY_PSI_CONTINUAR_TOUR = 'ylada_psi_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const PSI_LANDING_STEP_APOS_DEMO = 7
