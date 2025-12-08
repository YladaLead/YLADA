/**
 * GET /api/wellness/biblioteca/fluxos
 * 
 * Retorna todos os fluxos disponíveis para o NOEL e usuários
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
    const ativo = searchParams.get('ativo') !== 'false'

    // Buscar fluxos
    let query = supabaseAdmin
      .from('wellness_fluxos')
      .select('*')
      .order('ordem', { ascending: true })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    if (ativo) {
      query = query.eq('ativo', true)
    }

    const { data: fluxos, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar fluxos:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar fluxos' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: fluxos || []
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar fluxos:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
