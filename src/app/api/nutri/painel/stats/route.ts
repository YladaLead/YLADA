import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar indicadores do dia para o painel diário
 * Retorna: leads do dia, conversas ativas, atendimentos agendados
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const authenticatedUserId = user.id

    // Data de hoje (início e fim do dia)
    const hoje = new Date()
    hoje.setHours(0, 0, 0, 0)
    const inicioDia = hoje.toISOString()
    
    const fimDia = new Date(hoje)
    fimDia.setHours(23, 59, 59, 999)
    const fimDiaISO = fimDia.toISOString()

    // Buscar leads do dia
    const { data: leadsHoje, error: leadsError } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('user_id', authenticatedUserId)
      .gte('created_at', inicioDia)
      .lte('created_at', fimDiaISO)

    if (leadsError) {
      console.error('Erro ao buscar leads do dia:', leadsError)
    }

    // Buscar clientes com status que indicam conversas ativas (lead, pre_consulta, ativa)
    const { data: conversasAtivas, error: conversasError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('user_id', authenticatedUserId)
      .in('status', ['lead', 'pre_consulta', 'ativa'])

    if (conversasError) {
      console.error('Erro ao buscar conversas ativas:', conversasError)
    }

    // Buscar atendimentos agendados (clientes com next_appointment no futuro)
    const { data: atendimentosAgendados, error: atendimentosError } = await supabaseAdmin
      .from('clients')
      .select('id')
      .eq('user_id', authenticatedUserId)
      .not('next_appointment', 'is', null)
      .gte('next_appointment', inicioDia)

    if (atendimentosError) {
      console.error('Erro ao buscar atendimentos agendados:', atendimentosError)
    }

    return NextResponse.json({
      success: true,
      data: {
        leadsHoje: leadsHoje?.length || 0,
        conversasAtivas: conversasAtivas?.length || 0,
        atendimentosAgendados: atendimentosAgendados?.length || 0
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar stats do painel:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar indicadores',
        ...(process.env.NODE_ENV === 'development' && {
          technical: error.message
        })
      },
      { status: 500 }
    )
  }
}










