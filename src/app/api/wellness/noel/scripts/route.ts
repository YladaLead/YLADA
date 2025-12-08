// =====================================================
// NOEL WELLNESS SYSTEM - API de Scripts
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { WellnessScript, ScriptFilter } from '@/types/wellness-system'

/**
 * GET /api/wellness/noel/scripts
 * 
 * Busca scripts com filtros opcionais
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const filtros: ScriptFilter = {
      categoria: searchParams.get('categoria') as any || undefined,
      subcategoria: searchParams.get('subcategoria') || undefined,
      versao: searchParams.get('versao') as any || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      ativo: searchParams.get('ativo') !== 'false'
    }

    let query = supabaseAdmin!
      .from('wellness_scripts')
      .select('*')

    if (filtros.categoria) {
      query = query.eq('categoria', filtros.categoria)
    }

    if (filtros.subcategoria) {
      query = query.eq('subcategoria', filtros.subcategoria)
    }

    if (filtros.versao) {
      query = query.eq('versao', filtros.versao)
    }

    if (filtros.tags && filtros.tags.length > 0) {
      query = query.contains('tags', filtros.tags)
    }

    if (filtros.ativo !== undefined) {
      query = query.eq('ativo', filtros.ativo)
    }

    query = query.order('ordem', { ascending: true })
      .order('nome', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar scripts:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar scripts', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      scripts: data || [],
      total: data?.length || 0
    })

  } catch (error: any) {
    console.error('❌ Erro na API de scripts:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}





