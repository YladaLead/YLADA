import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/analytics/top-templates
 * Retorna top templates por diferentes métricas
 * Query params:
 * - metric?: 'links' | 'leads' | 'conversions' | 'conversion_rate' - Métrica para ordenar (default: 'leads')
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
    // BUSCAR TODOS OS TEMPLATES BASE
    // =====================================================
    const { data: baseTemplates } = await supabaseAdmin
      .from('templates_nutrition')
      .select('id, name, type, title, description')

    // =====================================================
    // BUSCAR USER_TEMPLATES COM ESTATÍSTICAS
    // =====================================================
    const { data: userTemplates } = await supabaseAdmin
      .from('user_templates')
      .select(`
        id,
        template_id,
        title,
        views,
        leads_count,
        conversions_count,
        created_at,
        templates_nutrition(name, type)
      `)

    // =====================================================
    // AGRUPAR POR TEMPLATE BASE
    // =====================================================
    const templateStats: Record<string, {
      templateId: string
      templateName: string
      templateType: string
      linksCriados: number
      totalViews: number
      totalLeads: number
      totalConversoes: number
      taxaConversao: number
    }> = {}

    if (userTemplates) {
      userTemplates.forEach(ut => {
        const baseTemplateId = ut.template_id || 'custom'
        const baseTemplate = baseTemplates?.find(t => t.id === baseTemplateId)

        if (!templateStats[baseTemplateId]) {
          templateStats[baseTemplateId] = {
            templateId: baseTemplateId,
            templateName: baseTemplate?.name || ut.title || 'Template Personalizado',
            templateType: baseTemplate?.type || 'custom',
            linksCriados: 0,
            totalViews: 0,
            totalLeads: 0,
            totalConversoes: 0,
            taxaConversao: 0
          }
        }

        templateStats[baseTemplateId].linksCriados++
        templateStats[baseTemplateId].totalViews += ut.views || 0
        templateStats[baseTemplateId].totalLeads += ut.leads_count || 0
        templateStats[baseTemplateId].totalConversoes += ut.conversions_count || 0
      })
    }

    // Calcular taxa de conversão
    Object.values(templateStats).forEach(stat => {
      stat.taxaConversao = stat.totalLeads > 0
        ? Math.round((stat.totalConversoes / stat.totalLeads) * 10000) / 100
        : 0
    })

    // =====================================================
    // ORDENAR POR MÉTRICA
    // =====================================================
    const sorted = Object.values(templateStats).sort((a, b) => {
      switch (metric) {
        case 'links':
          return b.linksCriados - a.linksCriados
        case 'leads':
          return b.totalLeads - a.totalLeads
        case 'conversions':
          return b.totalConversoes - a.totalConversoes
        case 'conversion_rate':
          return b.taxaConversao - a.taxaConversao
        default:
          return b.totalLeads - a.totalLeads
      }
    })

    return NextResponse.json({
      success: true,
      metric,
      topTemplates: sorted.slice(0, limit)
    })
  } catch (error: any) {
    console.error('Erro na API de analytics top-templates:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar top templates',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}

