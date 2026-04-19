import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { PL_SCRIPT_UUID_RE, clipBody, clipEntryTitle, clipHowToUse, clipSubtitle } from '@/lib/pro-lideres-scripts-api'
import type { LeaderTenantPlScriptSectionRow } from '@/types/leader-tenant'

/**
 * POST /api/pro-lideres/script-templates/[id]/use
 * Copia um template YLADA para a biblioteca do líder (secção + entradas).
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  const { id: templateId } = await context.params
  if (!templateId || !PL_SCRIPT_UUID_RE.test(templateId)) {
    return NextResponse.json({ error: 'ID de template inválido' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }
  if (ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode copiar templates.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  let visibleToTeam = true
  try {
    const b = await request.json().catch(() => ({}))
    if (b && typeof b === 'object' && 'visible_to_team' in b) {
      visibleToTeam = Boolean((b as { visible_to_team?: unknown }).visible_to_team)
    }
  } catch {
    /* default */
  }

  const { data: tpl, error: tplErr } = await supabaseAdmin
    .from('pro_lideres_script_templates')
    .select('id, focus_main, intention_key, tool_preset_key, title, subtitle, entries')
    .eq('id', templateId)
    .maybeSingle()

  if (tplErr || !tpl) {
    return NextResponse.json({ error: 'Template não encontrado.' }, { status: 404 })
  }

  const entriesRaw = tpl.entries
  if (!Array.isArray(entriesRaw) || entriesRaw.length < 1) {
    return NextResponse.json({ error: 'Template sem textos.' }, { status: 400 })
  }

  const focus_main = tpl.focus_main === 'recrutamento' ? 'recrutamento' : 'vendas'
  const intention_key = typeof tpl.intention_key === 'string' && tpl.intention_key.trim() ? tpl.intention_key.trim() : 'geral'
  const tool_preset_key =
    tpl.tool_preset_key == null || String(tpl.tool_preset_key).trim() === ''
      ? null
      : String(tpl.tool_preset_key).trim().slice(0, 80)

  const { data: maxRow } = await supabaseAdmin
    .from('leader_tenant_pl_script_sections')
    .select('sort_order')
    .eq('leader_tenant_id', ctx.tenant.id)
    .order('sort_order', { ascending: false })
    .limit(1)
    .maybeSingle()
  const sort_order = (typeof maxRow?.sort_order === 'number' ? maxRow.sort_order : -1) + 1

  const title = String(tpl.title ?? '').trim()
  if (!title) {
    return NextResponse.json({ error: 'Template inválido.' }, { status: 400 })
  }
  const subtitle = tpl.subtitle == null ? null : clipSubtitle(tpl.subtitle)

  const { data: section, error: secErr } = await supabaseAdmin
    .from('leader_tenant_pl_script_sections')
    .insert({
      leader_tenant_id: ctx.tenant.id,
      title,
      subtitle,
      ylada_link_id: null,
      sort_order,
      visible_to_team: visibleToTeam,
      focus_main,
      intention_key,
      tool_preset_key,
      source_template_id: templateId,
    })
    .select()
    .single()

  if (secErr || !section) {
    console.error('[pro-lideres/script-templates/use section]', secErr)
    return NextResponse.json({ error: 'Erro ao criar secção a partir do template.' }, { status: 500 })
  }

  const sectionId = (section as { id: string }).id
  let order = 0
  for (const raw of entriesRaw) {
    if (!raw || typeof raw !== 'object') continue
    const o = raw as Record<string, unknown>
    const et = clipEntryTitle(o.title)
    if (!et) continue
    const { error: entErr } = await supabaseAdmin.from('leader_tenant_pl_script_entries').insert({
      section_id: sectionId,
      title: et,
      subtitle: clipSubtitle(o.subtitle),
      body: clipBody(o.body),
      how_to_use: clipHowToUse(o.how_to_use),
      sort_order: order,
    })
    if (entErr) {
      console.error('[pro-lideres/script-templates/use entry]', entErr)
      await supabaseAdmin.from('leader_tenant_pl_script_sections').delete().eq('id', sectionId)
      return NextResponse.json({ error: 'Erro ao copiar textos do template.' }, { status: 500 })
    }
    order += 1
  }

  if (order < 1) {
    await supabaseAdmin.from('leader_tenant_pl_script_sections').delete().eq('id', sectionId)
    return NextResponse.json({ error: 'Nenhuma entrada válida no template.' }, { status: 400 })
  }

  return NextResponse.json({ section: section as LeaderTenantPlScriptSectionRow })
}
