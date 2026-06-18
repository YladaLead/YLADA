/**
 * RevenueCat / IAP (App Store) — fonte ÚNICA de constantes e mapeamento.
 *
 * Usado tanto pelo webhook (servidor) quanto pelo cliente do app iOS.
 * NÃO importa React nem Capacitor: pode rodar no servidor sem problema.
 *
 * Contexto (Apple 3.1.1 / decisão 18/06/2026): o app iOS passa a vender a
 * assinatura via In-App Purchase (StoreKit) com RevenueCat por cima. O site
 * (web/Android) segue vendendo por Mercado Pago/Pix normalmente. A "fonte da
 * verdade" de acesso continua sendo a tabela `subscriptions` — o webhook do
 * RevenueCat só grava uma linha ali, exatamente como o webhook do Mercado Pago.
 */

/** Entitlement único configurado no RevenueCat que representa "Pro". */
export const RC_ENTITLEMENT_PRO = 'pro'

/**
 * IDs de produto (App Store Connect). Precisam bater EXATAMENTE com os SKUs
 * criados no App Store Connect e espelhados no RevenueCat. Sobrescrevíveis por
 * env para permitir trocar SKU sem novo build.
 */
export const RC_PRODUCT_MONTHLY =
  process.env.NEXT_PUBLIC_RC_PRODUCT_MONTHLY || 'com.ylada.app.pro.monthly'
export const RC_PRODUCT_ANNUAL =
  process.env.NEXT_PUBLIC_RC_PRODUCT_ANNUAL || 'com.ylada.app.pro.annual'

/**
 * Área que a compra no iOS libera (Opção A, decidida com Andre em 18/06/2026):
 * SEMPRE 'ylada'. Uma assinatura "Pro" única que destrava links/Noel para
 * qualquer segmento — `hasYladaProPlan` já trata 'ylada' mensal/anual como
 * acesso total. Na hora da compra não precisamos saber o segmento do usuário.
 */
export const RC_SUBSCRIPTION_AREA = 'ylada' as const

export type IapPlanType = 'monthly' | 'annual'

/** Mapeia o product_id (App Store) para o plan_type da tabela `subscriptions`. */
export function planTypeFromProductId(
  productId: string | null | undefined,
): IapPlanType | null {
  if (!productId) return null
  const id = String(productId).toLowerCase()
  if (id === RC_PRODUCT_MONTHLY.toLowerCase()) return 'monthly'
  if (id === RC_PRODUCT_ANNUAL.toLowerCase()) return 'annual'
  // Fallback tolerante (caso o SKU final mude levemente): heurística por nome.
  if (id.includes('annual') || id.includes('anual') || id.includes('year') || id.includes('ano')) {
    return 'annual'
  }
  if (id.includes('month') || id.includes('mensal') || id.includes('mes')) {
    return 'monthly'
  }
  return null
}

/** Features gravadas na linha (espelha determineFeatures do webhook MP para área comum). */
export function iapFeaturesForPlan(planType: IapPlanType): string[] {
  return planType === 'annual' ? ['completo'] : ['gestao', 'ferramentas']
}

/**
 * Chave estável usada como `stripe_subscription_id` (coluna genérica de id
 * externo, reaproveitada: MP usa `mp_sub_...`, aqui usamos `rc_sub_...`).
 * Preferimos o original_transaction_id da Apple (estável entre renovações,
 * então RENEWAL atualiza a MESMA linha); cai para o app_user_id se faltar.
 */
export function iapSubscriptionKey(
  originalTransactionId: string | null | undefined,
  appUserId: string,
): string {
  const base = (originalTransactionId && String(originalTransactionId).trim()) || `${appUserId}_${RC_SUBSCRIPTION_AREA}`
  return `rc_sub_${base}`
}
