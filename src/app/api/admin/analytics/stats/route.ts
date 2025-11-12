import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/analytics/stats
 * Retorna estatísticas gerais para o dashboard de analytics
 * Apenas admin pode acessar
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // =====================================================
    // 1. TOTAL DE USUÁRIOS
    // =====================================================
    const { count: usuariosTotal } = await supabaseAdmin
      .from('user_profiles')
      .select('id', { count: 'exact', head: true })

    // =====================================================
    // 2. TOTAL DE LEADS
    // =====================================================
    const { count: leadsTotal } = await supabaseAdmin
      .from('leads')
      .select('id', { count: 'exact', head: true })

    // =====================================================
    // 3. TOTAL DE CONVERSÕES
    // =====================================================
    const { data: userTemplates } = await supabaseAdmin
      .from('user_templates')
      .select('conversions_count')

    const conversoesTotal = (userTemplates || []).reduce(
      (sum, ut) => sum + (ut.conversions_count || 0),
      0
    )

    // =====================================================
    // 4. TAXA DE CONVERSÃO GERAL
    // =====================================================
    const taxaConversao = leadsTotal && leadsTotal > 0
      ? (conversoesTotal / leadsTotal) * 100
      : 0

    // =====================================================
    // 5. RECEITA TOTAL (soma de todas as assinaturas ativas)
    // =====================================================
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('amount, plan_type, currency')
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())

    let receitaTotal = 0
    let receitaMensal = 0

    if (subscriptions) {
      subscriptions.forEach(sub => {
        if (sub.plan_type === 'free') return

        const valor = sub.amount / 100 // Converter centavos

        if (sub.plan_type === 'annual') {
          receitaTotal += valor
          receitaMensal += valor / 12
        } else {
          receitaTotal += valor
          receitaMensal += valor
        }
      })
    }

    // =====================================================
    // 6. TOTAL DE TEMPLATES CRIADOS
    // =====================================================
    const { count: templatesTotal } = await supabaseAdmin
      .from('user_templates')
      .select('id', { count: 'exact', head: true })

    // =====================================================
    // 7. TOTAL DE VISUALIZAÇÕES
    // =====================================================
    const { data: templatesViews } = await supabaseAdmin
      .from('user_templates')
      .select('views')

    const visualizacoesTotal = (templatesViews || []).reduce(
      (sum, ut) => sum + (ut.views || 0),
      0
    )

    return NextResponse.json({
      success: true,
      stats: {
        usuariosTotal: usuariosTotal || 0,
        leadsTotal: leadsTotal || 0,
        conversoesTotal,
        taxaConversao: Math.round(taxaConversao * 100) / 100,
        receitaTotal: Math.round(receitaTotal * 100) / 100,
        receitaMensal: Math.round(receitaMensal * 100) / 100,
        templatesTotal: templatesTotal || 0,
        visualizacoesTotal
      }
    })
  } catch (error: any) {
    console.error('Erro na API de analytics stats:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar estatísticas',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}

