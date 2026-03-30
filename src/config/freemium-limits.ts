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

/** Resposta API quando o link não é o único ativo permitido no Free (só o mais antigo fica público). */
export const FREEMIUM_LIMIT_TYPE_EXTRA_ACTIVE_LINK = 'freemium_extra_active_link' as const

/** Bloco único de benefícios Pro (tom: profissional / segunda pessoa). */
export const YLADA_PRO_UPGRADE_PITCH =
  'No plano Pro você tem o Noel sem limite para pensar em estratégias, atrair clientes e promover melhor o seu trabalho. Também cria links ilimitados e usa vários fluxos para gerar contato, com conversas ilimitadas chegando no seu WhatsApp.' as const

/** Mesmo pitch na terceira pessoa (visitante do link falando da profissional). */
export const YLADA_PRO_UPGRADE_PITCH_VISITOR =
  'Com o plano Pro ela libera o Noel sem limite para pensar em estratégias, atrair clientes e promover melhor o trabalho; cria links ilimitados e usa vários fluxos para gerar contato, com conversas ilimitadas no WhatsApp.' as const

/** Limite mensal de contatos WhatsApp (visitante) — texto completo da API + fallback da UI pública. */
export const YLADA_FREEMIUM_WHATSAPP_MONTHLY_LIMIT_MESSAGE_VISITOR =
  `O limite de contatos pelo WhatsApp do plano gratuito para este mês já foi utilizado neste diagnóstico. Na virada do mês o contador renova e novas conversas voltam a chegar. Se precisar receber sem esperar, ela pode ativar o Pro.\n\n${YLADA_PRO_UPGRADE_PITCH_VISITOR}` as const

/** Link extra pausado no Free (visitante) — texto completo. */
export const YLADA_FREEMIUM_EXTRA_ACTIVE_LINK_MESSAGE_VISITOR =
  `No plano gratuito, só um diagnóstico fica disponível para visitantes por vez — por isso este link está pausado na experiência pública até a profissional ativar o Pro.\n\n${YLADA_PRO_UPGRADE_PITCH_VISITOR}` as const

/** Limite do Noel no mês (profissional) — texto completo. */
export const YLADA_FREEMIUM_NOEL_MONTHLY_LIMIT_MESSAGE =
  `Seus créditos com o Noel neste mês já foram utilizados — quando o ciclo renovar, eles voltam automaticamente.\n\n${YLADA_PRO_UPGRADE_PITCH}` as const

/** Só um link ativo no Free (profissional) — texto completo ao tentar criar outro. */
export const YLADA_FREEMIUM_ACTIVE_LINK_LIMIT_MESSAGE =
  `No plano gratuito você mantém um diagnóstico ativo por vez (não é um limite por mês em quantidade de links — é um diagnóstico publicado ao mesmo tempo). Para criar outro, pause ou arquive um link na lista desta página, ou assine o Pro para vários ativos.\n\n${YLADA_PRO_UPGRADE_PITCH}` as const

/** Texto curto para banner na página de Links (plano gratuito). */
export const YLADA_FREEMIUM_LINKS_PAGE_HINT =
  'No plano gratuito: 1 diagnóstico ativo por vez. Não é limite mensal de criação — você pode pausar um e criar outro. Todos os links que você cria ficam nesta lista; em cada linha, Copiar URL é sempre o endereço daquele diagnóstico.' as const
