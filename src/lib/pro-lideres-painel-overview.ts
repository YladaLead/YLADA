import { supabaseAdmin } from '@/lib/supabase'
import { fetchProLideresMembersEnriched, type ProLideresMemberListItem } from '@/lib/pro-lideres-members-enriched'
import { pointsForUserInRange } from '@/lib/pro-lideres-daily-tasks-points'
import { PRO_LIDERES_DEV_STUB_TENANT_ID } from '@/lib/pro-lideres-server'
import type { ProLideresDailyTaskCompletionRow, ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'

export type PainelMemberStatus = 'ativo' | 'risco' | 'parado'

export type PainelOverviewMemberPoints = {
  userId: string
  displayName: string
  points: number
  completionsInRange: number
  lastActivityOn: string | null
  completedToday: number
}

/** Ranking da equipe (só membros, sem o líder). */
export type PainelOverviewTeamRank = {
  userId: string
  displayName: string
  points: number
  completionsInRange: number
  completedToday: number
  trackedViews: number
  trackedWhatsapp: number
  status: PainelMemberStatus
  lastActivityOn: string | null
}

export type PainelOverviewThermometer = {
  /** Uma linha sobre a situação da semana. */
  situationLine: string
  activeToday: number
  inactiveToday: number
  totalMembers: number
  engagementPct: number
  whatsappConversations: number
  /** Variação % das conclusões de tarefas da equipe vs período anterior (mesma duração). */
  weekVsWeekPct: number | null
  weekVsWeekDirection: 'up' | 'down' | 'flat'
}

export type PainelOverviewAlert = {
  id: string
  variant: 'critical' | 'warning' | 'info'
  title: string
  body: string
  memberIds: string[]
  ctaLabel: string
  ctaHref: string
}

export type PainelOverviewFunnel = {
  /** Visualizações de links (todos os eventos view). */
  linkViews: number
  /** Fluxos concluídos (eventos complete + result_view). */
  diagnosticsCompleted: number
  /** Cliques no WhatsApp (cta_click). */
  whatsappClicks: number
}

export type PainelOverviewTopLink = {
  linkId: string
  slug: string
  title: string
  views: number
  whatsappClicks: number
}

export type PainelOverviewMemberLinkActivity = {
  userId: string
  displayName: string
  views: number
  whatsappClicks: number
}

export type PainelOverviewRecentCompletion = {
  memberUserId: string
  displayName: string
  taskTitle: string
  completedOn: string
}

export type PainelOverviewPreset = 'yesterday' | '7d' | '30d' | 'custom'

export type ProLideresPainelOverviewPayload = {
  rangeFrom: string
  rangeTo: string
  /** Dia civil atual (fuso SP). */
  today: string
  /** Dia usado para “quem fez tarefa hoje/ontem” no termômetro e no ranking. */
  focusDay: string
  /** Legenda curta: "hoje" | "ontem" | "14 abr". */
  focusDayShortLabel: string
  /** Título curto do dia de foco: "Hoje", "Ontem", "14 de abr.". */
  focusCaption: string
  /** Ex.: "Últimos 7 dias", "Ontem", "De 1 a 14 abr.". */
  periodLabel: string
  preset: PainelOverviewPreset
  ownerUserId: string
  memberCount: number
  /** Membros (sem contar o líder), só para cópia. */
  teamMemberCount: number
  totalPointsInRange: number
  totalCompletionsInRange: number
  completionsToday: number
  /** Membros (role member) com pelo menos uma conclusão no período. */
  activeMembersOnTasks: number
  /** Membros com atividade rastreada em links (utm pl_member) no período. */
  membersWithTrackedLinkViews: number
  totalTrackedLinkViews: number
  totalTrackedWhatsappClicks: number
  memberPoints: PainelOverviewMemberPoints[]
  /** Ranking só da equipe (membros), ordenado por pontos. */
  teamRanking: PainelOverviewTeamRank[]
  thermometer: PainelOverviewThermometer
  alerts: PainelOverviewAlert[]
  funnel: PainelOverviewFunnel
  topLinks: PainelOverviewTopLink[]
  memberLinkActivity: PainelOverviewMemberLinkActivity[]
  recentCompletions: PainelOverviewRecentCompletion[]
  diagnostic: string
  nextSteps: string[]
}

function ymdInTimeZone(d: Date, timeZone: string): string {
  return d.toLocaleDateString('en-CA', { timeZone })
}

function addDaysYmd(ymd: string, delta: number): string {
  const [y, m, day] = ymd.split('-').map(Number)
  const dt = new Date(Date.UTC(y, m - 1, day + delta))
  return dt.toISOString().slice(0, 10)
}

/** Número de dias civis inclusive [from, to]. */
function daysBetweenInclusive(from: string, to: string): number {
  const [yf, mf, df] = from.split('-').map(Number)
  const [yt, mt, dt] = to.split('-').map(Number)
  const a = Date.UTC(yf, mf - 1, df)
  const b = Date.UTC(yt, mt - 1, dt)
  return Math.floor((b - a) / (24 * 60 * 60 * 1000)) + 1
}

function focusLabels(
  calendarToday: string,
  focusDay: string
): { focusDayShortLabel: string; focusCaption: string } {
  if (focusDay === calendarToday) {
    return { focusDayShortLabel: 'hoje', focusCaption: 'Hoje' }
  }
  if (focusDay === addDaysYmd(calendarToday, -1)) {
    return { focusDayShortLabel: 'ontem', focusCaption: 'Ontem' }
  }
  const [y, m, d] = focusDay.split('-').map(Number)
  const cap = new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
  const short = new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
  })
  return {
    focusDayShortLabel: short,
    focusCaption: cap.charAt(0).toUpperCase() + cap.slice(1),
  }
}

