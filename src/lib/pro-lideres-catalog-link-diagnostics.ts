import type { SupabaseClient } from '@supabase/supabase-js'

const CATALOG_TYPES = new Set(['calculator', 'diagnostico', 'quiz', 'triagem'])

const MAX_EVENTS = 25000

export type ProLideresCatalogLinkDiagnosticRow = {
  linkId: string
  slug: string
  title: string
  views: number
  starts: number
  completions: number
  whatsappClicks: number
}

export type FetchProLideresCatalogLinkDiagnosticsArgs = {
  tenantId: string
  ownerUserId: string
  /** Quando definido, só contam eventos com `utm_json.pl_member_user_id` e `pl_tenant_id` correspondentes. */
  memberUserId: string | null
  days: number
}

/**
 * Métricas de utilização das ferramentas do catálogo (links do dono do tenant).
 * Reutilizado pelo endpoint de diagnóstico do líder e pela visão geral do membro.
 */
export async function fetchProLideresCatalogLinkDiagnosticRows(
  admin: SupabaseClient,
  args: FetchProLideresCatalogLinkDiagnosticsArgs
): Promise<{
  days: number
  sinceIso: string
  memberUserId: string | null
  truncated: boolean
  rows: ProLideresCatalogLinkDiagnosticRow[]
}> {
  const days = Math.min(365, Math.max(1, args.days || 30))
  const from = new Date()
  from.setUTCDate(from.getUTCDate() - days)
  const sinceIso = from.toISOString()
  const memberUserId = args.memberUserId

  const { data: linkRows, error: linkErr } = await admin
    .from('ylada_links')
    .select('id, slug, title, template_id')
    .eq('user_id', args.ownerUserId)
    .order('created_at', { ascending: false })

  if (linkErr) {
    console.error('[catalog-link-diagnostics] links', linkErr)
    throw new Error('Erro ao listar links.')
  }

  const linksRaw = linkRows ?? []
  const templateIds = [...new Set(linksRaw.map((l) => l.template_id).filter((id): id is string => !!id))]
  const typeByTemplateId = new Map<string, string>()
  if (templateIds.length) {
    const { data: tpls } = await admin.from('ylada_link_templates').select('id, type').in('id', templateIds)
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
    return { days, sinceIso, memberUserId, truncated: false, rows: [] }
  }

  const { data: events, error: evErr } = await admin
    .from('ylada_link_events')
    .select('link_id, event_type, utm_json')
    .in('link_id', linkIds)
    .gte('created_at', sinceIso)
    .limit(MAX_EVENTS)

  if (evErr) {
    console.error('[catalog-link-diagnostics] events', evErr)
    throw new Error('Erro ao carregar eventos.')
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
      const tMatch = typeof uj.pl_tenant_id === 'string' && uj.pl_tenant_id === args.tenantId
      if (!mid || mid !== memberUserId || !tMatch) continue
    }

    const et = String(e.event_type || '')
    const c = counts.get(lid)!
    if (et === 'view') c.views += 1
    else if (et === 'start') c.starts += 1
    else if (et === 'complete' || et === 'result_view') c.completions += 1
    else if (et === 'cta_click') c.whatsapp += 1
  }

  const rows: ProLideresCatalogLinkDiagnosticRow[] = linkIds.map((id) => {
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
    const score = (r: ProLideresCatalogLinkDiagnosticRow) =>
      r.views + r.starts * 2 + r.completions * 3 + r.whatsappClicks * 4
    return score(b) - score(a)
  })

  return {
    days,
    sinceIso,
    memberUserId,
    truncated: (events?.length ?? 0) >= MAX_EVENTS,
    rows,
  }
}
