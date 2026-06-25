import {
  type CarolMessageRow,
  isRealUserMessage,
  isCarolAssistantReply,
} from './conversation-insights'
import { stripIgnoredAutoPrefix } from './auto-response'
import { detectPainFromText } from './pain-detection'

/**
 * Prontidão da conversa — quão perto a pessoa está de fechar.
 * Determinístico (sem LLM): lê os sinais nas mensagens reais do lead.
 * É SUGESTÃO por sinais, nunca certeza — a decisão é do Andre.
 */

export type ReadinessLevel = 'quente' | 'morno' | 'frio'

export type ConversationReadiness = {
  score: number
  level: ReadinessLevel
  reasons: string[]
  /** Lead adiou ("amanhã/semana que vem") mas a Carol se despediu por engano — resgatar. */
  misfired_postponement: boolean
}

const norm = (s: string) =>
  stripIgnoredAutoPrefix(s).toLowerCase().replace(/\s+/g, ' ').trim()

/** Topou / quer avançar / perguntou como funciona ou preço/horário. */
function showsClosingInterest(t: string): boolean {
  return (
    /\b(quero|pode sim|pode ser|topo|aceito|bora|vamos|fechado|me conecta|pode conectar|pode agendar|quero agendar|quero falar|pode chamar)\b/.test(
      t
    ) ||
    /(como funciona|quanto custa|qual.*(valor|pre[çc]o)|tem custo|é pago|que horas|qual.*hor[áa]rio|quando.*(pode|seria)|disponibilidade)/.test(
      t
    )
  )
}

/** Sinais de adiamento (não é recusa — é SIM adiado). */
function showsPostponement(t: string): boolean {
  return /(amanh[ãa]|semana que vem|depois|mais tarde|outro dia|outra hora|outro hor[áa]rio|me chama|na pr[óo]xima|fim de semana|segunda|ter[çc]a|quarta|quinta|sexta)/.test(
    t
  )
}

/** Despedida/recuo da Carol (encerrou a conversa). */
function isCarolGoodbye(t: string): boolean {
  return /(sucesso|que bom que t[áa] rodando|fico (por aqui|[àa] disposi[çc][ãa]o)|qualquer coisa.*(chamar|me chama)|um dia.*(oscilar|precisar).*(chamar|me chama))/.test(
    t
  )
}

export function scoreConversationReadiness(
  messages: CarolMessageRow[]
): ConversationReadiness {
  const sorted = [...messages].sort(
    (a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime()
  )

  const userMsgs = sorted.filter(
    (m) => m.role === 'user' && isRealUserMessage(m.content)
  )

  let score = 0
  const reasons: string[] = []

  if (userMsgs.length === 0) {
    return { score: 0, level: 'frio', reasons: ['ainda não respondeu'], misfired_postponement: false }
  }

  // 1) Interesse de fechar / topou / perguntou como funciona, preço ou horário.
  if (userMsgs.some((m) => showsClosingInterest(norm(m.content)))) {
    score += 3
    reasons.push('topou ou perguntou como funciona/horário')
  }

  // 2) Demonstrou a dor.
  if (userMsgs.some((m) => detectPainFromText(stripIgnoredAutoPrefix(m.content)))) {
    score += 2
    reasons.push('demonstrou a dor')
  }

  // 3) Engajamento: respondeu mais de uma vez / com frases próprias.
  if (userMsgs.length >= 2) {
    score += 1
    reasons.push('conversa com várias trocas')
  }
  if (userMsgs.some((m) => stripIgnoredAutoPrefix(m.content).length > 25)) {
    score += 1
    reasons.push('respondeu com as próprias palavras')
  }

  // 4) Adiamento mal interpretado: lead adiou e a última fala da Carol foi despedida.
  const lastUser = userMsgs[userMsgs.length - 1]
  const lastCarol = [...sorted]
    .reverse()
    .find((m) => m.role === 'assistant' && isCarolAssistantReply(m.content))
  const misfired_postponement =
    showsPostponement(norm(lastUser.content)) &&
    Boolean(lastCarol) &&
    isCarolGoodbye(norm(lastCarol!.content))
  if (misfired_postponement) {
    score += 3
    reasons.push('adiou e foi descartada por engano — resgatar')
  }

  const level: ReadinessLevel = score >= 4 ? 'quente' : score >= 2 ? 'morno' : 'frio'
  return { score, level, reasons, misfired_postponement }
}
