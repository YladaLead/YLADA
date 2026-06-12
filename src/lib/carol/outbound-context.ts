import { historyHasOutbound } from './carol-reply-profile'
import { isCarolAssistantReply, isRealUserMessage } from './conversation-insights'
import { detectPainFromText } from './pain-detection'

const OUTBOUND_MSG_RE = /\[TEMPLATE OUTBOUND:[^\]]+\]([^\n]*)/

/** Extrai metadados gravados no registro do template outbound. */
export function parseOutboundRegisterMeta(content: string): {
  nomeNegocio: string | null
  cidade: string | null
} {
  const tail = content.match(OUTBOUND_MSG_RE)?.[1] ?? ''
  const cidadeMatch = tail.match(/cidade=([^·\n]+)/i)
  const nomeMatch = content.match(/Enviado para ([^·\n]+)/i)
  return {
    nomeNegocio: nomeMatch?.[1]?.trim() || null,
    cidade: cidadeMatch?.[1]?.trim() || null,
  }
}

export function getOutboundLeadContext(
  history: Array<{ role: string; content: string }>,
  conversationNome: string | null
): { nomeNegocio: string | null; cidade: string | null } {
  const outboundMsg = history.find(
    (m) => m.role === 'assistant' && m.content.includes('[TEMPLATE OUTBOUND:')
  )
  const fromMsg = outboundMsg
    ? parseOutboundRegisterMeta(outboundMsg.content)
    : { nomeNegocio: null, cidade: null }

  const nomeNegocio =
    conversationNome?.trim() ||
    (fromMsg.nomeNegocio && fromMsg.nomeNegocio !== 'lead'
      ? fromMsg.nomeNegocio
      : null)

  return { nomeNegocio, cidade: fromMsg.cidade }
}

export function carolAlreadySentPainButtons(
  history: Array<{ role: string; content: string }>
): boolean {
  return history.some((m) => m.content.includes('[botões enviados'))
}

export function carolHasConversationalReply(
  history: Array<{ role: string; content: string }>
): boolean {
  return history.some(
    (m) =>
      m.role === 'assistant' &&
      isCarolAssistantReply(m.content) &&
      !m.content.startsWith('[botões enviados')
  )
}

export function countRealUserMessages(
  history: Array<{ role: string; content: string }>
): number {
  return history.filter((m) => m.role === 'user' && isRealUserMessage(m.content))
    .length
}

/** Primeira mensagem humana após template outbound — momento ideal para botões de dor. */
export function shouldSendOutboundPainButtons(
  text: string,
  history: Array<{ role: string; content: string }>
): boolean {
  if (!historyHasOutbound(history)) return false
  if (carolAlreadySentPainButtons(history)) return false
  if (carolHasConversationalReply(history)) return false
  if (text.match(/\[botão:/i)) return false
  if (detectPainFromText(text)) return false
  return countRealUserMessages(history) === 1
}

export function buildOutboundPromptContext(opts: {
  nomeNegocio: string | null
  cidade: string | null
  temAutoRespostaBot: boolean
}): string {
  const { nomeNegocio, cidade, temAutoRespostaBot } = opts
  const lines = [
    '',
    'CONTEXTO OUTBOUND (pesquisa Maps / template WhatsApp já enviado):',
    '- A clínica recebeu um template sobre agenda ANTES desta conversa.',
    '- NÃO repita a pergunta do template nem pareça spam.',
    '- Trilha curta: 2 a 3 trocas até convite ao diagnóstico de 30 min com o Andre.',
    '- Assume que tem espaço próprio (veio do Maps como negócio de estética). Não descarte na primeira linha.',
  ]

  if (nomeNegocio) {
    lines.push(
      `- Nome do negócio no cadastro: "${nomeNegocio}". Trate como clínica/salão — pergunte se é a dona ou quem cuida da agenda, sem soar robótico.`
    )
  }
  if (cidade) {
    lines.push(`- Cidade: ${cidade}. Pode mencionar com naturalidade se fizer sentido.`)
  }
  if (temAutoRespostaBot) {
    lines.push(
      '- Houve auto-resposta de bot da clínica ([auto-resposta ignorada]) — ignore, aguarde a dona. Na primeira mensagem REAL dela, acolha sem repetir o template.'
    )
  }

  lines.push(
    '- Se ela mandar só "Oi" / "Bom dia": acolha e pergunte como está a agenda.',
    '- PROIBIDO: "Se não for o caso, obrigada" ou descarte sem confirmar.'
  )

  return '\n' + lines.join('\n') + '\n'
}
