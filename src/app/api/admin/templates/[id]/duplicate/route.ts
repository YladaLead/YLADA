import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/templates/[id]/duplicate
 * Duplicar template (pode ser para outra área/idioma)
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()

    // Buscar template original
    const { data: original, error: fetchError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('*')
      .eq('id', params.id)
      .single()

    if (fetchError || !original) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    // Criar cópia com modificações opcionais
    const { data: duplicate, error: createError } = await supabaseAdmin
      .from('templates_nutrition')
      .insert({
        name: body.name || `${original.name} (Cópia)`,
        type: body.type || original.type,
        language: body.language || original.language,
        specialization: body.specialization || original.specialization,
        objective: body.objective || original.objective,
        title: body.title || original.title,
        description: body.description || original.description,
        content: body.content || original.content,
        cta_text: body.cta_text || original.cta_text,
        whatsapp_message: body.whatsapp_message || original.whatsapp_message,
        is_active: body.is_active !== undefined ? body.is_active : true
      })
      .select()
      .single()

    if (createError) {
      console.error('Erro ao duplicar template:', createError)
      return NextResponse.json(
        { error: 'Erro ao duplicar template', details: createError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      template: {
        ...duplicate,
        stats: {
          linksCriados: 0,
          totalViews: 0,
          totalLeads: 0,
          totalConversoes: 0,
          taxaConversao: 0
        }
      },
      message: 'Template duplicado com sucesso'
    })
  } catch (error: any) {
    console.error('Erro na API de templates duplicate:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao duplicar template',
        details: error.message
      },
      { status: 500 }
    )
  }
}

