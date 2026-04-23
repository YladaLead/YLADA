import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  PL_SCRIPT_UUID_RE,
  clipBody,
  clipEntryTitle,
  clipHowToUse,
  clipSubtitle,
} from '@/lib/pro-lideres-scripts-api'
import type { LeaderTenantPlScriptEntryRow } from '@/types/leader-tenant'

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
    return NextResponse.json({ error: 'Apenas o líder do espaço pode criar scripts.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  let body: {
    section_id?: unknown
    title?: unknown
    subtitle?: unknown
    body?: unknown
    how_to_use?: unknown
    sort_order?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const sectionId = typeof body.section_id === 'string' ? body.section_id.trim() : ''
  if (!sectionId || !PL_SCRIPT_UUID_RE.test(sectionId)) {
    return NextResponse.json({ error: 'Situação inválida.' }, { status: 400 })
  }

  const { data: section, error: secErr } = await supabaseAdmin
    .from('leader_tenant_pl_script_sections')
    .select('id')
    .eq('id', sectionId)
    .eq('leader_tenant_id', ctx.tenant.id)
    .maybeSingle()

  if (secErr || !section) {
    return NextResponse.json({ error: 'Situação não encontrada.' }, { status: 404 })
  }

  const title = clipEntryTitle(body.title)
  if (!title) {
    return NextResponse.json({ error: 'Título do script é obrigatório.' }, { status: 400 })
  }

  const subtitle = clipSubtitle(body.subtitle)
  const text = clipBody(body.body)
  const how_to_use = clipHowToUse(body.how_to_use)

  let sort_order = 0
  if (typeof body.sort_order === 'number' && Number.isFinite(body.sort_order)) {
    sort_order = Math.floor(body.sort_order)
  } else {
    const { data: maxRow } = await supabaseAdmin
      .from('leader_tenant_pl_script_entries')
      .select('sort_order')
      .eq('section_id', sectionId)
      .order('sort_order', { ascending: false })
      .limit(1)
      .maybeSingle()
    const max = typeof maxRow?.sort_order === 'number' ? maxRow.sort_order : -1
    sort_order = max + 1
  }

  const { data: inserted, error } = await supabaseAdmin
    .from('leader_tenant_pl_script_entries')
    .insert({
      section_id: sectionId,
      title,
      subtitle,
      body: text,
      how_to_use,
      sort_order,
    })
    .select()
    .single()

  if (error) {
    console.error('[pro-lideres/scripts/entries POST]', error)
    return NextResponse.json({ error: 'Erro ao criar script.' }, { status: 500 })
  }

  return NextResponse.json({ entry: inserted as LeaderTenantPlScriptEntryRow })
}
