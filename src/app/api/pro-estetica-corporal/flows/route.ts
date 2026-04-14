import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveEsteticaCorporalTenantContext } from '@/lib/pro-estetica-corporal-server'
import { buildProLideresCatalog, type ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'
import { ensureEsteticaCorporalPresetFlowEntries } from '@/lib/pro-estetica-corporal/ensure-estetica-preset-catalog'
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
 * Catálogo Pro Estética Corporal: mesma mecânica do Pro Líderes (links /l/… + entradas custom).
 */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  await ensureEsteticaCorporalPresetFlowEntries(ctx.tenant.id)

  const { data: rows, error } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .select('id, category, label, href, sort_order, notes')
    .eq('leader_tenant_id', ctx.tenant.id)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[pro-estetica-corporal/flows GET]', error)
    return NextResponse.json({ error: 'Erro ao carregar catálogo' }, { status: 500 })
  }

  const customRows = (rows ?? []).map((r) => ({
    id: r.id as string,
    label: r.label as string,
    href: r.href as string,
    sort_order: typeof r.sort_order === 'number' ? r.sort_order : 0,
    category: r.category as string,
    notes: typeof r.notes === 'string' ? r.notes : '',
  }))
  const baseUrl = requestBaseUrl(request)
  const catalog = await buildProLideresCatalog(ctx.tenant.owner_user_id, baseUrl, customRows)

  return NextResponse.json({
    tenantId: ctx.tenant.id,
    catalog,
    note:
      'Catálogo: links /l/… da tua conta + atalhos do painel (sem URLs genéricas de Wellness).',
  })
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
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
    console.error('[pro-estetica-corporal/flows POST]', error)
    return NextResponse.json({ error: 'Erro ao criar entrada' }, { status: 500 })
  }

  return NextResponse.json({ entry: inserted })
}
