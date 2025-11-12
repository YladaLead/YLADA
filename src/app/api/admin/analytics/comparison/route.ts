import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/analytics/comparison
 * Retorna comparativo de métricas por área
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const areas = ['wellness', 'nutri', 'coach', 'nutra']
    const comparison: Record<string, {
      usuarios: number
      usuariosAtivos: number
      leads: number
      conversoes: number
      taxaConversao: number
      receita: number
      templates: number
      visualizacoes: number
    }> = {}

    // =====================================================
    // BUSCAR DADOS POR ÁREA
    // =====================================================
    for (const area of areas) {
      // Usuários totais
      const { count: usuariosTotal } = await supabaseAdmin
        .from('user_profiles')
        .select('id', { count: 'exact', head: true })
        .eq('perfil', area)

      // Usuários ativos (com assinatura)
      const { count: usuariosAtivos } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id', { count: 'exact', head: true })
        .eq('area', area)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())

      // Leads (buscar todos e filtrar por área do usuário)
      const { data: allLeads } = await supabaseAdmin
        .from('leads')
        .select('user_id')

      // Buscar perfis dos usuários dos leads
      const userIds = [...new Set((allLeads || []).map(l => l.user_id).filter(Boolean))]
      const { data: leadProfiles } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, perfil')
        .in('user_id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000'])

      const profilesMap = new Map()
      if (leadProfiles) {
        leadProfiles.forEach(p => profilesMap.set(p.user_id, p.perfil))
      }

      const leads = (allLeads || []).filter(l => profilesMap.get(l.user_id) === area).length

      // Conversões (buscar user_templates e filtrar por área)
      const { data: allTemplates } = await supabaseAdmin
        .from('user_templates')
        .select('user_id, conversions_count')

      const templateUserIds = [...new Set((allTemplates || []).map(t => t.user_id).filter(Boolean))]
      const { data: templateProfiles } = await supabaseAdmin
        .from('user_profiles')
        .select('user_id, perfil')
        .in('user_id', templateUserIds.length > 0 ? templateUserIds : ['00000000-0000-0000-0000-000000000000'])

      const templateProfilesMap = new Map()
      if (templateProfiles) {
        templateProfiles.forEach(p => templateProfilesMap.set(p.user_id, p.perfil))
      }

      const templatesData = (allTemplates || []).filter(t => templateProfilesMap.get(t.user_id) === area)

      const conversoes = (templatesData || []).reduce(
        (sum, t) => sum + (t.conversions_count || 0),
        0
      )

      const taxaConversao = leads > 0 ? (conversoes / leads) * 100 : 0

      // Receita
      const { data: subscriptions } = await supabaseAdmin
        .from('subscriptions')
        .select('amount, plan_type')
        .eq('area', area)
        .eq('status', 'active')
        .gt('current_period_end', new Date().toISOString())

      let receita = 0
      if (subscriptions) {
        subscriptions.forEach(sub => {
          if (sub.plan_type === 'free') return
          const valor = sub.amount / 100
          if (sub.plan_type === 'annual') {
            receita += valor / 12 // Mensalizado
          } else {
            receita += valor
          }
        })
      }

      // Templates criados (usar o mesmo mapa de perfis)
      const { data: allTemplatesArea } = await supabaseAdmin
        .from('user_templates')
        .select('id, views, user_id')

      const templatesArea = (allTemplatesArea || []).filter(t => templateProfilesMap.get(t.user_id) === area)

      const templates = templatesArea?.length || 0
      const visualizacoes = (templatesArea || []).reduce(
        (sum, t) => sum + (t.views || 0),
        0
      )

      comparison[area] = {
        usuarios: usuariosTotal || 0,
        usuariosAtivos: usuariosAtivos || 0,
        leads,
        conversoes,
        taxaConversao: Math.round(taxaConversao * 100) / 100,
        receita: Math.round(receita * 100) / 100,
        templates,
        visualizacoes
      }
    }

    return NextResponse.json({
      success: true,
      comparison
    })
  } catch (error: any) {
    console.error('Erro na API de analytics comparison:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar comparativo',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}

