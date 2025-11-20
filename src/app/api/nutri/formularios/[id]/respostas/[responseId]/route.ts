import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET - Buscar resposta individual
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; responseId: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
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

    const { id: formId, responseId } = await params
    const authenticatedUserId = user.id

    // Verificar se o formulário existe e pertence ao usuário
    const { data: form, error: formError } = await supabaseAdmin
      .from('custom_forms')
      .select('id, name, structure, user_id')
      .eq('id', formId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (formError || !form) {
      return NextResponse.json(
        { error: 'Formulário não encontrado' },
        { status: 404 }
      )
    }

    // Buscar resposta
    const { data: response, error } = await supabaseAdmin
      .from('form_responses')
      .select(`
        id,
        form_id,
        client_id,
        responses,
        completed_at,
        created_at,
        ip_address,
        user_agent,
        clients (
          id,
          name,
          email,
          phone
        )
      `)
      .eq('id', responseId)
      .eq('form_id', formId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (error || !response) {
      return NextResponse.json(
        { error: 'Resposta não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      success: true,
      data: {
        response,
        form: {
          id: form.id,
          name: form.name,
          structure: form.structure
        }
      }
    })

  } catch (error: any) {
    console.error('Erro ao buscar resposta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

/**
 * DELETE - Deletar resposta
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string; responseId: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['nutri', 'admin'])
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

    const { id: formId, responseId } = await params
    const authenticatedUserId = user.id

    // Verificar se a resposta existe e pertence ao usuário
    const { data: existingResponse, error: fetchError } = await supabaseAdmin
      .from('form_responses')
      .select('id, form_id, user_id')
      .eq('id', responseId)
      .eq('form_id', formId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (fetchError || !existingResponse) {
      return NextResponse.json(
        { error: 'Resposta não encontrada' },
        { status: 404 }
      )
    }

    // Deletar resposta
    const { error } = await supabaseAdmin
      .from('form_responses')
      .delete()
      .eq('id', responseId)
      .eq('user_id', authenticatedUserId)

    if (error) {
      console.error('Erro ao deletar resposta:', error)
      return NextResponse.json(
        { error: 'Erro ao deletar resposta', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Resposta deletada com sucesso'
    })

  } catch (error: any) {
    console.error('Erro ao deletar resposta:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}

