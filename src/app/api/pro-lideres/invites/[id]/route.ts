import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

type Ctx = { params: Promise<{ id: string }> }

/**
 * Remove convite do histórico (líder). Não permitido para convites já utilizados (cadastro feito).
 */
export async function DELETE(request: NextRequest, { params }: Ctx) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode remover convites.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  const { id: rawId } = await params
  const id = rawId?.trim()
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }

  const { data: row, error: fetchErr } = await supabaseAdmin
    .from('leader_tenant_invites')
    .select('id, leader_tenant_id, status')
    .eq('id', id)
    .maybeSingle()

  if (fetchErr || !row) {
    return NextResponse.json({ error: 'Convite não encontrado.' }, { status: 404 })
  }

  if ((row.leader_tenant_id as string) !== ctx.tenant.id) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
  }

  if ((row.status as string) === 'used') {
    return NextResponse.json(
      { error: 'Convites já utilizados (cadastro feito) não podem ser removidos do histórico.' },
      { status: 400 }
    )
  }

  const { error: delErr } = await supabaseAdmin.from('leader_tenant_invites').delete().eq('id', id)

  if (delErr) {
    console.error('[pro-lideres/invites DELETE]', delErr)
    return NextResponse.json({ error: 'Não foi possível remover.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
