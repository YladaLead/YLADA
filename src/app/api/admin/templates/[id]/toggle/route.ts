import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * PATCH /api/admin/templates/[id]/toggle
 * Ativar/Desativar template
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Buscar template atual
    const { data: template, error: fetchError } = await supabaseAdmin
      .from('templates_nutrition')
      .select('is_active')
      .eq('id', params.id)
      .single()

    if (fetchError || !template) {
      return NextResponse.json(
        { error: 'Template não encontrado' },
        { status: 404 }
      )
    }

    // Alternar status
    const { data: updated, error: updateError } = await supabaseAdmin
      .from('templates_nutrition')
      .update({ 
        is_active: !template.is_active,
        updated_at: new Date().toISOString()
      })
      .eq('id', params.id)
      .select()
      .single()

    if (updateError) {
      console.error('Erro ao alternar status do template:', updateError)
      return NextResponse.json(
        { error: 'Erro ao alternar status', details: updateError.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      template: updated,
      message: `Template ${updated.is_active ? 'ativado' : 'desativado'} com sucesso`
    })
  } catch (error: any) {
    console.error('Erro na API de templates toggle:', error)
    return NextResponse.json(
      { 
        error: 'Erro ao alternar status',
        details: error.message
      },
      { status: 500 }
    )
  }
}

