/**
 * POST /api/admin/whatsapp/carol/send-template
 *
 * Envia mensagem 100% fixa (template) para a conversa — SEM IA.
 * Usado pelo menu "O que a Carol faça?" nas ações sensíveis de tom (pergunta interesse, etc.).
 *
 * body: { conversationId, templateId }
 * templateId: 'pergunta_interesse_nao_respondeu' | 'pergunta_interesse_nao_participou' | 'followup_ficou_pensar' | 'ultima_chance'
 *
 * Substitui [NOME] pelo primeiro nome do lead. Atualiza context.stage para a Carol usar depois.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getZApiInstance, getRegistrationName, getFirstName } from '@/lib/whatsapp-carol-ai'
import { createZApiClient } from '@/lib/z-api'
import { supabaseAdmin } from '@/lib/supabase'

const TEMPLATES: Record<string, { body: string; stage: string; tagsToAdd?: string[] }> = {
  pergunta_interesse_nao_respondeu: {
    body: `Oi, [NOME] 😊 tudo bem?
Só pra eu saber: você ainda quer agendar a aula prática de agenda cheia?`,
    stage: 'ASK_INTEREST_NO_RESPONSE',
    tagsToAdd: ['remarketing_enviado'],
  },
  pergunta_interesse_nao_participou: {
    body: `Oi, [NOME] 😊
Vi que você não conseguiu entrar na aula — acontece.
Quer que eu te encaixe em uma nova data?`,
    stage: 'ASK_INTEREST_NO_SHOW',
    tagsToAdd: ['nao_participou_aula', 'remarketing_enviado'],
  },
  followup_ficou_pensar: {
    body: `Oi, [NOME] 😊
Pra eu te ajudar sem enrolar: o que te deixou em dúvida — agenda, investimento ou se faz sentido pro seu momento?
Eu te respondo rapidinho.`,
    stage: 'FOLLOWUP_DECIDING',
  },
  ultima_chance: {
    body: `[NOME], prometo ser rápida 😊
Você quer que eu reserve uma vaga na próxima aula ou prefere deixar pra depois?`,
    stage: 'LAST_CHANCE',
  },
}

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json().catch(() => ({}))
    const { conversationId, templateId } = body as { conversationId?: string; templateId?: string }

    if (!conversationId || !templateId) {
      return NextResponse.json(
        { success: false, error: 'conversationId e templateId são obrigatórios' },
        { status: 400 }
      )
    }

    const t = TEMPLATES[templateId]
    if (!t) {
      return NextResponse.json(
        { success: false, error: `templateId inválido. Use: ${Object.keys(TEMPLATES).join(', ')}` },
        { status: 400 }
      )
    }

    const area = 'nutri'
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, area')
      .eq('id', conversationId)
      .eq('area', area)
      .single()

    if (convError || !conversation) {
      return NextResponse.json({ success: false, error: 'Conversa não encontrada' }, { status: 404 })
    }

    const ctx = (conversation.context as Record<string, unknown>) || {}
    const tags = Array.isArray(ctx.tags) ? ctx.tags : []
    const registrationName = await getRegistrationName(conversation.phone, area)
    let leadName =
      getFirstName(registrationName || (ctx as { lead_name?: string })?.lead_name || conversation.name) || ''
    if (leadName && /ylada/i.test(leadName.trim())) leadName = ''
    if (!leadName) leadName = ''

    const message = t.body.replace(/\[NOME\]/g, leadName || 'você').replace(/\n\n\s*\n/g, '\n\n').trim()

    const instance = await getZApiInstance(area)
    if (!instance) {
      return NextResponse.json(
        { success: false, error: 'Instância Z-API não encontrada para a área nutri' },
        { status: 502 }
      )
    }
    const client = createZApiClient(instance.instance_id, instance.token)
    const sendResult = await client.sendTextMessage({ phone: conversation.phone, message })

    if (!sendResult.success) {
      return NextResponse.json(
        { success: false, error: sendResult.error || 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversation.id,
      instance_id: instance.id,
      z_api_message_id: sendResult.id || null,
      sender_type: 'bot',
      sender_name: 'Carol - Secretária',
      message,
      message_type: 'text',
      status: 'sent',
      is_bot_response: true,
    })

    const newTags = t.tagsToAdd ? [...new Set([...tags, ...t.tagsToAdd])] : tags
    const newContext = {
      ...ctx,
      tags: newTags,
      stage: t.stage,
      stage_updated_at: new Date().toISOString(),
      last_template_at: new Date().toISOString(),
    }
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        context: newContext,
        last_message_at: new Date().toISOString(),
        last_message_from: 'bot',
      })
      .eq('id', conversation.id)

    return NextResponse.json({
      success: true,
      response: `Template "${templateId}" enviado. Stage: ${t.stage}.`,
    })
  } catch (e: any) {
    console.error('[send-template] Erro:', e)
    return NextResponse.json(
      { success: false, error: e?.message || 'Erro ao enviar template' },
      { status: 500 }
    )
  }
}
