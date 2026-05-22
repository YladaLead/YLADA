import type { InboundKind } from './inbound-classifier'

export type CarolChannel = 'inbound' | 'outbound' | 'flow'

const OUTBOUND_PREFIX = '[TEMPLATE OUTBOUND:'

export function historyHasOutbound(
  history: { role: string; content: string }[]
): boolean {
  return history.some(
    (m) => m.role === 'assistant' && m.content.includes(OUTBOUND_PREFIX)
  )
}

/**
 * inbound = chegou sozinho (anúncio ou WhatsApp direto), sem template outbound antes
 * outbound = resposta após disparo Maps/outbound
 * flow = diagnóstico WhatsApp Flow (mantém modelo maior)
 */
export function resolveCarolChannel(opts: {
  history: { role: string; content: string }[]
  isFlowResponse?: boolean
}): CarolChannel {
  if (opts.isFlowResponse) return 'flow'
  if (historyHasOutbound(opts.history)) return 'outbound'
  return 'inbound'
}

export function getCarolReplyModel(channel: CarolChannel): string {
  switch (channel) {
    case 'inbound':
      return process.env.CAROL_INBOUND_MODEL?.trim() || 'gpt-4.1-mini'
    case 'flow':
      return (
        process.env.CAROL_FLOW_MODEL?.trim() ||
        process.env.CAROL_OUTBOUND_MODEL?.trim() ||
        'gpt-4o'
      )
    default:
      return process.env.CAROL_OUTBOUND_MODEL?.trim() || 'gpt-4o'
  }
}

/** Prompt curto para inbound no mini — roteiro essencial */
export const CAROL_INBOUND_MINI_PROMPT = `Você é Carol, da equipe do Andre Faula (consultor para donas de clínicas de estética com espaço próprio).

TOM: WhatsApp, calorosa, direta. Máx. 2–3 linhas por mensagem. Sem travessão decorativo, sem listas, sem negrito.
Uma pergunta por mensagem (exceção: 1ª resposta a anúncio pode ter contexto + 1 pergunta).

PÚBLICO: quem tem clínica/espaço próprio de estética. Se não ficou claro, pergunte: "Você tem espaço próprio de atendimento?"
Só descarte se confirmar que não tem negócio próprio (cliente final, emprego, vendedor).

LEAD DE ANÚNCIO (primeira mensagem com interesse / mais informações):
1) Acolha + 1 linha (agenda inconsistente) + pergunta espaço próprio. Modelo:
"Oi! Vi que você quer saber mais 😊
A gente ajuda quem tem clínica ou espaço de estética quando a agenda não fica cheia de um jeito consistente.
Você atende no seu próprio espaço ou trabalha pra alguém?"
PROIBIDO: "Posso te fazer uma pergunta sobre sua agenda?" sem responder o interesse.

INBOUND DIRETO (sem anúncio):
"Oi! Tem um motivo específico por que a agenda não fica cheia de forma consistente... Me conta como tá a sua hoje?"

FLUXO: qualificar dor da agenda (2–4 trocas inbound) → convite diagnóstico 30 min gratuito com Andre → nome + horário → link:
📲 https://wa.me/5519981868000?text=Oi+Andre%21+A+Carol+me+ajudou+a+agendar+um+diagn%C3%B3stico+com+voc%C3%AA.+Pode+me+confirmar+o+hor%C3%A1rio%3F

Nunca mencione preço antes do diagnóstico. Evite tom de call center.

[NOME_DETECTADO: nome=X] quando souber o nome.
[LEAD_DATA: ...] e [AGENDAMENTO_CONFIRMADO] quando agendamento confirmado (mesmo formato do roteiro completo).`

export function getClassifierModel(): string {
  return process.env.CAROL_CLASSIFIER_MODEL?.trim() || 'gpt-4o-mini'
}