function periodLabelCustom(from: string, to: string): string {
  if (from === to) {
    const [y, m, d] = from.split('-').map(Number)
    return new Date(y, m - 1, d).toLocaleDateString('pt-BR', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    })
  }
  const [yf, mf, df] = from.split('-').map(Number)
  const [yt, mt, dt] = to.split('-').map(Number)
  const a = new Date(yf, mf - 1, df).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
  const b = new Date(yt, mt - 1, dt).toLocaleDateString('pt-BR', { day: 'numeric', month: 'short' })
  return `${a} – ${b}`
}

function computeMemberStatus(
  today: string,
  completionsInRange: number,
  completedToday: number,
  lastActivityOn: string | null,
  trackedViews: number,
  trackedWhatsapp: number
): PainelMemberStatus {
  const hasLink = trackedViews > 0 || trackedWhatsapp > 0
  const hasTask = completionsInRange > 0
  if (!hasTask && !hasLink) return 'parado'
  if (completedToday > 0) return 'ativo'
  const lim = addDaysYmd(today, -2)
  if (lastActivityOn && lastActivityOn >= lim) return 'ativo'
  if (hasLink) return 'ativo'
  if (hasTask && lastActivityOn && lastActivityOn < lim) return 'risco'
  return 'risco'
}

function buildSituationLine(p: {
  teamMemberCount: number
  engagementPct: number
  weekVsWeekPct: number | null
  weekVsWeekDirection: 'up' | 'down' | 'flat'
  activeOnFocusDay: number
  totalMembers: number
  vsPeriodPhrase: string
  focusCaption: string
}): string {
  if (p.teamMemberCount === 0) {
    return 'Convide pessoas para a equipe para começar a medir desempenho e ações no dia a dia.'
  }
  const bits: string[] = []
  bits.push(`${p.engagementPct}% da equipe com pelo menos uma conclusão de tarefa no período.`)
  if (p.weekVsWeekPct != null && p.weekVsWeekDirection === 'up') {
    bits.push(`Conclusões de tarefas subiram cerca de ${p.weekVsWeekPct}% em relação a ${p.vsPeriodPhrase}.`)
  } else if (p.weekVsWeekPct != null && p.weekVsWeekDirection === 'down') {
    bits.push(
      `Conclusões caíram cerca de ${p.weekVsWeekPct}% vs ${p.vsPeriodPhrase} — vale conversar com quem parou.`
    )
  } else if (p.weekVsWeekPct != null && p.weekVsWeekDirection === 'flat') {
    bits.push(`Ritmo parecido com ${p.vsPeriodPhrase}.`)
  }
  bits.push(
    `${p.focusCaption}: ${p.activeOnFocusDay} de ${p.totalMembers} membros com tarefa registrada nesse dia.`
  )
  return bits.join(' ')
}

