import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// GET - Detalhes do ticket
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
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

    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !ticket) {
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
      .single()

    if (ticket.user_id !== user.id && !agent) {
      return NextResponse.json(
        { error: 'Sem permissão para ver este ticket' },
        { status: 403 }
      )
    }

    // Buscar mensagens
    const { data: messages } = await supabaseAdmin
      .from('support_messages')
      .select('*')
      .eq('ticket_id', ticket.id)
      .order('created_at', { ascending: true })

    // Buscar nome do usuário
    const { data: userData } = await supabaseAdmin.auth.admin.getUserById(ticket.user_id)
    const userName = userData?.user?.user_metadata?.full_name || 
                    userData?.user?.email?.split('@')[0] || 
                    'Usuário'

    // Buscar nome do atendente se houver
    let agentName = null
    if (ticket.agent_id) {
      const { data: agentData } = await supabaseAdmin.auth.admin.getUserById(ticket.agent_id)
      agentName = agentData?.user?.user_metadata?.full_name || 
                 agentData?.user?.email?.split('@')[0] || 
                 'Atendente'
    }

    return NextResponse.json({
      success: true,
      ticket: {
        ...ticket,
        user_name: userName,
        agent_name: agentName,
        messages: messages || []
      }
    })
  } catch (error: any) {
    console.error('Erro ao buscar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao buscar ticket' },
      { status: 500 }
    )
  }
}

