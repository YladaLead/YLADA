import { Preference } from 'mercadopago'
import { createMercadoPagoClient } from '@/lib/mercado-pago'
import { splitDisplayNameForMercadoPagoPayer } from '@/lib/mercado-pago-payer'
import { PRO_LIDERES_INVITE_PACK_BRL } from '@/lib/pro-lideres-invite-slots'
import { buildProLideresInviteQuotaPixMpExternalReference } from '@/lib/pro-lideres-invite-quota-packs'

export type CreateProLideresInviteQuotaPixPreferenceParams = {
  userId: string
  userEmail: string
  userDisplayName?: string | null
  leaderTenantId: string
  packId: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
}

export type CreateProLideresInviteQuotaPixPreferenceResult = {
  preferenceId: string
  initPoint: string
}

/**
 * Checkout PIX (pagamento único) para regularizar pacote +50 em atraso.
 */
export async function createProLideresInviteQuotaPixPreference(
  params: CreateProLideresInviteQuotaPixPreferenceParams,
  isTest: boolean
): Promise<CreateProLideresInviteQuotaPixPreferenceResult> {
  const client = createMercadoPagoClient(isTest)
  const preference = new Preference(client)
  const { firstName, lastName } = splitDisplayNameForMercadoPagoPayer(params.userDisplayName)
  const checkoutEmail = params.userEmail.trim().toLowerCase()

  const body = {
    items: [
      {
        id: 'pro-lideres-invite-quota-50-renew',
        title: 'YLADA Pro Líderes — Regularizar pacote +50 convites',
        description: 'Pagamento mensal do pacote extra de convites (PIX ou cartão).',
        category_id: 'services',
        quantity: 1,
        unit_price: Number(PRO_LIDERES_INVITE_PACK_BRL.toFixed(2)),
        currency_id: 'BRL' as const,
      },
    ],
    payer: {
      email: checkoutEmail,
      first_name: firstName,
      last_name: lastName,
    },
    metadata: {
      user_id: params.userId,
      leader_tenant_id: params.leaderTenantId,
      pack_id: params.packId,
      ylada_product: 'pro_lideres_invite_quota_50_pix',
      checkout_account_email: checkoutEmail,
    },
    back_urls: {
      success: params.successUrl,
      failure: params.failureUrl,
      pending: params.pendingUrl,
    },
    auto_return: 'approved' as const,
    payment_methods: {
      excluded_payment_types: [] as string[],
      excluded_payment_methods: [] as string[],
      installments: 1,
      default_installments: 1,
    },
    statement_descriptor: 'YLADA',
    external_reference: buildProLideresInviteQuotaPixMpExternalReference(params.packId),
  }

  const response = await preference.create({ body: body as Record<string, unknown> })
  const initPoint = response.init_point || response.sandbox_init_point
  if (!initPoint || !response.id) {
    throw new Error('Mercado Pago não retornou URL de checkout PIX.')
  }

  return { preferenceId: response.id, initPoint }
}