function buildAlerts(input: {
  calendarToday: string
  focusDay: string
  focusDayShortLabel: string
  teamMemberCount: number
  teamRanking: PainelOverviewTeamRank[]
  currTeamCompletions: number
  prevTeamCompletions: number
  totalTrackedLinkViews: number
  activeMembersOnTasks: number
}): PainelOverviewAlert[] {
  const out: PainelOverviewAlert[] = []
  const {
    calendarToday,
    focusDay,
    focusDayShortLabel,
    teamMemberCount,
    teamRanking,
    currTeamCompletions,
    prevTeamCompletions,
    totalTrackedLinkViews,
    activeMembersOnTasks,
  } = input

  if (teamMemberCount === 0) return out

  const lim3 = addDaysYmd(calendarToday, -3)
  const noTaskOnFocus = teamRanking.filter((m) => m.completedToday === 0)
  if (noTaskOnFocus.length >= 1) {
    const dayPhrase =
      focusDay === calendarToday
        ? 'hoje'
        : focusDayShortLabel === 'ontem'
          ? 'ontem'
          : `em ${focusDayShortLabel}`
    out.push({
      id: 'no_task_today',
      variant: noTaskOnFocus.length >= Math.ceil(teamRanking.length / 2) ? 'critical' : 'warning',
      title: `${noTaskOnFocus.length} membro(s) sem tarefa ${dayPhrase}`,
      body: 'Quem não registra tarefa perde visibilidade para você. Envie um lembrete ou veja o ranking.',
      memberIds: noTaskOnFocus.map((m) => m.userId),
      ctaLabel: 'Ver ranking',
      ctaHref: '/pro-lideres/painel#ranking-equipe',
    })
  }

  const quiet3 = teamRanking.filter(
    (m) => m.lastActivityOn != null && m.lastActivityOn < lim3
  )
  if (quiet3.length >= 1) {
    out.push({
      id: 'quiet_3d',
      variant: 'warning',
      title: `${quiet3.length} membro(s) sem tarefa há mais de 3 dias`,
      body: 'Já tinham registrado antes, mas sumiram do ritmo — vale um contato direto.',
      memberIds: quiet3.map((m) => m.userId),
      ctaLabel: 'Ver quem são',
      ctaHref: '/pro-lideres/painel#ranking-equipe',
    })
  }

  if (prevTeamCompletions >= 4 && currTeamCompletions < prevTeamCompletions * 0.6) {
    const drop = Math.round(100 * (1 - currTeamCompletions / prevTeamCompletions))
    out.push({
      id: 'week_drop',
      variant: 'critical',
      title: `Queda forte nas conclusões (~${drop}% vs semana anterior)`,
      body: 'O ritmo da equipe caiu em relação ao período anterior. Combine uma ação rápida (reunião ou mensagem).',
      memberIds: [],
      ctaLabel: 'Tarefas diárias',
      ctaHref: '/pro-lideres/painel/tarefas',
    })
  }

  if (activeMembersOnTasks >= 1 && totalTrackedLinkViews === 0) {
    out.push({
      id: 'no_tracked_links',
      variant: 'info',
      title: 'Nenhum clique rastreado no catálogo',
      body: 'Sem o parâmetro de equipe nos links, você não vê quem abriu cada ferramenta.',
      memberIds: [],
      ctaLabel: 'Análise da equipe',
      ctaHref: '/pro-lideres/painel/equipe',
    })
  }

  return out.slice(0, 5)
}

function displayNameFrom(
  userId: string,
  enriched: ProLideresMemberListItem[],
  profileById: Map<string, { nome_completo: string | null; email: string | null }>
): string {
  const m = enriched.find((x) => x.userId === userId)
  const p = profileById.get(userId)
  const n = m?.displayName?.trim() || p?.nome_completo?.trim()
  if (n) return n
  const e = m?.email?.trim() || p?.email?.trim()
  if (e) return e
  return userId.slice(0, 8)
}

