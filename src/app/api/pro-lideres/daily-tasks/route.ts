import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { fetchProLideresMembersEnriched } from '@/lib/pro-lideres-members-enriched'
import { PL_WEEKDAY_ORDER, type ProLideresDailyTaskCompletionRow, type ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'

function isoDate(d: Date): string {
  return d.toISOString().slice(0, 10)
}

function defaultRange(): { from: string; to: string } {
  const now = new Date()
  const to = isoDate(now)
  const start = new Date(now.getFullYear(), now.getMonth(), 1)
  const from = isoDate(start)
  return { from, to }
}

function normalizeExecutionWeekdays(raw: unknown): number[] | null {
  if (!Array.isArray(raw)) return null
  const s = new Set<number>()
  for (const x of raw) {
    const n = Number(x)
    if (Number.isInteger(n) && n >= 0 && n <= 6) s.add(n)
  }
  if (s.size === 0) return null
  return PL_WEEKDAY_ORDER.filter((d) => s.has(d))
}

/**
 * GET: todas as tarefas do tenant + conclusões no intervalo [from, to] (por dia civil) + lembretes + pontos.
 * POST: criar tarefa (só líder) com dias da semana em que se executa.
 */
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

  const sp = request.nextUrl.searchParams
  const dr = defaultRange()
  const from = sp.get('from')?.trim() || dr.from
  const to = sp.get('to')?.trim() || dr.to
  if (!/^\d{4}-\d{2}-\d{2}$/.test(from) || !/^\d{4}-\d{2}-\d{2}$/.test(to)) {
    return NextResponse.json({ error: 'Parâmetros from e to devem ser YYYY-MM-DD.' }, { status: 400 })
  }
  if (from > to) {
    return NextResponse.json({ error: 'Data inicial não pode ser depois da final.' }, { status: 400 })
  }

  const tenantId = ctx.tenant.id
  const isOwner = ctx.tenant.owner_user_id === user.id

  const { data: taskRows, error: taskErr } = await supabaseAdmin
    .from('pro_lideres_daily_tasks')
    .select('*')
    .eq('leader_tenant_id', tenantId)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: true })

  if (taskErr) {
    console.error('[daily-tasks GET tasks]', taskErr)
    return NextResponse.json({ error: 'Erro ao carregar tarefas.' }, { status: 500 })
  }

  const tasks = (taskRows ?? []) as ProLideresDailyTaskRow[]

  const { data: complRows, error: complErr } = await supabaseAdmin
    .from('pro_lideres_daily_task_completions')
    .select('*')
    .eq('leader_tenant_id', tenantId)
    .gte('completed_on', from)
    .lte('completed_on', to)

  if (complErr) {
    console.error('[daily-tasks GET completions]', complErr)
    return NextResponse.json({ error: 'Erro ao carregar conclusões.' }, { status: 500 })
  }

  let completions = (complRows ?? []) as ProLideresDailyTaskCompletionRow[]
  if (!isOwner) {
    completions = completions.filter((c) => c.member_user_id === user.id)
  }

  const taskById = new Map(tasks.map((t) => [t.id, t]))
  const pointsByUserId: Record<string, number> = {}
  if (isOwner) {
    for (const c of complRows ?? []) {
      const t = taskById.get(c.task_id)
      if (!t) continue
      const uid = c.member_user_id
      pointsByUserId[uid] = (pointsByUserId[uid] ?? 0) + t.points
    }
  }

  let myPointsInRange = 0
  for (const c of complRows ?? []) {
    if (c.member_user_id !== user.id) continue
    const t = taskById.get(c.task_id)
    if (t) myPointsInRange += t.points
  }

  const { data: reminderRows, error: remErr } = await supabaseAdmin
    .from('pro_lideres_weekday_reminders')
    .select('weekday, body')
    .eq('leader_tenant_id', tenantId)

  if (remErr) {
    console.error('[daily-tasks GET reminders]', remErr)
    return NextResponse.json({ error: 'Erro ao carregar lembretes.' }, { status: 500 })
  }

  const reminders: Record<string, string> = {}
  for (const r of reminderRows ?? []) {
    reminders[String(r.weekday)] = (r.body as string) ?? ''
  }

  const members = isOwner ? await fetchProLideresMembersEnriched(tenantId) : []

  return NextResponse.json({
    tasks,
    completions,
    reminders,
    pointsByUserId,
    myPointsInRange,
    members,
    role: ctx.role,
    from,
    to,
  })
}

export async function POST(request: NextRequest) {
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
    return NextResponse.json({ error: 'Apenas o líder pode criar tarefas.' }, { status: 403 })
  }

  let body: {
    title?: string
    description?: string
    points?: number
    sort_order?: number
    execution_weekdays?: unknown
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const title = String(body.title ?? '').trim().slice(0, 500)
  if (title.length < 2) {
    return NextResponse.json({ error: 'Título inválido.' }, { status: 400 })
  }

  const description = body.description != null ? String(body.description).trim().slice(0, 2000) : null
  const points = Math.min(100000, Math.max(0, Number(body.points ?? 1) || 0))
  const sort_order = Number.isFinite(Number(body.sort_order)) ? Number(body.sort_order) : 0
  const execution_weekdays = normalizeExecutionWeekdays(body.execution_weekdays)
  if (!execution_weekdays) {
    return NextResponse.json(
      { error: 'Indica pelo menos um dia da semana em que esta tarefa se executa (0=dom … 6=sáb).' },
      { status: 400 }
    )
  }

  const { data: inserted, error } = await supabaseAdmin
    .from('pro_lideres_daily_tasks')
    .insert({
      leader_tenant_id: ctx.tenant.id,
      title,
      description: description || null,
      points,
      execution_weekdays,
      sort_order,
      created_by_user_id: user.id,
    })
    .select()
    .single()

  if (error) {
    console.error('[daily-tasks POST]', error)
    return NextResponse.json({ error: 'Erro ao criar tarefa.' }, { status: 500 })
  }

  return NextResponse.json({ task: inserted as ProLideresDailyTaskRow })
}
