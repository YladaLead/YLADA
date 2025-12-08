import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/wellness/treinos/[codigo]
 * Busca um treino específico pelo código
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { codigo: string } }
) {
  try {
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { codigo } = params

    const { data, error } = await supabaseAdmin
      .from('wellness_treinos')
      .select('*')
      .eq('codigo', codigo)
      .eq('ativo', true)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        return NextResponse.json(
          { error: 'Treino não encontrado' },
          { status: 404 }
        )
      }
      console.error('[Wellness Treinos] Erro ao buscar treino:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar treino' },
        { status: 500 }
      )
    }

    return NextResponse.json({ treino: data })
  } catch (error) {
    console.error('[Wellness Treinos] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
