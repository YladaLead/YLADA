import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { daysUntilEsteticaConsultAccessEnds } from '@/lib/estetica-consult-access'
import { isEsteticaConsultPainelAccessExpiredForTenant } from '@/lib/estetica-consult-access'
import {
  PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA,
  proEsteticaCapilarMonthlyAmountBrl,
} from '@/lib/pro-estetica-capilar-subscription'
import { resolveEsteticaCapilarTenantContext } from '@/lib/pro-estetica-capilar-server'
import { getActiveSubscription } from '@/lib/subscription-helpers'

/** Estado da assinatura / acesso ao painel Pro Estética Capilar. */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.role !== 'leader') {
    return NextResponse.json({ error: 'Apenas a líder da clínica pode ver a assinatura.' }, { status: 403 })
  }

  const ownerId = ctx.tenant.owner_user_id
  const isOwner = user.id === ownerId
  const sub = await getActiveSubscription(ownerId, PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA)

  const accessExpired = await isEsteticaConsultPainelAccessExpiredForTenant(
    supabaseAdmin,
    ctx.tenant.id
  )

  const { data: consultRow } = await supabaseAdmin
    .from('ylada_estetica_consult_clients')
    .select('access_valid_until')
    .eq('leader_tenant_id', ctx.tenant.id)
    .order('access_valid_until', { ascending: false })
    .limit(1)
    .maybeSingle()

  const accessUntil = (consultRow as { access_valid_until?: string | null } | null)?.access_valid_until ?? null
  const daysLeft = daysUntilEsteticaConsultAccessEnds(accessUntil)

  const accessOk = !accessExpired

  return NextResponse.json({
    accessOk,
    isOwner,
    ownerUserId: ownerId,
    accessValidUntil: accessUntil,
    daysUntilAccessEnds: daysLeft,
    subscription: sub
      ? {
          status: sub.status,
          currentPeriodEnd: sub.current_period_end,
          amountCents: sub.amount,
        }
      : null,
    monthlyAmountBrl: proEsteticaCapilarMonthlyAmountBrl(),
  })
}
