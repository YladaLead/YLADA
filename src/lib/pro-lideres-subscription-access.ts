import type { SupabaseClient } from '@supabase/supabase-js'
import type { User } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import type { ProLideresTenantContext } from '@/lib/pro-lideres-server'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import {
  isProLideresBootstrapLeader,
  isProLideresDevStubTenant,
  proLideresPainelDevBypassEnabled,
} from '@/lib/pro-lideres-server'
import { hasActiveSubscription, type SubscriptionArea } from '@/lib/subscription-helpers'

const PRO_LIDERES_TEAM_AREA: SubscriptionArea = 'pro_lideres_team'

/**
 * Líder + equipe dependem da assinatura recorrente do dono do tenant (Mercado Pago).
 * Bypass: stub de dev, contas bootstrap (env / lista interna).
 */
export async function proLideresTeamSubscriptionAllowsAccess(
  user: User,
  ctx: ProLideresTenantContext
): Promise<boolean> {
  if (proLideresPainelDevBypassEnabled() && isProLideresDevStubTenant(ctx.tenant)) return true
  if (isProLideresBootstrapLeader(user)) return true
  const ownerId = ctx.tenant.owner_user_id
  return hasActiveSubscription(ownerId, PRO_LIDERES_TEAM_AREA)
}

export async function ownerHasProLideresTeamSubscription(ownerUserId: string): Promise<boolean> {
  return hasActiveSubscription(ownerUserId, PRO_LIDERES_TEAM_AREA)
}

export function proLideresSubscriptionRequiredResponse(): NextResponse {
  return NextResponse.json(
    {
      error: 'Assinatura Pro Líderes (equipe) inativa ou pagamento em atraso.',
      code: 'pro_lideres_team_subscription_required',
    },
    { status: 402 }
  )
}

/** Para APIs autenticadas que precisam do tenant + assinatura ativa do líder. */
export async function requireProLideresPaidContext(
  supabase: SupabaseClient,
  user: User
): Promise<{ ok: true; ctx: ProLideresTenantContext } | { ok: false; response: NextResponse }> {
  const ctx = await resolveProLideresTenantContext(supabase, user)
  if (!ctx) {
    return { ok: false, response: NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 }) }
  }
  if (!(await proLideresTeamSubscriptionAllowsAccess(user, ctx))) {
    return { ok: false, response: proLideresSubscriptionRequiredResponse() }
  }
  return { ok: true, ctx }
}
