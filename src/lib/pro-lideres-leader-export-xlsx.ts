import type { SupabaseClient } from '@supabase/supabase-js'
import * as XLSX from 'xlsx'

import type { ProLideresDailyTaskCompletionRow, ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'

const TZ_SP = 'America/Sao_Paulo'
const MAX_LINK_EVENTS = 25000

function ymdTodaySp(): string {
  return new Date().toLocaleDateString('en-CA', { timeZone: TZ_SP })
}

function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, day] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, day + delta))
  return dt.toISOString().slice(0, 10)
}

function daysBetweenInclusive(from: string, to: string): number {
  const [yf, mf, df] = from.split('-').map(Number)
  const [yt, mt, dt] = to.split('-').map(Number)
  const a = Date.UTC(yf, mf - 1, df)
  const b = Date.UTC(yt, mt - 1, dt)
  return Math.floor((b - a) / (24 * 60 * 60 * 1000)) + 1
}

function safeSheetName(base: string): string {
  const cleaned = base.replace(/[:\\/?*[\]]/g, '-').slice(0, 31)
  return cleaned.length ? cleaned : 'Sheet'
}

export type ProLideresLeaderExportRange = {
  from: string
  to: string
}

export type ProLideresLeaderExportResult = {
  buffer: Buffer
  range: ProLideresLeaderExportRange
  eventsTruncated: boolean
}

/**
 * Valida intervalo civil (YYYY-MM-DD), inclusive, máx. 90 dias, até hoje (fuso SP).
 */
export function parseProLideresLeaderExportRange(
  fromRaw: string | null,
  toRaw: string | null
): { ok: true; range: ProLideresLeaderExportRange } | { ok: false; error: string } {
  const ymdRe = /^\d{4}-\d{2}-\d{2}$/
  const today = ymdTodaySp()
  let from = (fromRaw ?? '').trim()
  let to = (toRaw ?? '').trim()
  if (!from || !to) {
    to = today
    from = addDaysYmd(to, -29)
  }
  if (!ymdRe.test(from) || !ymdRe.test(to)) {
    return { ok: false, error: 'Datas inválidas. Use from e to em YYYY-MM-DD.' }
  }
  if (from > to) {
    return { ok: false, error: 'A data inicial não pode ser depois da final.' }
  }
  if (to > today) {
    return { ok: false, error: 'A data final não pode ser no futuro.' }
  }
  const span = daysBetweenInclusive(from, to)
  if (span < 1 || span > 90) {
    return { ok: false, error: 'O período deve ter entre 1 e 90 dias.' }
  }
  return { ok: true, range: { from, to } }
}

function displayName(
  userId: string,
  profileById: Map<string, { nome_completo: string | null; email: string | null }>
): string {
  const p = profileById.get(userId)
  const n = p?.nome_completo?.trim()
  if (n) return n
  const e = p?.email?.trim()
  if (e) return e
  return userId.slice(0, 8)
}

type LinkFour = { views: number; starts: number; completions: number; wa: number }

function emptyFour(): LinkFour {
  return { views: 0, starts: 0, completions: 0, wa: 0 }
}

function addLinkEvent(f: LinkFour, eventType: string): void {
  const et = String(eventType || '')
  if (et === 'view') f.views += 1
  else if (et === 'start') f.starts += 1
  else if (et === 'result_view') f.completions += 1
  else if (et === 'cta_click') f.wa += 1
}

function linkScore(f: LinkFour): number {
  return f.views + f.starts * 2 + f.completions * 3 + f.wa * 4
}

/** Percentagem 0–100 com uma casa, ou vazio se divisão inválida. */
function pct100(num: number, den: number): number | string {
  if (den <= 0) return '—'
  return Math.round((1000 * num) / den) / 10
}

