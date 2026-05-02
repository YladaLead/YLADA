import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

type RouteParams = { params: Promise<{ id: string }> }

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode gerir tabuladores.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  const { id: rowId } = await params
  const id = rowId?.trim()
  if (!id) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }

  const { data: row, error: fetchErr } = await supabaseAdmin
    .from('leader_tenant_tabulators')
    .select('id, leader_tenant_id, label')
    .eq('id', id)
    .maybeSingle()

  if (fetchErr || !row) {
    return NextResponse.json({ error: 'Tabulador não encontrado.' }, { status: 404 })
  }

  if ((row.leader_tenant_id as string) !== ctx.tenant.id) {
    return NextResponse.json({ error: 'Não autorizado.' }, { status: 403 })
  }

  const label = String(row.label ?? '').trim()
  const labelLower = label.toLowerCase()

  const { data: memRows } = await supabaseAdmin
    .from('leader_tenant_members')
    .select('id, pro_lideres_tabulator_name')
    .eq('leader_tenant_id', ctx.tenant.id)
    .eq('role', 'member')

  const inUse = (memRows ?? []).some((m) => {
    const v = typeof m.pro_lideres_tabulator_name === 'string' ? m.pro_lideres_tabulator_name.trim() : ''
    return v.length > 0 && v.toLowerCase() === labelLower
  })

  if (inUse) {
    return NextResponse.json(
      { error: 'Não é possível remover: há membros da equipe com este tabulador.' },
      { status: 409 }
    )
  }

  const { error: delErr } = await supabaseAdmin.from('leader_tenant_tabulators').delete().eq('id', id)

  if (delErr) {
    console.error('[pro-lideres/tabuladores DELETE]', delErr)
    return NextResponse.json({ error: 'Não foi possível remover.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
