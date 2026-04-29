import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'

type Ctx = { params: Promise<{ id: string; linkId: string }> }

/** DELETE: remove um share link de um material (admin). */
export async function DELETE(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  const { id: materialId, linkId } = await context.params
  const mid = typeof materialId === 'string' ? materialId.trim() : ''
  const lid = typeof linkId === 'string' ? linkId.trim() : ''
  if (!mid || !lid) {
    return NextResponse.json({ error: 'Parâmetros em falta.' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: mat } = await supabaseAdmin
    .from('pro_lideres_consultancy_materials')
    .select('id, material_kind')
    .eq('id', mid)
    .maybeSingle()

  if (!mat || mat.material_kind !== 'formulario') {
    return NextResponse.json({ error: 'Material não encontrado ou não é formulário.' }, { status: 404 })
  }

  const { data: link } = await supabaseAdmin
    .from('pro_lideres_consultancy_share_links')
    .select('id, material_id')
    .eq('id', lid)
    .maybeSingle()

  if (!link || link.material_id !== mid) {
    return NextResponse.json({ error: 'Link não encontrado neste material.' }, { status: 404 })
  }

  const { error: delErr } = await supabaseAdmin.from('pro_lideres_consultancy_share_links').delete().eq('id', lid)

  if (delErr) {
    console.error('[admin share-links delete]', delErr)
    return NextResponse.json({ error: 'Erro ao eliminar o link.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
