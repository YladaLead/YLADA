import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  fetchProLideresMemberTabulatorName,
  normalizeNoelMemberOfferScope,
  proLideresMemberHasNoelMemberSubscription,
  proLideresNoelMemberUserInOfferScope,
  proLideresNoelMemberMonthlyAmountBrl,
} from '@/lib/pro-lideres-noel-member-access'
import type { LeaderTenantRow } from '@/types/leader-tenant'

/** Estado da oferta + adesão Noel campo (membro). */
export async function GET(_request: NextRequest) {
  const auth = await requireApiAuth(_request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.role !== 'member') {
    return NextResponse.json({ error: 'Só para membros da equipe.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  const t = ctx.tenant as LeaderTenantRow
  const offerEnabled = t.noel_member_offer_enabled === true
  const offerScope = normalizeNoelMemberOfferScope(t.noel_member_offer_scope)
  const tabulatorName = await fetchProLideresMemberTabulatorName(supabaseAdmin, t.id, user.id)
  const inOfferScope = offerEnabled && proLideresNoelMemberUserInOfferScope({ offerScope, tabulatorName })
  const hasPersonalSubscription = await proLideresMemberHasNoelMemberSubscription(user.id)

  return NextResponse.json({
    offerEnabled,
    offerScope,
    inOfferScope,
    hasPersonalSubscription,
    monthlyAmountBrl: proLideresNoelMemberMonthlyAmountBrl(),
    tabulatorName,
  })
}
