import { sendWhatsAppMessage } from './sender'
import { saveMessage, updateConversationStatus } from './conversation'
import { isCarolAssistantReply, isRealUserMessage } from './conversation-insights'
import { historyHasOutbound } from './carol-reply-profile'
import { isMetaAdLeadMessage } from './meta-ad-lead'
import { detectPainFromText } from './pain-detection'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '../resend'

/** E-mail do Andre p/ os avisos da Carol — canal confiável (WhatsApp depende da janela de 24h da Meta e costuma falhar). */
const ANDRE_NOTIFY_EMAIL =
  process.env.ADMIN_EMAIL ||
  process.env.CAROL_ANDRE_NOTIFY_EMAIL ||
  process.env.CONTACT_NOTIFICATION_EMAIL ||
  'ylada.lead@gmail.com'

export { detectPainFromText } from './pain-detection'

const PAINEL_URL = 'ylada.com/admin/whatsapp/carol/conversas'

export type CarolAdvanceMilestone =
  | 'respondeu'
  | 'dor_identificada'
  | 'quer_agendar'
  | 'nome_capturado'
  | 'diagnostico_agendado'
  | 'flow_novo'

const NOTIFY_MARKER = '[SISTEMA: notify_andre:'

/** Celular do Andre para avisos de avanço na conversa (E.164 sem +). */
export function getCarolAndreNotifyPhone(): string {
  const raw =
    process.env.CAROL_ANDRE_NOTIFY_PHONE?.trim() ||
    process.env.Z_API_NOTIFICATION_PHONE?.trim() ||
    '5519981868000'
  return raw.replace(/\D/g, '')
}

function wasMilestoneNotified(
  history: Array<{ role: string; content: string }>,
  milestone: CarolAdvanceMilestone
): boolean {
  return history.some((m) => m.content.includes(`${NOTIFY_MARKER}${milestone}]`))
}

async function markMilestoneNotified(
  conversationId: string,
  milestone: CarolAdvanceMilestone
): Promise<void> {
  await saveMessage(
    conversationId,
    'assistant',
    `${NOTIFY_MARKER}${milestone}]`
  )
}

