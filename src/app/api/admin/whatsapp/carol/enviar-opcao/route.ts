import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createZApiClient } from '@/lib/z-api'
import { generateCarolResponse } from '@/lib/whatsapp-carol-ai'

/**
 * POST /api/admin/whatsapp/carol/enviar-opcao
 * Envia uma opção de sessão específica para uma conversa e deixa Carol continuar o fluxo
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { conversationId, sessionId, message } = body

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar conversa
    const { data: conversation, error: convError } = await supabaseAdmin
      .from('whatsapp_conversations')
      .select('id, phone, name, context, instance_id, area')
      .eq('id', conversationId)
      .single()

    if (convError || !conversation) {
      return NextResponse.json(
        { error: 'Conversa não encontrada' },
        { status: 404 }
      )
    }

    // Buscar instância Z-API
    const { data: instance } = await supabaseAdmin
      .from('z_api_instances')
      .select('id, instance_id, token')
      .eq('id', conversation.instance_id)
      .single()

    if (!instance) {
      return NextResponse.json(
        { error: 'Instância Z-API não encontrada' },
        { status: 404 }
      )
    }

    // Buscar sessão se sessionId foi fornecido
    let session: any = null
    if (sessionId) {
      const { data: sessao } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link')
        .eq('id', sessionId)
        .eq('is_active', true)
        .single()

      if (sessao) {
        session = sessao
      }
    }

    const client = createZApiClient(instance.instance_id, instance.token)
    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []

    // Se forneceu uma sessão específica, enviar diretamente o flyer + link (não perguntar novamente)
    if (session) {
      // Buscar configurações do workshop (flyer)
      const { data: settings } = await supabaseAdmin
        .from('whatsapp_workshop_settings')
        .select('flyer_url, flyer_caption')
        .eq('area', conversation.area || 'nutri')
        .maybeSingle()
      
      const flyerUrl = settings?.flyer_url
      const flyerCaption = settings?.flyer_caption || ''
      
      // Formatar data/hora
      const sessionDate = new Date(session.starts_at)
      const weekday = sessionDate.toLocaleDateString('pt-BR', { weekday: 'long' })
      const date = sessionDate.toLocaleDateString('pt-BR')
      const time = sessionDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })
      
      // 1. Enviar imagem do flyer (se configurado)
      if (flyerUrl) {
        const caption = flyerCaption?.trim() 
          ? flyerCaption 
          : `${session.title}\n${weekday}, ${date} • ${time}`
        
        const imageResult = await client.sendImageMessage({
          phone: conversation.phone,
          image: flyerUrl,
          caption,
        })
        
        if (imageResult.success) {
          // Salvar mensagem da imagem
          await supabaseAdmin.from('whatsapp_messages').insert({
            conversation_id: conversationId,
            instance_id: instance.id,
            z_api_message_id: imageResult.id || null,
            sender_type: 'bot',
            sender_name: 'Carol - Secretária',
            message: caption,
            message_type: 'image',
            media_url: flyerUrl,
            status: 'sent',
            is_bot_response: true,
          })
        }
      }
      
      // 2. Enviar mensagem com link
      const linkMessage = `✅ *Perfeito! Você vai adorar essa aula!* 🎉\n\n🗓️ ${weekday}, ${date}\n🕒 ${time} (horário de Brasília)\n\n🔗 ${session.zoom_link}\n\n💡 *Dica importante:* A sala do Zoom será aberta 10 minutos antes do horário da aula. Chegue com antecedência para garantir sua vaga! 😊\n\nQualquer dúvida, é só me chamar! 💚`
      
      const textResult = await client.sendTextMessage({
        phone: conversation.phone,
        message: linkMessage,
      })
      
      if (!textResult.success) {
        return NextResponse.json(
          { error: textResult.error || 'Erro ao enviar mensagem' },
          { status: 500 }
        )
      }
      
      // Salvar mensagem do link
      await supabaseAdmin.from('whatsapp_messages').insert({
        conversation_id: conversationId,
        instance_id: instance.id,
        z_api_message_id: textResult.id || null,
        sender_type: 'bot',
        sender_name: 'Carol - Secretária',
        message: linkMessage,
        message_type: 'text',
        status: 'sent',
        is_bot_response: true,
      })
      
      // Atualizar contexto da conversa
      const prevTags = Array.isArray(context.tags) ? context.tags : []
      const newTags = [...new Set([...prevTags, 'recebeu_link_workshop', 'agendou_aula'])]
      
      await supabaseAdmin
        .from('whatsapp_conversations')
        .update({
          context: {
            ...context,
            tags: newTags,
            workshop_session_id: session.id,
            scheduled_date: session.starts_at,
          },
          last_message_at: new Date().toISOString(),
          last_message_from: 'bot',
        })
        .eq('id', conversationId)
      
      return NextResponse.json({
        success: true,
        message: 'Link da aula enviado com sucesso!',
        carolMessage: linkMessage,
      })
    }

    // Se não forneceu sessão, buscar próximas sessões e gerar mensagem com opções
    const now = new Date()
    const minDate = new Date(now.getTime() + 5 * 60 * 1000) // Buffer de 5 minutos
    
    const { data: sessions } = await supabaseAdmin
      .from('whatsapp_workshop_sessions')
      .select('id, title, starts_at, zoom_link')
      .eq('area', conversation.area || 'nutri')
      .eq('is_active', true)
      .gte('starts_at', minDate.toISOString())
      .order('starts_at', { ascending: true })
      .limit(3)
    
    const workshopSessions = sessions || []

    // Buscar histórico de mensagens
    const { data: messages } = await supabaseAdmin
      .from('whatsapp_messages')
      .select('sender_type, message, created_at')
      .eq('conversation_id', conversationId)
      .order('created_at', { ascending: true })
      .limit(30)

    const conversationHistory = (messages || [])
      .filter(m => m.sender_type === 'customer' || m.sender_type === 'bot' || m.sender_type === 'agent')
      .filter(m => m.message && m.message.trim().length > 0)
      .map(m => ({
        role: m.sender_type === 'customer' ? 'user' as const : 'assistant' as const,
        content: m.message || ''
      }))

    // Buscar nome do cadastro
    let registrationName: string | null = null
    
    try {
      const phoneClean = conversation.phone.replace(/\D/g, '')
      
      const { data: workshopReg } = await supabaseAdmin
        .from('workshop_inscricoes')
        .select('nome')
        .ilike('telefone', `%${phoneClean.slice(-8)}%`)
        .limit(1)
        .maybeSingle()
      
      if (workshopReg?.nome) {
        registrationName = workshopReg.nome
      } else {
        const { data: contactReg } = await supabaseAdmin
          .from('contact_submissions')
          .select('name, nome')
          .or(`phone.ilike.%${phoneClean.slice(-8)}%,telefone.ilike.%${phoneClean.slice(-8)}%`)
          .limit(1)
          .maybeSingle()
        
        if (contactReg?.name || contactReg?.nome) {
          registrationName = contactReg.name || contactReg.nome || null
        }
      }
    } catch (error: any) {
      console.warn('[Enviar Opção] Erro ao buscar nome do cadastro:', error.message)
    }

    const leadName = registrationName || (context as any)?.lead_name || conversation.name || undefined

    // Gerar mensagem da Carol oferecendo as opções
    const userMessage = message || 'Quais são as próximas opções de aula disponíveis?'

    const carolMessage = await generateCarolResponse(
      userMessage,
      conversationHistory,
      {
        tags,
        workshopSessions,
        leadName,
        hasScheduled: tags.includes('agendou_aula'),
        isFirstMessage: false,
      }
    )

    // Enviar mensagem via Z-API
    const result = await client.sendTextMessage({
      phone: conversation.phone,
      message: carolMessage,
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    // Salvar mensagem no banco
    await supabaseAdmin.from('whatsapp_messages').insert({
      conversation_id: conversationId,
      instance_id: instance.id,
      z_api_message_id: result.id || null,
      sender_type: 'bot',
      sender_name: 'Carol - Secretária',
      message: carolMessage,
      message_type: 'text',
      status: 'sent',
      is_bot_response: true,
    })

    // Atualizar última mensagem da conversa
    await supabaseAdmin
      .from('whatsapp_conversations')
      .update({
        last_message_at: new Date().toISOString(),
        last_message_from: 'bot',
      })
      .eq('id', conversationId)

    return NextResponse.json({
      success: true,
      message: 'Mensagem enviada com sucesso!',
      carolMessage,
    })
  } catch (error: any) {
    console.error('[Enviar Opção] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao enviar opção' },
      { status: 500 }
    )
  }
}
