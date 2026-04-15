import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresApiDevHint } from '@/lib/pro-lideres-api-dev-hints'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

/**
 * Visibilidade no catálogo para ferramentas YLADA (biblioteca + Meus links).
 * Ausência de linha em leader_tenant_catalog_ylada_visibility = visível para a equipe.
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
    return NextResponse.json({ error: 'Apenas o líder pode alterar a visibilidade do catálogo.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  let body: { yladaLinkId?: string; visibleToTeam?: boolean }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const yladaLinkId = String(body.yladaLinkId ?? '').trim()
  if (!yladaLinkId || !UUID_RE.test(yladaLinkId)) {
    return NextResponse.json({ error: 'yladaLinkId inválido' }, { status: 400 })
  }
  if (typeof body.visibleToTeam !== 'boolean') {
    return NextResponse.json({ error: 'visibleToTeam deve ser booleano' }, { status: 400 })
  }

  const { data: linkRow, error: linkErr } = await supabaseAdmin
    .from('ylada_links')
    .select('id')
    .eq('id', yladaLinkId)
    .eq('user_id', ctx.tenant.owner_user_id)
    .maybeSingle()

  if (linkErr) {
    console.error('[pro-lideres/flows/visibility PATCH] link lookup', linkErr)
    return NextResponse.json({ error: 'Erro ao validar o link' }, { status: 500 })
  }
  if (!linkRow) {
    return NextResponse.json({ error: 'Link não encontrado nesta conta' }, { status: 404 })
  }

  if (body.visibleToTeam) {
    const { error: delErr } = await supabaseAdmin
      .from('leader_tenant_catalog_ylada_visibility')
      .delete()
      .eq('leader_tenant_id', ctx.tenant.id)
      .eq('ylada_link_id', yladaLinkId)

    if (delErr) {
      console.error('[pro-lideres/flows/visibility PATCH] delete', delErr)
      return NextResponse.json({ error: 'Erro ao atualizar visibilidade' }, { status: 500 })
    }
  } else {
    const { error: upErr } = await supabaseAdmin.from('leader_tenant_catalog_ylada_visibility').upsert(
      {
        leader_tenant_id: ctx.tenant.id,
        ylada_link_id: yladaLinkId,
        visible_to_team: false,
      },
      { onConflict: 'leader_tenant_id,ylada_link_id' }
    )

    if (upErr) {
      console.error('[pro-lideres/flows/visibility PATCH] upsert', upErr)
      return NextResponse.json({ error: 'Erro ao atualizar visibilidade' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, yladaLinkId, visibleToTeam: body.visibleToTeam })
}
