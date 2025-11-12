import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/templates
 * Lista todos os templates base com estatísticas de uso
 * Query params:
 * - area?: 'wellness' | 'nutri' | 'coach' | 'nutra' | 'todos'
 * - type?: 'quiz' | 'calculadora' | 'planilha' | 'todos'
 * - status?: 'active' | 'inactive' | 'todos'
 * - language?: 'pt' | 'en' | 'es' | 'todos'
 * - search?: string - Busca por nome
 * - sort?: 'usage' | 'recent' | 'name' - Ordenação
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const areaFiltro = searchParams.get('area') || 'todos'
    const typeFiltro = searchParams.get('type') || 'todos'
    const statusFiltro = searchParams.get('status') || 'todos'
    const languageFiltro = searchParams.get('language') || 'todos'
    const search = searchParams.get('search') || ''
    const sort = searchParams.get('sort') || 'usage'

    // =====================================================
    // BUSCAR TEMPLATES BASE
    // =====================================================
    let templatesQuery = supabaseAdmin
      .from('templates_nutrition')
      .select('*')
      .order('created_at', { ascending: false })

    // Aplicar filtros
    if (statusFiltro !== 'todos') {
      templatesQuery = templatesQuery.eq('is_active', statusFiltro === 'active')
    }

    if (typeFiltro !== 'todos') {
      templatesQuery = templatesQuery.eq('type', typeFiltro)
    }

    if (languageFiltro !== 'todos') {
      templatesQuery = templatesQuery.eq('language', languageFiltro)
    }

    if (search) {
      templatesQuery = templatesQuery.or(`name.ilike.%${search}%,title.ilike.%${search}%,description.ilike.%${search}%`)
    }

    const { data: templates, error: templatesError } = await templatesQuery

    if (templatesError) {
      console.error('Erro ao buscar templates:', templatesError)
      return NextResponse.json(
        { error: 'Erro ao buscar templates', details: templatesError.message },
        { status: 500 }
      )
    }

    // =====================================================
    // BUSCAR ESTATÍSTICAS DE USO PARA CADA TEMPLATE
    // =====================================================
    const templatesComStats = await Promise.all(
      (templates || []).map(async (template) => {
        // Buscar user_templates criados a partir deste template
        const { data: userTemplates } = await supabaseAdmin
          .from('user_templates')
          .select('id, views, leads_count, conversions_count, user_id')
          .eq('template_id', template.id)

        // Se tiver filtro de área, filtrar por perfil do usuário
        let templatesFiltrados = userTemplates || []
        if (areaFiltro !== 'todos' && userTemplates && userTemplates.length > 0) {
          const userIds = [...new Set(userTemplates.map(ut => ut.user_id).filter(Boolean))]
          const { data: profiles } = await supabaseAdmin
            .from('user_profiles')
            .select('user_id, perfil')
            .in('user_id', userIds.length > 0 ? userIds : ['00000000-0000-0000-0000-000000000000'])

          const profilesMap = new Map()
          if (profiles) {
            profiles.forEach(p => profilesMap.set(p.user_id, p.perfil))
          }

          templatesFiltrados = userTemplates.filter(ut => profilesMap.get(ut.user_id) === areaFiltro)
        }

        // Calcular estatísticas
        const linksCriados = templatesFiltrados.length
        const totalViews = templatesFiltrados.reduce((sum, ut) => sum + (ut.views || 0), 0)
        const totalLeads = templatesFiltrados.reduce((sum, ut) => sum + (ut.leads_count || 0), 0)
        const totalConversoes = templatesFiltrados.reduce((sum, ut) => sum + (ut.conversions_count || 0), 0)
        const taxaConversao = totalLeads > 0 ? (totalConversoes / totalLeads) * 100 : 0

        return {
          ...template,
          stats: {
            linksCriados,
            totalViews,
            totalLeads,
            totalConversoes,
            taxaConversao: Math.round(taxaConversao * 100) / 100
          }
        }
      })
    )

    // =====================================================
    // ORDENAR
    // =====================================================
    let sorted = templatesComStats
    switch (sort) {
      case 'usage':
        sorted = templatesComStats.sort((a, b) => b.stats.linksCriados - a.stats.linksCriados)
        break
      case 'recent':
        sorted = templatesComStats.sort((a, b) => 
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        )
        break
      case 'name':
        sorted = templatesComStats.sort((a, b) => a.name.localeCompare(b.name))
        break
    }

    return NextResponse.json({
      success: true,
      templates: sorted,
      total: sorted.length
    })
  } catch (error: any) {
    console.error('Erro na API de templates:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar templates',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/admin/templates
 * Criar novo template
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()

    // Validar campos obrigatórios
    if (!body.name || !body.type || !body.title || !body.content) {
      return NextResponse.json(
        { error: 'Campos obrigatórios: name, type, title, content' },
        { status: 400 }
      )
    }

    // Criar template
    const { data: template, error: createError } = await supabaseAdmin
      .from('templates_nutrition')
      .insert({
        name: body.name,
        type: body.type,
        language: body.language || 'pt',
        specialization: body.specialization || null,
        objective: body.objective || null,
        title: body.title,
        description: body.description || null,
        content: body.content,
        cta_text: body.cta_text || null,
        whatsapp_message: body.whatsapp_message || null,
        is_active: body.is_active !== undefined ? body.is_active : true
      })
      .select()
      .single()

    if (createError) {
      console.error('Erro ao criar template:', createError)
      return NextResponse.json(
        { error: 'Erro ao criar template', details: createError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      template: {
        ...template,
        stats: {
          linksCriados: 0,
          totalViews: 0,
          totalLeads: 0,
          totalConversoes: 0,
          taxaConversao: 0
        }
      }
    })
  } catch (error: any) {
    console.error('Erro na API de templates (POST):', error)
    return NextResponse.json(
      { 
        error: 'Erro ao criar template',
        details: error.message,
        ...(process.env.NODE_ENV === 'development' && { stack: error.stack })
      },
      { status: 500 }
    )
  }
}

