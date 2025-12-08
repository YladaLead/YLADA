import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

/**
 * GET /api/wellness/consultor/estatisticas
 * 
 * Retorna estatísticas do consultor (clientes, PV, etc)
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    // Buscar clientes
    const { data: clientes, error: clientesError } = await supabaseAdmin
      .from('noel_clients')
      .select('*')
      .eq('user_id', user.id)

    if (clientesError) {
      console.error('❌ Erro ao buscar clientes:', clientesError)
      return NextResponse.json(
        { error: 'Erro ao buscar clientes' },
        { status: 500 }
      )
    }

    // Buscar leads também (para total)
    const { data: leads, error: leadsError } = await supabaseAdmin
      .from('noel_leads')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'cliente')

    // Calcular estatísticas
    const totalClientes = (clientes?.length || 0) + (leads?.length || 0)
    const clientesRecorrentes = clientes?.filter(c => c.rotina_mensal === true).length || 0

    // Calcular PV mensal (buscar de compras/vendas se houver tabela)
    // Por enquanto, retornar 0 se não houver tabela específica
    let pvMensal = 0
    try {
      // Tentar buscar PV de alguma tabela de vendas/compras
      // Por enquanto, usar kits_vendidos como aproximação
      const totalKits = clientes?.reduce((sum, c) => sum + (c.kits_vendidos || 0), 0) || 0
      // Assumir que cada kit tem ~100 PV (ajustar conforme necessário)
      pvMensal = totalKits * 100
    } catch (e) {
      // Se não conseguir calcular, deixar 0
      pvMensal = 0
    }

    // Clientes próximos de recompra (7 dias)
    const hoje = new Date()
    const proximosRecompra = clientes?.filter((c: any) => {
      if (!c.next_follow_up_at) return false
      const recompra = new Date(c.next_follow_up_at)
      const diff = Math.ceil((recompra.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24))
      return diff <= 7 && diff >= 0
    }).length || 0

    return NextResponse.json({
      success: true,
      data: {
        totalClientes,
        pvMensal,
        clientesRecorrentes,
        proximosRecompra
      }
    })

  } catch (error: any) {
    console.error('❌ Erro ao buscar estatísticas:', error)
    return NextResponse.json(
      { success: false, error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
