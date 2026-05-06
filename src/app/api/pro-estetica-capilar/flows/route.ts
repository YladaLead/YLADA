import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveEsteticaCapilarTenantContext } from '@/lib/pro-estetica-capilar-server'
import { buildProLideresCatalog, type ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'
import { personalizeProLideresCatalogUrlsForMember } from '@/lib/pro-lideres-member-catalog-share-urls'
import { ensureEsteticaCapilarPresetFlowEntries } from '@/lib/pro-estetica-capilar/ensure-estetica-preset-catalog'
import {
  isProLideresFlowHrefAllowed,
  PRO_LIDERES_FLOW_HREF_MAX,
  PRO_LIDERES_FLOW_LABEL_MAX,
  PRO_LIDERES_FLOW_NOTES_MAX,
} from '@/lib/pro-lideres-flow-href'
import { inferProLideresFlowCatalogKindFromHref } from '@/lib/pro-lideres-flow-catalog-kind'

export type { ProLideresCatalogItem }

function requestBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  return host ? `${protocol}://${host}` : ''
}

/** Catálogo Pro Estética Capilar: mesma mecânica do Pro Líderes (links /l/… + entradas custom). */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  await ensureEsteticaCapilarPresetFlowEntries(ctx.tenant.id)

  const { data: rows, error } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .select('id, category, label, href, sort_order, notes, visible_to_team')
    .eq('leader_tenant_id', ctx.tenant.id)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[pro-estetica-capilar/flows GET]', error)
    return NextResponse.json({ error: 'Erro ao carregar catálogo' }, { status: 500 })
  }

  const customRows = (rows ?? []).map((r) => ({
    id: r.id as string,
    label: r.label as string,
    href: r.href as string,
    sort_order: typeof r.sort_order === 'number' ? r.sort_order : 0,
    category: r.category as string,
    notes: typeof r.notes === 'string' ? r.notes : '',
    visible_to_team: typeof r.visible_to_team === 'boolean' ? r.visible_to_team : true,
  }))

  const { data: visRows, error: visErr } = await supabaseAdmin
    .from('leader_tenant_catalog_ylada_visibility')
    .select('ylada_link_id, visible_to_team')
    .eq('leader_tenant_id', ctx.tenant.id)

  const yladaVisibleToTeamByLinkId: Record<string, boolean> = {}
  if (!visErr && visRows) {
    for (const v of visRows) {
      const lid = v.ylada_link_id as string | undefined
      if (lid) yladaVisibleToTeamByLinkId[lid] = Boolean(v.visible_to_team)
    }
  } else if (
    visErr &&
    !/leader_tenant_catalog_ylada_visibility|Could not find|does not exist|schema cache/i.test(
      visErr.message ?? ''
    )
  ) {
    console.error('[pro-estetica-capilar/flows GET] ylada visibility', visErr)
    return NextResponse.json({ error: 'Erro ao carregar visibilidade do catálogo' }, { status: 500 })
  }

  const baseUrl = requestBaseUrl(request)
  let catalog = await buildProLideresCatalog(ctx.tenant.owner_user_id, baseUrl, customRows, {
    yladaVisibleToTeamByLinkId,
  })

  if (ctx.role === 'member') {
    catalog = catalog.filter((item) => item.visibleToTeam)
    catalog = await personalizeProLideresCatalogUrlsForMember(supabaseAdmin, catalog, {
      leaderTenantId: ctx.tenant.id,
      memberUserId: user.id,
      baseUrl,
    })
  }

  return NextResponse.json({
    tenantId: ctx.tenant.id,
    catalog,
    note: 'Catálogo: links /l/… da tua conta + atalhos do painel (Pro Estética Capilar).',
  })
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o profissional pode adicionar itens ao catálogo.' }, { status: 403 })
  }

  let body: { category?: string; label?: string; href?: string; sort_order?: number; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const category = body.category === 'recruitment' ? 'recruitment' : 'sales'

  const label = String(body.label ?? '').trim().slice(0, PRO_LIDERES_FLOW_LABEL_MAX)
  const href = String(body.href ?? '').trim().slice(0, PRO_LIDERES_FLOW_HREF_MAX)
  const catalog_kind = inferProLideresFlowCatalogKindFromHref(href)
  if (!label) {
    return NextResponse.json({ error: 'label é obrigatório' }, { status: 400 })
  }
  if (!isProLideresFlowHrefAllowed(href)) {
    return NextResponse.json({ error: 'href inválido (use caminho /... ou https://)' }, { status: 400 })
  }

  const sort_order = typeof body.sort_order === 'number' && Number.isFinite(body.sort_order) ? body.sort_order : 999
  const notes = String(body.notes ?? '').trim().slice(0, PRO_LIDERES_FLOW_NOTES_MAX)

  const { data: inserted, error } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .insert({
      leader_tenant_id: ctx.tenant.id,
      category,
      label,
      href,
      sort_order,
      notes,
      catalog_kind,
    })
    .select()
    .single()

  if (error) {
    console.error('[pro-estetica-capilar/flows POST]', error)
    return NextResponse.json({ error: 'Erro ao criar entrada' }, { status: 500 })
  }

  return NextResponse.json({ entry: inserted })
}
