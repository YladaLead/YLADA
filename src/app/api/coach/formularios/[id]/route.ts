import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar formulário específico
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id } = await params
    const authenticatedUserId = user.id

    const { data: form, error } = await supabaseAdmin
      .from('custom_forms')
      .select('*')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (error || !form) {
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { form }
    })

  } catch (error: any) {
    console.error('Erro ao buscar formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * PUT - Atualizar formulário
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id } = await params
    const authenticatedUserId = user.id

    // Verificar se o formulário existe e pertence ao usuário
    const { data: existingForm, error: fetchError } = await supabaseAdmin
      .from('custom_forms')
      .select('id, name')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (fetchError || !existingForm) {
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404 }
      )
    }

    const body = await request.json()
    const {
      name,
      description,
      form_type,
      structure,
      is_active,
      is_template
    } = body

    // Preparar dados para atualização
    const updateData: any = {}

    if (name !== undefined) updateData.name = name.trim()
    if (description !== undefined) updateData.description = description || null
    if (form_type !== undefined) {
      const validTypes = ['questionario', 'anamnese', 'avaliacao', 'consentimento', 'outro']
      if (!validTypes.includes(form_type)) {
        return NextResponse.json(
          { error: `Tipo de formulário inválido. Use um dos seguintes: ${validTypes.join(', ')}` },
          { status: 400 }
        )
      }
      updateData.form_type = form_type
    }
    if (structure !== undefined) updateData.structure = structure
    if (is_active !== undefined) updateData.is_active = is_active
    if (is_template !== undefined) updateData.is_template = is_template
    updateData.updated_at = new Date().toISOString()

    // Atualizar formulário
    const { data: updatedForm, error } = await supabaseAdmin
      .from('custom_forms')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .select()
      .single()

    if (error) {
      console.error('Erro ao atualizar formulário:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar formulário', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { form: updatedForm }
    })

  } catch (error: any) {
    console.error('Erro ao atualizar formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Deletar formulário
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['coach', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }
    const { user } = authResult

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta. Contate o suporte.' },
        { status: 500 }
      )
    }

    const { id } = await params
    const authenticatedUserId = user.id

    // Verificar se o formulário existe e pertence ao usuário
    const { data: existingForm, error: fetchError } = await supabaseAdmin
      .from('custom_forms')
      .select('id, name')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (fetchError || !existingForm) {
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404 }
      )
    }

    // Deletar formulário
    const { error } = await supabaseAdmin
      .from('custom_forms')
      .delete()
      .eq('id', id)
      .eq('user_id', authenticatedUserId)

    if (error) {
      console.error('Erro ao deletar formulário:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar formulário', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Formulário deletado com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar formulário:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