function buildDiagnostic(p: {
  teamMemberCount: number
  activeMembersOnTasks: number
  membersWithTrackedLinkViews: number
  totalTrackedLinkViews: number
  totalCompletionsInRange: number
  completionsOnFocusDay: number
  calendarToday: string
  focusDay: string
}): { diagnostic: string; nextSteps: string[] } {
  const nextSteps: string[] = []
  let diagnostic = ''

  if (p.teamMemberCount === 0) {
    diagnostic =
      'Ainda não há outros membros na equipe além de você. Use Convites equipe para gerar links e acompanhar a atividade aqui.'
    nextSteps.push('Gerar um link de convite em Convites equipe.')
    return { diagnostic, nextSteps }
  }

  const taskEngage =
    p.teamMemberCount > 0 ? p.activeMembersOnTasks / p.teamMemberCount : 0
  const linkEngage =
    p.teamMemberCount > 0 ? p.membersWithTrackedLinkViews / p.teamMemberCount : 0

  if (taskEngage < 0.25) {
    diagnostic +=
      ' Poucos membros estão registrando tarefas diárias neste período — o hábito pode não ter pegado ou as tarefas precisam estar mais alinhadas ao que fazem no dia a dia.'
    nextSteps.push('Conversar com a equipe sobre o que atrapalha o registro das tarefas (tempo, clareza, prioridade).')
  } else if (taskEngage >= 0.65) {
    diagnostic +=
      ' A equipe está bem engajada nas tarefas diárias — bom sinal de disciplina e de visibilidade para você.'
  } else {
    diagnostic +=
      ' Parte da equipe usa as tarefas diárias; identifique quem está abaixo e alinhe expectativas em conversa individual ou em grupo.'
    nextSteps.push('Reconhecer quem está constante e apoiar quem tem poucas conclusões.')
  }

  if (p.totalTrackedLinkViews === 0) {
    diagnostic +=
      ' Ainda não há aberturas contadas por pessoa nas ferramentas do catálogo — sem o link certo para cada um, fica difícil saber quem está a divulgar o quê.'
    nextSteps.push(
      'Em Análise da equipe, escolha a ferramenta, carregue em «Criar ou atualizar links» e peça a cada pessoa para usar só o link que copiar dessa página ao partilhar.'
    )
  } else if (linkEngage < 0.3) {
    diagnostic +=
      ' As aberturas por pessoa concentram-se em poucos membros — pode haver diferença forte no uso do catálogo.'
    nextSteps.push(
      'Reforce que cada um use o link que recebe em Análise da equipe, e não só o endereço genérico da ferramenta.'
    )
  } else {
    diagnostic +=
      ' O uso por pessoa está bem repartido; continue a reforçar as ferramentas que mais convertem.'
  }

  if (
    p.completionsOnFocusDay === 0 &&
    p.totalCompletionsInRange > 0 &&
    p.focusDay === p.calendarToday
  ) {
    nextSteps.push('Hoje ainda não há conclusões registradas — veja se é feriado ou se vale um lembrete rápido.')
  }

  if (!diagnostic.trim()) {
    diagnostic =
      'Use o resumo abaixo para priorizar conversas: junte tarefas diárias e uso das ferramentas do catálogo.'
  }

  nextSteps.push('Abra Análise da equipe para ver detalhes por pessoa e por link.')
  nextSteps.push('Em Tarefas diárias, ajuste pontos e dias da semana conforme a operação.')

  const uniqueSteps = [...new Set(nextSteps)]
  return { diagnostic: diagnostic.trim(), nextSteps: uniqueSteps.slice(0, 5) }
}

/**
 * Agrega tarefas, conclusões e telemetria de links YLADA do dono do tenant.
 * `preset`: ontem | 7d | 30d (fuso SP). Com `customFrom`+`customTo` válidos, usa intervalo personalizado.
 */
