import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  clipToolPresetKey,
  normalizeConversationStage,
  normalizeFocusMain,
  normalizeIntentionKey,
} from '@/lib/pro-lideres-script-section-meta'
import {
  PL_SCRIPT_UUID_RE,
  clipHowToUse,
  clipSectionTitle,
  clipSubtitle,
  resolveYladaLinkIdForOwner,
} from '@/lib/pro-lideres-scripts-api'
import type { LeaderTenantPlScriptSectionRow } from '@/types/leader-tenant'

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
    return NextResponse.json({ error: 'Apenas o líder do espaço pode editar situações.' }, { status: 403 })
  }

  const paidPatch = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paidPatch.ok) return paidPatch.response

  let body: {
    title?: unknown
    subtitle?: unknown
    ylada_link_id?: unknown
    sort_order?: unknown
    visible_to_team?: unknown
    focus_main?: unknown
    intention_key?: unknown
    tool_preset_key?: unknown
    usage_hint?: unknown
    sequence_label?: unknown
    conversation_stage?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const payload: Record<string, string | number | boolean | null> = {}

  if (body.title !== undefined) {
    const t = clipSectionTitle(body.title)
    if (!t) return NextResponse.json({ error: 'Título inválido.' }, { status: 400 })
    payload.title = t
  }
  if (body.subtitle !== undefined) {
    payload.subtitle = clipSubtitle(body.subtitle)
  }
  if (body.ylada_link_id !== undefined) {
    const ylada = await resolveYladaLinkIdForOwner(supabaseAdmin, body.ylada_link_id, ctx.tenant.owner_user_id)
    if (!ylada.ok) {
      return NextResponse.json({ error: ylada.error }, { status: 400 })
    }
    payload.ylada_link_id = ylada.id
  }
  if (body.sort_order !== undefined && typeof body.sort_order === 'number' && Number.isFinite(body.sort_order)) {
    payload.sort_order = Math.floor(body.sort_order)
  }
  if (body.visible_to_team !== undefined) {
    payload.visible_to_team = Boolean(body.visible_to_team)
  }
  if (body.focus_main !== undefined) {
    payload.focus_main = normalizeFocusMain(body.focus_main)
  }
  if (body.intention_key !== undefined) {
    payload.intention_key = normalizeIntentionKey(body.intention_key)
  }
  if (body.tool_preset_key !== undefined) {
    payload.tool_preset_key = clipToolPresetKey(body.tool_preset_key)
  }
  if (body.usage_hint !== undefined) {
    payload.usage_hint = clipHowToUse(body.usage_hint)
  }
  if (body.sequence_label !== undefined) {
    payload.sequence_label = clipSubtitle(body.sequence_label)
  }
  if (body.conversation_stage !== undefined) {
    payload.conversation_stage = normalizeConversationStage(body.conversation_stage)
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar' }, { status: 400 })
  }

  const { data: updated, error } = await supabaseAdmin
    .from('leader_tenant_pl_script_sections')
    .update(payload)
    .eq('id', id)
    .eq('leader_tenant_id', ctx.tenant.id)
    .select()
    .maybeSingle()

  if (error) {
    console.error('[pro-lideres/scripts/sections PATCH]', error)
    return NextResponse.json({ error: 'Erro ao atualizar.' }, { status: 500 })
  }

  if (!updated) {
    return NextResponse.json({ error: 'Situação não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ section: updated as LeaderTenantPlScriptSectionRow })
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
    return NextResponse.json({ error: 'Apenas o líder do espaço pode apagar situações.' }, { status: 403 })
  }

  const paidDel = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paidDel.ok) return paidDel.response

  const { data: removed, error } = await supabaseAdmin
    .from('leader_tenant_pl_script_sections')
    .delete()
    .eq('id', id)
    .eq('leader_tenant_id', ctx.tenant.id)
    .select('id')
    .maybeSingle()

  if (error) {
    console.error('[pro-lideres/scripts/sections DELETE]', error)
    return NextResponse.json({ error: 'Erro ao apagar.' }, { status: 500 })
  }

  if (!removed) {
    return NextResponse.json({ error: 'Situação não encontrada' }, { status: 404 })
  }

  return NextResponse.json({ ok: true })
}
