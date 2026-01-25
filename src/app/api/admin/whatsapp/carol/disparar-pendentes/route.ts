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

    // 🆕 Buscar cadastros do workshop que ainda não têm conversa
    let registrationsWithoutConversation: Array<{ phone: string; name: string }> = []
    
    try {
      // Tentar buscar de workshop_inscricoes
      const { data: workshopRegs } = await supabaseAdmin
        .from('workshop_inscricoes')
        .select('telefone, nome')
        .not('telefone', 'is', null)
        .limit(1000)

      if (workshopRegs && workshopRegs.length > 0) {
        // Verificar quais não têm conversa
        const existingPhones = new Set(
          (conversations || []).map(c => c.phone.replace(/\D/g, ''))
        )

        registrationsWithoutConversation = workshopRegs
          .map(reg => ({
            phone: (reg.telefone || '').replace(/\D/g, ''),
            name: reg.nome || 'Cliente'
          }))
          .filter(reg => reg.phone.length >= 10 && !existingPhones.has(reg.phone))
      }
    } catch (error: any) {
      // Se workshop_inscricoes não existir, tentar contact_submissions
      try {
        const { data: contactRegs } = await supabaseAdmin
          .from('contact_submissions')
          .select('phone, name')
          .not('phone', 'is', null)
          .limit(1000)

        if (contactRegs && contactRegs.length > 0) {
          const existingPhones = new Set(
            (conversations || []).map(c => c.phone.replace(/\D/g, ''))
          )

          registrationsWithoutConversation = contactRegs
            .map(reg => ({
              phone: (reg.phone || '').replace(/\D/g, ''),
              name: reg.name || 'Cliente'
            }))
            .filter(reg => reg.phone.length >= 10 && !existingPhones.has(reg.phone))
        }
      } catch (contactError: any) {
        console.warn('[Disparar Pendentes] Erro ao buscar cadastros:', contactError.message)
      }
    }

    const allConversations = conversations || []

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

    // 🆕 Primeiro: Criar conversas para cadastros sem conversa
    for (const registration of registrationsWithoutConversation) {
      try {
        // Criar conversa
        const { data: newConv, error: createError } = await supabaseAdmin
          .from('whatsapp_conversations')
          .insert({
            instance_id: instance.id,
            phone: registration.phone,
            name: registration.name || 'Cliente',
            area: area,
            status: 'active',
            context: {
              tags: ['veio_aula_pratica', 'primeiro_contato'],
              source: 'workshop_registration',
              lead_name: registration.name || 'Cliente' // 🆕 Salvar nome também no context
            }
          })
          .select('id, phone, name, context')
          .single()

        if (createError || !newConv) {
          errors++
          details.push(`❌ ${registration.phone}: Erro ao criar conversa - ${createError?.message || 'Erro desconhecido'}`)
          continue
        }

        // Adicionar à lista de conversas para processar
        allConversations.push({
          id: newConv.id,
          phone: newConv.phone,
          name: newConv.name,
          context: newConv.context || {},
          area: area,
          last_message_at: new Date().toISOString()
        })

        details.push(`✅ ${registration.phone}: Conversa criada para cadastro sem conversa`)
      } catch (error: any) {
        errors++
        details.push(`❌ ${registration.phone}: ${error.message || 'Erro ao criar conversa'}`)
      }
    }

    // Processar cada conversa (incluindo as recém-criadas)
    for (const conversation of allConversations) {
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
          // 🆕 Buscar nome do context se não tiver em conversation.name
          const leadName = conversation.name || (context as any)?.lead_name || undefined
          messageToSend = await generateCarolResponse(
            'Olá, quero agendar uma aula',
            conversationHistory,
            {
              tags: newTags,
              workshopSessions,
              leadName: leadName, // 🆕 Sempre passar o nome se disponível
              hasScheduled: false,
              isFirstMessage: true,
            }
          )
          if (!newTags.includes('veio_aula_pratica')) {
            newTags.push('veio_aula_pratica')
          }
        } else if (tipoProcessamento === 'nao_escolheu_agenda') {
          // Não escolheu agenda: relembrar opções
          // 🆕 Buscar nome do context se não tiver em conversation.name
          const leadName = conversation.name || (context as any)?.lead_name || undefined
          messageToSend = await generateCarolResponse(
            'Quais são os horários disponíveis? Quero agendar',
            conversationHistory,
            {
              tags: newTags,
              workshopSessions,
              leadName: leadName,
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

        // Delay entre mensagens (5 segundos para evitar bloqueio do WhatsApp)
        await new Promise(resolve => setTimeout(resolve, 5000))
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
