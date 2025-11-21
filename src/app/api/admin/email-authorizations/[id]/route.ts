import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * DELETE - Cancelar autorização
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { id } = await params

    if (!supabaseAdmin) {
      return NextResponse.json(
        { error: 'Configuração do servidor incompleta' },
        { status: 500 }
      )
    }

    // Verificar se existe e está pendente
    const { data: auth } = await supabaseAdmin
      .from('email_authorizations')
      .select('id, status')
      .eq('id', id)
      .single()

    if (!auth) {
      return NextResponse.json(
        { error: 'Autorização não encontrada' },
        { status: 404 }
      )
    }

    if (auth.status === 'activated') {
      return NextResponse.json(
        { error: 'Não é possível cancelar uma autorização já ativada' },
        { status: 400 }
      )
    }

    // Cancelar
    const { error } = await supabaseAdmin
      .from('email_authorizations')
      .update({ status: 'cancelled' })
      .eq('id', id)

    if (error) {
      console.error('Erro ao cancelar autorização:', error)
      return NextResponse.json(
        { error: 'Erro ao cancelar autorização', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Autorização cancelada com sucesso'
    })
  } catch (error: any) {
    console.error('Erro ao cancelar autorização:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao cancelar autorização' },
      { status: 500 }
    )
  }
}

