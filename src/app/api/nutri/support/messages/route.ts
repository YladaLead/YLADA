import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// POST - Enviar mensagem (atendente ou usuário)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin', 'support'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { ticket_id, message } = body

    if (!ticket_id || !message || message.trim() === '') {
      return NextResponse.json(
        { error: 'ticket_id e message são obrigatórios' },
        { status: 400 }
      )
    }

    // Buscar ticket
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', ticket_id)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se é atendente
    const { data: agent } = await supabaseAdmin
      .from('support_agents')
      .select('*')
      .eq('user_id', user.id)
      .eq('area', 'nutri')
      .single()

    const isAgent = !!agent
    const isOwner = ticket.user_id === user.id

    // Verificar permissão
    if (!isAgent && !isOwner) {
      return NextResponse.json(
        { error: 'Sem permissão para enviar mensagem neste ticket' },
        { status: 403 }
      )
    }

    // Determinar tipo de remetente
    const senderType = isAgent ? 'agent' : 'user'
    
    // Buscar nome do remetente
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(user.id)
    const senderName = userData?.user?.user_metadata?.full_name || 
                      userData?.user?.email?.split('@')[0] || 
                      (isAgent ? 'Atendente' : 'Usuário')

    // Criar mensagem
    const { data: messageData, error: messageError } = await supabaseAdmin
      .from('support_messages')
      .insert({
        ticket_id: ticket_id,
        sender_type: senderType,
        sender_id: user.id,
        sender_name: senderName,
        message: message.trim(),
        is_bot_response: false
      })
      .select()
      .single()

    if (messageError) {
      console.error('Erro ao criar mensagem:', messageError)
      return NextResponse.json(
        { error: 'Erro ao enviar mensagem' },
        { status: 500 }
      )
    }

    // Atualizar ticket
    const updateData: any = {
      ultima_mensagem: message.trim(),
      ultima_mensagem_em: new Date().toISOString(),
      mensagens_count: (ticket.mensagens_count || 0) + 1,
      updated_at: new Date().toISOString()
    }

    // Se atendente está respondendo e ticket estava aguardando, mudar para em_atendimento
    if (isAgent && ticket.status === 'aguardando') {
      updateData.status = 'em_atendimento'
      if (!ticket.agent_id) {
        updateData.agent_id = user.id
        updateData.assigned_at = new Date().toISOString()
      }
    }

    await supabaseAdmin
      .from('support_tickets')
      .update(updateData)
      .eq('id', ticket_id)

    return NextResponse.json({
      success: true,
      message: messageData
    })
  } catch (error: any) {
    console.error('Erro ao enviar mensagem:', error)
    return NextResponse.json(
      { error: 'Erro ao enviar mensagem' },
      { status: 500 }
    )
  }
}

// GET - Buscar mensagens do ticket
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin', 'support'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const ticket_id = searchParams.get('ticket_id')

    if (!ticket_id) {
      return NextResponse.json(
        { error: 'ticket_id é obrigatório' },
        { status: 400 }
      )
    }

    // Buscar ticket
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', ticket_id)
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    // Verificar permissão
    const { data: agent } = await supabaseAdmin
      .from('support_agents')
      .select('*')
      .eq('user_id', user.id)
      .eq('area', 'nutri')
      .single()

    const isAgent = !!agent
    const isOwner = ticket.user_id === user.id

    if (!isAgent && !isOwner) {
      return NextResponse.json(
        { error: 'Sem permissão para ver mensagens deste ticket' },
        { status: 403 }
      )
    }

    // Buscar mensagens
    const { data: messages, error: messagesError } = await supabaseAdmin
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticket_id)
      .order('created_at', { ascending: true })

    if (messagesError) {
      console.error('Erro ao buscar mensagens:', messagesError)
      return NextResponse.json(
        { error: 'Erro ao buscar mensagens' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      messages: messages || []
    })
  } catch (error: any) {
    console.error('Erro ao buscar mensagens:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar mensagens' },
      { status: 500 }
    )
  }
}

