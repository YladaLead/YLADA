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
      error: 'Assinatura YLADA deste espaço inativa ou pagamento em atraso.',
      code: 'pro_lideres_team_subscription_required',
    },
    { status: 402 }
  )
}

export type RequireProLideresPaidContextOptions = {
  /**
   * Quando true, só exige tenant autenticado — não bloqueia por assinatura da equipe (qualquer papel).
   * Evitar em rotas expostas a membros; preferir `allowUnpaidOwnerDraft`.
   */
  allowUnpaid?: boolean
  /**
   * Dono do tenant (`owner_user_id`) pode usar a rota sem assinatura Pro Líderes equipe ativa,
   * para montar catálogo/scripts antes de pagar ou convidar. Membros continuam a precisar da
   * assinatura do dono (`proLideresTeamSubscriptionAllowsAccess`).
   */
  allowUnpaidOwnerDraft?: boolean
}

/** Para APIs autenticadas que precisam do tenant; regra de assinatura conforme as opções. */
export async function requireProLideresPaidContext(
  supabase: SupabaseClient,
  user: User,
  options?: RequireProLideresPaidContextOptions
): Promise<{ ok: true; ctx: ProLideresTenantContext } | { ok: false; response: NextResponse }> {
  const ctx = await resolveProLideresTenantContext(supabase, user)
  if (!ctx) {
    return { ok: false, response: NextResponse.json({ error: 'Tenant não encontrado' }, { status: 404 }) }
  }

  if (options?.allowUnpaid) {
    return { ok: true, ctx }
  }

  if (await proLideresTeamSubscriptionAllowsAccess(user, ctx)) {
    return { ok: true, ctx }
  }

  if (options?.allowUnpaidOwnerDraft && ctx.tenant.owner_user_id === user.id) {
    return { ok: true, ctx }
  }

  return { ok: false, response: proLideresSubscriptionRequiredResponse() }
}
