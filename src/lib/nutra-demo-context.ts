/**
 * Demo nutra (suplementos): canal de venda + rota do fluxo no lugar do cliente.
 */

export const NUTRA_DEMO_CLIENTE_BASE_PATH = '/pt/nutra/exemplo-cliente' as const

export const NUTRA_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'redes', label: 'Redes sociais e direct' },
  { value: 'grupos', label: 'Grupos e comunidade' },
  { value: 'presencial', label: 'Atendimento presencial ou loja' },
  { value: 'parcerias', label: 'Parcerias (academia, clínica, estética)' },
  { value: 'eventos', label: 'Feiras, eventos ou indicação' },
  { value: 'outro', label: 'Outro formato' },
]

export const STORAGE_KEY_NUTRA_DEMO_LOCAL = 'ylada_nutra_demo_local' as const

export const STORAGE_KEY_NUTRA_DEMO_NICHO = 'ylada_nutra_demo_nicho' as const

export const STORAGE_KEY_NUTRA_CONTINUAR_TOUR = 'ylada_nutra_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const NUTRA_LANDING_STEP_APOS_DEMO = 7
