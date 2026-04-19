import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresApiDevHint } from '@/lib/pro-lideres-api-dev-hints'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

export type ProLideresLinkCatalogKind = 'sales' | 'recruitment'

/**
 * PATCH /api/pro-lideres/flows/link-meta
 * Líder: grava `meta.pro_lideres_kind` no `config_json` do link YLADA (vendas vs recrutamento no catálogo).
 */
export async function PATCH(request: NextRequest) {
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
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode atualizar metadados do link.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  let body: { yladaLinkId?: string; proLideresKind?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const yladaLinkId = String(body.yladaLinkId ?? '').trim()
  if (!yladaLinkId || !UUID_RE.test(yladaLinkId)) {
    return NextResponse.json({ error: 'yladaLinkId inválido' }, { status: 400 })
  }

  const kind = body.proLideresKind === 'recruitment' ? 'recruitment' : body.proLideresKind === 'sales' ? 'sales' : null
  if (!kind) {
    return NextResponse.json({ error: 'proLideresKind deve ser "sales" ou "recruitment"' }, { status: 400 })
  }

  const ownerId = ctx.tenant.owner_user_id

  const { data: link, error: linkErr } = await supabaseAdmin
    .from('ylada_links')
    .select('id, config_json')
    .eq('id', yladaLinkId)
    .eq('user_id', ownerId)
    .maybeSingle()

  if (linkErr || !link) {
    return NextResponse.json({ error: 'Link não encontrado nesta conta' }, { status: 404 })
  }

  const prev = (link.config_json && typeof link.config_json === 'object' ? link.config_json : {}) as Record<
    string,
    unknown
  >
  const prevMeta = (prev.meta && typeof prev.meta === 'object' ? prev.meta : {}) as Record<string, unknown>
  const meta = {
    ...prevMeta,
    pro_lideres_kind: kind,
    pro_lideres_published_to_library_at: new Date().toISOString(),
  }
  const config_json = { ...prev, meta }

  const { error: updErr } = await supabaseAdmin.from('ylada_links').update({ config_json }).eq('id', yladaLinkId)

  if (updErr) {
    console.error('[pro-lideres/flows/link-meta]', updErr)
    return NextResponse.json({ error: 'Não foi possível guardar os metadados' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, yladaLinkId, proLideresKind: kind })
}
