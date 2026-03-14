/**
 * Configuração central dos limites do plano Free YLADA.
 * Alterar aqui permite ajustar limites sem refatorar a lógica.
 * @see docs/SPEC-FREEMIUM-YLADA.md
 */
export const FREEMIUM_LIMITS = {
  /** Máximo de links/diagnósticos ativos para plano Free */
  FREE_LIMIT_ACTIVE_LINKS: 1,
  /** Máximo de contatos iniciados no WhatsApp (clicked_whatsapp) por mês para plano Free */
  FREE_LIMIT_WHATSAPP_CLICKS_PER_MONTH: 10,
  /** Máximo de análises avançadas do Noel por mês para plano Free */
  FREE_LIMIT_NOEL_ADVANCED_ANALYSES_PER_MONTH: 10,
  /** Área de assinatura usada pelo produto YLADA (links, Noel, diagnósticos) */
  SUBSCRIPTION_AREA_YLADA: 'ylada',
} as const

export type FreemiumLimitKey = keyof typeof FREEMIUM_LIMITS
