import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireApiAuth } from '@/lib/auth/api-auth'

/**
 * GET /api/wellness/treinos
 * Lista todos os treinos (1, 3, 5 minutos)
 * Query params: tipo (1min, 3min, 5min), ativo
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
    const ativo = searchParams.get('ativo') !== 'false'

    let query = supabase
      .from('wellness_treinos')
      .select('*')
      .eq('ativo', ativo)
      .order('tipo', { ascending: true })
      .order('ordem', { ascending: true })

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

    return NextResponse.json({ treinos: data || [] })
  } catch (error) {
    console.error('[Wellness Treinos] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
