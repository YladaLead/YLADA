import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import {
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

  let body: { title?: unknown; subtitle?: unknown; ylada_link_id?: unknown; sort_order?: unknown; visible_to_team?: unknown }
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

  const { data: inserted, error } = await supabaseAdmin
    .from('leader_tenant_pl_script_sections')
    .insert({
      leader_tenant_id: ctx.tenant.id,
      title,
      subtitle,
      ylada_link_id: ylada.id,
      sort_order,
      visible_to_team,
    })
    .select()
    .single()

  if (error) {
    console.error('[pro-lideres/scripts/sections POST]', error)
    return NextResponse.json({ error: 'Erro ao criar situação.' }, { status: 500 })
  }

  return NextResponse.json({ section: inserted as LeaderTenantPlScriptSectionRow })
}
