import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import {
  PL_SCRIPT_UUID_RE,
  clipBody,
  clipEntryTitle,
  clipHowToUse,
  clipSubtitle,
} from '@/lib/pro-lideres-scripts-api'
import type { LeaderTenantPlScriptEntryRow } from '@/types/leader-tenant'

async function loadEntryForOwnerTenant(
  admin: NonNullable<typeof supabaseAdmin>,
  entryId: string,
  tenantId: string
): Promise<{ section_id: string } | null> {
  const { data: entry, error } = await admin
    .from('leader_tenant_pl_script_entries')
    .select('id, section_id')
    .eq('id', entryId)
    .maybeSingle()

  if (error || !entry) return null

  const { data: section } = await admin
    .from('leader_tenant_pl_script_sections')
    .select('id, leader_tenant_id')
    .eq('id', entry.section_id as string)
    .eq('leader_tenant_id', tenantId)
    .maybeSingle()

  if (!section) return null
  return { section_id: entry.section_id as string }
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  const { id } = await context.params
  if (!id || !PL_SCRIPT_UUID_RE.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder do espaço pode editar scripts.' }, { status: 403 })
  }

  const exists = await loadEntryForOwnerTenant(supabaseAdmin, id, ctx.tenant.id)
  if (!exists) {
    return NextResponse.json({ error: 'Script não encontrado' }, { status: 404 })
  }

  let body: { title?: unknown; subtitle?: unknown; body?: unknown; how_to_use?: unknown; sort_order?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const payload: Record<string, string | number | null> = {}

  if (body.title !== undefined) {
    const t = clipEntryTitle(body.title)
    if (!t) return NextResponse.json({ error: 'Título inválido.' }, { status: 400 })
    payload.title = t
  }
  if (body.subtitle !== undefined) {
    payload.subtitle = clipSubtitle(body.subtitle)
  }
  if (body.body !== undefined) {
    payload.body = clipBody(body.body)
  }
  if (body.how_to_use !== undefined) {
    const h = clipHowToUse(body.how_to_use)
    payload.how_to_use = h
  }
  if (body.sort_order !== undefined && typeof body.sort_order === 'number' && Number.isFinite(body.sort_order)) {
    payload.sort_order = Math.floor(body.sort_order)
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 })
  }

  const { data: updated, error } = await supabaseAdmin
    .from('leader_tenant_pl_script_entries')
    .update(payload)
    .eq('id', id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('[pro-lideres/scripts/entries PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar.' }, { status: 500 })
  }

  if (!updated) {
    return NextResponse.json({ error: 'Script não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ entry: updated as LeaderTenantPlScriptEntryRow })
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  const { id } = await context.params
  if (!id || !PL_SCRIPT_UUID_RE.test(id)) {
    return NextResponse.json({ error: 'ID inválido' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder do espaço pode apagar scripts.' }, { status: 403 })
  }

  const exists = await loadEntryForOwnerTenant(supabaseAdmin, id, ctx.tenant.id)
  if (!exists) {
    return NextResponse.json({ error: 'Script não encontrado' }, { status: 404 })
  }

  const { data: removed, error } = await supabaseAdmin
    .from('leader_tenant_pl_script_entries')
    .delete()
    .eq('id', id)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[pro-lideres/scripts/entries DELETE]', error)
    return NextResponse.json({ error: 'Erro ao apagar.' }, { status: 500 })
  }

  if (!removed) {
    return NextResponse.json({ error: 'Script não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
