/**
 * Disparos por fase — envio imediato usando scripts-workshop + Z-API.
 * Cada função: monta texto com script, envia via Z-API, salva em whatsapp_messages e atualiza contexto se necessário.
 */

import { supabaseAdmin } from '@/lib/supabase'
import {
  getZApiInstance,
  getRegistrationName,
  getFirstName,
  sendWhatsAppMessage,
  formatSessionDateTime,
} from '@/lib/whatsapp-carol-ai'
import type { OpcaoAula } from './scripts-workshop'
import {
  getScriptBoasVindasSemClique,
  getScriptPreAula24h,
  getScriptPreAula12h,
  getScriptPreAula2h,
  getScriptPreAula30min,
  getScriptPreAula10min,
  getScriptLinkPosParticipou,
  getScriptRemarketing,
  getScriptFollowUpNaoRespondeu24h,
  getScriptFollowUpNaoRespondeu48h,
  getScriptFollowUpNaoRespondeu72h,
} from './scripts-workshop'

const AREA_PADRAO = 'nutri'

function sessionToOpcao(session: { starts_at: string; zoom_link?: string | null }): OpcaoAula {
  const { weekday, date, time } = formatSessionDateTime(session.starts_at)
  return {
    diasemana: weekday,
    data: date,
    hora: time,
    linkZoom: session.zoom_link ?? undefined,
  }
}

async function getProximasSessoes(area: string = AREA_PADRAO, limit = 2): Promise<OpcaoAula[]> {
  const { data: list } = await supabaseAdmin
    .from('whatsapp_workshop_sessions')
    .select('id, title, starts_at, zoom_link')
    .eq('area', area)
    .eq('is_active', true)
    .gte('starts_at', new Date().toISOString())
    .order('starts_at', { ascending: true })
    .limit(limit)
  return (list || []).map(sessionToOpcao)
}

export interface EnvioResult {
  success: boolean
  error?: string
}

/**
 * Envia boas-vindas sem clique (cadastro mas não clicou no WhatsApp).
 * Cria ou atualiza conversa e adiciona tags veio_aula_pratica, primeiro_contato.
 * "Link Workshop" (recebeu_link_workshop) só é adicionado quando enviar mensagem com link (ex.: pré-aula).
 */
export async function enviarBoasVindasSemClique(
  phone: string,
  nome: string,
  area: string = AREA_PADRAO
): Promise<EnvioResult> {
  const instance = await getZApiInstance(area)
  if (!instance?.instance_id || !instance?.token) {
    return { success: false, error: 'Instância Z-API não encontrada' }
  }
  const opcoes = await getProximasSessoes(area, 2)
  if (opcoes.length < 2) {
    return { success: false, error: 'Menos de 2 sessões disponíveis' }
  }
  const nomePrimeiro = getFirstName(nome || '')
  const texto = getScriptBoasVindasSemClique(nomePrimeiro, opcoes[0], opcoes[1])
  const phoneNorm = phone.replace(/\D/g, '').startsWith('55')
    ? phone.replace(/\D/g, '')
    : '55' + phone.replace(/\D/g, '')
  const tags = ['veio_aula_pratica', 'primeiro_contato']
  let convId: string | null = null
  const { data: conv } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, context')
    .eq('phone', phoneNorm)
    .eq('area', area)
    .maybeSingle()
  if (conv) {
    convId = conv.id
  } else {
    const { data: newConv, error: insErr } = await supabaseAdmin
      .from('whatsapp_conversations')
      .insert({
        phone: phoneNorm,
        area,
        status: 'active',
        context: { tags },
      })
      .select('id')
      .single()
    if (insErr || !newConv?.id) {
      return { success: false, error: 'Erro ao criar conversa' }
    }
    convId = newConv.id
  }

  // Na primeira conexão, gravar nome e telefone do cadastro na conversa
  try {
    const { syncConversationFromCadastro } = await import('@/lib/whatsapp-conversation-enrichment')
    if (convId) await syncConversationFromCadastro(convId, phoneNorm)
  } catch (_) {}

  const result = await sendWhatsAppMessage(phone, texto, instance.instance_id, instance.token)
  if (!result.success) return { success: false, error: result.error }

  if (conv) {
    const ctx = (conv.context || {}) as Record<string, unknown>
    const prevTags = Array.isArray(ctx.tags) ? (ctx.tags as string[]) : []
    const newTags = [...new Set([...prevTags, ...tags])]
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({ context: { ...ctx, tags: newTags } })
      .eq('id', conv.id)
  }

  await supabaseAdmin.from('whatsapp_messages').insert({
    conversation_id: convId,
    instance_id: instance.id,
    z_api_message_id: result.messageId || null,
    sender_type: 'bot',
    sender_name: 'Carol - Secretária',
    message: texto,
    message_type: 'text',
    status: 'sent',
    is_bot_response: true,
  })
  return { success: true }
}

