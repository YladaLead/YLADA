import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { getActiveSubscription } from '@/lib/subscription-helpers'
import { proLideresTeamSubscriptionAllowsAccess } from '@/lib/pro-lideres-subscription-access'

const DEFAULT_PENDING_QUOTA = 50

/** Estado da assinatura Mercado Pago (equipe) para o tenant atual. */
export async function GET(_request: NextRequest) {
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
  const accessOk = await proLideresTeamSubscriptionAllowsAccess(user, ctx)
  const q = ctx.tenant.team_invite_pending_quota
  const pendingQuota = typeof q === 'number' && q > 0 ? q : DEFAULT_PENDING_QUOTA

  return NextResponse.json({
    accessOk,
    ownerUserId: ownerId,
    subscription: sub
      ? {
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
          amountCents: sub.amount,
        }
      : null,
    monthlyAmountBrl: 750,
    pendingInviteQuota: pendingQuota,
  })
}