export async function buildProLideresLeaderExportXlsx(
  admin: SupabaseClient,
  args: {
    tenantId: string
    ownerUserId: string
    range: ProLideresLeaderExportRange
  }
): Promise<ProLideresLeaderExportResult> {
  const { tenantId, ownerUserId, range } = args
  const { from, to } = range

  const { data: memRows, error: memErr } = await admin
    .from('leader_tenant_members')
    .select('user_id, role, team_access_state, pro_lideres_tabulator_name')
    .eq('leader_tenant_id', tenantId)
    .order('created_at', { ascending: true })

  if (memErr) {
    console.error('[pro-lideres export] members', memErr)
    throw new Error('Erro ao carregar membros.')
  }

  const members = memRows ?? []
  const userIds = members.map((r) => r.user_id as string)
  const tabByUser = new Map<string, string>()
  for (const r of members) {
    const tab = typeof r.pro_lideres_tabulator_name === 'string' ? r.pro_lideres_tabulator_name.trim() : ''
    tabByUser.set(r.user_id as string, tab || '—')
  }

  const memberIdsOnly = new Set(
    members
      .filter((m) => m.role === 'member' && (m.team_access_state as string) === 'active')
      .map((m) => m.user_id as string)
  )

  const profileById = new Map<string, { nome_completo: string | null; email: string | null }>()
  if (userIds.length) {
    const { data: profs } = await admin
      .from('user_profiles')
      .select('user_id, nome_completo, email')
      .in('user_id', userIds)
    for (const p of profs ?? []) {
      profileById.set(p.user_id as string, {
        nome_completo: (p.nome_completo as string | null) ?? null,
        email: (p.email as string | null) ?? null,
      })
    }
  }

  const roleLabel = (r: string) => (r === 'owner' ? 'Líder' : r === 'member' ? 'Membro' : r)
  const stateLabel = (s: string) =>
    s === 'paused' ? 'Pausado' : s === 'pending_activation' ? 'Pendente' : 'Ativo'

  const equipeRows: (string | number)[][] = [
    ['Nome', 'E-mail', 'Tabulador', 'Função', 'Estado de acesso', 'ID do usuário'],
  ]
  for (const r of members) {
    const uid = r.user_id as string
    const p = profileById.get(uid)
    equipeRows.push([
      displayName(uid, profileById),
      (p?.email ?? '').trim() || '—',
      tabByUser.get(uid) ?? '—',
      roleLabel(String(r.role)),
      stateLabel(String(r.team_access_state ?? 'active')),
      uid,
    ])
  }

  const { data: taskRows, error: taskErr } = await admin
    .from('pro_lideres_daily_tasks')
    .select('*')
    .eq('leader_tenant_id', tenantId)
    .order('sort_order', { ascending: true })

  if (taskErr) {
    console.error('[pro-lideres export] tasks', taskErr)
    throw new Error('Erro ao carregar tarefas.')
  }

  const tasks = (taskRows ?? []) as ProLideresDailyTaskRow[]
  const taskById = new Map(tasks.map((t) => [t.id, t]))

  const { data: complRows, error: complErr } = await admin
    .from('pro_lideres_daily_task_completions')
    .select('*')
    .eq('leader_tenant_id', tenantId)
    .gte('completed_on', from)
    .lte('completed_on', to)

  if (complErr) {
    console.error('[pro-lideres export] completions', complErr)
    throw new Error('Erro ao carregar conclusões de tarefas.')
  }

  const completions = (complRows ?? []) as ProLideresDailyTaskCompletionRow[]
  const tarefasLinhas: (string | number)[][] = [
    ['Tabulador', 'Membro', 'Data', 'Tarefa', 'Pontos da tarefa', 'Concluído às (UTC)'],
  ]
  for (const c of completions) {
    const title = taskById.get(c.task_id)?.title?.trim() || 'Tarefa'
    const pts = taskById.get(c.task_id)?.points ?? 0
    tarefasLinhas.push([
      tabByUser.get(c.member_user_id) ?? '—',
      displayName(c.member_user_id, profileById),
      c.completed_on,
      title,
      pts,
      c.completed_at,
    ])
  }

  const completionsByTab = new Map<string, { count: number; users: Set<string> }>()
  for (const c of completions) {
    if (!memberIdsOnly.has(c.member_user_id)) continue
    const tab = tabByUser.get(c.member_user_id) ?? '—'
    const cur = completionsByTab.get(tab) ?? { count: 0, users: new Set() }
    cur.count += 1
    cur.users.add(c.member_user_id)
    completionsByTab.set(tab, cur)
  }
  const tarefasResumoTab: (string | number)[][] = [
    ['Tabulador', 'Conclusões no período', 'Membros distintos com conclusão'],
  ]
  for (const [tab, v] of [...completionsByTab.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pt'))) {
    tarefasResumoTab.push([tab, v.count, v.users.size])
  }
  if (completionsByTab.size === 0) {
    tarefasResumoTab.push(['—', 0, 0])
  }

  const sinceIso = `${from}T00:00:00.000Z`
  const untilIso = `${to}T23:59:59.999Z`

  const { data: linkRows, error: linkErr } = await admin
    .from('ylada_links')
    .select('id, slug, title, template_id')
    .eq('user_id', ownerUserId)

  if (linkErr) {
    console.error('[pro-lideres export] links', linkErr)
    throw new Error('Erro ao carregar links.')
  }

  const links = linkRows ?? []
  const linkIds = links.map((l) => l.id as string)
  const linkMeta = new Map(
    links.map((l) => [
      l.id as string,
      {
        slug: (l.slug as string) || '',
        title: ((l.title as string)?.trim() || (l.slug as string) || 'Link') as string,
      },
    ])
  )

  const globalByLink = new Map<string, LinkFour>()
  const memberByLink = new Map<string, LinkFour>()
  const memberTotal = new Map<string, LinkFour>()
  let eventsTruncated = false

  const getGlobal = (lid: string) => {
    let g = globalByLink.get(lid)
    if (!g) {
      g = emptyFour()
      globalByLink.set(lid, g)
    }
    return g
  }

  if (linkIds.length) {
    const { data: events, error: evErr } = await admin
      .from('ylada_link_events')
      .select('link_id, event_type, utm_json')
      .in('link_id', linkIds)
      .gte('created_at', sinceIso)
      .lte('created_at', untilIso)
      .limit(MAX_LINK_EVENTS)

    if (evErr) {
      console.error('[pro-lideres export] events', evErr)
      throw new Error('Erro ao carregar eventos de links.')
    }
    const evList = events ?? []
    eventsTruncated = evList.length >= MAX_LINK_EVENTS

    for (const e of evList) {
      const lid = e.link_id as string
      if (!linkMeta.has(lid)) continue
      const et = String(e.event_type || '')
      addLinkEvent(getGlobal(lid), et)

      const uj = (e.utm_json as Record<string, unknown> | null) ?? {}
      const tenantMatch = typeof uj.pl_tenant_id === 'string' && uj.pl_tenant_id === tenantId
      const mid = typeof uj.pl_member_user_id === 'string' ? uj.pl_member_user_id : null
      const tracked = tenantMatch || !!mid
      if (!tracked || !mid || !memberIdsOnly.has(mid)) continue

      const mlKey = `${mid}\t${lid}`
      let ml = memberByLink.get(mlKey)
      if (!ml) {
        ml = emptyFour()
        memberByLink.set(mlKey, ml)
      }
      addLinkEvent(ml, et)

      let mt = memberTotal.get(mid)
      if (!mt) {
        mt = emptyFour()
        memberTotal.set(mid, mt)
      }
      addLinkEvent(mt, et)
    }
  }

  const linkRankingData: (string | number | string)[][] = []
  for (const id of linkIds) {
    const meta = linkMeta.get(id)!
    const f = globalByLink.get(id) ?? emptyFour()
    if (f.views + f.starts + f.completions + f.wa === 0) continue
    const sc = linkScore(f)
    linkRankingData.push([
      meta.title,
      meta.slug,
      f.views,
      f.starts,
      f.completions,
      f.wa,
      sc,
      pct100(f.wa, f.views),
      pct100(f.completions, f.views),
    ])
  }
  linkRankingData.sort((a, b) => Number(b[6]) - Number(a[6]))
  const linksRanking: (string | number | string)[][] = [
    [
      'Título',
      'Slug',
      'Ver link',
      'Início fluxo',
      'Ver resultado',
      'Clique WhatsApp',
      'Pontuação uso',
      'Taxa WA / views %',
      'Taxa resultado / views %',
    ],
    ...(linkRankingData.length ? linkRankingData : [['—', '—', 0, 0, 0, 0, 0, '—', '—']]),
  ]

  type MemberAgg = {
    uid: string
    tab: string
    name: string
    f: LinkFour
    score: number
    rank: number
  }
  const byMemberRows: MemberAgg[] = [...memberIdsOnly].map((uid) => {
    const f = memberTotal.get(uid) ?? emptyFour()
    const score = linkScore(f)
    return {
      uid,
      tab: tabByUser.get(uid) ?? '—',
      name: displayName(uid, profileById),
      f,
      score,
      rank: 0,
    }
  })
  byMemberRows.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'pt'))
  for (let i = 0; i < byMemberRows.length; i++) {
    const row = byMemberRows[i]!
    if (i === 0 || row.score < byMemberRows[i - 1]!.score) {
      row.rank = i + 1
    } else {
      row.rank = byMemberRows[i - 1]!.rank
    }
  }

  const linksMembros: (string | number | string)[][] = [
    [
      'Posição',
      'Tabulador',
      'Membro',
      'Ver (rastreado)',
      'Início',
      'Resultado',
      'WhatsApp',
      'Pontuação',
      'Taxa WA / views %',
      'Taxa resultado / views %',
    ],
  ]
  for (const r of byMemberRows) {
    const { f } = r
    linksMembros.push([
      r.rank,
      r.tab,
      r.name,
      f.views,
      f.starts,
      f.completions,
      f.wa,
      r.score,
      pct100(f.wa, f.views),
      pct100(f.completions, f.views),
    ])
  }

  const detMembroFerramenta: (string | number | string)[][] = [
    [
      'Tabulador',
      'Membro',
      'Ferramenta (título)',
      'Slug',
      'Ver',
      'Início',
      'Resultado',
      'WhatsApp',
      'Pontuação',
      'Taxa WA / views %',
      'Taxa resultado / views %',
    ],
  ]
  const pairRows: {
    tab: string
    name: string
    title: string
    slug: string
    f: LinkFour
    score: number
  }[] = []
  for (const [key, f] of memberByLink.entries()) {
    if (linkScore(f) === 0) continue
    const [mid, lid] = key.split('\t')
    const meta = linkMeta.get(lid)
    if (!meta) continue
    pairRows.push({
      tab: tabByUser.get(mid) ?? '—',
      name: displayName(mid, profileById),
      title: meta.title,
      slug: meta.slug,
      f,
      score: linkScore(f),
    })
  }
  pairRows.sort((a, b) => b.score - a.score || a.name.localeCompare(b.name, 'pt'))
  for (const r of pairRows) {
    detMembroFerramenta.push([
      r.tab,
      r.name,
      r.title,
      r.slug,
      r.f.views,
      r.f.starts,
      r.f.completions,
      r.f.wa,
      r.score,
      pct100(r.f.wa, r.f.views),
      pct100(r.f.completions, r.f.views),
    ])
  }
  if (pairRows.length === 0) {
    detMembroFerramenta.push(['—', '—', '—', '—', 0, 0, 0, 0, 0, '—', '—'])
  }

  const linksPorTab = new Map<string, LinkFour>()
  for (const r of byMemberRows) {
    const cur = linksPorTab.get(r.tab) ?? emptyFour()
    cur.views += r.f.views
    cur.starts += r.f.starts
    cur.completions += r.f.completions
    cur.wa += r.f.wa
    linksPorTab.set(r.tab, cur)
  }
  const linksResumoTab: (string | number | string)[][] = [
    [
      'Tabulador',
      'Ver (soma rastreada)',
      'Início (soma)',
      'Resultado (soma)',
      'WhatsApp (soma)',
      'Pontuação (soma)',
      'Taxa WA / views % (agregada)',
    ],
  ]
  for (const [tab, f] of [...linksPorTab.entries()].sort((a, b) => a[0].localeCompare(b[0], 'pt'))) {
    linksResumoTab.push([
      tab,
      f.views,
      f.starts,
      f.completions,
      f.wa,
      linkScore(f),
      pct100(f.wa, f.views),
    ])
  }
  if (linksPorTab.size === 0) {
    linksResumoTab.push(['—', 0, 0, 0, 0, 0, '—'])
  }

  const metaRows: (string | number)[][] = [
    ['Pro Líderes — exportação para diagnóstico'],
    ['Período (inclusive)', `${from} a ${to}`],
    ['Fuso da data «hoje»', TZ_SP],
    [
      'Nota — links (aba Links_ranking)',
      'Totais por ferramenta = todo o tráfego no período (ver, início, resultado, WhatsApp).',
    ],
    [
      'Nota — links rastreados (membro / tabulador)',
      'Abas Links_por_membro, Links_membro_ferram e Links_por_tab: só eventos com utm Pro Líderes (equipa) e membros ativos; pontuação = ver + 2×início + 3×resultado + 4×WhatsApp.',
    ],
    ['Limite de eventos lidos', String(MAX_LINK_EVENTS)],
    ['Eventos truncados?', eventsTruncated ? 'Sim — reduza o período ou exporte várias vezes em janelas menores.' : 'Não'],
  ]

  const wb = XLSX.utils.book_new()
  const sheets: { name: string; data: (string | number | string)[][] }[] = [
    { name: 'Metadados', data: metaRows },
    { name: 'Equipe', data: equipeRows },
    { name: 'Links_ranking', data: linksRanking },
    { name: 'Links_por_membro', data: linksMembros },
    { name: 'Links_membro_ferram', data: detMembroFerramenta },
    { name: 'Links_por_tab', data: linksResumoTab },
    { name: 'Tarefas_linhas', data: tarefasLinhas },
    { name: 'Tarefas_resumo_tab', data: tarefasResumoTab },
  ]

  for (const { name, data } of sheets) {
    const ws = XLSX.utils.aoa_to_sheet(data)
    XLSX.utils.book_append_sheet(wb, ws, safeSheetName(name))
  }

  const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' }) as Buffer
  return { buffer, range: { from, to }, eventsTruncated }
}
