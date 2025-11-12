import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/admin/templates/[id]
 * Buscar template específico com estatísticas
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { data: template, error } = await supabaseAdmin
      .from('templates_nutrition')
      .select('*')
      .eq('id', params.id)
      .single()

    if (error || !template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    // Buscar estatísticas
    const { data: userTemplates } = await supabaseAdmin
      .from('user_templates')
      .select('id, views, leads_count, conversions_count')
      .eq('template_id', params.id)

    const linksCriados = userTemplates?.length || 0
    const totalViews = (userTemplates || []).reduce((sum, ut) => sum + (ut.views || 0), 0)
    const totalLeads = (userTemplates || []).reduce((sum, ut) => sum + (ut.leads_count || 0), 0)
    const totalConversoes = (userTemplates || []).reduce((sum, ut) => sum + (ut.conversions_count || 0), 0)
    const taxaConversao = totalLeads > 0 ? (totalConversoes / totalLeads) * 100 : 0

    return NextResponse.json({
      success: true,
      template: {
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
  } catch (error: any) {
    console.error('Erro na API de templates (GET):', error)
    return NextResponse.json(
      { 
        error: 'Erro ao buscar template',
        details: error.message
      },
      { status: 500 }
    )
  }
}

/**
 * PUT /api/admin/templates/[id]
 * Atualizar template
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()

    // Preparar dados para atualização
    const updateData: any = {
      updated_at: new Date().toISOString()
    }

    if (body.name !== undefined) updateData.name = body.name
    if (body.type !== undefined) updateData.type = body.type
    if (body.language !== undefined) updateData.language = body.language
    if (body.specialization !== undefined) updateData.specialization = body.specialization
    if (body.objective !== undefined) updateData.objective = body.objective
    if (body.title !== undefined) updateData.title = body.title
    if (body.description !== undefined) updateData.description = body.description
    if (body.content !== undefined) updateData.content = body.content
    if (body.cta_text !== undefined) updateData.cta_text = body.cta_text
    if (body.whatsapp_message !== undefined) updateData.whatsapp_message = body.whatsapp_message
    if (body.is_active !== undefined) updateData.is_active = body.is_active

    const { data: template, error } = await supabaseAdmin
      .from('templates_nutrition')
      .update(updateData)
      .eq('id', params.id)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar template:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar template', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      template
    })
  } catch (error: any) {
    console.error('Erro na API de templates (PUT):', error)
    return NextResponse.json(
      { 
        error: 'Erro ao atualizar template',
        details: error.message
      },
      { status: 500 }
    )
  }
}

/**
 * DELETE /api/admin/templates/[id]
 * Deletar template (soft delete - desativar)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Soft delete - apenas desativar
    const { error } = await supabaseAdmin
      .from('templates_nutrition')
      .update({ is_active: false, updated_at: new Date().toISOString() })
      .eq('id', params.id)

    if (error) {
      console.error('Erro ao desativar template:', error)
      return NextResponse.json(
        { error: 'Erro ao desativar template', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Template desativado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro na API de templates (DELETE):', error)
    return NextResponse.json(
      { 
        error: 'Erro ao desativar template',
        details: error.message
      },
      { status: 500 }
    )
  }
}

