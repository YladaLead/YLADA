import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveEsteticaCorporalTenantContext } from '@/lib/pro-estetica-corporal-server'
import {
  isProLideresFlowHrefAllowed,
  PRO_LIDERES_FLOW_HREF_MAX,
  PRO_LIDERES_FLOW_LABEL_MAX,
  PRO_LIDERES_FLOW_NOTES_MAX,
} from '@/lib/pro-lideres-flow-href'
import { inferProLideresFlowCatalogKindFromHref } from '@/lib/pro-lideres-flow-catalog-kind'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  const { id } = await context.params
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'ID inválido.' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o profissional pode editar fluxos personalizados.' }, { status: 403 })
  }

  let body: {
    category?: string
    label?: string
    href?: string
    sort_order?: number
    notes?: string
    visible_to_team?: boolean
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const patch: Record<string, string | number | boolean> = {}
  if (body.category !== undefined) {
    patch.category = body.category === 'recruitment' ? 'recruitment' : 'sales'
  }
  if (body.label !== undefined) {
    const label = String(body.label).trim().slice(0, PRO_LIDERES_FLOW_LABEL_MAX)
    if (!label) {
      return NextResponse.json({ error: 'label não pode ser vazio' }, { status: 400 })
    }
    patch.label = label
  }
  if (body.href !== undefined) {
    const href = String(body.href).trim().slice(0, PRO_LIDERES_FLOW_HREF_MAX)
    if (!isProLideresFlowHrefAllowed(href)) {
      return NextResponse.json({ error: 'href inválido (use caminho /... ou https://)' }, { status: 400 })
    }
    patch.href = href
  }
  if (body.sort_order !== undefined) {
    const so = body.sort_order
    if (typeof so !== 'number' || !Number.isFinite(so)) {
      return NextResponse.json({ error: 'sort_order inválido' }, { status: 400 })
    }
    patch.sort_order = so
  }
  if (body.notes !== undefined) {
    patch.notes = String(body.notes).trim().slice(0, PRO_LIDERES_FLOW_NOTES_MAX)
  }
  if (body.visible_to_team !== undefined) {
    patch.visible_to_team = Boolean(body.visible_to_team)
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 })
  }

  const { data: existingRow, error: fetchErr } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .select('href')
    .eq('id', id)
    .eq('leader_tenant_id', ctx.tenant.id)
    .maybeSingle()

  if (fetchErr) {
    console.error('[pro-estetica-corporal/flows PATCH] fetch entry', fetchErr)
    return NextResponse.json({ error: 'Erro ao validar entrada' }, { status: 500 })
  }
  if (!existingRow) {
    return NextResponse.json({ error: 'Entrada não encontrada' }, { status: 404 })
  }

  const mergedHref =
    patch.href !== undefined ? String(patch.href) : String((existingRow as { href: string }).href ?? '').trim()
  patch.catalog_kind = inferProLideresFlowCatalogKindFromHref(mergedHref)

  const { data: updated, error } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .update(patch)
    .eq('id', id)
    .eq('leader_tenant_id', ctx.tenant.id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('[pro-estetica-corporal/flows PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar' }, { status: 500 })
  }

  if (!updated) {
    return NextResponse.json({ error: 'Entrada não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ entry: updated })
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  const { id } = await context.params
  if (!id || !UUID_RE.test(id)) {
    return NextResponse.json({ error: 'Só é possível apagar fluxos personalizados (UUID).' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o profissional pode remover fluxos personalizados.' }, { status: 403 })
  }

  const { data: removed, error } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .delete()
    .eq('id', id)
    .eq('leader_tenant_id', ctx.tenant.id)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[pro-estetica-corporal/flows DELETE]', error)
    return NextResponse.json({ error: 'Erro ao apagar' }, { status: 500 })
  }

  if (!removed) {
    return NextResponse.json({ error: 'Entrada não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
