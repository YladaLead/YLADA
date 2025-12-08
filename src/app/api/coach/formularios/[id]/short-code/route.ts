import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * PATCH - Gerar ou atualizar short_code de um formulário
 */
export async function PATCH(
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
    const body = await request.json()
    const { custom_short_code = null } = body

    // Verificar se o formulário existe e pertence ao usuário
    const { data: existingForm, error: fetchError } = await supabaseAdmin
      .from('custom_forms')
      .select('id, short_code')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (fetchError || !existingForm) {
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404 }
      )
    }

    let shortCode = null

    if (custom_short_code) {
      const customCode = custom_short_code.toLowerCase().trim()
      
      // Validar formato
      if (!/^[a-z0-9-]{3,10}$/.test(customCode)) {
        return NextResponse.json(
          { error: 'Código personalizado inválido. Deve ter entre 3 e 10 caracteres e conter apenas letras, números e hífens.' },
          { status: 400 }
        )
      }

      // Verificar disponibilidade
      const [toolCheck, quizCheck, portalCheck, formCheck] = await Promise.all([
        supabaseAdmin.from('coach_user_templates').select('id').eq('short_code', customCode).limit(1),
        supabaseAdmin.from('quizzes').select('id').eq('short_code', customCode).limit(1),
        supabaseAdmin.from('wellness_portals').select('id').eq('short_code', customCode).limit(1),
        supabaseAdmin.from('custom_forms').select('id').eq('short_code', customCode).neq('id', id).limit(1)
      ])

      if ((toolCheck.data && toolCheck.data.length > 0) ||
          (quizCheck.data && quizCheck.data.length > 0) ||
          (portalCheck.data && portalCheck.data.length > 0) ||
          (formCheck.data && formCheck.data.length > 0)) {
        return NextResponse.json(
          { error: 'Este código personalizado já está em uso' },
          { status: 409 }
        )
      }

      shortCode = customCode
    } else {
      // Gerar código aleatório
      const { data: codeData, error: codeError } = await supabaseAdmin.rpc('generate_unique_short_code')
      if (!codeError && codeData) {
        shortCode = codeData
      } else {
        console.error('Erro ao gerar código curto:', codeError)
        return NextResponse.json(
          { error: 'Erro ao gerar código curto' },
          { status: 500 }
        )
      }
    }

    // Atualizar formulário com short_code
    const { data: updatedForm, error } = await supabaseAdmin
      .from('custom_forms')
      .update({ short_code: shortCode })
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .select('id, short_code, slug')
      .single()

    if (error) {
      console.error('Erro ao atualizar short_code:', error)
      return NextResponse.json(
        { error: 'Erro ao atualizar short_code', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { form: updatedForm }
    })

  } catch (error: any) {
    console.error('Erro ao gerar short_code:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Remover short_code de um formulário
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
      .select('id')
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .single()

    if (fetchError || !existingForm) {
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404 }
      )
    }

    // Remover short_code
    const { data: updatedForm, error } = await supabaseAdmin
      .from('custom_forms')
      .update({ short_code: null })
      .eq('id', id)
      .eq('user_id', authenticatedUserId)
      .select('id, short_code, slug')
      .single()

    if (error) {
      console.error('Erro ao remover short_code:', error)
      return NextResponse.json(
        { error: 'Erro ao remover short_code', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: { form: updatedForm }
    })

  } catch (error: any) {
    console.error('Erro ao remover short_code:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


