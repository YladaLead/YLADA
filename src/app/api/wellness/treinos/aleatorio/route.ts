import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireApiAuth } from '@/lib/auth/api-auth'

/**
 * GET /api/wellness/treinos/aleatorio
 * Retorna um treino aleatório do tipo especificado
 * Query params: tipo (1min, 3min, 5min) - opcional
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')

    let query = supabase
      .from('wellness_treinos')
      .select('*')
      .eq('ativo', true)

    if (tipo) {
      query = query.eq('tipo', tipo)
    }

    const { data, error } = await query

    if (error) {
      console.error('[Wellness Treinos] Erro ao buscar treinos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar treinos' },
        { status: 500 }
      )
    }

    if (!data || data.length === 0) {
      return NextResponse.json(
        { error: 'Nenhum treino encontrado' },
        { status: 404 }
      )
    }

    // Seleciona um treino aleatório
    const randomIndex = Math.floor(Math.random() * data.length)
    const treinoAleatorio = data[randomIndex]

    return NextResponse.json({ treino: treinoAleatorio })
  } catch (error) {
    console.error('[Wellness Treinos] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
