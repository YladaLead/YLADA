import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext, resolvedUserEmail } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { createProLideresInviteQuotaPreference } from '@/lib/mercado-pago-pro-lideres-invite-quota-preference'

const PACK_BRL = 750

/**
 * Cria Preference Mercado Pago (pagamento único R$ 750) — +50 convites pendentes após webhook aprovado.
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
    return NextResponse.json({ error: 'Apenas o líder pode comprar cota extra.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

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

  const returnPath = '/pro-lideres/painel/links'
  const successUrl = `${baseUrl}${returnPath}?mp_inv_quota=ok`
  const failureUrl = `${baseUrl}${returnPath}?mp_inv_quota=fail`
  const pendingUrl = `${baseUrl}${returnPath}?mp_inv_quota=pending`
  const isTest = process.env.NODE_ENV !== 'production'

  try {
    const pref = await createProLideresInviteQuotaPreference(
      {
        userId: user.id,
        userEmail: email,
        leaderTenantId: ctx.tenant.id,
        successUrl,
        failureUrl,
        pendingUrl,
      },
      isTest
    )

    return NextResponse.json({
      checkoutUrl: pref.initPoint,
      preferenceId: pref.preferenceId,
      amountBrl: PACK_BRL,
      slotsAdded: 50,
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao criar checkout no Mercado Pago.'
    console.error('[pro-lideres/invites/quota-topup/checkout]', e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
