import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresApiDevHint } from '@/lib/pro-lideres-api-dev-hints'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { buildProLideresCatalog, type ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'
import { personalizeProLideresCatalogUrlsForMember } from '@/lib/pro-lideres-member-catalog-share-urls'
import {
  isProLideresFlowHrefAllowed,
  PRO_LIDERES_FLOW_HREF_MAX,
  PRO_LIDERES_FLOW_LABEL_MAX,
  PRO_LIDERES_FLOW_NOTES_MAX,
} from '@/lib/pro-lideres-flow-href'

export type { ProLideresCatalogItem }

function requestBaseUrl(request: NextRequest): string {
  const host = request.headers.get('host') || ''
  const protocol = request.headers.get('x-forwarded-proto') || 'http'
  return host ? `${protocol}://${host}` : ''
}

/**
 * Catálogo Pro Líderes: biblioteca base prefixada em /l/… (Vendas + Recrutamento),
 * links YLADA ativos do líder e entradas custom (sales/recruitment) na BD.
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
  if (!ctx) {
    return NextResponse.json(
      { error: 'Tenant não encontrado', ...proLideresApiDevHint('noTenant') },
      { status: 404 }
    )
  }

  const paidGet = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paidGet.ok) return paidGet.response

  const { data: rows, error } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .select('id, category, label, href, sort_order, notes, visible_to_team')
    .eq('leader_tenant_id', ctx.tenant.id)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[pro-lideres/flows GET]', error)
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
    console.error('[pro-lideres/flows GET] ylada visibility', visErr)
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
    note:
      'Ao carregar: cria-se o que faltar da biblioteca base Pro Líderes em /l/… (Vendas + Recrutamento). Cada item tem origin library (presets) ou mine (Meus links + extras); duplicados fundidos no mesmo origin + categoria.',
  })
}

/** Cria entrada custom extra (só dono). Categoria vendas ou recrutamento; href relativo ou URL. */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode adicionar itens ao catálogo.' }, { status: 403 })
  }

  const paidPost = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paidPost.ok) return paidPost.response

  let body: { category?: string; label?: string; href?: string; sort_order?: number; notes?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const category = body.category === 'recruitment' ? 'recruitment' : 'sales'

  const label = String(body.label ?? '').trim().slice(0, PRO_LIDERES_FLOW_LABEL_MAX)
  const href = String(body.href ?? '').trim().slice(0, PRO_LIDERES_FLOW_HREF_MAX)
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
    })
    .select()
    .single()

  if (error) {
    console.error('[pro-lideres/flows POST]', error)
    return NextResponse.json({ error: 'Erro ao criar entrada' }, { status: 500 })
  }

  return NextResponse.json({ entry: inserted })
}
