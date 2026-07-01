import { supabaseAdmin } from '@/lib/supabase'
import { parseYladaFreeGrantKind } from '@/lib/admin-ylada-free-matriz'
import { isPerfilMatrizYlada } from '@/lib/admin-matriz-constants'
import { isProEsteticaCorporalBootstrapLeaderEmail } from '@/lib/pro-estetica-corporal-server'
import { isProEsteticaCapilarBootstrapLeaderEmail } from '@/lib/pro-estetica-capilar-server'
import { proLideresContextUnlocksYladaMatrixApis } from '@/lib/pro-lideres-server'

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
  | 'joias'
  | 'perfumaria'
  | 'seller'
  | 'pro_lideres_team'
  /** Add-on: Noel campo no Pro Líderes (cobrado no user_id do membro). */
  | 'pro_lideres_noel_member'
  /** Mensalidade Pro Estética Capilar (MP); painel usa também `ylada_estetica_consult_clients`. */
  | 'pro_estetica_capilar'

/** Mapeia perfil da matriz YLADA (lado /pt) para coluna `subscriptions.area`. */
export function perfilMatrizToSubscriptionArea(perfil: string | null | undefined): SubscriptionArea | null {
  if (!perfil || !isPerfilMatrizYlada(perfil)) return null
  return perfil as SubscriptionArea
}

/** Produto Herbalife / Coach de bem-estar — assinatura em `subscriptions.area = wellness`. */
export function isWellnessProductPerfil(perfil: string | null | undefined): boolean {
  return perfil === 'wellness' || perfil === 'coach-bem-estar'
}

/**
 * Assinatura wellness paga/trial/cortesia vigente (prazo de `current_period_end`).
 * Usada para liberar links/Noel YLADA em contas migradas Coach de bem-estar.
 */
