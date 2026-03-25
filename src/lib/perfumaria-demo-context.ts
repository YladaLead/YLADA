/**
 * Demo perfumaria: onde você atua + fluxo no lugar do cliente.
 */

export const PERFUMARIA_DEMO_CLIENTE_BASE_PATH = '/pt/perfumaria/exemplo-cliente' as const

export const PERFUMARIA_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'loja', label: 'Loja física ou balcão' },
  { value: 'ecommerce', label: 'E-commerce ou site próprio' },
  { value: 'redes', label: 'Instagram e redes (direct)' },
  { value: 'consultoria', label: 'Consultoria ou curadoria personalizada' },
  { value: 'marca', label: 'Marca própria ou nicho' },
  { value: 'outro', label: 'Outro formato' },
]

export const STORAGE_KEY_PERFUMARIA_DEMO_LOCAL = 'ylada_perfumaria_demo_local' as const

export const STORAGE_KEY_PERFUMARIA_DEMO_NICHO = 'ylada_perfumaria_demo_nicho' as const

export const STORAGE_KEY_PERFUMARIA_CONTINUAR_TOUR = 'ylada_perfumaria_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const PERFUMARIA_LANDING_STEP_APOS_DEMO = 7
