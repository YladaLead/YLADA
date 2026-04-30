import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isEsteticaConsultSegment } from '@/lib/estetica-consultoria'

type Ctx = { params: Promise<{ id: string }> }

export async function GET(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data, error } = await supabaseAdmin.from('ylada_estetica_consult_clients').select('*').eq('id', id).maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: 'Cliente não encontrado' }, { status: 404 })
  }

  return NextResponse.json({ item: data })
}

export async function PATCH(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: Record<string, unknown>
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const patch: Record<string, unknown> = {}

  if (body.business_name !== undefined) {
    const v = String(body.business_name ?? '').trim().slice(0, 300)
    if (v.length < 2) {
      return NextResponse.json({ error: 'Nome da estética inválido.' }, { status: 400 })
    }
    patch.business_name = v
  }

  if (body.segment !== undefined) {
    const s = String(body.segment ?? '').trim().toLowerCase()
    patch.segment = isEsteticaConsultSegment(s) ? s : 'capilar'
  }

  if (body.contact_name !== undefined) {
    patch.contact_name =
      body.contact_name == null || body.contact_name === ''
        ? null
        : String(body.contact_name).trim().slice(0, 200) || null
  }
  if (body.contact_email !== undefined) {
    patch.contact_email =
      body.contact_email == null || body.contact_email === ''
        ? null
        : String(body.contact_email).trim().slice(0, 320) || null
  }
  if (body.phone !== undefined) {
    patch.phone =
      body.phone == null || body.phone === '' ? null : String(body.phone).trim().slice(0, 40) || null
  }

  if (body.leader_tenant_id !== undefined) {
    const tid =
      body.leader_tenant_id == null || body.leader_tenant_id === ''
        ? null
        : String(body.leader_tenant_id).trim()
    if (tid) {
      const { data: lt } = await supabaseAdmin.from('leader_tenants').select('id').eq('id', tid).maybeSingle()
      if (!lt) {
        return NextResponse.json({ error: 'Tenant de líder inválido.' }, { status: 400 })
      }
    }
    patch.leader_tenant_id = tid
  }

  if (body.consulting_paid_amount !== undefined) {
    const raw = body.consulting_paid_amount
    if (raw == null || raw === '') {
      patch.consulting_paid_amount = null
    } else {
      const n = Number(raw)
      patch.consulting_paid_amount = Number.isFinite(n) ? Math.round(n * 100) / 100 : null
    }
  }

  if (body.payment_currency !== undefined) {
    patch.payment_currency = String(body.payment_currency ?? 'BRL').trim().slice(0, 8) || 'BRL'
  }

  if (body.last_payment_at !== undefined) {
    patch.last_payment_at =
      body.last_payment_at == null || body.last_payment_at === ''
        ? null
        : String(body.last_payment_at).trim() || null
  }

  if (body.is_annual_plan !== undefined) {
    patch.is_annual_plan = Boolean(body.is_annual_plan)
  }

  if (body.annual_plan_start !== undefined) {
    patch.annual_plan_start =
      body.annual_plan_start == null || body.annual_plan_start === ''
        ? null
        : String(body.annual_plan_start).trim().slice(0, 32) || null
  }
  if (body.annual_plan_end !== undefined) {
    patch.annual_plan_end =
      body.annual_plan_end == null || body.annual_plan_end === ''
        ? null
        : String(body.annual_plan_end).trim().slice(0, 32) || null
  }

  if (body.access_valid_until !== undefined) {
    patch.access_valid_until =
      body.access_valid_until == null || body.access_valid_until === ''
        ? null
        : String(body.access_valid_until).trim().slice(0, 32) || null

    const { data: curRow } = await supabaseAdmin
      .from('ylada_estetica_consult_clients')
      .select('access_valid_until')
      .eq('id', id)
      .maybeSingle()
    const oldV = (curRow as { access_valid_until?: string | null } | null)?.access_valid_until ?? null
    const newV = patch.access_valid_until ?? null
    const unchanged =
      (oldV == null && newV == null) || String(oldV || '') === String(newV || '')
    if (!unchanged) {
      patch.access_expiry_reminder_sent_15d = false
      patch.access_expiry_reminder_sent_7d = false
      patch.access_expiry_reminder_sent_1d = false
    }
  }

  if (body.admin_notes !== undefined) {
    patch.admin_notes =
      body.admin_notes == null || body.admin_notes === ''
        ? null
        : String(body.admin_notes).trim().slice(0, 20000) || null
  }

  if (body.meeting_summary !== undefined) {
    patch.meeting_summary =
      body.meeting_summary == null || body.meeting_summary === ''
        ? null
        : String(body.meeting_summary).trim().slice(0, 20000) || null
  }

  if (Object.keys(patch).length === 0) {
    return NextResponse.json({ error: 'Nada para atualizar.' }, { status: 400 })
  }

  const { data, error } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .update(patch)
    .eq('id', id)
    .select('*')
    .maybeSingle()

  if (error || !data) {
    return NextResponse.json({ error: 'Erro ao atualizar cliente' }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}

export async function DELETE(request: NextRequest, context: Ctx) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { id } = await context.params

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { error } = await supabaseAdmin.from('ylada_estetica_consult_clients').delete().eq('id', id)
  if (error) {
    return NextResponse.json({ error: 'Erro ao eliminar' }, { status: 500 })
  }

  return NextResponse.json({ ok: true })
}