export async function getWellnessProductCommercialSubscription(userId: string) {
  const sub = await getActiveSubscription(userId, 'wellness')
  if (!sub) return null
  return subscriptionRowIsMatrixSegmentCommercialUnlimited(sub) ? sub : null
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

/**
 * Wellness e Coach Bem-estar compartilham a assinatura `wellness`.
 * Membros ativos da equipa Pró Líderes (estado no painel / `leader_tenant_members`) não devem
 * ficar bloqueados por uma linha antiga de assinatura wellness pessoal vencida.
 */
export async function wellnessAreaSubscriptionOrProLideresAccess(userId: string): Promise<boolean> {
  if (await hasActiveSubscription(userId, 'wellness')) return true
  return proLideresContextUnlocksYladaMatrixApis(userId)
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
/**
 * Assinatura ativa exibida em Configurações / APIs YLADA:
 * prioriza `ylada`, depois wellness vigente (coach-bem-estar / wellness migrados), senão segmento da matriz.
 */
export async function getActiveSubscriptionForYladaConfig(userId: string) {
  const ylada = await getActiveSubscription(userId, 'ylada')
  if (ylada) return ylada
  const { data: profile } = await supabaseAdmin
    .from('user_profiles')
    .select('perfil')
    .eq('user_id', userId)
    .maybeSingle()
  const perfil = profile?.perfil as string | undefined
  if (isWellnessProductPerfil(perfil)) {
    const wellnessCommercial = await getWellnessProductCommercialSubscription(userId)
    if (wellnessCommercial) return wellnessCommercial
  }
  const area = perfilMatrizToSubscriptionArea(perfil)
  if (!area) return null
  return getActiveSubscription(userId, area)
}

/** Áreas de assinatura que podem ser canceladas pelo fluxo unificado da matriz (`/api/ylada/subscription/*-cancel*`). */
export const YLADA_MATRIX_CANCEL_SUBSCRIPTION_AREAS: SubscriptionArea[] = [
  'ylada',
  'med',
  'psi',
  'psicanalise',
  'odonto',
  'nutra',
  'coach',
  'seller',
  'perfumaria',
  'estetica',
  'fitness',
  'joias',
  'nutri',
]

export function isSubscriptionCancellableViaYladaMatrixFlow(area: string | undefined | null): boolean {
  if (!area) return false
  return YLADA_MATRIX_CANCEL_SUBSCRIPTION_AREAS.includes(area as SubscriptionArea)
}

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

/** Contas de vídeo/teste criadas pelo script interno (`demo.*@ylada.app` / legado `.com`). */
export function emailIsMatrixDemoVideoAccount(email: string | null | undefined): boolean {
  const e = String(email || '')
    .trim()
    .toLowerCase()
  return /^demo\.[a-z0-9._-]+@ylada\.(app|com)$/.test(e)
}

/**
 * E-mails que devem ter benefícios comerciais YLADA (vários links ativos, Noel, etc.) como plano pago,
 * sem linha obrigatória em `subscriptions`: contas demo oficiais Pro Estética corporal/capilar
 * (`demo@proesteticacorporal.com`, env `PRO_*_BOOTSTRAP_LEADER_EMAILS`) e lista extra em
 * `YLADA_COMMERCIAL_UNLIMITED_EMAILS` (separada por vírgulas), ex.: conta real de parceira.
 */
export function emailHasYladaCommercialUnlimitedByEsteticaOrEnv(email: string | null | undefined): boolean {
  const e = String(email || '')
    .trim()
    .toLowerCase()
  if (!e) return false
  if (isProEsteticaCorporalBootstrapLeaderEmail(e)) return true
  if (isProEsteticaCapilarBootstrapLeaderEmail(e)) return true
  const extra =
    process.env.YLADA_COMMERCIAL_UNLIMITED_EMAILS?.split(',')
      .map((x) => x.trim().toLowerCase())
      .filter(Boolean) ?? []
  return extra.includes(e)
}

/**
 * Última etapa de `hasYladaProPlan` após checagens de e-mail e assinatura `ylada`.
 * Membro ativo Pro Líderes desbloqueia freemium em qualquer perfil (não só wellness).
 */
export function yladaMatrixProFromPerfilAndAccess(signals: {
  wellnessCommercialSub: boolean
  proLideresUnlock: boolean
  segmentCommercialSub: boolean
}): boolean {
  if (signals.wellnessCommercialSub) return true
  if (signals.proLideresUnlock) return true
  return signals.segmentCommercialSub
}

/**
 * Verifica se usuário tem benefícios “sem limite freemium” na matriz YLADA (links, Noel, WhatsApp).
 * Inclui: **admin ou suporte**; **demo.*@ylada**; ylada mensal/anual/trial/cortesia;
 * **wellness / coach-bem-estar** com assinatura `wellness` vigente (mensal/anual/trial);
 * **membro ativo ou líder Pro Líderes** (qualquer perfil);
 * **ou** segmento da matriz (nutri, med, coach, …) com plano comercial equivalente.
 * Não inclui: free migração/legado sem prazo pago vigente.
 * @see docs/SPEC-FREEMIUM-YLADA.md
 */
export async function hasYladaProPlan(userId: string): Promise<boolean> {
  try {
    if (await canBypassSubscription(userId)) return true

    const { data: profile } = await supabaseAdmin
      .from('user_profiles')
      .select('perfil, email')
      .eq('user_id', userId)
      .maybeSingle()

    if (emailIsMatrixDemoVideoAccount(profile?.email as string | undefined)) return true
    if (emailHasYladaCommercialUnlimitedByEsteticaOrEnv(profile?.email as string | undefined)) return true

    const yladaSub = await getActiveSubscription(userId, 'ylada')
    if (yladaSub && activeYladaRowIsUnlimited(yladaSub)) return true

    const perfil = profile?.perfil as string | undefined
    const wellnessCommercialSub = isWellnessProductPerfil(perfil)
      ? !!(await getWellnessProductCommercialSubscription(userId))
      : false
    const proLideresUnlock = await proLideresContextUnlocksYladaMatrixApis(userId)

    const area = perfilMatrizToSubscriptionArea(perfil)
    let segmentCommercialSub = false
    if (area) {
      const segSub = await getActiveSubscription(userId, area)
      segmentCommercialSub = !!(segSub && subscriptionRowIsMatrixSegmentCommercialUnlimited(segSub))
    }

    return yladaMatrixProFromPerfilAndAccess({
      wellnessCommercialSub,
      proLideresUnlock,
      segmentCommercialSub,
    })
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

