import { cookies } from 'next/headers'
import { type NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresApiDevHint } from '@/lib/pro-lideres-api-dev-hints'
import { PRO_LIDERES_TEAM_PREVIEW_COOKIE } from '@/lib/pro-lideres-team-preview'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { clipToolPresetKey, normalizeConversationStage } from '@/lib/pro-lideres-script-section-meta'
import type { LeaderTenantPlScriptEntryRow, LeaderTenantPlScriptSectionRow, ProLideresScriptSectionWithEntries } from '@/types/leader-tenant'

const SCRIPT_SECTION_SELECT_325 =
  'id, leader_tenant_id, title, subtitle, ylada_link_id, visible_to_team, sort_order, focus_main, intention_key, tool_preset_key, source_template_id, usage_hint, sequence_label, conversation_stage, created_at, updated_at'

const SCRIPT_SECTION_SELECT_322 =
  'id, leader_tenant_id, title, subtitle, ylada_link_id, visible_to_team, sort_order, focus_main, intention_key, tool_preset_key, source_template_id, created_at, updated_at'

const SCRIPT_SECTION_SELECT_LEGACY =
  'id, leader_tenant_id, title, subtitle, ylada_link_id, visible_to_team, sort_order, created_at, updated_at'

function isMissingColumnOrSchemaError(err: { message?: string; code?: string } | null): boolean {
  if (!err?.message) return false
  const m = err.message.toLowerCase()
  return (
    m.includes('column') ||
    m.includes('does not exist') ||
    m.includes('schema cache') ||
    err.code === '42703'
  )
}

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json(
      { error: 'Servidor sem service role', ...proLideresApiDevHint('noServiceRole') },
      { status: 503 }
    )
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json(
      { error: 'Tenant não encontrado', ...proLideresApiDevHint('noTenant') },
      { status: 404 }
    )
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  const cookieStore = await cookies()
  const leaderTeamPreview =
    ctx.tenant.owner_user_id === user.id && cookieStore.get(PRO_LIDERES_TEAM_PREVIEW_COOKIE)?.value === '1'
  const viewAsTeam = ctx.role === 'member' || leaderTeamPreview

  let { data: sections, error: secErr } = await supabaseAdmin
    .from('leader_tenant_pl_script_sections')
    .select(SCRIPT_SECTION_SELECT_325)
    .eq('leader_tenant_id', ctx.tenant.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (secErr && isMissingColumnOrSchemaError(secErr)) {
    console.warn('[pro-lideres/scripts GET] retry sem colunas 325:', secErr.message)
    const r322 = await supabaseAdmin
      .from('leader_tenant_pl_script_sections')
      .select(SCRIPT_SECTION_SELECT_322)
      .eq('leader_tenant_id', ctx.tenant.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
    sections = r322.data
    secErr = r322.error
  }

  if (secErr && isMissingColumnOrSchemaError(secErr)) {
    console.warn('[pro-lideres/scripts GET] retry legado (migration 322):', secErr.message)
    const r0 = await supabaseAdmin
      .from('leader_tenant_pl_script_sections')
      .select(SCRIPT_SECTION_SELECT_LEGACY)
      .eq('leader_tenant_id', ctx.tenant.id)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })
    sections = r0.data
    secErr = r0.error
  }

  if (secErr) {
    console.error('[pro-lideres/scripts GET sections]', secErr)
    return NextResponse.json({ error: 'Erro ao carregar scripts.' }, { status: 500 })
  }

  let sectionRows = (sections ?? []).map((row) => {
    const s = row as Record<string, unknown>
    const rawTool = s.tool_preset_key
    return {
      ...s,
      focus_main: (s.focus_main === 'recrutamento' ? 'recrutamento' : 'vendas') as 'vendas' | 'recrutamento',
      intention_key: typeof s.intention_key === 'string' && s.intention_key.trim() ? s.intention_key : 'geral',
      tool_preset_key: clipToolPresetKey(rawTool),
      source_template_id:
        s.source_template_id == null || String(s.source_template_id).trim() === ''
          ? null
          : String(s.source_template_id),
      usage_hint:
        typeof s.usage_hint === 'string' && s.usage_hint.trim() ? String(s.usage_hint).trim() : null,
      sequence_label:
        typeof s.sequence_label === 'string' && s.sequence_label.trim() ? String(s.sequence_label).trim() : null,
      conversation_stage: normalizeConversationStage(s.conversation_stage),
    } as LeaderTenantPlScriptSectionRow
  })
  if (viewAsTeam) {
    sectionRows = sectionRows.filter((s) => s.visible_to_team !== false)
  }
  const sectionIds = sectionRows.map((s) => s.id)

  let entryRows: LeaderTenantPlScriptEntryRow[] = []
  if (sectionIds.length > 0) {
    const { data: entries, error: entErr } = await supabaseAdmin
      .from('leader_tenant_pl_script_entries')
      .select('id, section_id, title, subtitle, body, how_to_use, sort_order, created_at, updated_at')
      .in('section_id', sectionIds)
      .order('sort_order', { ascending: true })
      .order('created_at', { ascending: true })

    if (entErr) {
      console.error('[pro-lideres/scripts GET entries]', entErr)
      return NextResponse.json({ error: 'Erro ao carregar scripts.' }, { status: 500 })
    }
    entryRows = (entries ?? []) as LeaderTenantPlScriptEntryRow[]
  }

  const bySection = new Map<string, LeaderTenantPlScriptEntryRow[]>()
  for (const e of entryRows) {
    const list = bySection.get(e.section_id) ?? []
    list.push(e)
    bySection.set(e.section_id, list)
  }

  const out: ProLideresScriptSectionWithEntries[] = sectionRows.map((s) => ({
    ...s,
    entries: bySection.get(s.id) ?? [],
  }))

  return NextResponse.json({
    sections: out,
    canEdit: ctx.tenant.owner_user_id === user.id,
  })
}
