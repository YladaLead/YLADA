import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// POST - Aceitar ticket
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
    const { ticket_id } = body

    if (!ticket_id) {
      return NextResponse.json(
        { error: 'ticket_id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se é atendente
    const { data: agent } = await supabaseAdmin
      .from('support_agents')
      .select('*')
      .eq('user_id', user.id)
      .eq('area', 'nutri')
      .single()

    if (!agent) {
      return NextResponse.json(
        { error: 'Você não está registrado como atendente' },
        { status: 403 }
      )
    }

    // Verificar se pode aceitar mais tickets
    if (agent.current_tickets_count >= agent.max_concurrent_tickets) {
      return NextResponse.json(
        { error: 'Você já está no limite de tickets simultâneos' },
        { status: 400 }
      )
    }

    // Verificar se ticket existe e está disponível
    const { data: ticket, error: ticketError } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', ticket_id)
      .eq('area', 'nutri')
      .single()

    if (ticketError || !ticket) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    if (ticket.status !== 'aguardando') {
      return NextResponse.json(
        { error: 'Ticket já está sendo atendido' },
        { status: 400 }
      )
    }

    // Atualizar ticket
    const now = new Date().toISOString()
    const { data: updatedTicket, error: updateError } = await supabaseAdmin
      .from('support_tickets')
      .update({
        agent_id: user.id,
        status: 'em_atendimento',
        assigned_at: now,
        updated_at: now
      })
      .eq('id', ticket_id)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao aceitar ticket:', updateError)
      return NextResponse.json(
        { error: 'Erro ao aceitar ticket' },
        { status: 500 }
      )
    }

    // Calcular tempo de resposta
    if (ticket.created_at) {
      const created = new Date(ticket.created_at)
      const assigned = new Date(now)
      const tempoResposta = Math.floor((assigned.getTime() - created.getTime()) / 1000)

      await supabaseAdmin
        .from('support_tickets')
        .update({ tempo_resposta_segundos: tempoResposta })
        .eq('id', ticket_id)
    }

    // Atualizar contador do atendente
    await supabaseAdmin
      .from('support_agents')
      .update({
        current_tickets_count: (agent.current_tickets_count || 0) + 1,
        total_tickets_atendidos: (agent.total_tickets_atendidos || 0) + 1,
        last_activity: now
      })
      .eq('user_id', user.id)

    // Criar mensagem do sistema
    await supabaseAdmin
      .from('support_messages')
      .insert({
        ticket_id: ticket_id,
        sender_type: 'system',
        message: 'Atendente aceitou o ticket',
        message_type: 'system'
      })

    return NextResponse.json({
      success: true,
      ticket: updatedTicket
    })
  } catch (error: any) {
    console.error('Erro ao aceitar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao aceitar ticket' },
      { status: 500 }
    )
  }
}

