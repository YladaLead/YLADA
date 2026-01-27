/**
 * POST /api/admin/whatsapp/carol/message-phase
 * Preview ou envio de mensagem de fase (fechamento / remarketing) para uma conversa.
 * action: 'preview' -> retorna { message } sem enviar
 * action: 'send' -> envia a mensagem, atualiza tags, retorna { success }
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { generateCarolResponse } from '@/lib/whatsapp-carol-ai'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) return authResult

    const body = await request.json()
    const { conversationId, tipo, action, message: messageOverride } = body as {
      conversationId?: string
      tipo?: 'fechamento' | 'remarketing'
      action?: 'preview' | 'send'
      message?: string
    }

    if (!conversationId || !tipo || !['fechamento', 'remarketing'].includes(tipo)) {
      return NextResponse.json(
        { error: 'conversationId e tipo (fechamento | remarketing) são obrigatórios' },
        { status: 400 }
      )
    }
    if (!action || !['preview', 'send'].includes(action)) {
      return NextResponse.json(
        { error: 'action deve ser "preview" ou "send"' },
        { status: 400 }
      )
    }

    const area = 'nutri'

    const { data: conversation } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, area')
      .eq('id', conversationId)
      .eq('area', area)
      .maybeSingle()

    if (!conversation) {
      return NextResponse.json({ error: 'Conversa não encontrada' }, { status: 404 })
    }

    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []

    const { data: messages } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('message, sender_type, created_at')
      .eq('conversation_id', conversation.id)
      .order('created_at', { ascending: true })
      .limit(20)

    const conversationHistory = (messages || []).map((msg: any) => ({
      role: (msg.sender_type === 'bot' ? 'assistant' : 'user') as 'user' | 'assistant',
      content: msg.message || '',
    }))

    const { getRegistrationName, getFirstName } = await import('@/lib/whatsapp-carol-ai')
    const registrationName = await getRegistrationName(conversation.phone, conversation.area || 'nutri')
    let leadName = getFirstName(registrationName || (context as any)?.lead_name || conversation.name) || undefined
    if (leadName && /ylada/i.test(leadName.trim())) leadName = undefined

    let messageToSend = messageOverride && messageOverride.trim() ? messageOverride.trim() : ''

    if (!messageToSend) {
      if (tipo === 'fechamento') {
        const refDate = (context as any)?.scheduled_date || (context as any)?.participated_at
        const diasDesde = refDate
          ? Math.floor((Date.now() - new Date(refDate).getTime()) / (24 * 60 * 60 * 1000))
          : null
        const carolInstruction =
          'O admin está pedindo para você fazer um remarketing/fechamento com esta pessoa. Ela JÁ PARTICIPOU da aula. NÃO abra forte com copy pesada ("Você viu como funciona. Sem sistema, amanhã o improviso volta. Você quer dar essa virada agora?"). Abra de forma acolhedora e completa: use o nome, pergunte como está, considere onde ela está no tempo.' +
          (diasDesde != null
            ? diasDesde <= 1
              ? ` Faz só ${diasDesde} dia desde a aula – abertura ainda próxima, tipo "como você está depois de ontem?".`
              : diasDesde >= 5
                ? ` Já passaram ${diasDesde} dias (quase uma semana ou mais) – abra reconhecendo: "Já passou uns dias desde a aula... ela ainda não começou... vamos realmente mudar o jogo?". Seja tranquila, não pressione no início.`
                : ` Já passaram ${diasDesde} dias desde a aula – considere na abertura ("Já passou uns dias desde a aula... como está sendo para você?").`
            : ' Não sabemos há quanto tempo foi a aula – seja tranquila na abertura, pergunte como está, e só depois conduza à decisão.') +
          ' Exemplo de tom completo: "Oi [nome], como você está? Já passou uns dias desde a aula e queria saber: como está sendo para você? A gente pode realmente mudar o jogo – você ainda tem interesse em dar esse passo?" Seja tranquila, considere o tempo que passou (1 dia vs semana), e só depois puxe a decisão.'
        messageToSend = await generateCarolResponse(
          'Quero saber mais sobre o programa completo',
          conversationHistory,
          {
            tags: [...tags, 'participou_aula'],
            leadName,
            participated: true,
            isFirstMessage: false,
            carolInstruction,
          }
        )
      } else {
        messageToSend = await generateCarolResponse(
          'Você ainda tem interesse em aprender como encher sua agenda? Quer saber como ter mais clientes?',
          conversationHistory,
          {
            tags: [...tags, 'nao_participou_aula'],
            leadName,
            hasScheduled: false,
            participated: false,
            isFirstMessage: false,
          }
        )
        if (!messageToSend.toLowerCase().includes('interesse') && !messageToSend.toLowerCase().includes('?')) {
          messageToSend = `Olá ${leadName || 'querido(a)'}! 👋

Vi que você não conseguiu participar da aula anterior. Tudo bem, acontece! 😊

Não se preocupe! Você ainda tem interesse? Gostaria de agendar uma aula?`
        }
      }
    }

    if (action === 'preview') {
      return NextResponse.json({ success: true, message: messageToSend })
    }

    const { getZApiInstance } = await import('@/lib/whatsapp-carol-ai')
    const instance = await getZApiInstance(area)
    if (!instance) {
      return NextResponse.json(
        { error: 'Instância Z-API não encontrada' },
        { status: 500 }
      )
    }

    const client = createZApiClient(instance.instance_id, instance.token)
    const result = await client.sendTextMessage({
      phone: conversation.phone,
      message: messageToSend,
    })

    if (!result.success) {
      return NextResponse.json(
        { success: false, error: result.error || 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversation.id,
      instance_id: instance.id,
      z_api_message_id: result.id || null,
      sender_type: 'bot',
      sender_name: 'Carol - Secretária',
      message: messageToSend,
      message_type: 'text',
      status: 'sent',
      is_bot_response: true,
    })

    const newTags =
      tipo === 'fechamento'
        ? [...new Set([...tags, 'participou_aula', 'fechamento_enviado'])]
        : [...new Set([...tags, 'nao_participou_aula', 'remarketing_enviado'])]

    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        context: { ...context, tags: newTags, [`${tipo}_sent_at`]: new Date().toISOString() },
        last_message_at: new Date().toISOString(),
        last_message_from: 'bot',
      })
      .eq('id', conversation.id)

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('[message-phase] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar' },
      { status: 500 }
    )
  }
}
