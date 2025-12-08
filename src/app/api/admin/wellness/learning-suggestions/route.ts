import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { createClient } from '@/lib/supabase-client'

/**
 * GET /api/admin/wellness/learning-suggestions
 * Lista sugestões de aprendizado do NOEL
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar autenticação
    const supabase = createClient()
    const { data: { session }, error: authError } = await supabase.auth.getSession()

    if (authError || !session) {
      return NextResponse.json({ error: 'Não autenticado' }, { status: 401 })
    }

    // Verificar se é admin (futuro: verificar role específica)
    // Por enquanto, qualquer usuário autenticado pode acessar (ajustar depois)

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Erro de configuração' }, { status: 500 })
    }

    // Buscar parâmetros da query
    const searchParams = request.nextUrl.searchParams
    const status = searchParams.get('status') || 'pending' // 'pending' | 'approved' | 'rejected'
    const minFrequency = parseInt(searchParams.get('min_frequency') || '3')
    const limit = parseInt(searchParams.get('limit') || '50')
    const offset = parseInt(searchParams.get('offset') || '0')

    // Construir query
    let query = supabaseAdmin
      .from('wellness_learning_suggestions')
      .select('*')
      .gte('frequency', minFrequency)
      .order('frequency', { ascending: false })
      .order('last_seen_at', { ascending: false })
      .range(offset, offset + limit - 1)

    // Filtrar por status
    if (status === 'pending') {
      query = query.is('approved', null)
    } else if (status === 'approved') {
      query = query.eq('approved', true)
    } else if (status === 'rejected') {
      query = query.eq('approved', false)
    }

    const { data: suggestions, error } = await query

    if (error) {
      console.error('Erro ao buscar sugestões:', error)
      return NextResponse.json({ error: 'Erro ao buscar sugestões' }, { status: 500 })
    }

    // Buscar total para paginação
    let countQuery = supabaseAdmin
      .from('wellness_learning_suggestions')
      .select('*', { count: 'exact', head: true })
      .gte('frequency', minFrequency)

    if (status === 'pending') {
      countQuery = countQuery.is('approved', null)
    } else if (status === 'approved') {
      countQuery = countQuery.eq('approved', true)
    } else if (status === 'rejected') {
      countQuery = countQuery.eq('approved', false)
    }

    const { count } = await countQuery

    return NextResponse.json({
      success: true,
      suggestions: suggestions || [],
      pagination: {
        total: count || 0,
        limit,
        offset,
        hasMore: (count || 0) > offset + limit,
      },
    })
  } catch (error: any) {
    console.error('Erro ao listar sugestões:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: process.env.NODE_ENV === 'development' ? error.message : undefined },
      { status: 500 }
    )
  }
}


