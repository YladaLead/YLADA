import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { getActiveSubscription } from '@/lib/subscription-helpers'
import { resolveProLideresTeamAccessStatus } from '@/lib/pro-lideres-subscription-access'
import { loadInviteQuotaPacksForTenant } from '@/lib/pro-lideres-invite-quota-packs'

const DEFAULT_PENDING_QUOTA = 50

/** Estado da assinatura Mercado Pago (equipe) para o tenant atual. */
export async function GET(request: NextRequest) {
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

  const ownerId = ctx.tenant.owner_user_id
  const sub = await getActiveSubscription(ownerId, 'pro_lideres_team')
  const accessStatus = await resolveProLideresTeamAccessStatus(user, ctx, supabaseAdmin)
  const accessOk = accessStatus.allowed
  const q = ctx.tenant.team_invite_pending_quota
  const pendingQuota = typeof q === 'number' && q > 0 ? q : DEFAULT_PENDING_QUOTA
  const inviteQuotaPacks = await loadInviteQuotaPacksForTenant(supabaseAdmin, ctx.tenant.id)

  const { data: latestTeamSub } = await supabaseAdmin
    .from('subscriptions')
    .select('status, current_period_end')
    .eq('user_id', ownerId)
    .eq('area', 'pro_lideres_team')
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle()

  const isRenewal = Boolean(latestTeamSub)

  return NextResponse.json({
    accessOk,
    blockReason: accessStatus.reason,
    overduePackIds: accessStatus.overduePackIds,
    ownerUserId: ownerId,
    isRenewal,
    subscription: sub
      ? {
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
          amountCents: sub.amount,
        }
      : null,
    inviteQuotaPacks: inviteQuotaPacks.map((pack) => ({
      id: pack.id,
      status: pack.status,
      slots: pack.slots,
      amountBrl: Number(pack.amount_brl),
      billingDay: pack.billing_day,
      currentPeriodEnd: pack.current_period_end,
      mpPreapprovalId: pack.mp_preapproval_id,
    })),
    lastPeriodEnd: latestTeamSub?.current_period_end ?? null,
    monthlyAmountBrl: 750,
    pendingInviteQuota: pendingQuota,
  })
}
