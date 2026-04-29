import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID } from '@/lib/pro-lideres-pre-diagnostico'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

type Ctx = { params: Promise<{ id: string }> }

/**
 * DELETE: remove um convite (share link) do pré-diagnóstico do tenant do líder.
 * Respostas já guardadas mantêm-se; o campo share_link_id fica NULL (ON DELETE SET NULL).
 */
export async function DELETE(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  if (paid.ctx.role !== 'leader') {
    return NextResponse.json({ error: 'Apenas o líder pode eliminar convites.' }, { status: 403 })
  }

  const { id: linkId } = await context.params
  const id = typeof linkId === 'string' ? linkId.trim() : ''
  if (!id) {
    return NextResponse.json({ error: 'Identificador em falta.' }, { status: 400 })
  }

  const tenantId = paid.ctx.tenant.id

  const { data: row, error: selErr } = await supabaseAdmin
    .from('pro_lideres_consultancy_share_links')
    .select('id, material_id, leader_tenant_id')
    .eq('id', id)
    .maybeSingle()

  if (selErr || !row) {
    return NextResponse.json({ error: 'Link não encontrado.' }, { status: 404 })
  }

  if (row.material_id !== PRO_LIDERES_PRE_DIAGNOSTICO_MATERIAL_ID) {
    return NextResponse.json({ error: 'Este convite não pertence ao pré-diagnóstico.' }, { status: 403 })
  }

  if (row.leader_tenant_id !== tenantId) {
    return NextResponse.json({ error: 'Não pode eliminar convites de outro espaço.' }, { status: 403 })
  }

  const { error: delErr } = await supabaseAdmin.from('pro_lideres_consultancy_share_links').delete().eq('id', id)

  if (delErr) {
    console.error('[pre-diagnostico/share-link] delete', delErr)
    return NextResponse.json({ error: 'Não foi possível eliminar o convite.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
