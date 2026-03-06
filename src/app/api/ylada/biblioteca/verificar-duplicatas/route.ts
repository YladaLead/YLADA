/**
 * GET /api/ylada/biblioteca/verificar-duplicatas
 * Verifica se há itens duplicados em ylada_biblioteca_itens.
 * Duplicata = mesmo titulo + tipo + template_id (ou titulo + tipo se template_id null).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

export async function GET(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['ylada', 'admin'])
    if (auth instanceof NextResponse) return auth

    if (!supabaseAdmin) {
      return NextResponse.json({ error: 'Backend não configurado' }, { status: 503 })
    }

    const { data: itens, error } = await supabaseAdmin
      .from('ylada_biblioteca_itens')
      .select('id, titulo, tipo, template_id, sort_order, created_at')
      .eq('active', true)
      .order('titulo')

    if (error) {
      console.error('[biblioteca/verificar-duplicatas]', error)
      return NextResponse.json({ error: error.message }, { status: 500 })
    }

    const byKey = new Map<string, typeof itens>()
    const duplicatas: Array<{ chave: string; itens: typeof itens; count: number }> = []

    for (const item of itens ?? []) {
      const chave = `${item.titulo}|${item.tipo}|${item.template_id ?? 'null'}`
      if (!byKey.has(chave)) {
        byKey.set(chave, [])
      }
      byKey.get(chave)!.push(item)
    }

    for (const [chave, lista] of byKey) {
      if (lista.length > 1) {
        duplicatas.push({ chave, itens: lista, count: lista.length })
      }
    }

    return NextResponse.json({
      total_itens: itens?.length ?? 0,
      duplicatas: duplicatas.length,
      detalhes: duplicatas.map((d) => ({
        chave: d.chave,
        count: d.count,
        ids: d.itens.map((i) => i.id),
        titulos: d.itens.map((i) => i.titulo),
      })),
    })
  } catch (err: unknown) {
    console.error('[biblioteca/verificar-duplicatas]', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro interno' },
      { status: 500 }
    )
  }
}
