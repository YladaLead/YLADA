import { supabaseAdmin } from '@/lib/supabase'

export type YladaFreeMatrizKind = 'migration' | 'courtesy'

/** Prefixo em stripe_subscription_id para distinguir migração (novo padrão) vs cortesia admin. */
export function yladaFreeStripeSubscriptionId(
  kind: YladaFreeMatrizKind,
  userId: string,
  area: string
): string {
  const ts = Date.now()
  const randomSuffix = Math.random().toString(36).substring(2, 15)
  const prefix = kind === 'migration' ? 'free_mig_' : 'free_cor_'
  return `${prefix}${userId}_${area}_${ts}_${randomSuffix}`
}

export function parseYladaFreeGrantKind(
  stripe_subscription_id: string | null | undefined
): 'migration' | 'courtesy' | 'legacy' | null {
  if (!stripe_subscription_id) return null
  if (stripe_subscription_id.startsWith('free_mig_')) return 'migration'
  if (stripe_subscription_id.startsWith('free_cor_')) return 'courtesy'
  if (stripe_subscription_id.startsWith('free_')) return 'legacy'
  return null
}

const nowMs = () => Date.now()

/**
 * Cria assinatura free area ylada (matriz /pt). Cancela free ylada ativa anterior, se houver.
 * Não altera assinaturas de outros segmentos (ex.: mensal nutri).
 */
export async function createYladaFreeMatrizSubscription(
  finalUserId: string,
  expires_in_days: number,
  kind: YladaFreeMatrizKind
): Promise<{
  data: Record<string, unknown> | null
  error: string | null
  code?: string
}> {
  const area = 'ylada'
  const days = Math.min(3650, Math.max(1, Math.floor(Number(expires_in_days)) || 365))
  const now = new Date()
  const periodStart = now.toISOString()
  const periodEnd = new Date(now.getTime() + days * 24 * 60 * 60 * 1000).toISOString()

  const { data: existing } = await supabaseAdmin
    .from('subscriptions')
    .select('id, current_period_end')
    .eq('user_id', finalUserId)
    .eq('area', area)
    .eq('status', 'active')
    .gt('current_period_end', new Date().toISOString())
    .maybeSingle()

  if (existing) {
    await supabaseAdmin
      .from('subscriptions')
      .update({
        status: 'canceled',
        canceled_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      })
      .eq('id', existing.id)
  }

  const stripeSubscriptionId = yladaFreeStripeSubscriptionId(kind, finalUserId, area)
  const subscriptionData: Record<string, unknown> = {
    user_id: finalUserId,
    area,
    plan_type: 'free',
    status: 'active',
    current_period_start: periodStart,
    current_period_end: periodEnd,
    stripe_account: 'br',
    stripe_subscription_id: stripeSubscriptionId,
    stripe_customer_id: `free_${finalUserId}`,
    stripe_price_id: 'free',
    amount: 0,
    currency: 'brl',
    created_at: periodStart,
    updated_at: periodStart,
  }

  const { data, error } = await supabaseAdmin.from('subscriptions').insert(subscriptionData).select().single()

  if (error) {
    return {
      data: null,
      error: error.message || 'Erro ao criar assinatura',
      code: error.code,
    }
  }
  return { data: data as Record<string, unknown>, error: null }
}

export function subscriptionIsActivePaid(sub: {
  plan_type: string
  status: string
  current_period_end: string | null
}): boolean {
  if (sub.status !== 'active' || !sub.current_period_end) return false
  if (sub.plan_type !== 'monthly' && sub.plan_type !== 'annual') return false
  return new Date(sub.current_period_end).getTime() > nowMs()
}

export function hasActiveYladaFree(sub: {
  area: string
  plan_type: string
  status: string
  current_period_end: string | null
}): boolean {
  if (sub.area !== 'ylada' || sub.plan_type !== 'free' || sub.status !== 'active' || !sub.current_period_end)
    return false
  return new Date(sub.current_period_end).getTime() > nowMs()
}
