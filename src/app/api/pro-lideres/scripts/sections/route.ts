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
  clipHowToUse,
  clipSectionTitle,
  clipSubtitle,
  resolveYladaLinkIdForOwner,
} from '@/lib/pro-lideres-scripts-api'
import type { LeaderTenantPlScriptSectionRow } from '@/types/leader-tenant'

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder do espaço pode criar situações de script.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  let body: {
    title?: unknown
    subtitle?: unknown
    ylada_link_id?: unknown
    sort_order?: unknown
    visible_to_team?: unknown
    focus_main?: unknown
    intention_key?: unknown
    tool_preset_key?: unknown
    source_template_id?: unknown
    usage_hint?: unknown
    sequence_label?: unknown
    conversation_stage?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const title = clipSectionTitle(body.title)
  if (!title) {
    return NextResponse.json({ error: 'Assunto (título da situação) é obrigatório.' }, { status: 400 })
  }

  const subtitle = clipSubtitle(body.subtitle)
  const ylada = await resolveYladaLinkIdForOwner(supabaseAdmin, body.ylada_link_id, ctx.tenant.owner_user_id)
  if (!ylada.ok) {
    return NextResponse.json({ error: ylada.error }, { status: 400 })
  }

  let sort_order = 0
  if (typeof body.sort_order === 'number' && Number.isFinite(body.sort_order)) {
    sort_order = Math.floor(body.sort_order)
  } else {
    const { data: maxRow } = await supabaseAdmin
      .from('leader_tenant_pl_script_sections')
      .select('sort_order')
      .eq('leader_tenant_id', ctx.tenant.id)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const max = typeof maxRow?.sort_order === 'number' ? maxRow.sort_order : -1
    sort_order = max + 1
  }

  const visible_to_team =
    body.visible_to_team === undefined ? true : Boolean(body.visible_to_team)

  const focus_main = normalizeFocusMain(body.focus_main)
  const intention_key = normalizeIntentionKey(body.intention_key)
  const tool_preset_key = clipToolPresetKey(body.tool_preset_key)
  const usage_hint = clipHowToUse(body.usage_hint ?? null)
  const sequence_label = clipSubtitle(body.sequence_label ?? null)
  const conversation_stage = normalizeConversationStage(body.conversation_stage)

  const { data: inserted, error } = await supabaseAdmin
    .from('leader_tenant_pl_script_sections')
    .insert({
      leader_tenant_id: ctx.tenant.id,
      title,
      subtitle,
      ylada_link_id: ylada.id,
      sort_order,
      visible_to_team,
      focus_main,
      intention_key,
      tool_preset_key,
      usage_hint,
      sequence_label,
      conversation_stage,
      source_template_id: null,
    })
    .select()
    .single()

  if (error) {
    console.error('[pro-lideres/scripts/sections POST]', error)
    return NextResponse.json({ error: 'Erro ao criar situação.' }, { status: 500 })
  }

  return NextResponse.json({ section: inserted as LeaderTenantPlScriptSectionRow })
}
