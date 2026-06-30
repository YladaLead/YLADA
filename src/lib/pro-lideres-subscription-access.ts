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
import { supabaseAdmin } from '@/lib/supabase'
import { hasActiveSubscription, type SubscriptionArea } from '@/lib/subscription-helpers'
import { evaluateInviteQuotaPacksAccess } from '@/lib/pro-lideres-invite-quota-packs'

const PRO_LIDERES_TEAM_AREA: SubscriptionArea = 'pro_lideres_team'

export type ProLideresAccessBlockReason =
  | null
  | 'base_subscription'
  | 'invite_quota_pack_overdue'

export type ProLideresTeamAccessStatus = {
  allowed: boolean
  reason: ProLideresAccessBlockReason
  overduePackIds: string[]
}

/**
 * Líder + equipe dependem da assinatura recorrente do dono do tenant (Mercado Pago).
 * Bypass: stub de dev, contas bootstrap (env / lista interna).
 * Qualquer pacote +50 em atraso bloqueia o painel inteiro.
 */
export async function resolveProLideresTeamAccessStatus(
  user: User,
  ctx: ProLideresTenantContext,
  supabase: SupabaseClient
): Promise<ProLideresTeamAccessStatus> {
  if (proLideresPainelDevBypassEnabled() && isProLideresDevStubTenant(ctx.tenant)) {
    return { allowed: true, reason: null, overduePackIds: [] }
  }
  if (isProLideresBootstrapLeader(user)) {
    return { allowed: true, reason: null, overduePackIds: [] }
  }

  const ownerId = ctx.tenant.owner_user_id
  const baseOk = await hasActiveSubscription(ownerId, PRO_LIDERES_TEAM_AREA)
  if (!baseOk) {
    return { allowed: false, reason: 'base_subscription', overduePackIds: [] }
  }

  const packAccess = await evaluateInviteQuotaPacksAccess(supabase, ctx.tenant.id)
  if (!packAccess.ok) {
    return {
      allowed: false,
      reason: 'invite_quota_pack_overdue',
      overduePackIds: packAccess.overduePacks.map((p) => p.id),
    }
  }

  return { allowed: true, reason: null, overduePackIds: [] }
}

export async function proLideresTeamSubscriptionAllowsAccess(
  user: User,
  ctx: ProLideresTenantContext
): Promise<boolean> {
  if (!supabaseAdmin) return false
  const status = await resolveProLideresTeamAccessStatus(user, ctx, supabaseAdmin)
  return status.allowed
}

export async function ownerHasProLideresTeamSubscription(ownerUserId: string): Promise<boolean> {
  return hasActiveSubscription(ownerUserId, PRO_LIDERES_TEAM_AREA)
}

export function proLideresSubscriptionRequiredResponse(reason?: ProLideresAccessBlockReason): NextResponse {
  const isPackOverdue = reason === 'invite_quota_pack_overdue'
  return NextResponse.json(
    {
      error: isPackOverdue
        ? 'Pagamento de um pacote de convites em atraso. Regularize para voltar a usar o painel.'
        : 'Assinatura YLADA deste espaço inativa ou pagamento em atraso.',
      code: isPackOverdue
        ? 'pro_lideres_invite_quota_pack_overdue'
        : 'pro_lideres_team_subscription_required',
      blockReason: reason ?? 'base_subscription',
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

  const accessStatus = await resolveProLideresTeamAccessStatus(user, ctx, supabase)
  if (accessStatus.allowed) {
    return { ok: true, ctx }
  }

  if (options?.allowUnpaidOwnerDraft && ctx.tenant.owner_user_id === user.id) {
    return { ok: true, ctx }
  }

  return { ok: false, response: proLideresSubscriptionRequiredResponse(accessStatus.reason) }
}
