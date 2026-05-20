import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { createRecurringSubscription } from '@/lib/mercado-pago-subscriptions'
import {
  PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA,
  proEsteticaCapilarMonthlyAmountBrl,
} from '@/lib/pro-estetica-capilar-subscription'
import {
  resolveEsteticaCapilarTenantContext,
  resolvedUserEmail,
} from '@/lib/pro-estetica-capilar-server'

/**
 * Cria Preapproval Mercado Pago (cartão recorrente) — dona do tenant capilar.
 */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json(
      { error: 'Apenas a líder da clínica pode contratar a assinatura.' },
      { status: 403 }
    )
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

  const successUrl = `${baseUrl}/pro-estetica-capilar/painel/assinatura?mp=ok`
  const failureUrl = `${baseUrl}/pro-estetica-capilar/painel/assinatura?mp=fail`
  const pendingUrl = `${baseUrl}/pro-estetica-capilar/painel/assinatura?mp=pending`

  const isTest = process.env.NODE_ENV !== 'production'
  const amount = proEsteticaCapilarMonthlyAmountBrl()

  try {
    const sub = await createRecurringSubscription(
      {
        area: PRO_ESTETICA_CAPILAR_SUBSCRIPTION_AREA,
        planType: 'monthly',
        userId: user.id,
        userEmail: email,
        amount,
        description: `YLADA Pro Estética Capilar — Assinatura mensal (R$ ${amount.toFixed(2)})`,
        successUrl,
        failureUrl,
        pendingUrl,
      },
      isTest
    )
    return NextResponse.json({ checkoutUrl: sub.initPoint, preapprovalId: sub.id })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao criar assinatura no Mercado Pago.'
    console.error('[pro-estetica-capilar/subscription/checkout]', e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
