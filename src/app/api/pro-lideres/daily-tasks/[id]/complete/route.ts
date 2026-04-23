import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresDailyTasksBlockedForMember } from '@/lib/pro-lideres-daily-tasks-access'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { weekdayFromYmd } from '@/lib/pro-lideres-daily-tasks-points'
import type { ProLideresDailyTaskCompletionRow, ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'

type RouteCtx = { params: Promise<{ id: string }> }

function parseYmd(s: string): string | null {
  const t = s.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null
}

/**
 * POST: marcar conclusão num dia civil (body: { date?: YYYY-MM-DD } — omisso = hoje no cliente deve enviar).
 * DELETE: desmarcar — query ?date=YYYY-MM-DD obrigatória.
 */
export async function POST(request: NextRequest, ctx: RouteCtx) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth
  const { id: taskId } = await ctx.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const tenantCtx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!tenantCtx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  const paidPost = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paidPost.ok) return paidPost.response

  if (proLideresDailyTasksBlockedForMember(tenantCtx.tenant, tenantCtx.role)) {
    return NextResponse.json({ error: 'Esta área não está visível para a equipe.' }, { status: 403 })
  }

  let bodyDate: string | undefined
  try {
    const body = await request.json().catch(() => ({}))
    if (typeof (body as { date?: string }).date === 'string') {
      bodyDate = (body as { date: string }).date
    }
  } catch {
    /* empty */
  }

  const dateStr = bodyDate != null ? parseYmd(bodyDate) : null
  if (!dateStr) {
    return NextResponse.json(
      { error: 'Envia a data civil em JSON: { "date": "YYYY-MM-DD" } (o dia em que cumpriste a tarefa).' },
      { status: 400 }
    )
  }

  const { data: task, error: taskErr } = await supabaseAdmin
    .from('pro_lideres_daily_tasks')
    .select('id, leader_tenant_id, execution_weekdays, points')
    .eq('id', taskId)
    .eq('leader_tenant_id', tenantCtx.tenant.id)
    .maybeSingle()

  if (taskErr || !task) {
    return NextResponse.json({ error: 'Tarefa não encontrada.' }, { status: 404 })
  }

  const row = task as Pick<ProLideresDailyTaskRow, 'execution_weekdays'>
  const dow = weekdayFromYmd(dateStr)
  const days = row.execution_weekdays ?? []
  if (!days.includes(dow)) {
    return NextResponse.json(
      { error: 'Esta tarefa não se aplica ao dia da semana desta data.' },
      { status: 400 }
    )
  }

  const { data: inserted, error } = await supabaseAdmin
    .from('pro_lideres_daily_task_completions')
    .insert({
      leader_tenant_id: tenantCtx.tenant.id,
      task_id: taskId,
      member_user_id: user.id,
      completed_on: dateStr,
    })
    .select()
    .single()

  if (error) {
    if (error.code === '23505') {
      return NextResponse.json({ error: 'Já registaste esta tarefa neste dia.' }, { status: 400 })
    }
    console.error('[daily-tasks complete POST]', error)
    return NextResponse.json({ error: 'Erro ao registar conclusão.' }, { status: 500 })
  }

  return NextResponse.json({ completion: inserted as ProLideresDailyTaskCompletionRow })
}

export async function DELETE(request: NextRequest, ctx: RouteCtx) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth
  const { id: taskId } = await ctx.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const tenantCtx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!tenantCtx) {
    return NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 })
  }

  const paidDel = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paidDel.ok) return paidDel.response

  if (proLideresDailyTasksBlockedForMember(tenantCtx.tenant, tenantCtx.role)) {
    return NextResponse.json({ error: 'Esta área não está visível para a equipe.' }, { status: 403 })
  }

  const dateStr = parseYmd(request.nextUrl.searchParams.get('date') ?? '')
  if (!dateStr) {
    return NextResponse.json({ error: 'Query ?date=YYYY-MM-DD obrigatória.' }, { status: 400 })
  }

  const { error } = await supabaseAdmin
    .from('pro_lideres_daily_task_completions')
    .delete()
    .eq('task_id', taskId)
    .eq('member_user_id', user.id)
    .eq('leader_tenant_id', tenantCtx.tenant.id)
    .eq('completed_on', dateStr)

  if (error) {
    return NextResponse.json({ error: 'Erro ao remover conclusão.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
