import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresApiDevHint } from '@/lib/pro-lideres-api-dev-hints'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  hideProLideresYladaLinkFromTeamCatalog,
  isProLideresYladaLinkVisibleToTeamInCatalog,
  showProLideresYladaLinkToTeamCatalog,
} from '@/lib/pro-lideres-ylada-catalog-team-visibility'

const UUID_RE = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

async function assertLeaderOwnsYladaLink(
  yladaLinkId: string,
  ownerUserId: string
): Promise<{ ok: true } | { ok: false; status: number; body: Record<string, unknown> }> {
  const { data: linkRow, error: linkErr } = await supabaseAdmin!
    .from('ylada_links')
    .select('id')
    .eq('id', yladaLinkId)
    .eq('user_id', ownerUserId)
    .maybeSingle()

  if (linkErr) {
    console.error('[pro-lideres/flows/visibility] link lookup', linkErr)
    return { ok: false, status: 500, body: { error: 'Erro ao validar o link' } }
  }
  if (!linkRow) {
    return { ok: false, status: 404, body: { error: 'Link não encontrado nesta conta' } }
  }
  return { ok: true }
}

/**
 * GET ?yladaLinkId= — líder consulta se a equipe vê a ferramenta no catálogo (default: sim).
 */
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
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode consultar a visibilidade do catálogo.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  const yladaLinkId = String(request.nextUrl.searchParams.get('yladaLinkId') ?? '').trim()
  if (!yladaLinkId || !UUID_RE.test(yladaLinkId)) {
    return NextResponse.json({ error: 'yladaLinkId inválido' }, { status: 400 })
  }

  const owned = await assertLeaderOwnsYladaLink(yladaLinkId, ctx.tenant.owner_user_id)
  if (!owned.ok) return NextResponse.json(owned.body, { status: owned.status })

  try {
    const visibleToTeam = await isProLideresYladaLinkVisibleToTeamInCatalog(
      supabaseAdmin,
      ctx.tenant.id,
      yladaLinkId
    )
    return NextResponse.json({ ok: true, yladaLinkId, visibleToTeam })
  } catch (e) {
    console.error('[pro-lideres/flows/visibility GET]', e)
    return NextResponse.json({ error: 'Erro ao ler visibilidade' }, { status: 500 })
  }
}

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

  const owned = await assertLeaderOwnsYladaLink(yladaLinkId, ctx.tenant.owner_user_id)
  if (!owned.ok) return NextResponse.json(owned.body, { status: owned.status })

  try {
    if (body.visibleToTeam) {
      await showProLideresYladaLinkToTeamCatalog(supabaseAdmin, ctx.tenant.id, yladaLinkId)
    } else {
      await hideProLideresYladaLinkFromTeamCatalog(supabaseAdmin, ctx.tenant.id, yladaLinkId)
    }
  } catch (e) {
    console.error('[pro-lideres/flows/visibility PATCH]', e)
    return NextResponse.json({ error: 'Erro ao atualizar visibilidade' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, yladaLinkId, visibleToTeam: body.visibleToTeam })
}
