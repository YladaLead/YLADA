/**
 * Demo psicanálise: onde o psicanalista atua + fluxo no lugar de quem busca análise.
 */

export const PSICANALISE_DEMO_CLIENTE_BASE_PATH = '/pt/psicanalise/exemplo-cliente' as const

export const PSICANALISE_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'consultorio', label: 'Consultório próprio (divã)' },
  { value: 'online', label: 'Atendimento online' },
  { value: 'clinica', label: 'Clínica ou espaço compartilhado' },
  { value: 'instituicao', label: 'Instituição ou serviço' },
  { value: 'grupo', label: 'Grupo ou dispositivo clínico' },
  { value: 'outro', label: 'Outro formato' },
]

export const STORAGE_KEY_PSICANALISE_DEMO_LOCAL = 'ylada_psicanalise_demo_local' as const

export const STORAGE_KEY_PSICANALISE_DEMO_NICHO = 'ylada_psicanalise_demo_nicho' as const

export const STORAGE_KEY_PSICANALISE_CONTINUAR_TOUR = 'ylada_psicanalise_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const PSICANALISE_LANDING_STEP_APOS_DEMO = 7
