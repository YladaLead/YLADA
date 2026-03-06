/**
 * GET /api/ylada/biblioteca — lista itens da biblioteca com filtros.
 * Query: tipo?, segmento?, tema?
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Backend não configurado' }, { status: 503 })
    }

    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')?.trim() || ''
    const segmento = searchParams.get('segmento')?.trim() || ''
    const tema = searchParams.get('tema')?.trim() || ''

    let query = supabaseAdmin
      .from('ylada_biblioteca_itens')
      .select('id, tipo, segment_codes, tema, pilar, titulo, description, template_id, flow_id, architecture, meta, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('titulo', { ascending: true })

    if (tipo) {
      query = query.eq('tipo', tipo)
    }
    if (tema) {
      query = query.eq('tema', tema)
    }
    if (segmento) {
      query = query.contains('segment_codes', [segmento])
    }

    const { data, error } = await query

    if (error) {
      console.error('[biblioteca] Erro ao buscar itens:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    return NextResponse.json({ items: data ?? [] })
  } catch (err: unknown) {
    console.error('[biblioteca] Erro:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
