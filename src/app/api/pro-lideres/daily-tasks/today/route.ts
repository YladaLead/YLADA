import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresDailyTasksBlockedForMember } from '@/lib/pro-lideres-daily-tasks-access'
import { weekdayFromYmd } from '@/lib/pro-lideres-daily-tasks-points'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import type { ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'

function parseYmd(s: string): string | null {
  const t = s.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null
}

/**
 * PUT: substituir as conclusões do utilizador num dia civil (checklist do dia).
 * Body: { date: "YYYY-MM-DD", completed_task_ids: string[] }
 */
export async function PUT(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const tenantCtx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!tenantCtx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  if (proLideresDailyTasksBlockedForMember(tenantCtx.tenant, tenantCtx.role)) {
    return NextResponse.json({ error: 'Esta área não está visível para a equipe.' }, { status: 403 })
  }

  let body: { date?: string; completed_task_ids?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const dateStr = parseYmd(String(body.date ?? ''))
  if (!dateStr) {
    return NextResponse.json({ error: 'Indica a data em {"date":"YYYY-MM-DD"}.' }, { status: 400 })
  }

  const rawIds = Array.isArray(body.completed_task_ids) ? body.completed_task_ids : []
  const ids = [...new Set(rawIds.map((x) => String(x)).filter(Boolean))]

  const tenantId = tenantCtx.tenant.id

  const { data: taskRows, error: taskErr } = await supabaseAdmin
    .from('pro_lideres_daily_tasks')
    .select('id, execution_weekdays')
    .eq('leader_tenant_id', tenantId)

  if (taskErr) {
    console.error('[daily-tasks today PUT tasks]', taskErr)
    return NextResponse.json({ error: 'Erro ao carregar tarefas.' }, { status: 500 })
  }

  const tasks = (taskRows ?? []) as Pick<ProLideresDailyTaskRow, 'id' | 'execution_weekdays'>[]
  const taskById = new Map(tasks.map((t) => [t.id, t]))
  const dow = weekdayFromYmd(dateStr)

  const validIds: string[] = []
  for (const id of ids) {
    const t = taskById.get(id)
    if (!t) continue
    const days = t.execution_weekdays ?? []
    if (days.includes(dow)) validIds.push(id)
  }

  const { error: delErr } = await supabaseAdmin
    .from('pro_lideres_daily_task_completions')
    .delete()
    .eq('leader_tenant_id', tenantId)
    .eq('member_user_id', user.id)
    .eq('completed_on', dateStr)

  if (delErr) {
    console.error('[daily-tasks today PUT delete]', delErr)
    return NextResponse.json({ error: 'Erro ao atualizar conclusões.' }, { status: 500 })
  }

  if (validIds.length === 0) {
    return NextResponse.json({ ok: true, completed_task_ids: [] })
  }

  const rows = validIds.map((task_id) => ({
    leader_tenant_id: tenantId,
    task_id,
    member_user_id: user.id,
    completed_on: dateStr,
  }))

  const { error: insErr } = await supabaseAdmin.from('pro_lideres_daily_task_completions').insert(rows)

  if (insErr) {
    console.error('[daily-tasks today PUT insert]', insErr)
    return NextResponse.json({ error: 'Erro ao guardar conclusões.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true, completed_task_ids: validIds })
}
