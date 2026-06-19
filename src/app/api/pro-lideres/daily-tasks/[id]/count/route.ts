import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { proLideresDailyTasksBlockedForMember } from '@/lib/pro-lideres-daily-tasks-access'
import { weekdayFromYmd } from '@/lib/pro-lideres-daily-tasks-points'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import type { ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'

type RouteCtx = { params: Promise<{ id: string }> }

function parseYmd(s: string): string | null {
  const t = s.trim()
  return /^\d{4}-\d{2}-\d{2}$/.test(t) ? t : null
}

/**
 * PUT: registrar a quantidade do membro numa tarefa com contador, num dia civil.
 * Body: { date: "YYYY-MM-DD", quantity: number }
 *
 * Regra: grava sempre a quantidade. Se a tarefa tem meta (count_goal) e
 * quantity >= meta → gera a conclusão (ponto). Abaixo da meta → remove a conclusão
 * (o número fica gravado, mas sem ponto).
 */
export async function PUT(request: NextRequest, ctx: RouteCtx) {
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

  const paid = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paid.ok) return paid.response

  if (proLideresDailyTasksBlockedForMember(tenantCtx.tenant, tenantCtx.role)) {
    return NextResponse.json({ error: 'Esta área não está visível para a equipe.' }, { status: 403 })
  }

  let body: { date?: string; quantity?: unknown }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const dateStr = parseYmd(String(body.date ?? ''))
  if (!dateStr) {
    return NextResponse.json({ error: 'Indica a data em {"date":"YYYY-MM-DD"}.' }, { status: 400 })
  }

  const quantity = Math.min(100000, Math.max(0, Math.floor(Number(body.quantity) || 0)))
  const tenantId = tenantCtx.tenant.id

  const { data: taskRow, error: taskErr } = await supabaseAdmin
    .from('pro_lideres_daily_tasks')
    .select('id, execution_weekdays, count_enabled, count_goal')
    .eq('id', taskId)
    .eq('leader_tenant_id', tenantId)
    .single()

  if (taskErr || !taskRow) {
    return NextResponse.json({ error: 'Tarefa não encontrada.' }, { status: 404 })
  }

  const task = taskRow as Pick<
    ProLideresDailyTaskRow,
    'id' | 'execution_weekdays' | 'count_enabled' | 'count_goal'
  >

  if (!task.count_enabled) {
    return NextResponse.json({ error: 'Esta tarefa não tem contador.' }, { status: 400 })
  }

  const dow = weekdayFromYmd(dateStr)
  if (!(task.execution_weekdays ?? []).includes(dow)) {
    return NextResponse.json({ error: 'Esta tarefa não se executa neste dia.' }, { status: 400 })
  }

  // 1) Grava a quantidade (upsert por tarefa+membro+dia).
  const { error: upErr } = await supabaseAdmin
    .from('pro_lideres_daily_task_counts')
    .upsert(
      {
        leader_tenant_id: tenantId,
        task_id: taskId,
        member_user_id: user.id,
        counted_on: dateStr,
        quantity,
      },
      { onConflict: 'task_id,member_user_id,counted_on' }
    )

  if (upErr) {
    console.error('[daily-tasks count PUT upsert]', upErr)
    return NextResponse.json({ error: 'Erro ao guardar a quantidade.' }, { status: 500 })
  }

  // 2) Sincroniza a conclusão (ponto) com a meta.
  const goal = task.count_goal
  const metGoal = goal != null && quantity >= goal

  if (metGoal) {
    // Garante a conclusão; ignora conflito (já concluída).
    const { error: insErr } = await supabaseAdmin
      .from('pro_lideres_daily_task_completions')
      .upsert(
        {
          leader_tenant_id: tenantId,
          task_id: taskId,
          member_user_id: user.id,
          completed_on: dateStr,
        },
        { onConflict: 'task_id,member_user_id,completed_on', ignoreDuplicates: true }
      )
    if (insErr) {
      console.error('[daily-tasks count PUT completion insert]', insErr)
      return NextResponse.json({ error: 'Erro ao registar a conclusão.' }, { status: 500 })
    }
  } else {
    const { error: delErr } = await supabaseAdmin
      .from('pro_lideres_daily_task_completions')
      .delete()
      .eq('leader_tenant_id', tenantId)
      .eq('task_id', taskId)
      .eq('member_user_id', user.id)
      .eq('completed_on', dateStr)
    if (delErr) {
      console.error('[daily-tasks count PUT completion delete]', delErr)
      return NextResponse.json({ error: 'Erro ao atualizar a conclusão.' }, { status: 500 })
    }
  }

  return NextResponse.json({ ok: true, quantity, done: metGoal })
}