/** Assunto do e-mail = 1ª linha do aviso, sem markdown/emoji. */
function notifySubject(text: string): string {
  const first = (text.split('\n')[0] || 'aviso')
    .replace(/[*_`]/g, '')
    .replace(/^[^\p{L}\p{N}]+/u, '')
    .trim()
  return `Carol — ${first || 'novo aviso'}`.slice(0, 120)
}

async function notifyAndreEmail(text: string): Promise<void> {
  if (!isResendConfigured() || !resend) return
  const html = `<div style="font-family:Arial,sans-serif;background:#f5f7f6;padding:24px;margin:0">
    <div style="max-width:520px;margin:0 auto;background:#fff;border-radius:12px;padding:24px;box-shadow:0 2px 6px rgba(0,0,0,.06)">
      <div style="white-space:pre-line;color:#0f172a;font-size:15px;line-height:1.5">${text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/\*(.+?)\*/g, '<b>$1</b>')}</div>
    </div></div>`
  try {
    await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: ANDRE_NOTIFY_EMAIL,
      subject: notifySubject(text),
      html,
    })
  } catch (err) {
    console.error('[Carol Notify] Falha ao enviar e-mail:', err)
  }
}

async function notifyAndre(text: string): Promise<void> {
  // E-mail = canal confiável (sempre chega).
  await notifyAndreEmail(text)

  // WhatsApp = best-effort (só entrega dentro da janela de 24h da Meta).
  const phone = getCarolAndreNotifyPhone()
  if (phone) {
    try {
      await sendWhatsAppMessage(phone, text)
      console.log(`[Carol Notify] Aviso enviado para +${phone}`)
    } catch (err) {
      console.error('[Carol Notify] WhatsApp falhou (provável janela 24h):', err)
    }
  }
}

function formatLeadLine(nome: string | null | undefined, phone: string): string {
  const label = nome?.trim() || `+${phone}`
  return nome?.trim() ? `${nome} (+${phone})` : `+${phone}`
}

function countRealUserMessages(
  history: Array<{ role: string; content: string }>
): number {
  return history.filter((m) => m.role === 'user' && isRealUserMessage(m.content)).length
}

function userShowsSchedulingInterest(
  text: string,
  history: Array<{ role: string; content: string }>
): boolean {
  const t = text.toLowerCase().trim()
  const affirmative =
    /^(sim|sii+m|quero|pode|topo|claro|vamos|ok|pode ser|com certeza|bora|fechado|aceito|vamos sim|pode sim|quero sim)\b/i.test(
      t
    ) || /\b(sim|quero|topo|pode agendar|quero agendar|vamos agendar)\b/i.test(t)

  if (!affirmative) return false

  const lastAssistant = [...history]
    .reverse()
    .find((m) => m.role === 'assistant' && isCarolAssistantReply(m.content))

  if (!lastAssistant) return false

  const la = lastAssistant.content.toLowerCase()
  return (
    la.includes('agende') ||
    la.includes('agendar') ||
    (la.includes('diagnóstico') && la.includes('?')) ||
    (la.includes('diagnostico') && la.includes('?'))
  )
}

export type AdvanceNotifyContext = {
  conversationId: string
  phone: string
  nome: string | null
  text: string
  history: Array<{ role: string; content: string }>
  isFlowResponse?: boolean
  paused?: boolean
}

/** Avisos quando o lead avança (mensagem recebida / antes da resposta da Carol). */
export async function notifyConversationAdvanceOnInbound(
  ctx: AdvanceNotifyContext
): Promise<void> {
  const { conversationId, phone, nome, text, history, isFlowResponse, paused } = ctx

  if (paused) {
    await notifyAndre(
      `📩 *Nova mensagem* (conversa pausada)\n` +
        `👤 ${formatLeadLine(nome, phone)}\n` +
        `💬 "${text.slice(0, 200)}"\n\n` +
        `_${PAINEL_URL}_`
    )
    return
  }

  if (isFlowResponse && !wasMilestoneNotified(history, 'flow_novo')) {
    await markMilestoneNotified(conversationId, 'flow_novo')
    await notifyAndre(
      `🆕 *Novo lead via Flow*\n` +
        `👤 ${formatLeadLine(nome, phone)}\n` +
        `💬 ${text.slice(0, 300)}\n\n` +
        `_${PAINEL_URL}_`
    )
  }

  const realCount = countRealUserMessages(history)
  const isFirstReal = realCount === 1
  const fromOutbound = historyHasOutbound(history)

  if (
    isFirstReal &&
    !wasMilestoneNotified(history, 'respondeu') &&
    !isMetaAdLeadMessage(text)
  ) {
    await markMilestoneNotified(conversationId, 'respondeu')
    await updateConversationStatus(conversationId, 'em_andamento')
    const canal = fromOutbound ? 'Outbound Maps' : 'Inbound'
    await notifyAndre(
      `💬 *Lead respondeu* (${canal})\n` +
        `👤 ${formatLeadLine(nome, phone)}\n` +
        `💬 "${text.slice(0, 220)}"\n\n` +
        `_${PAINEL_URL}_`
    )
  }

  const pain = detectPainFromText(text)
  if (pain && !wasMilestoneNotified(history, 'dor_identificada')) {
    if (
      !wasMilestoneNotified(history, 'respondeu') &&
      !isMetaAdLeadMessage(text)
    ) {
      await markMilestoneNotified(conversationId, 'respondeu')
      const canal = fromOutbound ? 'Outbound Maps' : 'Inbound'
      await notifyAndre(
        `💬 *Lead respondeu* (${canal})\n` +
          `👤 ${formatLeadLine(nome, phone)}\n` +
          `💬 "${text.slice(0, 220)}"\n\n` +
          `_${PAINEL_URL}_`
      )
    }
    await markMilestoneNotified(conversationId, 'dor_identificada')
    await updateConversationStatus(conversationId, 'em_andamento', {
      hipotese: pain.hipotese,
    })
    await notifyAndre(
      `🎯 *Dor identificada:* ${pain.label}\n` +
        `👤 ${formatLeadLine(nome, phone)}\n` +
        `💬 "${text.slice(0, 180)}"\n\n` +
        `_${PAINEL_URL}_`
    )
  }

  if (
    userShowsSchedulingInterest(text, history) &&
    !wasMilestoneNotified(history, 'quer_agendar')
  ) {
    await markMilestoneNotified(conversationId, 'quer_agendar')
    await notifyAndre(
      `✅ *Quer agendar diagnóstico*\n` +
        `👤 ${formatLeadLine(nome, phone)}\n` +
        `💬 "${text.slice(0, 120)}"\n\n` +
        `_${PAINEL_URL}_`
    )
  }
}

export async function notifyNomeCapturado(opts: {
  conversationId: string
  phone: string
  nome: string
  history: Array<{ role: string; content: string }>
}): Promise<void> {
  const { conversationId, phone, nome, history } = opts
  if (wasMilestoneNotified(history, 'nome_capturado')) return

  await markMilestoneNotified(conversationId, 'nome_capturado')
  await updateConversationStatus(conversationId, 'em_andamento', { nome })
  await notifyAndre(
    `👤 *Nome capturado:* ${nome}\n` +
      `📱 +${phone}\n\n` +
      `_${PAINEL_URL}_`
  )
}

export async function notifyDiagnosticoAgendado(opts: {
  conversationId: string
  phone: string
  leadNome: string
  leadEmail: string
  leadHorario: string
  leadSegmento: string
  leadFaturamento: string
  leadEquipe: string
  leadDor: string
  history: Array<{ role: string; content: string }>
}): Promise<void> {
  const {
    conversationId,
    phone,
    leadNome,
    leadEmail,
    leadHorario,
    leadSegmento,
    leadFaturamento,
    leadEquipe,
    leadDor,
    history,
  } = opts

  if (!wasMilestoneNotified(history, 'diagnostico_agendado')) {
    await markMilestoneNotified(conversationId, 'diagnostico_agendado')
  }

  await updateConversationStatus(conversationId, 'diagnostico_agendado')
  await notifyAndre(
    `🗓️ *Diagnóstico agendado!*\n\n` +
      `👤 *Nome:* ${leadNome}\n` +
      `📧 *Email:* ${leadEmail}\n` +
      `📱 *WhatsApp:* +${phone}\n` +
      `⏰ *Horário:* ${leadHorario}\n` +
      `🏢 *Segmento:* ${leadSegmento}\n` +
      `💰 *Faturamento:* ${leadFaturamento}\n` +
      `👥 *Equipe:* ${leadEquipe}\n` +
      `💬 *Dor:* ${leadDor}\n\n` +
      `_${PAINEL_URL}_`
  )
}
