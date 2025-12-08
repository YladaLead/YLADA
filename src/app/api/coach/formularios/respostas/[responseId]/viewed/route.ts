import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * PATCH - Marcar resposta como visualizada
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ responseId: string }> }
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

    const { responseId } = await params
    const authenticatedUserId = user.id

    // Verificar se a resposta existe e pertence ao coach
    const { data: resposta, error: respostaError } = await supabaseAdmin
      .from('form_responses')
      .select('id, user_id')
      .eq('id', responseId)
      .eq('user_id', authenticatedUserId)
      .single()

    if (respostaError || !resposta) {
      return NextResponse.json(
        { error: 'Resposta não encontrada' },
        { status: 404 }
      )
    }

    // Marcar como visualizada
    const { error: updateError } = await supabaseAdmin
      .from('form_responses')
      .update({ viewed: true })
      .eq('id', responseId)
      .eq('user_id', authenticatedUserId)

    if (updateError) {
      console.error('Erro ao marcar resposta como visualizada:', updateError)
      return NextResponse.json(
        { error: 'Erro ao atualizar resposta', technical: process.env.NODE_ENV === 'development' ? updateError.message : undefined },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Resposta marcada como visualizada'
    })

  } catch (error: any) {
    console.error('Erro ao marcar resposta como visualizada:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor', technical: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


