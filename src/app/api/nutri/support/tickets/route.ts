import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { notifyAgentsNewTicket } from '@/lib/support-notifications'

// GET - Listar tickets
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
    const status = searchParams.get('status')
    const user_id = searchParams.get('user_id')
    const agent_id = searchParams.get('agent_id')

    // Verificar se é atendente (com tratamento de erro se tabela não existir)
    let agent = null
    try {
      const { data: agentData, error: agentError } = await supabaseAdmin
        .from('support_agents')
        .select('*')
        .eq('user_id', user.id)
        .single()
      
      if (!agentError && agentData) {
        agent = agentData
      }
    } catch (err: any) {
      // Se tabela não existir, agent fica null (usuário comum)
      console.warn('[Support Tickets] Tabela support_agents pode não existir:', err.message)
    }

    let query = supabaseAdmin
      .from('support_tickets')
      .select(`
        *,
        agent:agent_id (
          id,
          user_id
        )
      `)
      .eq('area', 'nutri')
      .order('created_at', { ascending: false })

    // Se não é atendente, só pode ver seus próprios tickets
    if (!agent) {
      query = query.eq('user_id', user.id)
    } else {
      // Atendente pode ver todos ou filtrar
      if (user_id) {
        query = query.eq('user_id', user_id)
      }
      if (agent_id) {
        query = query.eq('agent_id', agent_id)
      }
    }

    // Filtrar por status
    if (status) {
      query = query.eq('status', status)
    }

    const { data: tickets, error } = await query

    if (error) {
      console.error('Erro ao buscar tickets:', error)
      
      // Mensagem mais específica para erro de tabela não encontrada
      if (error.message?.includes('relation') && error.message?.includes('does not exist')) {
        return NextResponse.json(
          { 
            error: 'Tabelas de suporte não encontradas. Execute o SQL: migrations/criar-tabelas-chat-suporte-nutri.sql',
            details: error.message
          },
          { status: 500 }
        )
      }
      
      return NextResponse.json(
        { 
          error: 'Erro ao buscar tickets',
          details: error.message || 'Erro desconhecido'
        },
        { status: 500 }
      )
    }

    // Buscar nomes dos usuários e atendentes
    const ticketsComNomes = await Promise.all(
      (tickets || []).map(async (ticket: any) => {
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

        return {
          ...ticket,
          user_name: userName,
          agent_name: agentName
        }
      })
    )

    return NextResponse.json({
      success: true,
      tickets: ticketsComNomes
    })
  } catch (error: any) {
    console.error('Erro ao listar tickets:', error)
    return NextResponse.json(
      { error: 'Erro ao listar tickets' },
      { status: 500 }
    )
  }
}

// POST - Criar ticket
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
    const {
      assunto,
      categoria,
      primeira_mensagem,
      prioridade
    } = body

    if (!assunto || !primeira_mensagem) {
      return NextResponse.json(
        { error: 'Assunto e primeira mensagem são obrigatórios' },
        { status: 400 }
      )
    }

    const { data: ticket, error } = await supabaseAdmin
      .from('support_tickets')
      .insert({
        area: 'nutri',
        user_id: user.id,
        status: 'aguardando',
        categoria: categoria || 'outras',
        assunto: assunto.substring(0, 200),
        primeira_mensagem: primeira_mensagem,
        ultima_mensagem: primeira_mensagem,
        ultima_mensagem_em: new Date().toISOString(),
        prioridade: prioridade || 'normal',
        mensagens_count: 1
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar ticket:', error)
      return NextResponse.json(
        { error: 'Erro ao criar ticket' },
        { status: 500 }
      )
    }

    // Criar primeira mensagem
    await supabaseAdmin
      .from('support_messages')
      .insert({
        ticket_id: ticket.id,
        sender_type: 'user',
        sender_id: user.id,
        sender_name: user.email?.split('@')[0] || 'Usuário',
        message: primeira_mensagem,
        is_bot_response: false
      })

    // Enviar notificação para atendentes (não bloqueia resposta)
    notifyAgentsNewTicket({
      ticketId: ticket.id,
      area: 'nutri',
      assunto: assunto.substring(0, 200),
      primeiraMensagem: primeira_mensagem,
      prioridade: prioridade || 'normal',
      categoria: categoria || 'outras',
      userName: user.email?.split('@')[0] || 'Usuário',
      userEmail: user.email || undefined,
      createdAt: ticket.created_at
    }).catch(error => {
      // Não falhar a requisição se notificação falhar
      console.error('[Support Tickets] Erro ao enviar notificação:', error)
    })

    return NextResponse.json({
      success: true,
      ticket
    })
  } catch (error: any) {
    console.error('Erro ao criar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao criar ticket' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar ticket
export async function PUT(request: NextRequest) {
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
    const { id, status, agent_id, prioridade, satisfacao, feedback } = body

    if (!id) {
      return NextResponse.json(
        { error: 'ID do ticket é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se usuário tem permissão
    const { data: existingTicket } = await supabaseAdmin
      .from('support_tickets')
      .select('*')
      .eq('id', id)
      .single()

    if (!existingTicket) {
      return NextResponse.json(
        { error: 'Ticket não encontrado' },
        { status: 404 }
      )
    }

    // Verificar se é atendente ou dono do ticket
    const { data: agent } = await supabaseAdmin
      .from('support_agents')
      .select('*')
      .eq('user_id', user.id)
      .single()

    const isOwner = existingTicket.user_id === user.id
    const isAgent = !!agent

    if (!isOwner && !isAgent) {
      return NextResponse.json(
        { error: 'Sem permissão para atualizar este ticket' },
        { status: 403 }
      )
    }

    // Preparar atualizações
    const updates: any = {
      updated_at: new Date().toISOString()
    }

    if (status) {
      updates.status = status
      if (status === 'resolvido' || status === 'fechado') {
        updates.resolved_at = new Date().toISOString()
        // Calcular tempo de resolução
        if (existingTicket.created_at) {
          const created = new Date(existingTicket.created_at)
          const resolved = new Date()
          updates.tempo_resolucao_segundos = Math.floor((resolved.getTime() - created.getTime()) / 1000)
        }
      }
    }

    if (agent_id && isAgent) {
      updates.agent_id = agent_id
      updates.assigned_at = new Date().toISOString()
      if (status === 'aguardando') {
        updates.status = 'em_atendimento'
      }
    }

    if (prioridade && isAgent) {
      updates.prioridade = prioridade
    }

    if (satisfacao !== undefined && isOwner) {
      updates.satisfacao = satisfacao
    }

    if (feedback && isOwner) {
      updates.feedback = feedback
    }

    const { data: updatedTicket, error } = await supabaseAdmin
      .from('support_tickets')
      .update(updates)
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar ticket:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar ticket' },
        { status: 500 }
      )
    }

    // Se atendente aceitou, atualizar contador
    if (agent_id && agent_id === user.id && isAgent && agent) {
      await supabaseAdmin
        .from('support_agents')
        .update({
          current_tickets_count: (agent.current_tickets_count || 0) + 1,
          total_tickets_atendidos: (agent.total_tickets_atendidos || 0) + 1,
          last_activity: new Date().toISOString()
        })
        .eq('user_id', user.id)
    }

    return NextResponse.json({
      success: true,
      ticket: updatedTicket
    })
  } catch (error: any) {
    console.error('Erro ao atualizar ticket:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar ticket' },
      { status: 500 }
    )
  }
}


