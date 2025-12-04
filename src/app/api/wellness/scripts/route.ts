/**
 * GET /api/wellness/scripts
 * 
 * Busca scripts da biblioteca
 * 
 * Query params:
 * - categoria: filtrar por categoria
 * - estagio: filtrar por estágio
 * - tempo: filtrar por tempo disponível
 * - tags: filtrar por tags
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import type { CategoriaConhecimento, EstagioNegocio, TempoDisponivelDiario } from '@/types/wellness-noel'

export async function GET(request: NextRequest) {
  try {
    // Autenticação
    const authResult = await requireApiAuth(request, ['wellness', 'admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const { searchParams } = new URL(request.url)
    const categoria = searchParams.get('categoria') as CategoriaConhecimento | null
    const estagio = searchParams.get('estagio') as EstagioNegocio | null
    const tempo = searchParams.get('tempo') as TempoDisponivelDiario | null
    const tags = searchParams.get('tags')?.split(',')

    // Construir query
    let query = supabaseAdmin
      .from('ylada_wellness_base_conhecimento')
      .select('*')
      .eq('ativo', true)

    if (categoria) {
      query = query.eq('categoria', categoria)
    }

    if (estagio) {
      query = query.contains('estagio_negocio', [estagio])
    }

    if (tempo) {
      query = query.contains('tempo_disponivel', [tempo])
    }

    if (tags && tags.length > 0) {
      query = query.overlaps('tags', tags)
    }

    const { data, error } = await query
      .order('prioridade', { ascending: false })
      .order('created_at', { ascending: false })

    if (error) {
      console.error('❌ Erro ao buscar scripts:', error)
      return NextResponse.json(
        { error: 'Erro ao buscar scripts', details: error.message },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      scripts: data || [],
      total: data?.length || 0,
    })
  } catch (error: any) {
    console.error('❌ Erro ao buscar scripts:', error)
    return NextResponse.json(
      {
        error: 'Erro ao processar solicitação',
        details: process.env.NODE_ENV === 'development' ? error.message : undefined,
      },
      { status: 500 }
    )
  }
}

