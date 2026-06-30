import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  resolveProLideresTenantContext,
  resolvedUserEmail,
  resolveProLideresViewerDisplayName,
} from '@/lib/pro-lideres-server'
import { createProLideresInviteQuotaPixPreference } from '@/lib/mercado-pago-pro-lideres-invite-quota-pix-preference'
import { getInviteQuotaPackById } from '@/lib/pro-lideres-invite-quota-packs'
import { PRO_LIDERES_INVITE_PACK_BRL } from '@/lib/pro-lideres-invite-slots'

/**
 * PIX ou cartão avulso para regularizar pacote +50 em atraso (R$ 750).
 */
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ packId: string }> }
) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const { packId } = await context.params
  const pack = await getInviteQuotaPackById(supabaseAdmin, packId)
  if (!pack) {
    return NextResponse.json({ error: 'Pacote não encontrado.' }, { status: 404 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx || ctx.tenant.owner_user_id !== user.id || pack.leader_tenant_id !== ctx.tenant.id) {
    return NextResponse.json({ error: 'Apenas o líder pode pagar este pacote.' }, { status: 403 })
  }

  if (pack.status !== 'past_due') {
    return NextResponse.json(
      { error: 'Este pacote não está em atraso. Use a assinatura com cartão se quiser renovar automaticamente.' },
      { status: 400 }
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

  const returnPath = '/pro-lideres/painel/links'
  const successUrl = `${baseUrl}${returnPath}?mp_inv_quota=ok`
  const failureUrl = `${baseUrl}${returnPath}?mp_inv_quota=fail`
  const pendingUrl = `${baseUrl}${returnPath}?mp_inv_quota=pending`
  const isTest = process.env.NODE_ENV !== 'production'

  try {
    const displayName = resolveProLideresViewerDisplayName(user, {
      nomeCompleto: ctx.tenant.display_name,
    })

    const pref = await createProLideresInviteQuotaPixPreference(
      {
        userId: user.id,
        userEmail: email,
        userDisplayName: displayName,
        leaderTenantId: ctx.tenant.id,
        packId: pack.id,
        successUrl,
        failureUrl,
        pendingUrl,
      },
      isTest
    )

    return NextResponse.json({
      checkoutUrl: pref.initPoint,
      preferenceId: pref.preferenceId,
      packId: pack.id,
      amountBrl: PRO_LIDERES_INVITE_PACK_BRL,
      paymentMethods: ['pix', 'credit_card'],
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao criar checkout PIX.'
    console.error('[pro-lideres/invites/quota-pack/pay-pix]', e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
