import { Preference } from 'mercadopago'
import { createMercadoPagoClient } from '@/lib/mercado-pago'
import { buildProLideresInviteQuotaMpExternalReference } from '@/lib/pro-lideres-invite-quota-mp'

const PACK_BRL = 750

export type CreateProLideresInviteQuotaPreferenceParams = {
  userId: string
  userEmail: string
  leaderTenantId: string
  successUrl: string
  failureUrl: string
  pendingUrl: string
}

export type CreateProLideresInviteQuotaPreferenceResult = {
  preferenceId: string
  initPoint: string
}

/**
 * Checkout único Mercado Pago: +50 convites pendentes no tenant (R$ 750).
 */
export async function createProLideresInviteQuotaPreference(
  params: CreateProLideresInviteQuotaPreferenceParams,
  isTest: boolean
): Promise<CreateProLideresInviteQuotaPreferenceResult> {
  const client = createMercadoPagoClient(isTest)
  const preference = new Preference(client)

  const external_reference = buildProLideresInviteQuotaMpExternalReference(params.leaderTenantId)

  const body = {
    items: [
      {
        id: 'pro-lideres-invite-quota-50',
        title: 'YLADA Pro Líderes — +50 convites pendentes (equipa)',
        description: 'Pacote único: aumenta a cota de convites pendentes em 50.',
        category_id: 'services',
        quantity: 1,
        unit_price: Number(PACK_BRL.toFixed(2)),
        currency_id: 'BRL' as const,
      },
    ],
    payer: {
      email: params.userEmail,
    },
    metadata: {
      user_id: params.userId,
      leader_tenant_id: params.leaderTenantId,
      ylada_product: 'pro_lideres_invite_quota_50',
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
    external_reference,
  }

  const response = await preference.create({ body: body as Record<string, unknown> })

  const initPoint = response.init_point || response.sandbox_init_point
  if (!initPoint || !response.id) {
    throw new Error('Mercado Pago não retornou URL de checkout')
  }

  return { preferenceId: response.id, initPoint }
}
