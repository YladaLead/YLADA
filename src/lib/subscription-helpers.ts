import { supabaseAdmin } from '@/lib/supabase'
import { parseYladaFreeGrantKind } from '@/lib/admin-ylada-free-matriz'
import { isPerfilMatrizYlada } from '@/lib/admin-matriz-constants'

/**
 * Verifica se usuário tem assinatura ativa para uma área específica
 * Inclui planos pagos (monthly, annual), gratuitos (free) e trials (trial)
 * Alinhado ao CHECK `subscriptions_area_check` (matriz /pt + wellness + ylada).
 */
export type SubscriptionArea =
  | 'wellness'
  | 'nutri'
  | 'coach'
  | 'nutra'
  | 'med'
  | 'ylada'
  | 'psi'
  | 'psicanalise'
  | 'odonto'
  | 'estetica'
  | 'fitness'
  | 'perfumaria'
  | 'seller'

/** Mapeia perfil da matriz YLADA (lado /pt) para coluna `subscriptions.area`. */
export function perfilMatrizToSubscriptionArea(perfil: string | null | undefined): SubscriptionArea | null {
  if (!perfil || !isPerfilMatrizYlada(perfil)) return null
  return perfil as SubscriptionArea
}

function activeYladaRowIsUnlimited(sub: {
  plan_type?: string | null
  stripe_subscription_id?: string | null
}): boolean {
  const planType = sub.plan_type as string | undefined
  if (planType === 'monthly' || planType === 'annual' || planType === 'trial') return true
  if (planType === 'free') {
    return parseYladaFreeGrantKind(sub.stripe_subscription_id) === 'courtesy'
  }
  return false
}

export async function hasActiveSubscription(
  userId: string,
  area: SubscriptionArea
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('id, status, current_period_end, plan_type')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .limit(1)

    if (error) {
      console.error('❌ Erro ao verificar assinatura:', error)
      return false
    }

    return (data?.length || 0) > 0
  } catch (error) {
    console.error('❌ Erro ao verificar assinatura:', error)
    return false
  }
}

/**
 * Verifica se usuário tem plano gratuito ativo para uma área específica
 */
export async function hasFreePlan(
  userId: string,
  area: SubscriptionArea
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('id, plan_type')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('plan_type', 'free')
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .limit(1)

    if (error) {
      console.error('❌ Erro ao verificar plano gratuito:', error)
      return false
    }

    return (data?.length || 0) > 0
  } catch (error) {
    console.error('❌ Erro ao verificar plano gratuito:', error)
    return false
  }
}

/**
 * Verifica se assinatura é migrada e precisa renovação manual
 */
export async function requiresManualRenewal(
  userId: string,
  area: SubscriptionArea
): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('requires_manual_renewal')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .limit(1)
      .maybeSingle()

    if (error || !data) {
      return false
    }

    return data.requires_manual_renewal === true
  } catch (error) {
    console.error('❌ Erro ao verificar renovação manual:', error)
    return false
  }
}

/**
 * Obtém assinatura ativa do usuário para uma área específica
 */
export async function getActiveSubscription(
  userId: string,
  area: SubscriptionArea
) {
  try {
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    if (error) {
      if (error.code === 'PGRST116') {
        // Nenhuma assinatura encontrada
        return null
      }
      console.error('❌ Erro ao buscar assinatura:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('❌ Erro ao buscar assinatura:', error)
    return null
  }
}

/**
 * Qualquer segmento da matriz: mensal, anual, trial ou free com cortesia admin (`free_cor_`) = sem teto freemium / Freedom.
 */
export function subscriptionRowIsMatrixSegmentCommercialUnlimited(sub: {
  plan_type?: string | null
  stripe_subscription_id?: string | null
} | null): boolean {
  if (!sub) return false
  const pt = String(sub.plan_type || '').toLowerCase()
  if (pt === 'monthly' || pt === 'annual' || pt === 'trial') return true
  if (pt === 'free') {
    return parseYladaFreeGrantKind(sub.stripe_subscription_id) === 'courtesy'
  }
  return false
}

/** @deprecated Use subscriptionRowIsMatrixSegmentCommercialUnlimited (mesmo comportamento). */
export const subscriptionRowIsNutriCommercialUnlimited = subscriptionRowIsMatrixSegmentCommercialUnlimited

/**
 * Perfil na matriz YLADA (/pt), com assinatura ativa na área do segmento, mas sem pago/trial/cortesia.
 * Wellness e quem não é matriz → false (regras de Freedom da matriz não se aplicam).
 */
export async function isMatrixFreedomTierUser(userId: string): Promise<boolean> {
  try {
    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil')
      .eq('user_id', userId)
      .maybeSingle()

    const perfil = profile?.perfil as string | undefined
    const area = perfilMatrizToSubscriptionArea(perfil)
    if (!area) return false

    const sub = await getActiveSubscription(userId, area)
    if (!sub) return false
    return !subscriptionRowIsMatrixSegmentCommercialUnlimited(sub)
  } catch {
    return false
  }
}

/** @deprecated Use isMatrixFreedomTierUser (cobre todos os segmentos da matriz). */
export const isNutriFreedomTierUser = isMatrixFreedomTierUser

/**
 * Verifica se usuário tem benefícios “sem limite freemium” na matriz YLADA (links, Noel, WhatsApp).
 * Inclui: ylada mensal/anual/trial ou free cortesia; **ou** assinatura ativa no **segmento do perfil** (nutri, med, coach, …) equivalente a pago/trial/cortesia.
 * Wellness não entra aqui. Não inclui: free migração/legado no segmento.
 * @see docs/SPEC-FREEMIUM-YLADA.md
 */
export async function hasYladaProPlan(userId: string): Promise<boolean> {
  try {
    const yladaSub = await getActiveSubscription(userId, 'ylada')
    if (yladaSub && activeYladaRowIsUnlimited(yladaSub)) return true

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil')
      .eq('user_id', userId)
      .maybeSingle()

    const area = perfilMatrizToSubscriptionArea(profile?.perfil as string | undefined)
    if (!area) return false

    const segSub = await getActiveSubscription(userId, area)
    return !!(segSub && subscriptionRowIsMatrixSegmentCommercialUnlimited(segSub))
  } catch {
    return false
  }
}

/**
 * Verifica se usuário é admin ou suporte (bypass de assinatura)
 */
export async function canBypassSubscription(userId: string): Promise<boolean> {
  try {
    const { data, error } = await supabaseAdmin
      .from('user_profiles')
      .select('is_admin, is_support')
      .eq('user_id', userId)
      .single()

    if (error) {
      console.error('❌ Erro ao verificar perfil:', error)
      return false
    }

    return data?.is_admin === true || data?.is_support === true
  } catch (error) {
    console.error('❌ Erro ao verificar perfil:', error)
    return false
  }
}

