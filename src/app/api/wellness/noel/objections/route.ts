// =====================================================
// NOEL WELLNESS SYSTEM - API de Objeções
// =====================================================

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { WellnessObjeção, ObjeçãoFilter } from '@/types/wellness-system'

/**
 * GET /api/wellness/noel/objections
 * 
 * Busca objeções com filtros opcionais
 */
export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const filtros: ObjeçãoFilter = {
      categoria: searchParams.get('categoria') as any || undefined,
      codigo: searchParams.get('codigo') || undefined,
      tags: searchParams.get('tags')?.split(',') || undefined,
      ativo: searchParams.get('ativo') !== 'false'
    }

    let query = supabaseAdmin!
      .from('wellness_objecoes')
      .select('*')

    if (filtros.categoria) {
      query = query.eq('categoria', filtros.categoria)
    }

    if (filtros.codigo) {
      query = query.eq('codigo', filtros.codigo)
    }

    if (filtros.tags && filtros.tags.length > 0) {
      query = query.contains('tags', filtros.tags)
    }

    if (filtros.ativo !== undefined) {
      query = query.eq('ativo', filtros.ativo)
    }

    query = query.order('ordem', { ascending: true })
      .order('codigo', { ascending: true })

    const { data, error } = await query

    if (error) {
      console.error('❌ Erro ao buscar objeções:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar objeções', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      objeções: data || [],
      total: data?.length || 0
    })

  } catch (error: any) {
    console.error('❌ Erro na API de objeções:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}





