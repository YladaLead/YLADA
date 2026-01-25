import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { generateCarolResponse, isAllowedTimeToSendMessage } from '@/lib/whatsapp-carol-ai'

/**
 * POST /api/admin/whatsapp/carol/disparar-pendentes
 * Dispara mensagens para:
 * 1. Quem não escolheu agenda ainda (veio do workshop mas não agendou)
 * 2. Quem ainda está na primeira mensagem (não recebeu mensagem da Carol)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { area = 'nutri', tipos = ['primeira_mensagem', 'nao_escolheu_agenda'] } = body

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('area', area)
      .eq('status', 'connected')
      .limit(1)
      .maybeSingle()

    if (!instance) {
      return NextResponse.json(
        { error: 'Instância Z-API não encontrada' },
        { status: 500 }
      )
    }

    const client = createZApiClient(instance.instance_id, instance.token)

    // Buscar todas as conversas da área
    const { data: conversations, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, area, last_message_at')
      .eq('area', area)
      .eq('status', 'active')
      .order('last_message_at', { ascending: false })

    if (convError) {
      return NextResponse.json(
        { error: `Erro ao buscar conversas: ${convError.message}` },
        { status: 500 }
      )
    }

    if (!conversations || conversations.length === 0) {
      return NextResponse.json({
        success: true,
        processed: 0,
        sent: 0,
        errors: 0,
        details: 'Nenhuma conversa encontrada'
      })
    }

    // Buscar próximas 2 sessões
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, title, starts_at, zoom_link')
      .eq('area', area)
      .eq('is_active', true)
      .gte('starts_at', new Date().toISOString())
      .order('starts_at', { ascending: true })
      .limit(2)

    const workshopSessions = (sessions || []).map(s => ({
      id: s.id,
      title: s.title || 'Aula Prática ao Vivo',
      starts_at: s.starts_at,
      zoom_link: s.zoom_link
    }))

    let processed = 0
    let sent = 0
    let errors = 0
    const details: string[] = []

    // Processar cada conversa
    for (const conversation of conversations) {
      try {
        const context = conversation.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        
        // Verificar status da conversa
        const hasScheduled = tags.includes('agendou_aula') || tags.includes('recebeu_link_workshop')
        const veioAulaPratica = tags.includes('veio_aula_pratica')
        const participated = tags.includes('participou_aula')
        const naoParticipou = tags.includes('nao_participou_aula')
        
        // Verificar se tem mensagem da Carol
        const { data: carolMessages } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id')
          .eq('conversation_id', conversation.id)
          .eq('sender_type', 'bot')
          .eq('sender_name', 'Carol - Secretária')
          .limit(1)
          .maybeSingle()

        const temMensagemCarol = carolMessages !== null

        // Buscar histórico de mensagens
        const { data: messages } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('sender_type, message, created_at')
          .eq('conversation_id', conversation.id)
          .order('created_at', { ascending: true })
          .limit(30)

        const conversationHistory = (messages || [])
          .filter(m => m.sender_type === 'customer' || m.sender_type === 'bot' || m.sender_type === 'agent')
          .filter(m => m.message && m.message.trim().length > 0)
          .map(m => ({
            role: m.sender_type === 'customer' ? 'user' as const : 'assistant' as const,
            content: m.message || ''
          }))

        // Verificar se deve processar
        let shouldProcess = false
        let tipoProcessamento = ''

        // 1. Quem ainda está na primeira mensagem (não recebeu mensagem da Carol)
        if (tipos.includes('primeira_mensagem') && !temMensagemCarol && !hasScheduled && !participated && !naoParticipou) {
          shouldProcess = true
          tipoProcessamento = 'primeira_mensagem'
        }
        
        // 2. Quem não escolheu agenda ainda (veio do workshop mas não agendou)
        if (tipos.includes('nao_escolheu_agenda') && veioAulaPratica && !hasScheduled && !participated && !naoParticipou) {
          shouldProcess = true
          tipoProcessamento = 'nao_escolheu_agenda'
        }

        if (!shouldProcess) {
          continue
        }

        processed++

        // Gerar mensagem apropriada
        let messageToSend = ''
        let newTags: string[] = [...tags]

        if (tipoProcessamento === 'primeira_mensagem') {
          // Primeira mensagem: boas-vindas com opções
          messageToSend = await generateCarolResponse(
            'Olá, quero agendar uma aula',
            conversationHistory,
            {
              tags: newTags,
              workshopSessions,
              leadName: conversation.name || undefined,
              hasScheduled: false,
              isFirstMessage: true,
            }
          )
          if (!newTags.includes('veio_aula_pratica')) {
            newTags.push('veio_aula_pratica')
          }
        } else if (tipoProcessamento === 'nao_escolheu_agenda') {
          // Não escolheu agenda: relembrar opções
          messageToSend = await generateCarolResponse(
            'Quais são os horários disponíveis? Quero agendar',
            conversationHistory,
            {
              tags: newTags,
              workshopSessions,
              leadName: conversation.name || undefined,
              hasScheduled: false,
              isFirstMessage: false,
            }
          )
        }

        if (!messageToSend) {
          details.push(`⏭️ ${conversation.phone}: Não gerou mensagem`)
          continue
        }

        // Verificar se já tem mensagem recente da Carol (evitar duplicação)
        const cincoMinutosAtras = new Date(Date.now() - 5 * 60 * 1000).toISOString()
        const { data: recentCarolMessages } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id, created_at')
          .eq('conversation_id', conversation.id)
          .eq('sender_type', 'bot')
          .eq('sender_name', 'Carol - Secretária')
          .gte('created_at', cincoMinutosAtras)
          .limit(1)

        if (recentCarolMessages && recentCarolMessages.length > 0) {
          details.push(`⏭️ ${conversation.phone}: Já tem mensagem recente da Carol`)
          continue
        }

        // Enviar mensagem
        const result = await client.sendTextMessage({
          phone: conversation.phone,
          message: messageToSend,
        })

        if (result.success) {
          // Salvar mensagem
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

          // Atualizar contexto
          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: {
                ...context,
                tags: newTags,
              },
              last_message_at: new Date().toISOString(),
              last_message_from: 'bot',
            })
            .eq('id', conversation.id)

          sent++
          details.push(`✅ ${conversation.phone} (${conversation.name || 'Sem nome'}): ${tipoProcessamento === 'primeira_mensagem' ? 'Primeira mensagem' : 'Relembrar agenda'}`)
        } else {
          errors++
          details.push(`❌ ${conversation.phone}: ${result.error || 'Erro ao enviar'}`)
        }

        // Delay entre mensagens (2.5 segundos para evitar bloqueio)
        await new Promise(resolve => setTimeout(resolve, 2500))
      } catch (error: any) {
        errors++
        details.push(`❌ ${conversation.phone}: ${error.message || 'Erro desconhecido'}`)
        console.error(`[Disparar Pendentes] Erro ao processar ${conversation.phone}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      processed,
      sent,
      errors,
      details: details.slice(0, 100), // Limitar detalhes
    })
  } catch (error: any) {
    console.error('[Disparar Pendentes] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar' },
      { status: 500 }
    )
  }
}
