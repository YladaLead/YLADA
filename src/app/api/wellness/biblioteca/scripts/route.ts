/**
 * GET /api/wellness/biblioteca/scripts
 * 
 * Retorna scripts oficiais para o NOEL e usuários
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const tag = searchParams.get('tag')
    const busca = searchParams.get('busca')

    // Buscar scripts
    let query = supabaseAdmin
      .from('wellness_scripts')
      .select('*')
      .eq('ativo', true)
      .order('uso_frequente', { ascending: false })
      .order('titulo', { ascending: true })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    if (busca) {
      query = query.or(`titulo.ilike.%${busca}%,descricao.ilike.%${busca}%,texto.ilike.%${busca}%`)
    }

    const { data: scripts, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar scripts:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar scripts' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: scripts || []
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar scripts:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
