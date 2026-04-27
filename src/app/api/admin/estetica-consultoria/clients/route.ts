import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isEsteticaConsultSegment } from '@/lib/estetica-consultoria'

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const q = request.nextUrl.searchParams.get('q')?.trim()
  let query = supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .select('*')
    .order('updated_at', { ascending: false })

  if (q && q.length >= 2) {
    const like = `%${q.replace(/%/g, '')}%`
    query = query.or(
      `business_name.ilike.${like},contact_name.ilike.${like},contact_email.ilike.${like}`
    )
  }

  const { data, error } = await query
  if (error) {
    return NextResponse.json({ error: 'Erro ao listar clientes' }, { status: 500 })
  }

  return NextResponse.json({ items: data ?? [] })
}

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  let body: {
    business_name?: string
    segment?: string
    contact_name?: string | null
    contact_email?: string | null
    phone?: string | null
    leader_tenant_id?: string | null
    consulting_paid_amount?: number | string | null
    payment_currency?: string | null
    last_payment_at?: string | null
    is_annual_plan?: boolean
    annual_plan_start?: string | null
    annual_plan_end?: string | null
    access_valid_until?: string | null
    admin_notes?: string | null
  }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const businessName = String(body.business_name ?? '').trim().slice(0, 300)
  if (businessName.length < 2) {
    return NextResponse.json({ error: 'Nome da estética é obrigatório.' }, { status: 400 })
  }

  const segmentRaw = String(body.segment ?? 'capilar').trim().toLowerCase()
  const segment = isEsteticaConsultSegment(segmentRaw) ? segmentRaw : 'capilar'

  const contactName =
    body.contact_name == null || body.contact_name === ''
      ? null
      : String(body.contact_name).trim().slice(0, 200) || null
  const contactEmail =
    body.contact_email == null || body.contact_email === ''
      ? null
      : String(body.contact_email).trim().slice(0, 320) || null
  const phone =
    body.phone == null || body.phone === '' ? null : String(body.phone).trim().slice(0, 40) || null
  const leaderTenantId =
    body.leader_tenant_id == null || body.leader_tenant_id === ''
      ? null
      : String(body.leader_tenant_id).trim()

  if (leaderTenantId) {
    const { data: lt } = await supabaseAdmin.from('leader_tenants').select('id').eq('id', leaderTenantId).maybeSingle()
    if (!lt) {
      return NextResponse.json({ error: 'Tenant de líder inválido.' }, { status: 400 })
    }
  }

  const currency = String(body.payment_currency ?? 'BRL').trim().slice(0, 8) || 'BRL'
  const rawAmt = body.consulting_paid_amount
  const amount =
    rawAmt == null || rawAmt === '' || (typeof rawAmt === 'string' && rawAmt.trim() === '')
      ? null
      : Number(rawAmt)
  const safeAmount = amount != null && Number.isFinite(amount) ? Math.round(amount * 100) / 100 : null

  const lastPaymentAt =
    body.last_payment_at == null || body.last_payment_at === ''
      ? null
      : String(body.last_payment_at).trim() || null

  const isAnnual = Boolean(body.is_annual_plan)
  const annualStart =
    body.annual_plan_start == null || body.annual_plan_start === ''
      ? null
      : String(body.annual_plan_start).trim().slice(0, 32) || null
  const annualEnd =
    body.annual_plan_end == null || body.annual_plan_end === ''
      ? null
      : String(body.annual_plan_end).trim().slice(0, 32) || null

  const accessValidUntil =
    body.access_valid_until == null || body.access_valid_until === ''
      ? null
      : String(body.access_valid_until).trim().slice(0, 32) || null

  const adminNotes =
    body.admin_notes == null || body.admin_notes === ''
      ? null
      : String(body.admin_notes).trim().slice(0, 20000) || null

  const { data, error } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .insert({
      business_name: businessName,
      segment,
      contact_name: contactName,
      contact_email: contactEmail,
      phone,
      leader_tenant_id: leaderTenantId,
      consulting_paid_amount: safeAmount,
      payment_currency: currency,
      last_payment_at: lastPaymentAt,
      is_annual_plan: isAnnual,
      annual_plan_start: annualStart,
      annual_plan_end: annualEnd,
      access_valid_until: accessValidUntil,
      admin_notes: adminNotes,
      created_by_user_id: user.id,
    })
    .select('*')
    .single()

  if (error) {
    return NextResponse.json({ error: 'Erro ao criar cliente' }, { status: 500 })
  }

  return NextResponse.json({ item: data })
}
