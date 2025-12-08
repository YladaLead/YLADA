import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-client'

/**
 * POST /api/admin/wellness/learning-suggestions/[id]/reject
 * Rejeita uma sugestão de aprendizado
 */
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verificar autenticação
    const supabase = createClient()
    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError || !session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Erro de configuração' }, { status: 500 })
    }

    const { id } = params
    const body = await request.json()
    const { reason } = body

    // Marcar como rejeitada
    const { error: updateError } = await supabaseAdmin
      .from('wellness_learning_suggestions')
      .update({
        approved: false,
        approved_at: new Date().toISOString(),
        approved_by: session.user.id,
        rejection_reason: reason || null,
      })
      .eq('id', id)

    if (updateError) {
      console.error('Erro ao rejeitar sugestão:', updateError)
      return NextResponse.json({ error: 'Erro ao rejeitar sugestão' }, { status: 500 })
    }

    return NextResponse.json({
      success: true,
      message: 'Sugestão rejeitada com sucesso',
    })
  } catch (error: any) {
    console.error('Erro ao rejeitar sugestão:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


