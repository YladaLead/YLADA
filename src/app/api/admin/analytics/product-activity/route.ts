import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { PERFIS_MATRIZ_YLADA } from '@/lib/admin-matriz-constants'
import { brYmdEndUtcIso, brYmdStartUtcIso, daysInclusiveYmd, toYmdInTimeZone } from '@/lib/date-utils'

/**
 * GET /api/admin/analytics/product-activity
 * Série temporal para monitorar: novos cadastros (com split histórico de pagamento),
 * links YLADA criados e visualizações (eventos view).
 *
 * Query:
 * - period?: '7d' | '30d' | '3m' | '6m' | '1y' | 'all' (default 30d)
 * - bloco?: 'todos' | 'ylada' | 'wellness' (default todos) — filtra por user_profiles.perfil
 * - de?: YYYY-MM-DD e ate?: YYYY-MM-DD — intervalo inclusivo (calendário Brasil); se ambos válidos,
 *   substituem `period` para esse relatório. Granularidade: dia se ≤62 dias inclusivos, senão mês.
 *
 * Granularidade sem datas: dia (7d, 30d) | mês (demais).
 */
function periodToStart(period: string): Date {
  const now = new Date()
  const start = new Date()
  switch (period) {
    case '7d':
      start.setDate(now.getDate() - 7)
      break
    case '30d':
      start.setDate(now.getDate() - 30)
      break
    case '3m':
      start.setMonth(now.getMonth() - 3)
      break
    case '6m':
      start.setMonth(now.getMonth() - 6)
      break
    case '1y':
      start.setFullYear(now.getFullYear() - 1)
      break
    case 'all':
      return new Date(0)
    default:
      start.setDate(now.getDate() - 30)
  }
  return start
}

function granularityFor(period: string): 'day' | 'month' {
  return period === '7d' || period === '30d' ? 'day' : 'month'
}

function bucketFromIso(iso: string, g: 'day' | 'month'): string {
  const ymd = toYmdInTimeZone(iso)
  if (!ymd) return ''
  return g === 'day' ? ymd : ymd.slice(0, 7)
}

function perfilMatchesBloco(perfil: string | null, bloco: string): boolean {
  if (bloco === 'todos') return true
  const p = perfil || ''
  if (bloco === 'wellness') return p === 'wellness'
  if (bloco === 'ylada') return (PERFIS_MATRIZ_YLADA as readonly string[]).includes(p)
  return true
}

async function fetchAllInRange<T extends Record<string, unknown>>(
  table: string,
  select: string,
  startISO: string,
  endISO: string | null,
  extraFilter?: (q: ReturnType<typeof supabaseAdmin.from>) => ReturnType<typeof supabaseAdmin.from>
): Promise<T[]> {
  const pageSize = 1000
  const out: T[] = []
  let from = 0
  for (;;) {
    let q = supabaseAdmin.from(table).select(select).gte('created_at', startISO)
    if (endISO) q = q.lte('created_at', endISO)
    q = q.order('created_at', {
      ascending: true,
    })
    if (extraFilter) q = extraFilter(q)
    const { data, error } = await q.range(from, from + pageSize - 1)
    if (error) {
      console.error(`product-activity paginate ${table}:`, error)
      break
    }
    const rows = (data || []) as T[]
    out.push(...rows)
    if (rows.length < pageSize) break
    from += pageSize
    if (from > 400_000) break
  }
  return out
}

