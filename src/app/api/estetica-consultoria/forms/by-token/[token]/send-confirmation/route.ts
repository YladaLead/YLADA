import { NextRequest, NextResponse } from 'next/server'
import { randomBytes } from 'crypto'
import { supabaseAdmin } from '@/lib/supabase'
import {
  TEMPLATE_DIAGNOSTICO_CAPILAR_ID,
  TEMPLATE_DIAGNOSTICO_CORPORAL_ID,
} from '@/lib/estetica-consultoria-form-templates'
import { sendEsteticaDiagnosticoConfirmEmail } from '@/lib/estetica-consultoria-confirmation-email'

type Ctx = { params: Promise<{ token: string }> }

const RESEND_COOLDOWN_MS = 90_000
const CONFIRM_TTL_MS = 48 * 60 * 60 * 1000

export async function POST(request: NextRequest, context: Ctx) {
  const { token: raw } = await context.params
  const token = decodeURIComponent(raw || '').trim()
  if (!token) {
    return NextResponse.json({ error: 'Token em falta' }, { status: 400 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Indisponível' }, { status: 503 })
  }

  const { data: link, error: linkErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_share_links')
    .select(
      'id, material_id, estetica_consult_client_id, recipient_email, recipient_confirmed_at, last_confirmation_sent_at'
    )
    .eq('token', token)
    .maybeSingle()

  if (linkErr || !link) {
    return NextResponse.json({ error: 'Link inválido.' }, { status: 404 })
  }

  const { data: mat } = await supabaseAdmin
    .from('ylada_estetica_consultancy_materials')
    .select('template_key')
    .eq('id', link.material_id)
    .maybeSingle()

  const templateKey = (mat as { template_key?: string | null } | null)?.template_key
  if (templateKey !== TEMPLATE_DIAGNOSTICO_CORPORAL_ID && templateKey !== TEMPLATE_DIAGNOSTICO_CAPILAR_ID) {
    return NextResponse.json({ error: 'Este link não usa confirmação por e-mail.' }, { status: 400 })
  }

  const toEmail = String((link as { recipient_email?: string | null }).recipient_email ?? '').trim().toLowerCase()
  if (!toEmail || !toEmail.includes('@')) {
    return NextResponse.json({ error: 'Este link não tem e-mail de destino configurado.' }, { status: 400 })
  }

  if ((link as { recipient_confirmed_at?: string | null }).recipient_confirmed_at) {
    return NextResponse.json({ ok: true, alreadyConfirmed: true })
  }

  const lastSent = (link as { last_confirmation_sent_at?: string | null }).last_confirmation_sent_at
  if (lastSent) {
    const elapsed = Date.now() - new Date(lastSent).getTime()
    if (elapsed >= 0 && elapsed < RESEND_COOLDOWN_MS) {
      const wait = Math.ceil((RESEND_COOLDOWN_MS - elapsed) / 1000)
      return NextResponse.json(
        { error: `Aguarde ${wait}s antes de pedir outro e-mail.` },
        { status: 429 }
      )
    }
  }

  const confirmToken = randomBytes(32).toString('base64url')
  const exp = new Date(Date.now() + CONFIRM_TTL_MS).toISOString()
  const nowIso = new Date().toISOString()

  const { error: upErr } = await supabaseAdmin
    .from('ylada_estetica_consultancy_share_links')
    .update({
      email_confirm_token: confirmToken,
      email_confirm_expires_at: exp,
      last_confirmation_sent_at: nowIso,
    })
    .eq('id', (link as { id: string }).id)

  if (upErr) {
    return NextResponse.json({ error: 'Não foi possível preparar o envio.' }, { status: 500 })
  }

  const { data: cli } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .select('business_name')
    .eq('id', (link as { estetica_consult_client_id: string }).estetica_consult_client_id)
    .maybeSingle()

  const clinicName =
    cli && typeof (cli as { business_name?: string }).business_name === 'string'
      ? String((cli as { business_name: string }).business_name).trim() || 'Clínica'
      : 'Clínica'

  const origin = request.nextUrl.origin
  const sent = await sendEsteticaDiagnosticoConfirmEmail({
    origin,
    shareToken: token,
    confirmToken,
    toEmail,
    clinicName,
    formArea: templateKey === TEMPLATE_DIAGNOSTICO_CAPILAR_ID ? 'capilar' : 'corporal',
  })

  if (!sent.ok) {
    return NextResponse.json({ error: sent.error }, { status: 503 })
  }

  return NextResponse.json({ ok: true })
}
