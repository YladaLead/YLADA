import { NextRequest, NextResponse } from 'next/server'
import { daysUntilEsteticaConsultAccessEnds } from '@/lib/estetica-consult-access'
import { sendEsteticaConsultAccessExpiryReminderEmail } from '@/lib/estetica-consult-access-email'
import { isEsteticaConsultSegment } from '@/lib/estetica-consultoria'
import { supabaseAdmin } from '@/lib/supabase'

type ClientRow = {
  id: string
  business_name: string
  contact_name: string | null
  contact_email: string | null
  segment: string
  access_valid_until: string
  access_expiry_reminder_sent_15d?: boolean
  access_expiry_reminder_sent_7d?: boolean
  access_expiry_reminder_sent_1d?: boolean
}

/**
 * Cron diário (Vercel Cron ou manual com Authorization: Bearer CRON_SECRET).
 * Envia lembretes por e-mail (15, 7 e 1 dia antes do fim de access_valid_until).
 */
export async function GET(request: NextRequest) {
  const authHeader = request.headers.get('authorization') || ''
  const isCron = !!process.env.CRON_SECRET && authHeader === `Bearer ${process.env.CRON_SECRET}`
  if (!isCron) {
    return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { data: rows, error } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .select(
      'id, business_name, contact_name, contact_email, segment, access_valid_until, access_expiry_reminder_sent_15d, access_expiry_reminder_sent_7d, access_expiry_reminder_sent_1d, leader_tenant_id'
    )
    .not('access_valid_until', 'is', null)
    .not('leader_tenant_id', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const raw of rows ?? []) {
    const c = raw as ClientRow
    const email = c.contact_email?.trim()
    if (!email) {
      skipped++
      continue
    }

    const days = daysUntilEsteticaConsultAccessEnds(c.access_valid_until)
    if (days === null || days < 0) {
      skipped++
      continue
    }

    const segment = isEsteticaConsultSegment(c.segment) ? c.segment : 'capilar'
    const patch: Record<string, boolean> = {}

    const run = async (
      kind: '15d' | '7d' | '1d',
      flag: 'access_expiry_reminder_sent_15d' | 'access_expiry_reminder_sent_7d' | 'access_expiry_reminder_sent_1d',
      should: boolean,
      already: boolean | undefined
    ) => {
      if (!should || already) return
      const r = await sendEsteticaConsultAccessExpiryReminderEmail({
        to: email,
        businessName: c.business_name,
        contactName: c.contact_name,
        segment,
        accessValidUntil: c.access_valid_until,
        daysLeft: days,
        kind,
      })
      if (r.ok) {
        patch[flag] = true
        sent++
      } else if (r.error) {
        errors.push(`${c.id} (${kind}): ${r.error}`)
      }
    }

    await run('15d', 'access_expiry_reminder_sent_15d', days <= 15 && days > 7, c.access_expiry_reminder_sent_15d)
    await run('7d', 'access_expiry_reminder_sent_7d', days <= 7 && days > 1, c.access_expiry_reminder_sent_7d)
    await run('1d', 'access_expiry_reminder_sent_1d', days <= 1 && days >= 0, c.access_expiry_reminder_sent_1d)

    if (Object.keys(patch).length > 0) {
      const { error: upErr } = await supabaseAdmin
        .from('ylada_estetica_consult_clients')
        .update(patch)
        .eq('id', c.id)
      if (upErr) errors.push(`${c.id}: update ${upErr.message}`)
    }
  }

  return NextResponse.json({ ok: true, processed: (rows ?? []).length, sent, skipped, errors })
}
