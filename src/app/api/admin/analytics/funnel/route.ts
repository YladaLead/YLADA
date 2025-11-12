import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/analytics/funnel
 * Retorna dados do funil de conversão (Visualizações → Leads → Conversões)
 * Query params:
 * - area?: 'todos' | 'wellness' | 'nutri' | 'coach' | 'nutra' - Filtrar por área
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const areaFiltro = searchParams.get('area') || 'todos'

    // =====================================================
    // BUSCAR DADOS DO FUNIL
    // =====================================================
    const { data: allTemplates } = await supabaseAdmin
      .from('user_templates')
      .select('id, views, leads_count, conversions_count, user_id')

    // Filtrar por área se necessário
    let templates = allTemplates
    if (areaFiltro !== 'todos') {
      const userIds = [...new Set((allTemplates || []).map(t => t.user_id).filter(Boolean))]
      const { data: profiles } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, perfil')
        .in('user_id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000'])

      const profilesMap = new Map()
      if (profiles) {
        profiles.forEach(p => profilesMap.set(p.user_id, p.perfil))
      }

      templates = (allTemplates || []).filter(t => profilesMap.get(t.user_id) === areaFiltro)
    }

    // =====================================================
    // CALCULAR TOTAIS
    // =====================================================
    const visualizacoes = (templates || []).reduce(
      (sum, t) => sum + (t.views || 0),
      0
    )

    const leads = (templates || []).reduce(
      (sum, t) => sum + (t.leads_count || 0),
      0
    )

    const conversoes = (templates || []).reduce(
      (sum, t) => sum + (t.conversions_count || 0),
      0
    )

    // =====================================================
    // CALCULAR TAXAS DE CONVERSÃO
    // =====================================================
    const taxaLeads = visualizacoes > 0
      ? (leads / visualizacoes) * 100
      : 0

    const taxaConversoes = leads > 0
      ? (conversoes / leads) * 100
      : 0

    const taxaGeral = visualizacoes > 0
      ? (conversoes / visualizacoes) * 100
      : 0

    // =====================================================
    // FUNIL POR ÁREA (se não tiver filtro)
    // =====================================================
    const funnelPorArea: Record<string, {
      visualizacoes: number
      leads: number
      conversoes: number
      taxaLeads: number
      taxaConversoes: number
    }> = {}

    if (areaFiltro === 'todos') {
      const areas = ['wellness', 'nutri', 'coach', 'nutra']

      // Buscar todos os templates novamente para o breakdown por área
      const { data: allTemplatesForBreakdown } = await supabaseAdmin
        .from('user_templates')
        .select('id, views, leads_count, conversions_count, user_id')

      // Buscar perfis uma vez
      const allUserIds = [...new Set((allTemplatesForBreakdown || []).map(t => t.user_id).filter(Boolean))]
      const { data: allProfiles } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, perfil')
        .in('user_id', allUserIds.length > 0 ? allUserIds : ['00000000-0000-0000-0000-000000000000'])

      const allProfilesMap = new Map()
      if (allProfiles) {
        allProfiles.forEach(p => allProfilesMap.set(p.user_id, p.perfil))
      }

      for (const area of areas) {
        const areaTemplates = (allTemplatesForBreakdown || []).filter(t => allProfilesMap.get(t.user_id) === area)

        const vis = (areaTemplates || []).reduce((s, t) => s + (t.views || 0), 0)
        const le = (areaTemplates || []).reduce((s, t) => s + (t.leads_count || 0), 0)
        const conv = (areaTemplates || []).reduce((s, t) => s + (t.conversions_count || 0), 0)

        funnelPorArea[area] = {
          visualizacoes: vis,
          leads: le,
          conversoes: conv,
          taxaLeads: vis > 0 ? Math.round((le / vis) * 10000) / 100 : 0,
          taxaConversoes: le > 0 ? Math.round((conv / le) * 10000) / 100 : 0
        }
      }
    }

    return NextResponse.json({
      success: true,
      area: areaFiltro,
      funnel: {
        visualizacoes,
        leads,
        conversoes,
        taxaLeads: Math.round(taxaLeads * 100) / 100,
        taxaConversoes: Math.round(taxaConversoes * 100) / 100,
        taxaGeral: Math.round(taxaGeral * 100) / 100
      },
      funnelPorArea: Object.keys(funnelPorArea).length > 0 ? funnelPorArea : undefined
    })
  } catch (error: any) {
    console.error('Erro na API de analytics funnel:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar funil de conversão',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}