export async function fetchProLideresPainelOverview(opts: {
  tenantId: string
  ownerUserId: string
  preset?: PainelOverviewPreset
  customFrom?: string | null
  customTo?: string | null
}): Promise<ProLideresPainelOverviewPayload | null> {
  const { tenantId, ownerUserId } = opts
  if (!supabaseAdmin) return null

  const tz = 'America/Sao_Paulo'
  const calendarToday = ymdInTimeZone(new Date(), tz)

  const ymdRe = /^\d{4}-\d{2}-\d{2}$/
  const cf = opts.customFrom?.trim() ?? ''
  const ct = opts.customTo?.trim() ?? ''
  const useCustom =
    Boolean(cf && ct && ymdRe.test(cf) && ymdRe.test(ct) && cf <= ct && ct <= calendarToday) &&
    daysBetweenInclusive(cf, ct) >= 1 &&
    daysBetweenInclusive(cf, ct) <= 90

  if ((cf || ct) && !useCustom) {
    return null
  }

  let rangeFrom: string
  let rangeTo: string
  let dayCount: number
  let periodLabel: string
  let presetEffective: PainelOverviewPreset

  if (useCustom) {
    rangeFrom = cf
    rangeTo = ct
    dayCount = daysBetweenInclusive(cf, ct)
    presetEffective = 'custom'
    periodLabel = periodLabelCustom(cf, ct)
  } else {
    const p = opts.preset === 'custom' ? '7d' : opts.preset ?? '7d'
    presetEffective = p
    if (p === 'yesterday') {
      rangeTo = addDaysYmd(calendarToday, -1)
      rangeFrom = rangeTo
      dayCount = 1
      periodLabel = 'Ontem'
    } else if (p === '30d') {
      dayCount = 30
      rangeTo = calendarToday
      rangeFrom = addDaysYmd(calendarToday, -(dayCount - 1))
      periodLabel = 'Últimos 30 dias'
    } else {
      dayCount = 7
      rangeTo = calendarToday
      rangeFrom = addDaysYmd(calendarToday, -(dayCount - 1))
      periodLabel = 'Últimos 7 dias'
    }
  }

  const focusDay =
    presetEffective === 'yesterday' ? rangeTo : presetEffective === 'custom' ? rangeTo : calendarToday
  const { focusDayShortLabel, focusCaption } = focusLabels(calendarToday, focusDay)

  const vsPeriodPhrase =
    presetEffective === 'custom'
      ? 'o período anterior (mesma duração)'
      : presetEffective === 'yesterday'
        ? 'anteontem'
        : presetEffective === '30d'
          ? 'os 30 dias anteriores'
          : 'a semana anterior'

  const emptyThermometer = (line: string): PainelOverviewThermometer => ({
    situationLine: line,
    activeToday: 0,
    inactiveToday: 0,
    totalMembers: 0,
    engagementPct: 0,
    whatsappConversations: 0,
    weekVsWeekPct: null,
    weekVsWeekDirection: 'flat',
  })

  if (tenantId === PRO_LIDERES_DEV_STUB_TENANT_ID) {
    const stubLine =
      'Modo teste: sem dados reais. Configure o tenant para ver engajamento, ranking e alertas.'
    return {
      rangeFrom,
      rangeTo,
      today: calendarToday,
      focusDay,
      focusDayShortLabel,
      focusCaption,
      periodLabel,
      preset: presetEffective,
      ownerUserId,
      memberCount: 1,
      teamMemberCount: 0,
      totalPointsInRange: 0,
      totalCompletionsInRange: 0,
      completionsToday: 0,
      activeMembersOnTasks: 0,
      membersWithTrackedLinkViews: 0,
      totalTrackedLinkViews: 0,
      totalTrackedWhatsappClicks: 0,
      memberPoints: [
        {
          userId: ownerUserId,
          displayName: 'Você (teste)',
          points: 0,
          completionsInRange: 0,
          lastActivityOn: null,
          completedToday: 0,
        },
      ],
      teamRanking: [],
      thermometer: emptyThermometer(stubLine),
      alerts: [],
      funnel: { linkViews: 0, diagnosticsCompleted: 0, whatsappClicks: 0 },
      topLinks: [],
      memberLinkActivity: [],
      recentCompletions: [],
      diagnostic:
        'Painel em modo de teste, sem dados reais no banco. Configure um tenant ou desative o modo de desenvolvimento para ver métricas de verdade.',
      nextSteps: ['Configurar Supabase e migrações, ou entrar com um usuário que já tenha tenant.'],
    }
  }

  const enriched = await fetchProLideresMembersEnriched(tenantId)
  const teamMemberCount = enriched.filter((m) => m.role === 'member' && m.teamAccessState === 'active').length

  const allUserIds = new Set<string>([ownerUserId, ...enriched.map((m) => m.userId)])

  const { data: ownerProf } = await supabaseAdmin
    .from('user_profiles')
    .select('id, nome_completo, email')
    .eq('id', ownerUserId)
    .maybeSingle()

  const profileById = new Map<string, { nome_completo: string | null; email: string | null }>()
  if (ownerProf) {
    profileById.set(ownerProf.id as string, {
      nome_completo: (ownerProf.nome_completo as string | null) ?? null,
      email: (ownerProf.email as string | null) ?? null,
    })
  }
  const missingIds = enriched.map((m) => m.userId).filter((id) => !profileById.has(id))
  if (missingIds.length) {
    const { data: profs } = await supabaseAdmin
      .from('user_profiles')
      .select('id, nome_completo, email')
      .in('id', missingIds)
    for (const p of profs ?? []) {
      profileById.set(p.id as string, {
        nome_completo: (p.nome_completo as string | null) ?? null,
        email: (p.email as string | null) ?? null,
      })
    }
  }

  const { data: taskRows, error: taskErr } = await supabaseAdmin
    .from('pro_lideres_daily_tasks')
    .select('*')
    .eq('leader_tenant_id', tenantId)
    .order('sort_order', { ascending: true })

  if (taskErr) {
    console.error('[painel-overview tasks]', taskErr)
    return null
  }

  const tasks = (taskRows ?? []) as ProLideresDailyTaskRow[]
  const taskById = new Map(tasks.map((t) => [t.id, t]))

  const prevFrom = addDaysYmd(rangeFrom, -dayCount)
  const prevTo = addDaysYmd(rangeFrom, -1)
  const extFrom =
    prevFrom < addDaysYmd(calendarToday, -120)
      ? addDaysYmd(calendarToday, -120)
      : prevFrom

  const { data: complRows, error: complErr } = await supabaseAdmin
    .from('pro_lideres_daily_task_completions')
    .select('*')
    .eq('leader_tenant_id', tenantId)
    .gte('completed_on', extFrom)
    .lte('completed_on', rangeTo)

  if (complErr) {
    console.error('[painel-overview completions]', complErr)
    return null
  }

  const complExt = (complRows ?? []) as ProLideresDailyTaskCompletionRow[]
  const complAll = complExt.filter((c) => c.completed_on >= rangeFrom && c.completed_on <= rangeTo)
  const complPrevWindow = complExt.filter(
    (c) => c.completed_on >= prevFrom && c.completed_on <= prevTo
  )

  const { data: tenantRow } = await supabaseAdmin
    .from('leader_tenants')
    .select('daily_tasks_full_day_bonus_points')
    .eq('id', tenantId)
    .maybeSingle()

  const fullDayBonusPoints = Math.min(
    100000,
    Math.max(0, Math.floor(Number(tenantRow?.daily_tasks_full_day_bonus_points ?? 10)))
  )

  const memberPoints: PainelOverviewMemberPoints[] = []
  let totalPointsInRange = 0
  let totalCompletionsInRange = 0
  let completionsToday = 0

  const lastActivityByUser = new Map<string, string>()
  for (const c of complExt) {
    const prev = lastActivityByUser.get(c.member_user_id)
    if (!prev || c.completed_on > prev) lastActivityByUser.set(c.member_user_id, c.completed_on)
  }

  const completionsTodayByUser = new Map<string, number>()
  for (const c of complAll) {
    if (c.completed_on === focusDay) {
      completionsTodayByUser.set(c.member_user_id, (completionsTodayByUser.get(c.member_user_id) ?? 0) + 1)
      completionsToday += 1
    }
  }

  for (const uid of allUserIds) {
    const pts = pointsForUserInRange(uid, tasks, complAll, rangeFrom, rangeTo, fullDayBonusPoints)
    const myCompl = complAll.filter((c) => c.member_user_id === uid)
    totalPointsInRange += pts
    totalCompletionsInRange += myCompl.length

    memberPoints.push({
      userId: uid,
      displayName: displayNameFrom(uid, enriched, profileById),
      points: pts,
      completionsInRange: myCompl.length,
      lastActivityOn: lastActivityByUser.get(uid) ?? null,
      completedToday: completionsTodayByUser.get(uid) ?? 0,
    })
  }

  memberPoints.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return a.displayName.localeCompare(b.displayName, 'pt')
  })

  const memberIdsOnly = new Set(
    enriched.filter((m) => m.role === 'member' && m.teamAccessState === 'active').map((m) => m.userId)
  )
  const activeMembersOnTasks = enriched.filter((m) => {
    if (m.role !== 'member' || m.teamAccessState !== 'active') return false
    return complAll.some((c) => c.member_user_id === m.userId)
  }).length

  const currTeamCompletions = complAll.filter((c) => memberIdsOnly.has(c.member_user_id)).length
  const prevTeamCompletions = complPrevWindow.filter((c) => memberIdsOnly.has(c.member_user_id)).length

  let weekVsWeekPct: number | null = null
  let weekVsWeekDirection: 'up' | 'down' | 'flat' = 'flat'
  if (prevTeamCompletions > 0) {
    const raw = Math.round(
      (100 * (currTeamCompletions - prevTeamCompletions)) / prevTeamCompletions
    )
    weekVsWeekPct = Math.min(999, Math.abs(raw))
    weekVsWeekDirection = raw > 4 ? 'up' : raw < -4 ? 'down' : 'flat'
  } else if (currTeamCompletions > 0) {
    weekVsWeekPct = 100
    weekVsWeekDirection = 'up'
  }

  const engagementPct =
    teamMemberCount > 0 ? Math.round((100 * activeMembersOnTasks) / teamMemberCount) : 0

  const activeTodayCount = [...memberIdsOnly].filter(
    (uid) => (completionsTodayByUser.get(uid) ?? 0) > 0
  ).length
  const inactiveTodayCount = Math.max(0, teamMemberCount - activeTodayCount)

  const recentCompletions: PainelOverviewRecentCompletion[] = [...complAll]
    .sort((a, b) => {
      if (a.completed_on !== b.completed_on) return b.completed_on.localeCompare(a.completed_on)
      return b.completed_at.localeCompare(a.completed_at)
    })
    .slice(0, 8)
    .map((c) => ({
      memberUserId: c.member_user_id,
      displayName: displayNameFrom(c.member_user_id, enriched, profileById),
      taskTitle: taskById.get(c.task_id)?.title?.trim() || 'Tarefa',
      completedOn: c.completed_on,
    }))

  const sinceIso = `${rangeFrom}T00:00:00.000Z`

  let funnelLinkViews = 0
  let funnelDiagnostics = 0
  let funnelWhatsapp = 0

  const { data: linkRows } = await supabaseAdmin
    .from('ylada_links')
    .select('id, slug, title')
    .eq('user_id', ownerUserId)

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

  const viewsByLink = new Map<string, number>()
  const waByLink = new Map<string, number>()
  const viewsByMember = new Map<string, { views: number; wa: number }>()

  if (linkIds.length) {
    const { data: events, error: evErr } = await supabaseAdmin
      .from('ylada_link_events')
      .select('link_id, event_type, utm_json, created_at')
      .in('link_id', linkIds)
      .gte('created_at', sinceIso)
      .limit(8000)

    if (evErr) {
      console.error('[painel-overview events]', evErr)
    } else {
      for (const e of events ?? []) {
        const lid = e.link_id as string
        const uj = (e.utm_json as Record<string, unknown> | null) ?? {}
        const tenantMatch =
          typeof uj.pl_tenant_id === 'string' && uj.pl_tenant_id === tenantId
        const mid =
          typeof uj.pl_member_user_id === 'string' ? uj.pl_member_user_id : null
        const tracked = tenantMatch || !!mid
        const et = e.event_type as string

        if (et === 'view') {
          funnelLinkViews += 1
          viewsByLink.set(lid, (viewsByLink.get(lid) ?? 0) + 1)
          if (tracked && mid && memberIdsOnly.has(mid)) {
            const cur = viewsByMember.get(mid) ?? { views: 0, wa: 0 }
            cur.views += 1
            viewsByMember.set(mid, cur)
          }
        }
        if (et === 'cta_click') {
          funnelWhatsapp += 1
          waByLink.set(lid, (waByLink.get(lid) ?? 0) + 1)
          if (tracked && mid && memberIdsOnly.has(mid)) {
            const cur = viewsByMember.get(mid) ?? { views: 0, wa: 0 }
            cur.wa += 1
            viewsByMember.set(mid, cur)
          }
        }
        if (et === 'complete' || et === 'result_view') {
          funnelDiagnostics += 1
        }
      }
    }
  }

  const topLinks: PainelOverviewTopLink[] = linkIds
    .map((id) => {
      const meta = linkMeta.get(id)!
      return {
        linkId: id,
        slug: meta.slug,
        title: meta.title,
        views: viewsByLink.get(id) ?? 0,
        whatsappClicks: waByLink.get(id) ?? 0,
      }
    })
    .filter((x) => x.views > 0 || x.whatsappClicks > 0)
    .sort((a, b) => b.views + b.whatsappClicks * 2 - (a.views + a.whatsappClicks * 2))
    .slice(0, 6)

  const memberLinkActivity: PainelOverviewMemberLinkActivity[] = [...memberIdsOnly].map((uid) => {
    const st = viewsByMember.get(uid) ?? { views: 0, wa: 0 }
    return {
      userId: uid,
      displayName: displayNameFrom(uid, enriched, profileById),
      views: st.views,
      whatsappClicks: st.wa,
    }
  })
  memberLinkActivity.sort((a, b) => {
    if (b.views !== a.views) return b.views - a.views
    return a.displayName.localeCompare(b.displayName, 'pt')
  })

  const linkByUserId = new Map(memberLinkActivity.map((m) => [m.userId, m]))
  const teamRanking: PainelOverviewTeamRank[] = enriched
    .filter((m) => m.role === 'member')
    .map((mem) => {
      const uid = mem.userId
      const mp = memberPoints.find((p) => p.userId === uid)!
      const lk = linkByUserId.get(uid) ?? { views: 0, whatsappClicks: 0 }
      const status = computeMemberStatus(
        calendarToday,
        mp.completionsInRange,
        mp.completedToday,
        mp.lastActivityOn,
        lk.views,
        lk.whatsappClicks
      )
      return {
        userId: uid,
        displayName: mp.displayName,
        points: mp.points,
        completionsInRange: mp.completionsInRange,
        completedToday: mp.completedToday,
        trackedViews: lk.views,
        trackedWhatsapp: lk.whatsappClicks,
        status,
        lastActivityOn: mp.lastActivityOn,
      }
    })
  teamRanking.sort((a, b) => {
    if (b.points !== a.points) return b.points - a.points
    return a.displayName.localeCompare(b.displayName, 'pt')
  })

  let totalTrackedLinkViews = 0
  let totalTrackedWhatsappClicks = 0
  for (const [, v] of viewsByMember) {
    totalTrackedLinkViews += v.views
    totalTrackedWhatsappClicks += v.wa
  }

  let membersWithTrackedLinkViews = 0
  for (const [, v] of viewsByMember) {
    if (v.views > 0 || v.wa > 0) membersWithTrackedLinkViews += 1
  }

  const { diagnostic, nextSteps } = buildDiagnostic({
    teamMemberCount,
    activeMembersOnTasks,
    membersWithTrackedLinkViews,
    totalTrackedLinkViews,
    totalCompletionsInRange,
    completionsOnFocusDay: completionsToday,
    calendarToday,
    focusDay,
  })

  const situationLine = buildSituationLine({
    teamMemberCount,
    engagementPct,
    weekVsWeekPct,
    weekVsWeekDirection,
    activeOnFocusDay: activeTodayCount,
    totalMembers: teamMemberCount,
    vsPeriodPhrase,
    focusCaption,
  })

  const thermometer: PainelOverviewThermometer = {
    situationLine,
    activeToday: activeTodayCount,
    inactiveToday: inactiveTodayCount,
    totalMembers: teamMemberCount,
    engagementPct,
    whatsappConversations: totalTrackedWhatsappClicks,
    weekVsWeekPct,
    weekVsWeekDirection,
  }

  const alerts = buildAlerts({
    calendarToday,
    focusDay,
    focusDayShortLabel,
    teamMemberCount,
    teamRanking,
    currTeamCompletions,
    prevTeamCompletions,
    totalTrackedLinkViews,
    activeMembersOnTasks,
  })

  const funnel: PainelOverviewFunnel = {
    linkViews: funnelLinkViews,
    diagnosticsCompleted: funnelDiagnostics,
    whatsappClicks: funnelWhatsapp,
  }

  return {
    rangeFrom,
    rangeTo,
    today: calendarToday,
    focusDay,
    focusDayShortLabel,
    focusCaption,
    periodLabel,
    preset: presetEffective,
    ownerUserId,
    memberCount: allUserIds.size,
    teamMemberCount,
    totalPointsInRange,
    totalCompletionsInRange,
    completionsToday,
    activeMembersOnTasks,
    membersWithTrackedLinkViews,
    totalTrackedLinkViews,
    totalTrackedWhatsappClicks,
    memberPoints,
    teamRanking,
    thermometer,
    alerts,
    funnel,
    topLinks,
    memberLinkActivity,
    recentCompletions,
    diagnostic,
    nextSteps,
  }
}
