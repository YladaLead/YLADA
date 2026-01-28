/**
 * Worker único — dado horário atual, decide o que rodar e chama os disparos.
 * Respeita isAllowedTimeToSendMessage (horário comercial).
 */

import { supabaseAdmin } from '@/lib/supabase'
import { isAllowedTimeToSendMessage } from '@/lib/whatsapp-carol-ai'
import { getFaseFromTagsAndContext } from './fase'
import {
  enviarBoasVindasSemClique,
  enviarPreAula,
  enviarLinkPosParticipou,
  enviarRemarketing,
  enviarFollowUpNaoRespondeu,
} from './disparos'

const AREA_PADRAO = 'nutri'

export interface WorkerResult {
  ok: boolean
  skipped?: boolean
  reason?: string
  boasVindas: { enviados: number; erros: number }
  preAula: { enviados: number; erros: number }
  followUpNaoRespondeu: { enviados: number; erros: number }
  linkPosParticipou: { enviados: number; erros: number }
  remarketing: { enviados: number; erros: number }
}

/**
 * Executa o worker: boas-vindas sem clique, pré-aula, follow-up não respondeu.
 * Link pós-participou e remarketing são acionados pelo admin (participou/não participou); o worker não os inclui por padrão.
 */
export async function runWorker(area: string = AREA_PADRAO): Promise<WorkerResult> {
  const result: WorkerResult = {
    ok: true,
    boasVindas: { enviados: 0, erros: 0 },
    preAula: { enviados: 0, erros: 0 },
    followUpNaoRespondeu: { enviados: 0, erros: 0 },
    linkPosParticipou: { enviados: 0, erros: 0 },
    remarketing: { enviados: 0, erros: 0 },
  }

  const timeCheck = isAllowedTimeToSendMessage()
  if (!timeCheck.allowed) {
    result.ok = false
    result.skipped = true
    result.reason = timeCheck.reason || 'Fora do horário comercial'
    return result
  }

  const now = new Date()
  const nowBr = new Date(now.toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' }))

  // --- Boas-vindas sem clique: leads últimos 7 dias, sem conversa com mensagem do cliente ---
  const seteDiasAtras = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000).toISOString()
  const { data: inscricoes } = await supabaseAdmin
    .from('workshop_inscricoes')
    .select('nome, telefone, created_at')
    .gte('created_at', seteDiasAtras)
    .order('created_at', { ascending: false })
    .limit(100)
  const leads = (inscricoes || []).filter(
    (i: { telefone?: string }) => i.telefone && String(i.telefone).replace(/\D/g, '').length >= 10
  )
  for (const lead of leads) {
    const phoneClean = String(lead.telefone).replace(/\D/g, '')
    const phoneNorm = phoneClean.startsWith('55') ? phoneClean : '55' + phoneClean
    const { data: conv } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id')
      .eq('phone', phoneNorm)
      .eq('area', area)
      .maybeSingle()
    if (conv) {
      const { data: customerMsg } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('id')
        .eq('conversation_id', conv.id)
        .eq('sender_type', 'customer')
        .limit(1)
        .maybeSingle()
      if (customerMsg) continue // já chamou, não enviar boas-vindas sem clique
      const { data: botWelcome } = await supabaseAdmin
        .from('whatsapp_messages')
        .select('id')
        .eq('conversation_id', conv.id)
        .eq('sender_type', 'bot')
        .eq('sender_name', 'Carol - Secretária')
        .limit(1)
        .maybeSingle()
      if (botWelcome) continue // já recebeu boas-vindas
    }
    const r = await enviarBoasVindasSemClique(
      phoneNorm,
      (lead as { nome?: string }).nome || 'Cliente',
      area
    )
    if (r.success) result.boasVindas.enviados++
    else result.boasVindas.erros++
  }

  // --- Pré-aula: conversas com workshop_session_id — 2h, 30min e 10min antes (e opcional 24h/12h) ---
  const { data: convsPre } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, phone, context')
    .eq('area', area)
    .eq('status', 'active')
    .not('context->workshop_session_id', 'is', null)
  for (const c of convsPre || []) {
    const ctx = (c.context || {}) as Record<string, unknown>
    const sessionId = ctx.workshop_session_id as string | undefined
    if (!sessionId) continue
    const { data: session } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('starts_at')
      .eq('id', sessionId)
      .maybeSingle()
    if (!session) continue
    const sessaoBr = new Date(
      new Date(session.starts_at).toLocaleString('en-US', { timeZone: 'America/Sao_Paulo' })
    )
    const diffMs = sessaoBr.getTime() - nowBr.getTime()
    const diffH = diffMs / (1000 * 60 * 60)
    const diffMin = diffMs / (1000 * 60)
    const key = `pre_class_${sessionId}` as keyof typeof ctx
    const sent = (ctx[key] as Record<string, boolean>) || {}
    let tipo: '24h' | '12h' | '2h' | '30min' | '10min' | null = null
    if (!sent.sent_24h && diffH >= 23 && diffH < 25) tipo = '24h'
    else if (!sent.sent_12h && diffH >= 11 && diffH < 13) tipo = '12h'
    else if (!sent.sent_2h && diffH >= 1.9 && diffH < 2.5) tipo = '2h'
    else if (!sent.sent_30min && diffMin >= 28 && diffMin < 32) tipo = '30min'
    else if (!sent.sent_10min && diffMin >= 8 && diffMin < 12) tipo = '10min'
    if (tipo) {
      const r = await enviarPreAula(c.id, tipo, area)
      if (r.success) result.preAula.enviados++
      else result.preAula.erros++
    }
  }

  // --- Follow-up não respondeu: fase chamou_nao_fechou, última msg nossa há 24h/48h/72h ---
  const { data: convsFollow } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, context, created_at')
    .eq('area', area)
    .eq('status', 'active')
  for (const c of convsFollow || []) {
    const ctx = (c.context || {}) as Record<string, unknown>
    const tags = Array.isArray(ctx.tags) ? (ctx.tags as string[]) : []
    const fase = getFaseFromTagsAndContext(tags, {
      workshop_session_id: (ctx.workshop_session_id as string) ?? null,
    })
    if (fase !== 'chamou_nao_fechou') continue
    if (tags.includes('sem_resposta')) continue
    const criadoEm = new Date((c as { created_at: string }).created_at).getTime()
    const passou24 = now.getTime() - criadoEm >= 23 * 60 * 60 * 1000
    const passou48 = now.getTime() - criadoEm >= 47 * 60 * 60 * 1000
    const passou72 = now.getTime() - criadoEm >= 71 * 60 * 60 * 1000
    const { data: lastBot } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('created_at')
      .eq('conversation_id', c.id)
      .eq('sender_type', 'bot')
      .eq('sender_name', 'Carol - Secretária')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()
    const lastBotAt = lastBot?.created_at ? new Date(lastBot.created_at).getTime() : criadoEm
    const hDesdeBot = (now.getTime() - lastBotAt) / (1000 * 60 * 60)
    let tipo: '24h' | '48h' | '72h' | null = null
    if (hDesdeBot >= 23 && hDesdeBot < 25) tipo = '24h'
    else if (hDesdeBot >= 47 && hDesdeBot < 49) tipo = '48h'
    else if (hDesdeBot >= 71 && hDesdeBot < 73) tipo = '72h'
    if (tipo) {
      const r = await enviarFollowUpNaoRespondeu(c.id, tipo, area)
      if (r.success) result.followUpNaoRespondeu.enviados++
      else result.followUpNaoRespondeu.erros++
    }
  }

  return result
}
