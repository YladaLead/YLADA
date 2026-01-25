import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { generateCarolResponse, isAllowedTimeToSendMessage } from '@/lib/whatsapp-carol-ai'

/**
 * POST /api/admin/whatsapp/carol/processar-conversas
 * Processa conversas existentes em massa: analisa, identifica status e envia mensagens da Carol
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { area = 'nutri' } = body

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
        analyzed: 0,
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

    let analyzed = 0
    let processed = 0
    let sent = 0
    let errors = 0
    const details: string[] = []

    // Processar cada conversa
    for (const conversation of conversations) {
      analyzed++
      
      try {
        const context = conversation.context || {}
        const tags = Array.isArray(context.tags) ? context.tags : []
        
        // Verificar status da conversa
        const hasScheduled = tags.includes('agendou_aula') || tags.includes('recebeu_link_workshop')
        const participated = tags.includes('participou_aula')
        const naoParticipou = tags.includes('nao_participou_aula')
        const veioAulaPratica = tags.includes('veio_aula_pratica')
        
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

        const customerMessages = (messages || []).filter(m => m.sender_type === 'customer')
        const isFirstMessage = customerMessages.length === 0 || customerMessages.length === 1

        // Verificar se já tem mensagem da Carol recente (evitar duplicação)
        const { data: existingCarolMessages } = await supabaseAdmin
          .from('whatsapp_messages')
          .select('id, created_at')
          .eq('conversation_id', conversation.id)
          .eq('sender_type', 'bot')
          .eq('sender_name', 'Carol - Secretária')
          .order('created_at', { ascending: false })
          .limit(1)
          .maybeSingle()

        // Se já tem mensagem da Carol, verificar se precisa enviar nova
        // (só enviar se for caso específico que precisa de nova mensagem)
        const hasRecentCarolMessage = existingCarolMessages !== null

        // Determinar qual mensagem enviar baseado no status
        let messageToSend = ''
        let newTags: string[] = [...tags]
        let shouldSend = false

        if (naoParticipou && !participated) {
          // Remarketing: agendou mas não participou
          // MAS não enviar se já fechou ou foi direcionado
          const jaFechou = tags.includes('cliente_nutri')
          const jaDirecionado = context.redirected_to_support === true
          
          if (jaFechou || jaDirecionado) {
            details.push(`⏭️ ${conversation.phone}: Já fechou/direcionado - não enviar remarketing`)
            continue
          }
          
          messageToSend = await generateCarolResponse(
            'Quero reagendar',
            conversationHistory,
            {
              tags: newTags,
              workshopSessions,
              leadName: conversation.name || undefined,
              hasScheduled: true,
              participated: false,
              isFirstMessage: false
            }
          )
          if (!newTags.includes('recebeu_segundo_link')) {
            newTags.push('recebeu_segundo_link')
          }
          details.push(`📱 ${conversation.phone}: Remarketing (não participou)`)
        } else if (veioAulaPratica && !hasScheduled && !participated) {
          // Boas-vindas: veio do workshop mas não agendou
          messageToSend = await generateCarolResponse(
            'Olá, quero agendar uma aula',
            conversationHistory,
            {
              tags: newTags,
              workshopSessions,
              leadName: conversation.name || undefined,
              hasScheduled: false,
              isFirstMessage: isFirstMessage
            }
          )
          if (!newTags.includes('recebeu_link_workshop')) {
            newTags.push('recebeu_link_workshop')
          }
          // Só enviar se não tem mensagem da Carol ainda
          shouldSend = !hasRecentCarolMessage
          if (shouldSend) {
            details.push(`📱 ${conversation.phone}: Boas-vindas (não agendou)`)
          } else {
            details.push(`⏭️ ${conversation.phone}: Já tem mensagem da Carol`)
          }
        } else if (!veioAulaPratica && !hasScheduled) {
          // Primeira mensagem: ainda não veio do workshop
          messageToSend = await generateCarolResponse(
            'Olá',
            [],
            {
              tags: [],
              workshopSessions,
              leadName: conversation.name || undefined,
              isFirstMessage: true
            }
          )
          if (!newTags.includes('veio_aula_pratica')) {
            newTags.push('veio_aula_pratica')
          }
          if (!newTags.includes('primeiro_contato')) {
            newTags.push('primeiro_contato')
          }
          // Só enviar se não tem mensagem da Carol ainda
          shouldSend = !hasRecentCarolMessage
          if (shouldSend) {
            details.push(`📱 ${conversation.phone}: Primeira mensagem`)
          } else {
            details.push(`⏭️ ${conversation.phone}: Já tem mensagem da Carol`)
          }
        } else if (participated) {
          // Quem participou: pode enviar mensagem pós-aula se ainda não enviou
          // MAS não enviar se já fechou, já foi direcionado ou já conversou recentemente
          const jaFechou = tags.includes('cliente_nutri')
          const jaDirecionado = context.redirected_to_support === true
          const hasPostClassMessage = tags.includes('recebeu_link_cadastro') || context.post_class_message_sent
          
          // Verificar se tem mensagens recentes (se você já conversou)
          const { data: recentMessages } = await supabaseAdmin
            .from('whatsapp_messages')
            .select('created_at, sender_type')
            .eq('conversation_id', conversation.id)
            .order('created_at', { ascending: false })
            .limit(5)
          
          const temMensagensRecentes = recentMessages && recentMessages.length > 0
          const ultimaMensagem = recentMessages?.[0]
          const ultimaMensagemEhBot = ultimaMensagem?.sender_type === 'bot'
          const diasDesdeUltimaMensagem = ultimaMensagem 
            ? (Date.now() - new Date(ultimaMensagem.created_at).getTime()) / (1000 * 60 * 60 * 24)
            : 999
          
          const jaConversou = temMensagensRecentes && (!ultimaMensagemEhBot || diasDesdeUltimaMensagem < 7)
          
          if (jaFechou || jaDirecionado) {
            details.push(`⏭️ ${conversation.phone}: Já fechou/direcionado - não enviar pós-aula`)
            continue
          } else if (jaConversou) {
            details.push(`⏭️ ${conversation.phone}: Já conversou recentemente - não enviar pós-aula`)
            continue
          } else if (!hasPostClassMessage) {
            messageToSend = await generateCarolResponse(
              'Obrigada por participar da aula',
              conversationHistory,
              {
                tags: newTags,
                workshopSessions,
                leadName: conversation.name || undefined,
                hasScheduled: true,
                participated: true,
                isFirstMessage: false
              }
            )
            shouldSend = true
            if (!newTags.includes('recebeu_link_cadastro')) {
              newTags.push('recebeu_link_cadastro')
            }
            context.post_class_message_sent = true
            details.push(`📱 ${conversation.phone}: Pós-aula (participou)`)
          } else {
            details.push(`⏭️ ${conversation.phone}: Já recebeu mensagem pós-aula`)
          }
        } else {
          // Já processada ou não precisa de ação
          details.push(`⏭️ ${conversation.phone}: Não precisa de ação`)
          continue
        }

        // Verificar se deve enviar
        if (!shouldSend || !messageToSend) {
          continue
        }

        // Verificar horário permitido (mas permitir processamento manual)
        // Para processamento manual, vamos apenas logar mas não bloquear
        const timeCheck = isAllowedTimeToSendMessage()
        if (!timeCheck.allowed) {
          details.push(`⏰ ${conversation.phone}: Fora do horário permitido (${timeCheck.reason}) - será enviado no próximo horário`)
          // Continuar processando mas não enviar agora
          continue
        }

        // Enviar mensagem via Z-API
        const result = await client.sendTextMessage({
          phone: conversation.phone,
          message: messageToSend
        })

        if (result.success) {
          // Salvar mensagem no banco
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conversation.id,
            instance_id: instance.id,
            z_api_message_id: result.id || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message: messageToSend,
            message_type: 'text',
            status: 'sent',
            is_bot_response: true
          })

          // Atualizar tags e contexto
          await supabaseAdmin
            .from('whatsapp_conversations')
            .update({
              context: { ...context, tags: newTags },
              last_message_at: new Date().toISOString(),
              last_message_from: 'bot'
            })
            .eq('id', conversation.id)

          sent++
          processed++
        } else {
          errors++
          details.push(`❌ ${conversation.phone}: Erro ao enviar - ${result.error}`)
        }

        // Delay entre mensagens para não sobrecarregar o WhatsApp
        // Intervalo de 2-3 segundos é mais seguro para evitar bloqueios
        await new Promise(resolve => setTimeout(resolve, 2500))

      } catch (error: any) {
        errors++
        details.push(`❌ ${conversation.phone}: Erro - ${error.message}`)
        console.error(`[Processar Conversas] Erro ao processar ${conversation.phone}:`, error)
      }
    }

    return NextResponse.json({
      success: true,
      analyzed,
      processed,
      sent,
      errors,
      details: details.slice(0, 50).join('\n') // Limitar a 50 primeiras linhas
    })

  } catch (error: any) {
    console.error('[Processar Conversas] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar conversas' },
      { status: 500 }
    )
  }
}