export async function GET(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) return authResult

    const { searchParams } = new URL(request.url)
    const period = searchParams.get('period') || '30d'
    const bloco = searchParams.get('bloco') || 'todos'
    const deRaw = (searchParams.get('de') || '').trim()
    const ateRaw = (searchParams.get('ate') || '').trim()
    const ymdOk = (s: string) => /^\d{4}-\d{2}-\d{2}$/.test(s)

    let startISO: string
    let endISO: string | null
    let g: 'day' | 'month'
    let periodOut: string
    let customRange: { de: string; ate: string } | null = null

    if (ymdOk(deRaw) && ymdOk(ateRaw)) {
      let de = deRaw
      let ate = ateRaw
      if (de > ate) {
        const t = de
        de = ate
        ate = t
      }
      startISO = brYmdStartUtcIso(de)
      endISO = brYmdEndUtcIso(ate)
      customRange = { de, ate }
      const span = daysInclusiveYmd(de, ate)
      g = span > 62 ? 'month' : 'day'
      periodOut = 'custom'
    } else {
      const startDate = periodToStart(period)
      startISO = startDate.toISOString()
      endISO = null
      g = granularityFor(period)
      periodOut = period
    }

    let profilesQuery = supabaseAdmin
      .from('user_profiles')
      .select('user_id, perfil, created_at')
      .gte('created_at', startISO)
      .order('created_at', { ascending: true })
    if (endISO) {
      profilesQuery = profilesQuery.lte('created_at', endISO)
    }

    if (bloco === 'ylada') {
      profilesQuery = profilesQuery.in('perfil', [...PERFIS_MATRIZ_YLADA])
    } else if (bloco === 'wellness') {
      profilesQuery = profilesQuery.eq('perfil', 'wellness')
    }

    const { data: profilesNew, error: profilesErr } = await profilesQuery
    if (profilesErr) {
      console.error('product-activity profiles:', profilesErr)
      return NextResponse.json({ error: 'Erro ao buscar perfis' }, { status: 500 })
    }

    const profilesList = profilesNew || []
    const newUserIds = [...new Set(profilesList.map((p) => p.user_id))]

    const paidEver = new Set<string>()
    const chunk = 150
    for (let i = 0; i < newUserIds.length; i += chunk) {
      const slice = newUserIds.slice(i, i + chunk)
      const { data: subs } = await supabaseAdmin
        .from('subscriptions')
        .select('user_id')
        .in('user_id', slice)
        .in('plan_type', ['monthly', 'annual'])
      for (const row of subs || []) {
        if (row.user_id) paidEver.add(row.user_id)
      }
    }

    const buckets = new Map<
      string,
      {
        novosUsuarios: number
        novosJaPagaram: number
        novosNuncaPagaram: number
        linksCriados: number
        visualizacoesLinks: number
      }
    >()

    const bump = (key: string, field: keyof (typeof buckets extends Map<string, infer V> ? V : never)) => {
      if (!key) return
      const cur = buckets.get(key) || {
        novosUsuarios: 0,
        novosJaPagaram: 0,
        novosNuncaPagaram: 0,
        linksCriados: 0,
        visualizacoesLinks: 0,
      }
      cur[field] += 1
      buckets.set(key, cur)
    }

    for (const p of profilesList) {
      if (!perfilMatchesBloco(p.perfil, bloco)) continue
      const key = bucketFromIso(p.created_at, g)
      bump(key, 'novosUsuarios')
      if (paidEver.has(p.user_id)) bump(key, 'novosJaPagaram')
      else bump(key, 'novosNuncaPagaram')
    }

    type LinkRow = { user_id: string; created_at: string }
    const linksRaw = await fetchAllInRange<LinkRow>('ylada_links', 'user_id, created_at', startISO, endISO)

    const linkUserIds = [...new Set(linksRaw.map((l) => l.user_id))]
    const perfilByUser = new Map<string, string | null>()
    for (let i = 0; i < linkUserIds.length; i += chunk) {
      const slice = linkUserIds.slice(i, i + chunk)
      const { data: profs } = await supabaseAdmin.from('user_profiles').select('user_id, perfil').in('user_id', slice)
      for (const row of profs || []) {
        perfilByUser.set(row.user_id, row.perfil)
      }
    }

    for (const l of linksRaw) {
      const perfil = perfilByUser.get(l.user_id) ?? null
      if (!perfilMatchesBloco(perfil, bloco)) continue
      const key = bucketFromIso(l.created_at, g)
      const cur = buckets.get(key) || {
        novosUsuarios: 0,
        novosJaPagaram: 0,
        novosNuncaPagaram: 0,
        linksCriados: 0,
        visualizacoesLinks: 0,
      }
      cur.linksCriados += 1
      buckets.set(key, cur)
    }

    type EvRow = { link_id: string; created_at: string }
    let eventsRaw: EvRow[] = []
    try {
      eventsRaw = await fetchAllInRange<EvRow>(
        'ylada_link_events',
        'link_id, created_at',
        startISO,
        endISO,
        (q) => q.eq('event_type', 'view')
      )
    } catch (err) {
      console.warn('product-activity ylada_link_events:', err)
    }

    const linkIds = [...new Set(eventsRaw.map((e) => e.link_id))]
    const linkIdToUser = new Map<string, string>()
    for (let i = 0; i < linkIds.length; i += chunk) {
      const slice = linkIds.slice(i, i + chunk)
      const { data: lk } = await supabaseAdmin.from('ylada_links').select('id, user_id').in('id', slice)
      for (const row of lk || []) {
        linkIdToUser.set(row.id, row.user_id)
      }
    }

    const uidsFromViews = new Set<string>()
    for (const ev of eventsRaw) {
      const uid = linkIdToUser.get(ev.link_id)
      if (uid) uidsFromViews.add(uid)
    }
    const missingPerfil = [...uidsFromViews].filter((uid) => !perfilByUser.has(uid))
    for (let i = 0; i < missingPerfil.length; i += chunk) {
      const slice = missingPerfil.slice(i, i + chunk)
      const { data: profs } = await supabaseAdmin.from('user_profiles').select('user_id, perfil').in('user_id', slice)
      for (const row of profs || []) {
        perfilByUser.set(row.user_id, row.perfil)
      }
    }

    for (const ev of eventsRaw) {
      const uid = linkIdToUser.get(ev.link_id)
      if (!uid) continue
      const perfil = perfilByUser.get(uid) ?? null
      if (!perfilMatchesBloco(perfil, bloco)) continue
      const key = bucketFromIso(ev.created_at, g)
      const cur = buckets.get(key) || {
        novosUsuarios: 0,
        novosJaPagaram: 0,
        novosNuncaPagaram: 0,
        linksCriados: 0,
        visualizacoesLinks: 0,
      }
      cur.visualizacoesLinks += 1
      buckets.set(key, cur)
    }

    const sortedKeys = Array.from(buckets.keys()).filter(Boolean).sort()
    const data = sortedKeys.map((bucket) => {
      const b = buckets.get(bucket)!
      return {
        bucket,
        novosUsuarios: b.novosUsuarios,
        novosJaPagaram: b.novosJaPagaram,
        novosNuncaPagaram: b.novosNuncaPagaram,
        linksCriados: b.linksCriados,
        visualizacoesLinks: b.visualizacoesLinks,
      }
    })

    const totals = data.reduce(
      (acc, row) => ({
        novosUsuarios: acc.novosUsuarios + row.novosUsuarios,
        novosJaPagaram: acc.novosJaPagaram + row.novosJaPagaram,
        novosNuncaPagaram: acc.novosNuncaPagaram + row.novosNuncaPagaram,
        linksCriados: acc.linksCriados + row.linksCriados,
        visualizacoesLinks: acc.visualizacoesLinks + row.visualizacoesLinks,
      }),
      {
        novosUsuarios: 0,
        novosJaPagaram: 0,
        novosNuncaPagaram: 0,
        linksCriados: 0,
        visualizacoesLinks: 0,
      }
    )

    return NextResponse.json({
      success: true,
      period: periodOut,
      bloco,
      granularity: g,
      startDate: startISO,
      endDate: endISO,
      customRange,
      data,
      totals,
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro desconhecido'
    console.error('product-activity:', e)
    return NextResponse.json({ error: 'Erro ao montar série temporal', details: msg }, { status: 500 })
  }
}
