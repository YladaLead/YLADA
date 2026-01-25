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

    // Se não forneceu sessão, buscar próximas 2 sessões (incluindo quarta 20h se existir)
    let workshopSessions: Array<{ id: string; title: string; starts_at: string; zoom_link: string }> = []
    
    if (session) {
      workshopSessions = [session]
    } else {
      const now = new Date()
      const minDate = new Date(now.getTime() + 5 * 60 * 1000) // Buffer de 5 minutos
      
      const { data: sessions } = await supabaseAdmin
        .from('whatsapp_workshop_sessions')
        .select('id, title, starts_at, zoom_link')
        .eq('area', conversation.area || 'nutri')
        .eq('is_active', true)
        .gte('starts_at', minDate.toISOString())
        .order('starts_at', { ascending: true })
        .limit(3) // Buscar 3 para incluir quarta 20h se existir
      
      workshopSessions = sessions || []
    }

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
    const context = conversation.context || {}
    const tags = Array.isArray(context.tags) ? context.tags : []
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

    // Gerar mensagem da Carol oferecendo a opção
    // Se forneceu uma mensagem customizada, usar ela como prompt
    const userMessage = message || (session 
      ? 'Quero agendar para quarta-feira às 20h' 
      : 'Quais são as próximas opções de aula disponíveis?')

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
    const client = createZApiClient(instance.instance_id, instance.token)
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
