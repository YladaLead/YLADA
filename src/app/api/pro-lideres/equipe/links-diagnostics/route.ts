/**
 * GET /api/pro-lideres/equipe/links-diagnostics?days=30&member_user_id=optional
 * Só o líder do tenant. Lista ferramentas do catálogo (quiz, calculadora, diagnóstico, triagem) com:
 * - Sem member_user_id: totais de aberturas, início do fluxo, conclusão/resultado e WhatsApp no período.
 * - Com member_user_id: mesmas métricas só para eventos rastreados àquele membro (utm pl_member + pl_tenant).
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'

const CATALOG_TYPES = new Set(['calculator', 'diagnostico', 'quiz', 'triagem'])

const MAX_EVENTS = 25000

type ProLideresLinkDiagnosticRow = {
  linkId: string
  slug: string
  title: string
  views: number
  starts: number
  completions: number
  whatsappClicks: number
}

export async function GET(request: NextRequest) {
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
    return NextResponse.json({ error: 'Apenas o líder vê o diagnóstico das ferramentas.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  const tenantId = ctx.tenant.id
  const ownerId = ctx.tenant.owner_user_id

  const daysRaw = request.nextUrl.searchParams.get('days')?.trim()
  const days = Math.min(365, Math.max(1, parseInt(daysRaw || '30', 10) || 30))
  const from = new Date()
  from.setUTCDate(from.getUTCDate() - days)
  const sinceIso = from.toISOString()

  const memberParam = request.nextUrl.searchParams.get('member_user_id')?.trim() || null
  let memberUserId: string | null = null
  if (memberParam) {
    if (memberParam === ownerId) {
      return NextResponse.json({ error: 'Use o painel geral para o líder.' }, { status: 400 })
    }
    const { data: memRow } = await supabaseAdmin
      .from('leader_tenant_members')
      .select('user_id')
      .eq('leader_tenant_id', tenantId)
      .eq('user_id', memberParam)
      .maybeSingle()
    if (!memRow?.user_id) {
      return NextResponse.json({ error: 'Membro não encontrado neste espaço.' }, { status: 404 })
    }
    memberUserId = memberParam
  }

  const { data: linkRows, error: linkErr } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, title, template_id')
    .eq('user_id', ownerId)
    .order('created_at', { ascending: false })

  if (linkErr) {
    console.error('[links-diagnostics] links', linkErr)
    return NextResponse.json({ error: 'Erro ao listar links.' }, { status: 500 })
  }

  const linksRaw = linkRows ?? []
  const templateIds = [...new Set(linksRaw.map((l) => l.template_id).filter((id): id is string => !!id))]
  let typeByTemplateId = new Map<string, string>()
  if (templateIds.length) {
    const { data: tpls } = await supabaseAdmin.from('ylada_link_templates').select('id, type').in('id', templateIds)
    for (const t of tpls ?? []) {
      typeByTemplateId.set(t.id as string, String(t.type || ''))
    }
  }

  const catalogLinks = linksRaw.filter((l) => {
    const tid = l.template_id as string | null
    const ty = tid ? typeByTemplateId.get(tid) : ''
    return ty && CATALOG_TYPES.has(ty)
  })

  const linkIds = catalogLinks.map((l) => l.id as string)
  const metaById = new Map(
    catalogLinks.map((l) => [
      l.id as string,
      {
        slug: String(l.slug || '').trim(),
        title: (String(l.title || '').trim() || String(l.slug || '').trim() || 'Ferramenta') as string,
      },
    ])
  )

  if (linkIds.length === 0) {
    return NextResponse.json({
      days,
      sinceIso,
      memberUserId,
      rows: [] as ProLideresLinkDiagnosticRow[],
    })
  }

  const { data: events, error: evErr } = await supabaseAdmin
    .from('ylada_link_events')
    .select('link_id, event_type, utm_json')
    .in('link_id', linkIds)
    .gte('created_at', sinceIso)
    .limit(MAX_EVENTS)

  if (evErr) {
    console.error('[links-diagnostics] events', evErr)
    return NextResponse.json({ error: 'Erro ao carregar eventos.' }, { status: 500 })
  }

  const counts = new Map<string, { views: number; starts: number; completions: number; whatsapp: number }>()
  for (const id of linkIds) {
    counts.set(id, { views: 0, starts: 0, completions: 0, whatsapp: 0 })
  }

  for (const e of events ?? []) {
    const lid = e.link_id as string
    if (!counts.has(lid)) continue
    const uj = (e.utm_json as Record<string, unknown> | null) ?? {}
    if (memberUserId) {
      const mid = typeof uj.pl_member_user_id === 'string' ? uj.pl_member_user_id : null
      const tMatch = typeof uj.pl_tenant_id === 'string' && uj.pl_tenant_id === tenantId
      if (!mid || mid !== memberUserId || !tMatch) continue
    }

    const et = String(e.event_type || '')
    const c = counts.get(lid)!
    if (et === 'view') c.views += 1
    else if (et === 'start') c.starts += 1
    else if (et === 'complete' || et === 'result_view') c.completions += 1
    else if (et === 'cta_click') c.whatsapp += 1
  }

  const rows: ProLideresLinkDiagnosticRow[] = linkIds.map((id) => {
    const m = metaById.get(id)!
    const c = counts.get(id)!
    return {
      linkId: id,
      slug: m.slug,
      title: m.title,
      views: c.views,
      starts: c.starts,
      completions: c.completions,
      whatsappClicks: c.whatsapp,
    }
  })

  rows.sort((a, b) => {
    const score = (r: ProLideresLinkDiagnosticRow) =>
      r.views + r.starts * 2 + r.completions * 3 + r.whatsappClicks * 4
    return score(b) - score(a)
  })

  return NextResponse.json({
    days,
    sinceIso,
    memberUserId,
    truncated: (events?.length ?? 0) >= MAX_EVENTS,
    rows,
  })
}
