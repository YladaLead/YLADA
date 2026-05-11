import type { SupabaseClient } from '@supabase/supabase-js'
import type { LeaderTenantRow, ProLideresNoelMemberOfferScope, ProLideresTenantRole } from '@/types/leader-tenant'
import { hasActiveSubscription } from '@/lib/subscription-helpers'
import { proLideresTeamSubscriptionAllowsAccess } from '@/lib/pro-lideres-subscription-access'
import type { User } from '@supabase/supabase-js'

export const PRO_LIDERES_NOEL_MEMBER_SUBSCRIPTION_AREA = 'pro_lideres_noel_member' as const

export function proLideresNoelMemberMonthlyAmountBrl(): number {
  const raw = process.env.PRO_LIDERES_NOEL_MEMBER_MONTHLY_BRL
  const n = raw != null && raw !== '' ? Number(raw) : NaN
  if (Number.isFinite(n) && n > 0) return Math.round(n * 100) / 100
  return 40
}

export function normalizeNoelMemberOfferScope(raw: unknown): ProLideresNoelMemberOfferScope {
  return raw === 'tabulators_only' ? 'tabulators_only' : 'all_members'
}

export async function fetchProLideresMemberTabulatorName(
  admin: SupabaseClient,
  leaderTenantId: string,
  userId: string
): Promise<string | null> {
  const { data } = await admin
    .from('leader_tenant_members')
    .select('pro_lideres_tabulator_name')
    .eq('leader_tenant_id', leaderTenantId)
    .eq('user_id', userId)
    .maybeSingle()
  const s = (data?.pro_lideres_tabulator_name as string | undefined)?.trim()
  return s || null
}

/** Dentro da oferta do líder: escopo tabuladores vs todos. */
export function proLideresNoelMemberUserInOfferScope(params: {
  offerScope: ProLideresNoelMemberOfferScope
  tabulatorName: string | null
}): boolean {
  if (params.offerScope === 'all_members') return true
  return Boolean(params.tabulatorName?.trim())
}

export async function proLideresMemberHasNoelMemberSubscription(userId: string): Promise<boolean> {
  return hasActiveSubscription(userId, PRO_LIDERES_NOEL_MEMBER_SUBSCRIPTION_AREA)
}

export type ProLideresNoelMemberSurface = {
  offerEnabled: boolean
  offerScope: ProLideresNoelMemberOfferScope
  tabulatorName: string | null
  inOfferScope: boolean
  /** Item no menu (membro, líder com oferta ligada ou líder em «Ver como equipe»). */
  showSidebarNav: boolean
  hasPersonalSubscription: boolean
  /** Dono/líder: mesmo Noel da equipe, incluído na assinatura Pro Líderes equipe (sem add-on MP). */
  noelMemberIncludedForLeader: boolean
  /** Pode chamar o chat (API revalida). */
  canOpenChat: boolean
}

/**
 * Estado de UI + produto Noel membro (oferta do tenant + add-on individual).
 */
export async function resolveProLideresNoelMemberSurface(
  admin: SupabaseClient,
  user: User,
  ctx: { tenant: LeaderTenantRow; role: ProLideresTenantRole },
  ui: { isActiveMemberRow: boolean; teamViewPreview?: boolean }
): Promise<ProLideresNoelMemberSurface> {
  const t = ctx.tenant as LeaderTenantRow
  const offerEnabled = t.noel_member_offer_enabled === true
  const offerScope = normalizeNoelMemberOfferScope(t.noel_member_offer_scope)
  const tabulatorName = await fetchProLideresMemberTabulatorName(admin, t.id, user.id)
  const inOfferScope = offerEnabled && proLideresNoelMemberUserInOfferScope({ offerScope, tabulatorName })

  const preview = ui.teamViewPreview === true
  const isLeader = ctx.role === 'leader'
  const noelMemberIncludedForLeader = Boolean(isLeader && offerEnabled)
  const memberInOffer = ctx.role === 'member' && inOfferScope
  const showSidebarNav = Boolean(
    offerEnabled && (noelMemberIncludedForLeader || memberInOffer || (preview && inOfferScope))
  )

  const hasPersonalSubscription = await proLideresMemberHasNoelMemberSubscription(user.id)
  const teamPaid = await proLideresTeamSubscriptionAllowsAccess(user, ctx)

  const canOpenChat = Boolean(
    teamPaid &&
      !preview &&
      (noelMemberIncludedForLeader ||
        (ctx.role === 'member' && memberInOffer && hasPersonalSubscription && ui.isActiveMemberRow))
  )

  return {
    offerEnabled,
    offerScope,
    tabulatorName,
    inOfferScope,
    showSidebarNav,
    hasPersonalSubscription,
    noelMemberIncludedForLeader,
    canOpenChat,
  }
}
