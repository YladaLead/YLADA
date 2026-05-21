import { supabaseAdmin } from '@/lib/supabase'
import { sendWhatsAppTemplate } from './sender'
import { registerOutboundSend, normalizeCarolPhone } from './register-outbound'
import {
  analyzeConversationMessages,
  isFollowUpOutbound,
  isOutboundMessage,
  type CarolMessageRow,
} from './conversation-insights'
import { outboundTemplateLabel } from './outbound-templates'

/** Meta: 2º template MARKETING sem resposta costuma cobrar de novo após ~24h da 1ª mensagem */
export const META_MARKETING_WINDOW_MINUTES = 23 * 60 // margem de 1h antes das 24h
export const FOLLOWUP_MIN_MINUTES = 30
export const FOLLOWUP_MAX_AFTER_MINUTES = 20 * 60 // não esperar perto de 24h

export type FollowUpConfig = {
  enabled: boolean
  afterMinutes: number
  firstTemplate: string
  followUpTemplate: string
  useNomeVariable: boolean
  maxPerRun?: number
}

export function normalizeFollowUpConfig(config: FollowUpConfig): FollowUpConfig {
  const afterMinutes = Math.min(
    FOLLOWUP_MAX_AFTER_MINUTES,
    Math.max(FOLLOWUP_MIN_MINUTES, config.afterMinutes || 60)
  )
  return { ...config, afterMinutes }
}

export const DEFAULT_FOLLOW_UP_CONFIG: FollowUpConfig = {
  enabled: true,
  afterMinutes: 60,
  firstTemplate: 'carol_pesquisa_agenda',
  followUpTemplate: 'carol_pergunta_abertura',
  useNomeVariable: true,
  maxPerRun: 10,
}

function matchesFirstCampaign(content: string, templateName: string): boolean {
  if (!isOutboundMessage(content) || isFollowUpOutbound(content)) return false
  const label = outboundTemplateLabel(templateName)
  return content.includes(label) || content.includes(templateName)
}

export type FollowUpCandidate = {
  conversationId: string
  phone: string
  nome: string | null
  firstOutboundAt: string
  minutesSinceOutbound: number
}

export async function getFollowUpCandidates(
  config: FollowUpConfig
): Promise<FollowUpCandidate[]> {
  config = normalizeFollowUpConfig(config)
  if (!supabaseAdmin) throw new Error('Supabase admin não configurado')

  const { data: outboundMsgs, error } = await supabaseAdmin
    .from('carol_messages')
    .select('conversation_id, content, created_at, role')
    .eq('role', 'assistant')
    .ilike('content', '%TEMPLATE OUTBOUND%')
    .order('created_at', { ascending: true })

  if (error) throw new Error(error.message)

  const firstByConv = new Map<string, { created_at: string }>()
  for (const row of outboundMsgs || []) {
    const content = row.content as string
    if (!matchesFirstCampaign(content, config.firstTemplate)) continue
    const existing = firstByConv.get(row.conversation_id)
    if (
      !existing ||
      new Date(row.created_at).getTime() < new Date(existing.created_at).getTime()
    ) {
      firstByConv.set(row.conversation_id, { created_at: row.created_at })
    }
  }

  const convIds = [...firstByConv.keys()]
  if (convIds.length === 0) return []

  const { data: allMsgs } = await supabaseAdmin
    .from('carol_messages')
    .select('conversation_id, role, content, created_at')
    .in('conversation_id', convIds)
    .order('created_at', { ascending: true })

  const msgsByConv = new Map<string, CarolMessageRow[]>()
  for (const m of allMsgs || []) {
    const list = msgsByConv.get(m.conversation_id) || []
    list.push({
      role: m.role,
      content: m.content,
      created_at: m.created_at,
    })
    msgsByConv.set(m.conversation_id, list)
  }

  const { data: convs } = await supabaseAdmin
    .from('carol_conversations')
    .select('id, phone, nome')
    .in('id', convIds)

  const convMap = new Map((convs || []).map((c) => [c.id, c]))
  const now = Date.now()
  const minMs = config.afterMinutes * 60 * 1000
  const candidates: FollowUpCandidate[] = []

  for (const [conversationId, first] of firstByConv) {
    const insights = analyzeConversationMessages(
      msgsByConv.get(conversationId) || []
    )
    if (insights.has_user_reply || insights.follow_up_sent) continue

    const elapsed = now - new Date(first.created_at).getTime()
    if (elapsed < minMs) continue

    // Passou da janela ~24h: 2º template MARKETING provavelmente cobra de novo — não enviar automático
    if (elapsed > META_MARKETING_WINDOW_MINUTES * 60 * 1000) continue

    const conv = convMap.get(conversationId)
    if (!conv?.phone) continue

    candidates.push({
      conversationId,
      phone: conv.phone,
      nome: conv.nome,
      firstOutboundAt: first.created_at,
      minutesSinceOutbound: Math.floor(elapsed / 60000),
    })
  }

  return candidates.sort(
    (a, b) =>
      new Date(a.firstOutboundAt).getTime() - new Date(b.firstOutboundAt).getTime()
  )
}

export async function runFollowUpBatch(config: FollowUpConfig): Promise<{
  candidates: number
  sent: number
  failed: number
  skipped_late_window?: number
  results: { phone: string; ok: boolean; error?: string }[]
}> {
  config = normalizeFollowUpConfig(config)
  if (!config.enabled) {
    return { candidates: 0, sent: 0, failed: 0, results: [] }
  }

  const all = await getFollowUpCandidates(config)
  const batch = all.slice(0, config.maxPerRun ?? 10)
  const results: { phone: string; ok: boolean; error?: string }[] = []
  let sent = 0
  let failed = 0

  for (const c of batch) {
    const phone = normalizeCarolPhone(c.phone)
    const nome = c.nome?.trim() || 'você'
    try {
      const vars = config.useNomeVariable ? [nome] : []
      await sendWhatsAppTemplate(phone, config.followUpTemplate, vars)
      await registerOutboundSend({
        phone,
        template: config.followUpTemplate,
        nome,
        source: 'ylada_outbound',
        isFollowUp: true,
      })
      sent++
      results.push({ phone, ok: true })
      console.log(
        `[Carol Follow-up] ${config.followUpTemplate} → ${phone} (+${c.minutesSinceOutbound}min)`
      )
      await new Promise((r) => setTimeout(r, 12000 + Math.random() * 8000))
    } catch (e) {
      failed++
      const msg = e instanceof Error ? e.message : 'Erro'
      results.push({ phone, ok: false, error: msg })
      console.error(`[Carol Follow-up] Falha ${phone}:`, msg)
    }
  }

  return { candidates: all.length, sent, failed, results }
}
