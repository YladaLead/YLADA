import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext, resolvedUserEmail } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { createRecurringSubscription } from '@/lib/mercado-pago-subscriptions'
import {
  fetchProLideresMemberTabulatorName,
  normalizeNoelMemberOfferScope,
  proLideresMemberHasNoelMemberSubscription,
  proLideresNoelMemberUserInOfferScope,
  proLideresNoelMemberMonthlyAmountBrl,
} from '@/lib/pro-lideres-noel-member-access'
import type { LeaderTenantRow } from '@/types/leader-tenant'

/**
 * Mercado Pago Preapproval — Noel membro Pro Líderes (cobrança no **membro**).
 */
export async function POST(_request: NextRequest) {
  const auth = await requireApiAuth(_request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.role !== 'member') {
    return NextResponse.json({ error: 'Apenas membros da equipe podem contratar este produto.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  const t = ctx.tenant as LeaderTenantRow
  if (!t.noel_member_offer_enabled) {
    return NextResponse.json({ error: 'O líder não disponibilizou esta opção neste momento.' }, { status: 403 })
  }

  const scope = normalizeNoelMemberOfferScope(t.noel_member_offer_scope)
  const tabulatorName = await fetchProLideresMemberTabulatorName(supabaseAdmin, t.id, user.id)
  if (!proLideresNoelMemberUserInOfferScope({ offerScope: scope, tabulatorName })) {
    return NextResponse.json(
      { error: 'Neste espaço o Noel membro está disponível só para quem tem tabulador cadastrado.' },
      { status: 403 }
    )
  }

  if (await proLideresMemberHasNoelMemberSubscription(user.id)) {
    return NextResponse.json({ error: 'Você já tem uma assinatura ativa do Noel membro Pro Líderes.' }, { status: 409 })
  }

  const email = resolvedUserEmail(user)
  if (!email?.includes('@')) {
    return NextResponse.json({ error: 'E-mail da conta é obrigatório para o Mercado Pago.' }, { status: 400 })
  }

  const baseUrl = (
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    process.env.NEXT_PUBLIC_APP_URL ||
    ''
  ).replace(/\/$/, '')
  if (!baseUrl) {
    return NextResponse.json({ error: 'NEXT_PUBLIC_APP_URL não configurado.' }, { status: 500 })
  }

  const amount = proLideresNoelMemberMonthlyAmountBrl()
  const successUrl = `${baseUrl}/pro-lideres/membro/noel-membro?mp=ok`
  const failureUrl = `${baseUrl}/pro-lideres/membro/noel-membro?mp=fail`
  const pendingUrl = `${baseUrl}/pro-lideres/membro/noel-membro?mp=pending`
  const isTest = process.env.NODE_ENV !== 'production'

  try {
    const sub = await createRecurringSubscription(
      {
        area: 'pro_lideres_noel_member',
        planType: 'monthly',
        userId: user.id,
        userEmail: email,
        amount,
        description: 'YLADA Noel membro Pro Líderes (mensal)',
        successUrl,
        failureUrl,
        pendingUrl,
      },
      isTest
    )
    return NextResponse.json({ checkoutUrl: sub.initPoint, preapprovalId: sub.id })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao criar assinatura no Mercado Pago.'
    console.error('[pro-lideres/membro/noel-subscription/checkout]', e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
