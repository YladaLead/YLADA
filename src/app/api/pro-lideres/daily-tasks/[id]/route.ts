import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { PL_WEEKDAY_ORDER, type ProLideresDailyTaskRow } from '@/types/pro-lideres-daily-tasks'

type RouteCtx = { params: Promise<{ id: string }> }

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

export async function PATCH(request: NextRequest, ctx: RouteCtx) {
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
  if (tenantCtx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode editar tarefas.' }, { status: 403 })
  }

  const paidPatch = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paidPatch.ok) return paidPatch.response

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const payload: Record<string, string | number | number[] | null> = {}
  if (typeof body.title === 'string') {
    const t = body.title.trim().slice(0, 500)
    if (t.length >= 2) payload.title = t
  }
  if (typeof body.description === 'string') {
    payload.description = body.description.trim().slice(0, 2000) || null
  }
  if (body.points !== undefined) {
    payload.points = Math.min(100000, Math.max(0, Number(body.points) || 0))
  }
  if (body.execution_weekdays !== undefined) {
    const ew = normalizeExecutionWeekdays(body.execution_weekdays)
    if (!ew) {
      return NextResponse.json({ error: 'Dias da semana inválidos.' }, { status: 400 })
    }
    payload.execution_weekdays = ew
  }
  if (body.sort_order !== undefined && Number.isFinite(Number(body.sort_order))) {
    payload.sort_order = Number(body.sort_order)
  }

  if (Object.keys(payload).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar.' }, { status: 400 })
  }

  const { data: task, error } = await supabaseAdmin
    .from('pro_lideres_daily_tasks')
    .update(payload)
    .eq('id', taskId)
    .eq('leader_tenant_id', tenantCtx.tenant.id)
    .select()
    .single()

  if (error || !task) {
    return NextResponse.json({ error: 'Tarefa não encontrada ou sem permissão.' }, { status: 404 })
  }

  return NextResponse.json({ task: task as ProLideresDailyTaskRow })
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
  if (tenantCtx.tenant.owner_user_id !== user.id) {
    return NextResponse.json({ error: 'Apenas o líder pode remover tarefas.' }, { status: 403 })
  }

  const paidDel = await requireProLideresPaidContext(supabaseAdmin, user, { allowUnpaidOwnerDraft: true })
  if (!paidDel.ok) return paidDel.response

  const { error } = await supabaseAdmin
    .from('pro_lideres_daily_tasks')
    .delete()
    .eq('id', taskId)
    .eq('leader_tenant_id', tenantCtx.tenant.id)

  if (error) {
    return NextResponse.json({ error: 'Erro ao remover.' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
