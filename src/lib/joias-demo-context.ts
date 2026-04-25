/**
 * Demo joias & bijuterias: canal + fluxo no lugar da cliente final.
 */

export const JOIAS_DEMO_CLIENTE_BASE_PATH = '/pt/joias/exemplo-cliente' as const

export const JOIAS_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp ou direct' },
  { value: 'loja', label: 'Loja, balcão ou feira' },
  { value: 'redes', label: 'Instagram, TikTok ou redes' },
  { value: 'indicacao', label: 'Indicação e boca a boca' },
  { value: 'online', label: 'Site, loja virtual ou marketplace' },
  { value: 'outro', label: 'Outro canal' },
]

export const STORAGE_KEY_JOIAS_DEMO_LOCAL = 'ylada_joias_demo_local' as const

export const STORAGE_KEY_JOIAS_DEMO_NICHO = 'ylada_joias_demo_nicho' as const

export const STORAGE_KEY_JOIAS_CONTINUAR_TOUR = 'ylada_joias_continuar_tour' as const

/** Índice do passo na landing (0-based) após o exemplo completo. */
export const JOIAS_LANDING_STEP_APOS_DEMO = 7
