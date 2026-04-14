import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresApiDevHint } from '@/lib/pro-lideres-api-dev-hints'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { buildProLideresCatalog, type ProLideresCatalogItem } from '@/lib/pro-lideres-catalog-build'

export type { ProLideresCatalogItem }

function isAllowedHref(href: string): boolean {
  const t = href.trim()
  if (!t) return false
  if (t.startsWith('/')) return true
  try {
    const u = new URL(t)
    return u.protocol === 'https:' || u.protocol === 'http:'
  } catch {
    return false
  }
}

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

  const { data: rows, error } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .select('id, category, label, href, sort_order')
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
  }))
  const baseUrl = requestBaseUrl(request)
  const catalog = await buildProLideresCatalog(ctx.tenant.owner_user_id, baseUrl, customRows)

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

  let body: { category?: string; label?: string; href?: string; sort_order?: number }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const category = body.category === 'recruitment' ? 'recruitment' : 'sales'

  const label = String(body.label ?? '').trim().slice(0, 200)
  const href = String(body.href ?? '').trim().slice(0, 2000)
  if (!label) {
    return NextResponse.json({ error: 'label é obrigatório' }, { status: 400 })
  }
  if (!isAllowedHref(href)) {
    return NextResponse.json({ error: 'href inválido (use caminho /... ou https://)' }, { status: 400 })
  }

  const sort_order = typeof body.sort_order === 'number' && Number.isFinite(body.sort_order) ? body.sort_order : 999

  const { data: inserted, error } = await supabaseAdmin
    .from('leader_tenant_flow_entries')
    .insert({
      leader_tenant_id: ctx.tenant.id,
      category,
      label,
      href,
      sort_order,
    })
    .select()
    .single()

  if (error) {
    console.error('[pro-lideres/flows POST]', error)
    return NextResponse.json({ error: 'Erro ao criar entrada' }, { status: 500 })
  }

  return NextResponse.json({ entry: inserted })
}