/**
 * Envia notificação pré-aula (24h, 12h, 2h, 30min ou 10min antes).
 * 2h = "Sua aula começa em 2 horas"; 30min = "Começamos em 30 minutos"; 10min = "A sala está aberta".
 * Atualiza context.pre_class_${sessionId}.sent_${tipo} = true.
 */
export async function enviarPreAula(
  conversationId: string,
  tipo: '24h' | '12h' | '2h' | '30min' | '10min',
  area: string = AREA_PADRAO
): Promise<EnvioResult> {
  const instance = await getZApiInstance(area)
  if (!instance?.instance_id || !instance?.token) {
    return { success: false, error: 'Instância Z-API não encontrada' }
  }
  const { data: conv } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, phone, name, context')
    .eq('id', conversationId)
    .eq('area', area)
    .maybeSingle()
  if (!conv) return { success: false, error: 'Conversa não encontrada' }
  const ctx = (conv.context || {}) as Record<string, unknown>
  const sessionId = ctx.workshop_session_id as string | undefined
  if (!sessionId) return { success: false, error: 'Conversa sem sessão agendada' }

  const { data: session } = await supabaseAdmin
    .from('whatsapp_workshop_sessions')
    .select('id, starts_at, zoom_link')
    .eq('id', sessionId)
    .maybeSingle()
  if (!session) return { success: false, error: 'Sessão não encontrada' }

  const nome = (conv.name as string) || (await getRegistrationName(conv.phone, area)) || ''
  const nomePrimeiro = getFirstName(nome)
  const sessao = sessionToOpcao(session)
  let texto: string
  switch (tipo) {
    case '24h':
      texto = getScriptPreAula24h(nomePrimeiro, sessao)
      break
    case '12h':
      texto = getScriptPreAula12h(nomePrimeiro, sessao)
      break
    case '2h':
      texto = getScriptPreAula2h(nomePrimeiro, sessao)
      break
    case '30min':
      texto = getScriptPreAula30min(nomePrimeiro, sessao)
      break
    case '10min':
      texto = getScriptPreAula10min(nomePrimeiro, sessao)
      break
    default:
      return { success: false, error: 'Tipo inválido' }
  }

  const result = await sendWhatsAppMessage(
    conv.phone,
    texto,
    instance.instance_id,
    instance.token
  )
  if (!result.success) return { success: false, error: result.error }

  const key = `pre_class_${sessionId}` as keyof typeof ctx
  const prev = (ctx[key] as Record<string, boolean>) || {}
  const tags = Array.isArray(ctx.tags) ? (ctx.tags as string[]) : []
  const newTags = tags.includes('recebeu_link_workshop') ? tags : [...tags, 'recebeu_link_workshop']
  await supabaseAdmin
    .from('whatsapp_conversations')
    .update({
      context: { ...ctx, tags: newTags, [key]: { ...prev, [`sent_${tipo}`]: true } },
    })
    .eq('id', conversationId)

  await supabaseAdmin.from('whatsapp_messages').insert({
    conversation_id: conversationId,
    instance_id: instance.id,
    z_api_message_id: result.messageId || null,
    sender_type: 'bot',
    sender_name: 'Carol - Secretária',
    message: texto,
    message_type: 'text',
    status: 'sent',
    is_bot_response: true,
  })
  return { success: true }
}

/**
 * Envia link de cadastro pós-participou.
 */
export async function enviarLinkPosParticipou(
  conversationId: string,
  area: string = AREA_PADRAO
): Promise<EnvioResult> {
  const instance = await getZApiInstance(area)
  if (!instance?.instance_id || !instance?.token) {
    return { success: false, error: 'Instância Z-API não encontrada' }
  }
  const { data: conv } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, phone, name, context')
    .eq('id', conversationId)
    .eq('area', area)
    .maybeSingle()
  if (!conv) return { success: false, error: 'Conversa não encontrada' }
  const nome =
    ((conv.context as Record<string, unknown>)?.lead_name as string) ||
    (conv.name as string) ||
    (await getRegistrationName(conv.phone, area)) ||
    ''
  const nomePrimeiro = getFirstName(nome)
  const texto = getScriptLinkPosParticipou(nomePrimeiro)
  const result = await sendWhatsAppMessage(
    conv.phone,
    texto,
    instance.instance_id,
    instance.token
  )
  if (!result.success) return { success: false, error: result.error }

  const ctx = (conv.context || {}) as Record<string, unknown>
  const tags = Array.isArray(ctx.tags) ? (ctx.tags as string[]) : []
  if (!tags.includes('registration_link_sent')) {
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({ context: { ...ctx, tags: [...tags, 'registration_link_sent'] } })
      .eq('id', conversationId)
  }

  await supabaseAdmin.from('whatsapp_messages').insert({
    conversation_id: conversationId,
    instance_id: instance.id,
    z_api_message_id: result.messageId || null,
    sender_type: 'bot',
    sender_name: 'Carol - Secretária',
    message: texto,
    message_type: 'text',
    status: 'sent',
    is_bot_response: true,
  })
  return { success: true }
}

