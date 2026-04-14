import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'

type ReminderInput = { weekday: number; body: string }

/**
 * PUT: substituir lembretes por dia da semana (só líder).
 * Body: { reminders: [{ weekday: 0-6, body: string }, ...] }
 */
export async function PUT(request: NextRequest) {
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
    return NextResponse.json({ error: 'Apenas o líder pode editar lembretes.' }, { status: 403 })
  }

  let body: { reminders?: ReminderInput[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const list = Array.isArray(body.reminders) ? body.reminders : []
  const tenantId = ctx.tenant.id

  for (const r of list) {
    const w = Number(r.weekday)
    if (!Number.isInteger(w) || w < 0 || w > 6) {
      return NextResponse.json({ error: 'Cada lembrete precisa de weekday entre 0 (dom) e 6 (sáb).' }, { status: 400 })
    }
    const text = String(r.body ?? '').trim().slice(0, 4000)

    const { error: delErr } = await supabaseAdmin
      .from('pro_lideres_weekday_reminders')
      .delete()
      .eq('leader_tenant_id', tenantId)
      .eq('weekday', w)

    if (delErr) {
      console.error('[daily-tasks reminders PUT delete]', delErr)
      return NextResponse.json({ error: 'Erro ao guardar lembretes.' }, { status: 500 })
    }

    if (text.length > 0) {
      const { error: insErr } = await supabaseAdmin.from('pro_lideres_weekday_reminders').insert({
        leader_tenant_id: tenantId,
        weekday: w,
        body: text,
      })
      if (insErr) {
        console.error('[daily-tasks reminders PUT insert]', insErr)
        return NextResponse.json({ error: 'Erro ao guardar lembretes.' }, { status: 500 })
      }
    }
  }

  const { data: rows, error: selErr } = await supabaseAdmin
    .from('pro_lideres_weekday_reminders')
    .select('weekday, body')
    .eq('leader_tenant_id', tenantId)

  if (selErr) {
    return NextResponse.json({ error: 'Erro ao recarregar lembretes.' }, { status: 500 })
  }

  const reminders: Record<string, string> = {}
  for (const r of rows ?? []) {
    reminders[String(r.weekday)] = (r.body as string) ?? ''
  }

  return NextResponse.json({ reminders })
}
