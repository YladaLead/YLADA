import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  fetchTabulatorsForTenant,
  normalizeTabulatorLabelInput,
  type LeaderTenantTabulatorRow,
} from '@/lib/pro-lideres-tabulators'

type RouteParams = { params: Promise<{ id: string }> }

type TabulatorRowPick = { id: string; leader_tenant_id: string; label: string }

async function loadLeaderTabulatorRow(
  request: NextRequest,
  rowId: string
): Promise<{ ctx: NonNullable<Awaited<ReturnType<typeof resolveProLideresTenantContext>>>; row: TabulatorRowPick } | NextResponse> {
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

  return { ctx, row: row as TabulatorRowPick }
}

/** Renomeia tabulador e alinha o nome gravado nos membros da equipe (mesmo critério que o DELETE). */
export async function PATCH(request: NextRequest, { params }: RouteParams) {
  const { id: rowId } = await params
  const gate = await loadLeaderTabulatorRow(request, rowId)
  if (gate instanceof NextResponse) return gate
  const { ctx, row } = gate

  let body: { label?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const newLabel = normalizeTabulatorLabelInput(body.label ?? '')
  if (newLabel.length < 1) {
    return NextResponse.json({ error: 'Indique o nome do tabulador.' }, { status: 400 })
  }

  const oldLabel = String(row.label ?? '').trim()
  const oldLower = oldLabel.toLowerCase()
  if (oldLower === newLabel.toLowerCase()) {
    const { data: fresh } = await supabaseAdmin!
      .from('leader_tenant_tabulators')
      .select('id, leader_tenant_id, label, sort_order, created_at')
      .eq('id', row.id)
      .maybeSingle()
    return NextResponse.json({ item: (fresh ?? row) as LeaderTenantTabulatorRow })
  }

  const allTabs = await fetchTabulatorsForTenant(supabaseAdmin!, ctx.tenant.id)
  const duplicate = allTabs.some((t) => t.id !== row.id && t.label.trim().toLowerCase() === newLabel.toLowerCase())
  if (duplicate) {
    return NextResponse.json({ error: 'Já existe um tabulador com este nome.' }, { status: 409 })
  }

  const { data: memRows } = await supabaseAdmin!
    .from('leader_tenant_members')
    .select('id, pro_lideres_tabulator_name')
    .eq('leader_tenant_id', ctx.tenant.id)
    .eq('role', 'member')

  const memberIdsToRename = (memRows ?? [])
    .filter((m) => {
      const v = typeof m.pro_lideres_tabulator_name === 'string' ? m.pro_lideres_tabulator_name.trim() : ''
      return v.length > 0 && v.toLowerCase() === oldLower
    })
    .map((m) => m.id as string)

  const { error: updTabErr } = await supabaseAdmin!
    .from('leader_tenant_tabulators')
    .update({ label: newLabel })
    .eq('id', row.id)

  if (updTabErr) {
    if (updTabErr.code === '23505') {
      return NextResponse.json({ error: 'Já existe um tabulador com este nome.' }, { status: 409 })
    }
    console.error('[pro-lideres/tabuladores PATCH]', updTabErr)
    return NextResponse.json({ error: 'Não foi possível renomear.' }, { status: 500 })
  }

  if (memberIdsToRename.length > 0) {
    const { error: memErr } = await supabaseAdmin!
      .from('leader_tenant_members')
      .update({ pro_lideres_tabulator_name: newLabel })
      .in('id', memberIdsToRename)

    if (memErr) {
      console.error('[pro-lideres/tabuladores PATCH members]', memErr)
      await supabaseAdmin!.from('leader_tenant_tabulators').update({ label: oldLabel }).eq('id', row.id)
      return NextResponse.json({ error: 'Não foi possível atualizar a equipe; o nome foi revertido.' }, { status: 500 })
    }
  }

  const { data: updated } = await supabaseAdmin!
    .from('leader_tenant_tabulators')
    .select('id, leader_tenant_id, label, sort_order, created_at')
    .eq('id', row.id)
    .maybeSingle()

  return NextResponse.json({ item: updated as LeaderTenantTabulatorRow })
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  const { id: rowId } = await params
  const gate = await loadLeaderTabulatorRow(request, rowId)
  if (gate instanceof NextResponse) return gate
  const { ctx, row } = gate

  const id = row.id
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
