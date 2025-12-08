import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { requireApiAuth } from '@/lib/auth/api-auth'

/**
 * GET /api/wellness/links
 * Lista todos os Links Wellness oficiais
 * Query params: categoria, objetivo, ativo
 */
export async function GET(request: NextRequest) {
  try {
    const user = await requireApiAuth(request)
    if (!user) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const supabase = await createClient()
    const { searchParams } = new URL(request.url)
    
    const categoria = searchParams.get('categoria')
    const objetivo = searchParams.get('objetivo')
    const ativo = searchParams.get('ativo') !== 'false'

    let query = supabase
      .from('wellness_links')
      .select('*')
      .eq('ativo', ativo)
      .order('ordem', { ascending: true })
      .order('nome', { ascending: true })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    if (objetivo) {
      query = query.eq('objetivo', objetivo)
    }

    const { data, error } = await query

    if (error) {
      console.error('[Wellness Links] Erro ao buscar links:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar links wellness' },
        { status: 500 }
      )
    }

    return NextResponse.json({ links: data || [] })
  } catch (error) {
    console.error('[Wellness Links] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
