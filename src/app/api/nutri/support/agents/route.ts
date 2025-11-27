import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

// GET - Listar atendentes
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin', 'support'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status')
    const area = searchParams.get('area') || 'nutri'

    let query = supabaseAdmin
      .from('support_agents')
      .select('*')
      .eq('area', area)

    if (status) {
      query = query.eq('status', status)
    }

    const { data: agents, error } = await query

    if (error) {
      console.error('Erro ao buscar atendentes:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar atendentes' },
        { status: 500 }
      )
    }

    // Buscar nomes dos usuários
    const agentsComNomes = await Promise.all(
      (agents || []).map(async (agent: any) => {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(agent.user_id)
        const userName = userData?.user?.user_metadata?.full_name || 
                        userData?.user?.email?.split('@')[0] || 
                        'Atendente'

        return {
          ...agent,
          name: userName,
          email: userData?.user?.email
        }
      })
    )

    return NextResponse.json({
      success: true,
      agents: agentsComNomes
    })
  } catch (error: any) {
    console.error('Erro ao listar atendentes:', error)
    return NextResponse.json(
      { error: 'Erro ao listar atendentes' },
      { status: 500 }
    )
  }
}

// POST - Criar/Registrar atendente (apenas admin)
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
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
    const { user_id, area, max_concurrent_tickets, categorias_preferidas } = body

    if (!user_id) {
      return NextResponse.json(
        { error: 'user_id é obrigatório' },
        { status: 400 }
      )
    }

    // Verificar se já existe
    const { data: existing } = await supabaseAdmin
      .from('support_agents')
      .select('*')
      .eq('user_id', user_id)
      .eq('area', area || 'nutri')
      .single()

    if (existing) {
      return NextResponse.json(
        { error: 'Atendente já está registrado para esta área' },
        { status: 409 }
      )
    }

    const { data: agent, error } = await supabaseAdmin
      .from('support_agents')
      .insert({
        user_id,
        area: area || 'nutri',
        status: 'offline',
        max_concurrent_tickets: max_concurrent_tickets || 3,
        categorias_preferidas: categorias_preferidas || []
      })
      .select()
      .single()

    if (error) {
      console.error('Erro ao criar atendente:', error)
      return NextResponse.json(
        { error: 'Erro ao criar atendente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      agent
    })
  } catch (error: any) {
    console.error('Erro ao criar atendente:', error)
    return NextResponse.json(
      { error: 'Erro ao criar atendente' },
      { status: 500 }
    )
  }
}

// PUT - Atualizar status do atendente
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
    const { status, max_concurrent_tickets, categorias_preferidas, auto_accept } = body

    // Verificar se é atendente
    const { data: existingAgent } = await supabaseAdmin
      .from('support_agents')
      .select('*')
      .eq('user_id', user.id)
      .eq('area', 'nutri')
      .single()

    if (!existingAgent) {
      return NextResponse.json(
        { error: 'Você não está registrado como atendente' },
        { status: 403 }
      )
    }

    const updates: any = {
      updated_at: new Date().toISOString()
    }

    if (status) {
      updates.status = status
      updates.last_status_change = new Date().toISOString()
    }

    if (max_concurrent_tickets !== undefined) {
      updates.max_concurrent_tickets = max_concurrent_tickets
    }

    if (categorias_preferidas !== undefined) {
      updates.categorias_preferidas = categorias_preferidas
    }

    if (auto_accept !== undefined) {
      updates.auto_accept = auto_accept
    }

    updates.last_activity = new Date().toISOString()

    const { data: agent, error } = await supabaseAdmin
      .from('support_agents')
      .update(updates)
      .eq('user_id', user.id)
      .eq('area', 'nutri')
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar atendente:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar atendente' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      agent
    })
  } catch (error: any) {
    console.error('Erro ao atualizar atendente:', error)
    return NextResponse.json(
      { error: 'Erro ao atualizar atendente' },
      { status: 500 }
    )
  }
}

