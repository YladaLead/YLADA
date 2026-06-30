import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  resolveProLideresTenantContext,
  resolvedUserEmail,
  resolveProLideresViewerDisplayName,
} from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { createProLideresInviteQuotaPackSubscription } from '@/lib/mercado-pago-pro-lideres-invite-quota-subscription'
import {
  createPendingInviteQuotaPack,
  getInviteQuotaPackById,
  linkInviteQuotaPackPreapproval,
} from '@/lib/pro-lideres-invite-quota-packs'
import { PRO_LIDERES_INVITE_PACK_BRL, PRO_LIDERES_INVITE_SLOTS_PER_PACK } from '@/lib/pro-lideres-invite-slots'

type CheckoutBody = {
  packId?: string
}

/**
 * Cria assinatura recorrente Mercado Pago (cartão, R$ 750/mês) — +50 convites por pacote.
 * Renova no dia do mês em que o líder contratou.
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
    return NextResponse.json({ error: 'Apenas o líder pode contratar pacote extra.' }, { status: 403 })
  }

  let body: CheckoutBody = {}
  try {
    body = (await request.json()) as CheckoutBody
  } catch {
    body = {}
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
    const packIdFromBody = typeof body.packId === 'string' ? body.packId.trim() : ''
    let pack = packIdFromBody ? await getInviteQuotaPackById(supabaseAdmin, packIdFromBody) : null

    if (pack && pack.leader_tenant_id !== ctx.tenant.id) {
      return NextResponse.json({ error: 'Pacote não pertence a este espaço.' }, { status: 403 })
    }

    if (pack && pack.status === 'active') {
      return NextResponse.json({ error: 'Este pacote já está ativo.' }, { status: 400 })
    }

    if (!pack) {
      const paid = await requireProLideresPaidContext(supabaseAdmin, user)
      if (!paid.ok) return paid.response
      pack = await createPendingInviteQuotaPack(supabaseAdmin, {
        leaderTenantId: ctx.tenant.id,
        ownerUserId: user.id,
      })
    }

    const displayName = resolveProLideresViewerDisplayName(user, {
      nomeCompleto: ctx.tenant.display_name,
    })

    const sub = await createProLideresInviteQuotaPackSubscription(
      {
        userId: user.id,
        userEmail: email,
        leaderTenantId: ctx.tenant.id,
        packId: pack.id,
        successUrl,
        failureUrl,
        pendingUrl,
      },
      isTest
    )

    await linkInviteQuotaPackPreapproval(supabaseAdmin, pack.id, sub.preapprovalId)

    return NextResponse.json({
      checkoutUrl: sub.initPoint,
      preapprovalId: sub.preapprovalId,
      packId: pack.id,
      amountBrl: PRO_LIDERES_INVITE_PACK_BRL,
      slotsAdded: PRO_LIDERES_INVITE_SLOTS_PER_PACK,
      recurring: true,
    })
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : 'Erro ao criar assinatura no Mercado Pago.'
    console.error('[pro-lideres/invites/quota-topup/checkout]', e)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}
