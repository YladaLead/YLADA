import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * GET /api/wellness/produtos
 * Lista todos os produtos disponíveis
 */
export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['wellness'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria')
    const tipo = searchParams.get('tipo')

    let query = supabaseAdmin
      .from('wellness_produtos')
      .select('*')
      .eq('ativo', true)
      .order('categoria', { ascending: true })
      .order('nome', { ascending: true })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }
    if (tipo) {
      query = query.eq('tipo', tipo)
    }

    const { data: produtos, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar produtos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar produtos', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      produtos: produtos || []
    })
  } catch (error: any) {
    console.error('❌ Erro no GET /api/wellness/produtos:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}

