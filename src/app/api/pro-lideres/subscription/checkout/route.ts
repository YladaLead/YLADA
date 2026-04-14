import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext, resolvedUserEmail } from '@/lib/pro-lideres-server'
import { createRecurringSubscription } from '@/lib/mercado-pago-subscriptions'

const MONTHLY_BRL = 750

/**
 * Cria Preapproval Mercado Pago (cartão recorrente) — apenas o dono do tenant.
 */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id) {
    return NextResponse.json(
      { error: 'Apenas o líder pode contratar a assinatura da equipe.' },
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

  const successUrl = `${baseUrl}/pro-lideres/painel/assinatura-equipe?mp=ok`
  const failureUrl = `${baseUrl}/pro-lideres/painel/assinatura-equipe?mp=fail`
  const pendingUrl = `${baseUrl}/pro-lideres/painel/assinatura-equipe?mp=pending`
  const isTest = process.env.NODE_ENV !== 'production'

  try {
    const sub = await createRecurringSubscription(
      {
        area: 'pro_lideres_team',
        planType: 'monthly',
        userId: user.id,
        userEmail: email,
        amount: MONTHLY_BRL,
        description: 'YLADA Pro Líderes — Equipe (50 convites, assinatura mensal)',
        successUrl,
        failureUrl,
        pendingUrl,
      },
      isTest
    )
    return NextResponse.json({ checkoutUrl: sub.initPoint, preapprovalId: sub.id })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao criar assinatura no Mercado Pago.'
    console.error('[pro-lideres/subscription/checkout]', e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
