/**
 * GET /api/ylada/biblioteca — lista itens da biblioteca com filtros.
 * Query: tipo?, segmento?, tema?, subscope=estetica_corporal (lista fechada por template_id em `pro-estetica-corporal-biblioteca.ts`)
 *
 * Sem login: só quando `subscope=estetica_corporal` e pré-visualização pública estiver ligada
 * (`PRO_ESTETICA_CORPORAL_PUBLIC_PREVIEW` / dev) — catálogo é leitura pública da BD, sem dado de conta.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { YLADA_API_ALLOWED_PROFILES } from '@/config/ylada-areas'
import {
  SEGMENT_CODES_BIBLIOTECA_ESTETICA_CORPORAL,
  filtrarBibliotecaItensEsteticaCorporal,
} from '@/config/pro-estetica-corporal-biblioteca'
import { proEsteticaCorporalPublicPreviewNoAuthEnabled } from '@/lib/pro-estetica-corporal-server'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const tipo = searchParams.get('tipo')?.trim() || ''
    const segmento = searchParams.get('segmento')?.trim() || ''
    const tema = searchParams.get('tema')?.trim() || ''
    const subscope = searchParams.get('subscope')?.trim() || ''
    const esteticaCorporal = subscope === 'estetica_corporal'
    const allowPublicEsteticaCorporalCatalog =
      esteticaCorporal && proEsteticaCorporalPublicPreviewNoAuthEnabled()

    const auth = await requireApiAuth(request, [...YLADA_API_ALLOWED_PROFILES])
    if (auth instanceof NextResponse) {
      if (!allowPublicEsteticaCorporalCatalog) return auth
    }

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Backend não configurado' }, { status: 503 })
    }

    let query = supabaseAdmin
      .from('ylada_biblioteca_itens')
      .select('id, tipo, segment_codes, tema, pilar, titulo, description, dor_principal, objetivo_principal, template_id, flow_id, architecture, meta, sort_order')
      .eq('active', true)
      .order('sort_order', { ascending: true })
      .order('titulo', { ascending: true })

    if (tipo) {
      query = query.eq('tipo', tipo)
    }
    if (tema) {
      query = query.eq('tema', tema)
    }
    if (esteticaCorporal) {
      query = query.overlaps('segment_codes', [...SEGMENT_CODES_BIBLIOTECA_ESTETICA_CORPORAL])
    } else if (segmento) {
      // Overlap: segment_codes do item intersecta o array. Psicanálise ainda pode reutilizar itens marcados só como psychology até migrar no admin.
      const codes = segmento === 'psychoanalysis' ? ['psychoanalysis', 'psychology'] : [segmento]
      query = query.overlaps('segment_codes', codes)
    }

    const { data, error } = await query

    if (error) {
      console.error('[biblioteca] Erro ao buscar itens:', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    let items = data ?? []
    if (esteticaCorporal) {
      items = filtrarBibliotecaItensEsteticaCorporal(items)
    }
    return NextResponse.json({ items })
  } catch (err: unknown) {
    console.error('[biblioteca] Erro:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
