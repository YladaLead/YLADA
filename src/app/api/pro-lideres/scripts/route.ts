import { type NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresApiDevHint } from '@/lib/pro-lideres-api-dev-hints'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import type { LeaderTenantPlScriptEntryRow, LeaderTenantPlScriptSectionRow, ProLideresScriptSectionWithEntries } from '@/types/leader-tenant'

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

  const { data: sections, error: secErr } = await supabaseAdmin
    .from('leader_tenant_pl_script_sections')
    .select('id, leader_tenant_id, title, subtitle, ylada_link_id, sort_order, created_at, updated_at')
    .eq('leader_tenant_id', ctx.tenant.id)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (secErr) {
    console.error('[pro-lideres/scripts GET sections]', secErr)
    return NextResponse.json({ error: 'Erro ao carregar scripts.' }, { status: 500 })
  }

  const sectionRows = (sections ?? []) as LeaderTenantPlScriptSectionRow[]
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
