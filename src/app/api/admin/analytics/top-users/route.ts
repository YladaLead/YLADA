import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/analytics/top-users
 * Retorna top usuários por diferentes métricas
 * Query params:
 * - metric?: 'leads' | 'conversions' | 'templates' - Métrica para ordenar (default: 'leads')
 * - limit?: number - Limite de resultados (default: 10)
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const metric = searchParams.get('metric') || 'leads'
    const limit = parseInt(searchParams.get('limit') || '10')

    // =====================================================
    // BUSCAR TODOS OS USER_TEMPLATES
    // =====================================================
    const { data: userTemplates } = await supabaseAdmin
      .from('user_templates')
      .select('id, user_id, leads_count, conversions_count')

    // Buscar perfis dos usuários
    const userIds = [...new Set((userTemplates || []).map(ut => ut.user_id).filter(Boolean))]
    const { data: profiles } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, nome_completo, email, perfil')
      .in('user_id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000'])

    const profilesMap = new Map()
    if (profiles) {
      profiles.forEach(p => profilesMap.set(p.user_id, p))
    }

    // =====================================================
    // AGRUPAR POR USUÁRIO
    // =====================================================
    const userStats: Record<string, {
      userId: string
      nome: string
      email: string
      area: string
      totalTemplates: number
      totalLeads: number
      totalConversoes: number
      taxaConversao: number
    }> = {}

    if (userTemplates) {
      userTemplates.forEach(ut => {
        const userId = ut.user_id
        const profile = profilesMap.get(userId)

        if (!userStats[userId]) {
          userStats[userId] = {
            userId,
            nome: profile?.nome_completo || 'Usuário sem nome',
            email: profile?.email || '',
            area: profile?.perfil || 'unknown',
            totalTemplates: 0,
            totalLeads: 0,
            totalConversoes: 0,
            taxaConversao: 0
          }
        }

        userStats[userId].totalTemplates++
        userStats[userId].totalLeads += ut.leads_count || 0
        userStats[userId].totalConversoes += ut.conversions_count || 0
      })
    }

    // Calcular taxa de conversão
    Object.values(userStats).forEach(stat => {
      stat.taxaConversao = stat.totalLeads > 0
        ? Math.round((stat.totalConversoes / stat.totalLeads) * 10000) / 100
        : 0
    })

    // =====================================================
    // ORDENAR POR MÉTRICA
    // =====================================================
    const sorted = Object.values(userStats).sort((a, b) => {
      switch (metric) {
        case 'templates':
          return b.totalTemplates - a.totalTemplates
        case 'leads':
          return b.totalLeads - a.totalLeads
        case 'conversions':
          return b.totalConversoes - a.totalConversoes
        default:
          return b.totalLeads - a.totalLeads
      }
    })

    return NextResponse.json({
      success: true,
      metric,
      topUsers: sorted.slice(0, limit)
    })
  } catch (error: any) {
    console.error('Erro na API de analytics top-users:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar top usuários',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}

