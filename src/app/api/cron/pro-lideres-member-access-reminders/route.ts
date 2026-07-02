import { NextRequest, NextResponse } from 'next/server'

import { sendProLideresMemberAccessExpiryReminderEmail } from '@/lib/pro-lideres-member-expiry-reminder-email'
import { syncProLideresTeamSubscriptionsFromMercadoPago } from '@/lib/pro-lideres-team-subscription-mp-sync'
import { daysUntilProLideresTeamAccessEnds } from '@/lib/pro-lideres-team-access-expiry-ui'
import { supabaseAdmin } from '@/lib/supabase'

type MemberRow = {
  id: string
  user_id: string
  leader_tenant_id: string
  team_access_expires_at: string
  team_access_expiry_reminder_sent_7d?: boolean
  team_access_expiry_reminder_sent_3d?: boolean
  team_access_expiry_reminder_sent_1d?: boolean
}

/**
 * Cron diário (Vercel Cron ou manual com Authorization: Bearer CRON_SECRET).
 * Avisos por e-mail 7, 3 e 1 dia antes de `team_access_expires_at` (membros ativos).
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
    .from('leader_tenant_members')
    .select(
      'id, user_id, leader_tenant_id, team_access_expires_at, team_access_expiry_reminder_sent_7d, team_access_expiry_reminder_sent_3d, team_access_expiry_reminder_sent_1d'
    )
    .eq('role', 'member')
    .eq('team_access_state', 'active')
    .not('team_access_expires_at', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  let sent = 0
  let skipped = 0
  const errors: string[] = []

  for (const raw of rows ?? []) {
    const m = raw as MemberRow
    const days = daysUntilProLideresTeamAccessEnds(m.team_access_expires_at)
    if (days === null || days < 0) {
      skipped++
      continue
    }

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('email, nome_completo')
      .eq('user_id', m.user_id)
      .maybeSingle()

    const email = (profile?.email as string | undefined)?.trim()
    if (!email) {
      skipped++
      continue
    }

    const { data: tenant } = await supabaseAdmin
      .from('leader_tenants')
      .select('display_name, team_name, team_bank_payment_url, team_bank_pix_payment_url')
      .eq('id', m.leader_tenant_id)
      .maybeSingle()

    const teamLabel =
      (tenant?.display_name as string | undefined)?.trim() ||
      (tenant?.team_name as string | undefined)?.trim() ||
      'sua equipe'

    const patch: Record<string, boolean> = {}

    const run = async (
      kind: '7d' | '3d' | '1d',
      flag:
        | 'team_access_expiry_reminder_sent_7d'
        | 'team_access_expiry_reminder_sent_3d'
        | 'team_access_expiry_reminder_sent_1d',
      should: boolean,
      already: boolean | undefined
    ) => {
      if (!should || already) return
      const r = await sendProLideresMemberAccessExpiryReminderEmail({
        to: email,
        memberName: (profile?.nome_completo as string | null) ?? null,
        teamLabel,
        accessExpiresAt: m.team_access_expires_at,
        daysLeft: days,
        kind,
        cardUrl: (tenant?.team_bank_payment_url as string | null) ?? null,
        pixUrl: (tenant?.team_bank_pix_payment_url as string | null) ?? null,
      })
      if (r.ok) {
        patch[flag] = true
        sent++
      } else if (r.error) {
        errors.push(`${m.id} (${kind}): ${r.error}`)
      }
    }

    await run('7d', 'team_access_expiry_reminder_sent_7d', days <= 7 && days > 3, m.team_access_expiry_reminder_sent_7d)
    await run('3d', 'team_access_expiry_reminder_sent_3d', days <= 3 && days > 1, m.team_access_expiry_reminder_sent_3d)
    await run('1d', 'team_access_expiry_reminder_sent_1d', days <= 1 && days >= 0, m.team_access_expiry_reminder_sent_1d)

    if (Object.keys(patch).length > 0) {
      const { error: upErr } = await supabaseAdmin
        .from('leader_tenant_members')
        .update(patch)
        .eq('id', m.id)
      if (upErr) errors.push(`${m.id}: update ${upErr.message}`)
    }
  }

  let mpSync: Awaited<ReturnType<typeof syncProLideresTeamSubscriptionsFromMercadoPago>> | null = null
  try {
    mpSync = await syncProLideresTeamSubscriptionsFromMercadoPago(supabaseAdmin)
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'sync MP'
    errors.push(`mp-sync: ${msg}`)
  }

  return NextResponse.json({ ok: true, processed: (rows ?? []).length, sent, skipped, errors, mpSync })
}
