/**
 * GET /api/wellness/biblioteca/materiais
 * 
 * Retorna materiais (PDFs, vídeos, links) para o NOEL e usuários
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
    const tipo = searchParams.get('tipo')
    const tag = searchParams.get('tag')

    // Buscar materiais
    let query = supabaseAdmin
      .from('wellness_materiais')
      .select('*')
      .eq('ativo', true)
      .order('ordem', { ascending: true })
      .order('titulo', { ascending: true })

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    if (tipo) {
      query = query.eq('tipo', tipo)
    }

    if (tag) {
      query = query.contains('tags', [tag])
    }

    const { data: materiais, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar materiais:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar materiais' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      data: materiais || []
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar materiais:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
