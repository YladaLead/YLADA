/**
 * Demo vendedores: canal + fluxo no lugar do cliente. Imparcial entre ramos; Wellness é outra área no produto.
 */

export const SELLER_DEMO_CLIENTE_BASE_PATH = '/pt/seller/exemplo-cliente' as const

export const SELLER_DEMO_LOCAIS: { value: string; label: string }[] = [
  { value: 'whatsapp', label: 'WhatsApp ou direct' },
  { value: 'loja', label: 'Loja, balcão ou feira' },
  { value: 'redes', label: 'Instagram, TikTok ou redes' },
  { value: 'indicacao', label: 'Indicação e boca a boca' },
  { value: 'online', label: 'Site, loja virtual ou marketplace' },
  { value: 'outro', label: 'Outro canal' },
]

export const STORAGE_KEY_SELLER_DEMO_LOCAL = 'ylada_seller_demo_local' as const

export const STORAGE_KEY_SELLER_DEMO_NICHO = 'ylada_seller_demo_nicho' as const

export const STORAGE_KEY_SELLER_CONTINUAR_TOUR = 'ylada_seller_continuar_tour' as const
