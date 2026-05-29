import {
  isAutoResponse,
  isIgnoredAutoReplyMessage,
  stripIgnoredAutoPrefix,
} from './auto-response'

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
  /** Lead respondeu de verdade mas Carol ainda não enviou resposta depois */
  pending_carol_reply: boolean
}

export type PendingCarolReply = {
  conversation_id: string
  phone: string
  nome: string | null
  last_user_message: string
  last_user_at: string
  outbound_at: string | null
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

/** Resposta da Carol (não template outbound, nota Andre ou marcador interno). */
export function isCarolAssistantReply(content: string): boolean {
  if (!content.trim()) return false
  if (content.startsWith(OUTBOUND_PREFIX)) return false
  if (content.startsWith('[ANDRE]')) return false
  if (content.startsWith('[SISTEMA:')) return false
  if (content.startsWith('[botões enviados')) return false
  return true
}

/** Mensagem real do lead (humana), exclui bots e auto-respostas ignoradas. */
export function isRealUserMessage(content: string): boolean {
  if (!isUserInbound(content)) return false
  const raw = stripIgnoredAutoPrefix(content)
  if (!raw) return false
  if (isIgnoredAutoReplyMessage(content)) return false
  if (isAutoResponse(raw)) return false
  return true
}

export function findPendingCarolReply(
  messages: CarolMessageRow[]
): PendingCarolReply | null {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const outbound = sorted.filter((m) => m.role === 'assistant' && isOutboundMessage(m.content))
  const firstOutbound = outbound.find((m) => !isFollowUpOutbound(m.content)) ?? outbound[0]
  if (!firstOutbound) return null

  const last = sorted[sorted.length - 1]
  if (last.role !== 'user' || !isRealUserMessage(last.content)) return null

  // Só outbound antigo — lead respondeu depois e ficou pendente
  if (new Date(last.created_at).getTime() <= new Date(firstOutbound.created_at).getTime()) {
    return null
  }

  return {
    conversation_id: '',
    phone: '',
    nome: null,
    last_user_message: stripIgnoredAutoPrefix(last.content),
    last_user_at: last.created_at,
    outbound_at: firstOutbound.created_at,
  }
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
    pending_carol_reply: findPendingCarolReply(sorted) !== null,
  }
}
