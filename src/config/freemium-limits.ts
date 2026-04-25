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

/** Tipos de gatilho Free → Pro para analytics (Noel, WhatsApp/mês, diagnóstico ativo). */
export const FREEMIUM_CONVERSION_KINDS = ['noel', 'whatsapp', 'active_link'] as const
export type FreemiumConversionKind = (typeof FREEMIUM_CONVERSION_KINDS)[number]

/** Resposta API quando o link não é o único ativo permitido no Free (só o mais antigo fica público). */
export const FREEMIUM_LIMIT_TYPE_EXTRA_ACTIVE_LINK = 'freemium_extra_active_link' as const

/**
 * Benefícios Pro — **uma frase** (tom objetivo; alinhado ao `ActiveLinksProModal` e paywalls da matriz).
 * Textos longos de “documentário” ficam fora da UI; detalhe fica em marketing/docs.
 */
export const YLADA_PRO_UPGRADE_PITCH =
  'Com o Plano Pro você cria vários diagnósticos ativos, contatos ilimitados no WhatsApp por mês e análises completas do Noel.' as const

/** Terceira pessoa (visitante do link). */
export const YLADA_PRO_UPGRADE_PITCH_VISITOR =
  'Com o plano Pro ela cria vários diagnósticos ativos, contatos ilimitados no WhatsApp por mês e análises completas do Noel.' as const

/**
 * Limite “1 diagnóstico ativo por vez” — texto curto (modal Links, biblioteca, resposta da API ao criar link).
 * @see ActiveLinksProModal
 */
export const YLADA_FREEMIUM_ACTIVE_LINK_EXPLANATION_SHORT =
  'No plano gratuito você pode manter 1 diagnóstico ativo por vez. Isso não é "um link por mês": é um diagnóstico no ar ao mesmo tempo. Para criar outro, pause ou arquive um na página Links ou assine o Pro.' as const

/** Limite mensal de contatos WhatsApp (visitante) — texto completo da API + fallback da UI pública. */
export const YLADA_FREEMIUM_WHATSAPP_MONTHLY_LIMIT_MESSAGE_VISITOR =
  `O limite de contatos pelo WhatsApp do plano gratuito para este mês já foi utilizado neste diagnóstico. Na virada do mês o contador renova e novas conversas voltam a chegar. Se precisar receber sem esperar, ela pode ativar o Pro.\n\n${YLADA_PRO_UPGRADE_PITCH_VISITOR}` as const

/** Link extra pausado no Free (visitante) — texto completo. */
export const YLADA_FREEMIUM_EXTRA_ACTIVE_LINK_MESSAGE_VISITOR =
  `No plano gratuito, só um diagnóstico fica disponível para visitantes por vez — por isso este link está pausado na experiência pública até a profissional ativar o Pro.\n\n${YLADA_PRO_UPGRADE_PITCH_VISITOR}` as const

/** Limite do Noel no mês (profissional) — texto completo. */
export const YLADA_FREEMIUM_NOEL_MONTHLY_LIMIT_MESSAGE =
  `Seus créditos com o Noel neste mês já foram utilizados — quando o ciclo renovar, eles voltam automaticamente.\n\n${YLADA_PRO_UPGRADE_PITCH}` as const

/** Só um link ativo no Free (profissional) — API + sessionStorage; corpo = curto + pitch curto. */
export const YLADA_FREEMIUM_ACTIVE_LINK_LIMIT_MESSAGE =
  `${YLADA_FREEMIUM_ACTIVE_LINK_EXPLANATION_SHORT}\n\n${YLADA_PRO_UPGRADE_PITCH}` as const

/** Texto curto para banner na página de Links (plano gratuito). */
export const YLADA_FREEMIUM_LINKS_PAGE_HINT =
  'No plano gratuito: 1 diagnóstico ativo por vez. Não é limite mensal de criação — você pode pausar um e criar outro. Todos os links que você cria ficam nesta lista; em cada linha, Copiar URL é sempre o endereço daquele diagnóstico.' as const
