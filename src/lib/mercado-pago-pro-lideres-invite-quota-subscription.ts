import { PreApproval } from 'mercadopago'
import { createMercadoPagoClient } from '@/lib/mercado-pago'
import { truncateMercadoPagoPreapprovalReason } from '@/lib/mercado-pago-subscriptions'
import { PRO_LIDERES_INVITE_PACK_BRL } from '@/lib/pro-lideres-invite-slots'
import { buildProLideresInviteQuotaPackMpExternalReference } from '@/lib/pro-lideres-invite-quota-packs'

export type CreateProLideresInviteQuotaPackSubscriptionParams = {
  userId: string
  userEmail: string
  leaderTenantId: string
  packId: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
}

export type CreateProLideresInviteQuotaPackSubscriptionResult = {
  preapprovalId: string
  initPoint: string
}

/**
 * Assinatura mensal Mercado Pago (cartão) para pacote +50 convites.
 * Renova no mesmo dia do mês em que o líder contratou.
 */
export async function createProLideresInviteQuotaPackSubscription(
  params: CreateProLideresInviteQuotaPackSubscriptionParams,
  isTest: boolean
): Promise<CreateProLideresInviteQuotaPackSubscriptionResult> {
  const client = createMercadoPagoClient(isTest)
  const preapproval = new PreApproval(client)
  const email = params.userEmail.trim().toLowerCase()

  if (!email.includes('@')) {
    throw new Error(`E-mail do pagador inválido: ${params.userEmail}`)
  }

  const startDate = new Date(Date.now() + 60_000)

  const body = {
    reason: truncateMercadoPagoPreapprovalReason('YLADA PL +50 convites (mensal)'),
    external_reference: buildProLideresInviteQuotaPackMpExternalReference(params.packId),
    payer_email: email,
    auto_recurring: {
      frequency: 1,
      frequency_type: 'months' as const,
      transaction_amount: Number(PRO_LIDERES_INVITE_PACK_BRL.toFixed(2)),
      currency_id: 'BRL' as const,
      start_date: startDate.toISOString(),
    },
    back_url: params.successUrl,
    metadata: {
      user_id: params.userId,
      leader_tenant_id: params.leaderTenantId,
      pack_id: params.packId,
      area: 'pro_lideres_invite_quota',
      plan_type: 'monthly',
      ylada_product: 'pro_lideres_invite_quota_50_recurring',
    },
  }

  const response = await preapproval.create({ body: body as Record<string, unknown> })
  const initPoint = response.init_point || response.sandbox_init_point
  if (!initPoint || !response.id) {
    throw new Error('Mercado Pago não retornou URL de checkout da assinatura.')
  }

  return { preapprovalId: response.id, initPoint }
}
