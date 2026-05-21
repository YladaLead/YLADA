export type CarolMessageRow = {
  role: string
  content: string
  created_at: string
}

export type ConversationInsights = {
  has_outbound: boolean
  has_user_reply: boolean
  follow_up_sent: boolean
  first_outbound_at: string | null
  /** Sem mensagem do lead após o primeiro outbound (inclui auto-resposta) */
  awaiting_reply: boolean
}

const OUTBOUND_PREFIX = '[TEMPLATE OUTBOUND:'
const FOLLOW_UP_MARKER = '(Follow-up)'

export function isOutboundMessage(content: string): boolean {
  return content.startsWith(OUTBOUND_PREFIX)
}

export function isFollowUpOutbound(content: string): boolean {
  return isOutboundMessage(content) && content.includes(FOLLOW_UP_MARKER)
}

export function isUserInbound(content: string): boolean {
  return !content.startsWith('[TEMPLATE OUTBOUND:') && !content.startsWith('[ANDRE]')
}

export function analyzeConversationMessages(
  messages: CarolMessageRow[]
): ConversationInsights {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const outbound = sorted.filter((m) => m.role === 'assistant' && isOutboundMessage(m.content))
  const firstOutbound = outbound.find((m) => !isFollowUpOutbound(m.content)) ?? outbound[0]
  const followUpSent = outbound.some((m) => isFollowUpOutbound(m.content))

  let hasUserReply = false
  if (firstOutbound) {
    const t0 = new Date(firstOutbound.created_at).getTime()
    hasUserReply = sorted.some(
      (m) =>
        m.role === 'user' &&
        isUserInbound(m.content) &&
        new Date(m.created_at).getTime() > t0
    )
  } else {
    hasUserReply = sorted.some((m) => m.role === 'user' && isUserInbound(m.content))
  }

  return {
    has_outbound: outbound.length > 0,
    has_user_reply: hasUserReply,
    follow_up_sent: followUpSent,
    first_outbound_at: firstOutbound?.created_at ?? null,
    awaiting_reply: Boolean(firstOutbound) && !hasUserReply,
  }
}
