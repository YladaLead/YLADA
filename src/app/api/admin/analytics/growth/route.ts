import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/analytics/growth
 * Retorna dados de crescimento ao longo do tempo
 * Query params:
 * - period?: '7d' | '30d' | '3m' | '6m' | '1y' | 'all' - Período (default: '30d')
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'

    // Calcular data inicial baseado no período
    const now = new Date()
    let startDate = new Date()

    switch (period) {
      case '7d':
        startDate.setDate(now.getDate() - 7)
        break
      case '30d':
        startDate.setDate(now.getDate() - 30)
        break
      case '3m':
        startDate.setMonth(now.getMonth() - 3)
        break
      case '6m':
        startDate.setMonth(now.getMonth() - 6)
        break
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1)
        break
      case 'all':
        startDate = new Date(0) // Desde o início
        break
      default:
        startDate.setDate(now.getDate() - 30)
    }

    const startDateISO = startDate.toISOString()

    // =====================================================
    // 1. USUÁRIOS CADASTRADOS POR MÊS
    // =====================================================
    const { data: usuarios } = await supabaseAdmin
      .from('user_profiles')
      .select('created_at')
      .gte('created_at', startDateISO)
      .order('created_at', { ascending: true })

    // Agrupar por mês
    const usuariosPorMes: Record<string, number> = {}
    if (usuarios) {
      usuarios.forEach(user => {
        const date = new Date(user.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        usuariosPorMes[monthKey] = (usuariosPorMes[monthKey] || 0) + 1
      })
    }

    // =====================================================
    // 2. LEADS GERADOS POR MÊS
    // =====================================================
    const { data: leads } = await supabaseAdmin
      .from('leads')
      .select('created_at')
      .gte('created_at', startDateISO)
      .order('created_at', { ascending: true })

    const leadsPorMes: Record<string, number> = {}
    if (leads) {
      leads.forEach(lead => {
        const date = new Date(lead.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        leadsPorMes[monthKey] = (leadsPorMes[monthKey] || 0) + 1
      })
    }

    // =====================================================
    // 3. CONVERSÕES POR MÊS (baseado em quando o user_template foi atualizado com conversão)
    // Por enquanto, vamos usar a data de criação do user_template como proxy
    // No futuro, podemos adicionar uma tabela de conversões com timestamp
    const { data: templates } = await supabaseAdmin
      .from('user_templates')
      .select('created_at, conversions_count')
      .gte('created_at', startDateISO)
      .gt('conversions_count', 0)
      .order('created_at', { ascending: true })

    const conversoesPorMes: Record<string, number> = {}
    if (templates) {
      templates.forEach(template => {
        const date = new Date(template.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        conversoesPorMes[monthKey] = (conversoesPorMes[monthKey] || 0) + (template.conversions_count || 0)
      })
    }

    // =====================================================
    // 4. RECEITA POR MÊS (baseado em quando a assinatura foi criada)
    // =====================================================
    const { data: subscriptions } = await supabaseAdmin
      .from('subscriptions')
      .select('created_at, amount, plan_type, currency')
      .gte('created_at', startDateISO)
      .eq('status', 'active')
      .order('created_at', { ascending: true })

    const receitaPorMes: Record<string, number> = {}
    if (subscriptions) {
      subscriptions.forEach(sub => {
        if (sub.plan_type === 'free') return

        const date = new Date(sub.created_at)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const valor = sub.amount / 100

        if (sub.plan_type === 'annual') {
          receitaPorMes[monthKey] = (receitaPorMes[monthKey] || 0) + valor
        } else {
          receitaPorMes[monthKey] = (receitaPorMes[monthKey] || 0) + valor
        }
      })
    }

    // =====================================================
    // FORMATAR DADOS PARA GRÁFICO
    // =====================================================
    // Pegar todos os meses únicos
    const allMonths = new Set([
      ...Object.keys(usuariosPorMes),
      ...Object.keys(leadsPorMes),
      ...Object.keys(conversoesPorMes),
      ...Object.keys(receitaPorMes)
    ])

    const growthData = Array.from(allMonths)
      .sort()
      .map(month => ({
        month,
        usuarios: usuariosPorMes[month] || 0,
        leads: leadsPorMes[month] || 0,
        conversoes: conversoesPorMes[month] || 0,
        receita: Math.round((receitaPorMes[month] || 0) * 100) / 100
      }))

    return NextResponse.json({
      success: true,
      period,
      startDate: startDateISO,
      data: growthData
    })
  } catch (error: any) {
    console.error('Erro na API de analytics growth:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar dados de crescimento',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}