/**
 * Envia remarketing (não participou) com novas opções de aula.
 */
export async function enviarRemarketing(
  conversationId: string,
  area: string = AREA_PADRAO
): Promise<EnvioResult> {
  const instance = await getZApiInstance(area)
  if (!instance?.instance_id || !instance?.token) {
    return { success: false, error: 'Instância Z-API não encontrada' }
  }
  const { data: conv } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, phone, name, context')
    .eq('id', conversationId)
    .eq('area', area)
    .maybeSingle()
  if (!conv) return { success: false, error: 'Conversa não encontrada' }
  const opcoes = await getProximasSessoes(area, 2)
  if (opcoes.length < 2) {
    return { success: false, error: 'Menos de 2 sessões disponíveis' }
  }
  const nome =
    ((conv.context as Record<string, unknown>)?.lead_name as string) ||
    (conv.name as string) ||
    (await getRegistrationName(conv.phone, area)) ||
    ''
  const nomePrimeiro = getFirstName(nome)
  const texto = getScriptRemarketing(nomePrimeiro, opcoes[0], opcoes[1])
  const result = await sendWhatsAppMessage(
    conv.phone,
    texto,
    instance.instance_id,
    instance.token
  )
  if (!result.success) return { success: false, error: result.error }

  const ctx = (conv.context || {}) as Record<string, unknown>
  const tags = Array.isArray(ctx.tags) ? (ctx.tags as string[]) : []
  if (!tags.includes('recebeu_segundo_link')) {
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({ context: { ...ctx, tags: [...tags, 'recebeu_segundo_link'] } })
      .eq('id', conversationId)
  }

  await supabaseAdmin.from('whatsapp_messages').insert({
    conversation_id: conversationId,
    instance_id: instance.id,
    z_api_message_id: result.messageId || null,
    sender_type: 'bot',
    sender_name: 'Carol - Secretária',
    message: texto,
    message_type: 'text',
    status: 'sent',
    is_bot_response: true,
  })
  return { success: true }
}

/**
 * Envia follow-up para quem não respondeu (24h, 48h ou 72h após boas-vindas).
 */
export async function enviarFollowUpNaoRespondeu(
  conversationId: string,
  tipo: '24h' | '48h' | '72h',
  area: string = AREA_PADRAO
): Promise<EnvioResult> {
  const instance = await getZApiInstance(area)
  if (!instance?.instance_id || !instance?.token) {
    return { success: false, error: 'Instância Z-API não encontrada' }
  }
  const { data: conv } = await supabaseAdmin
    .from('whatsapp_conversations')
    .select('id, phone')
    .eq('id', conversationId)
    .eq('area', area)
    .maybeSingle()
  if (!conv) return { success: false, error: 'Conversa não encontrada' }
  let texto: string
  if (tipo === '24h') {
    texto = getScriptFollowUpNaoRespondeu24h()
  } else if (tipo === '48h') {
    const opcoes = await getProximasSessoes(area, 2)
    if (opcoes.length < 2) {
      return { success: false, error: 'Menos de 2 sessões para follow-up 48h' }
    }
    texto = getScriptFollowUpNaoRespondeu48h(opcoes[0], opcoes[1])
  } else {
    texto = getScriptFollowUpNaoRespondeu72h()
  }
  const result = await sendWhatsAppMessage(
    conv.phone,
    texto,
    instance.instance_id,
    instance.token
  )
  if (!result.success) return { success: false, error: result.error }

  if (tipo === '72h') {
    const { data: c } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('context')
      .eq('id', conversationId)
      .single()
    const ctx = (c?.context || {}) as Record<string, unknown>
    const prevTags = Array.isArray(ctx.tags) ? (ctx.tags as string[]) : []
    if (!prevTags.includes('sem_resposta')) {
      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({ context: { ...ctx, tags: [...prevTags, 'sem_resposta'] } })
        .eq('id', conversationId)
    }
  }

  await supabaseAdmin.from('whatsapp_messages').insert({
    conversation_id: conversationId,
    instance_id: instance.id,
    z_api_message_id: result.messageId || null,
    sender_type: 'bot',
    sender_name: 'Carol - Secretária',
    message: texto,
    message_type: 'text',
    status: 'sent',
    is_bot_response: true,
  })
  return { success: true }
}
