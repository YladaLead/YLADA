import { supabaseAdmin } from '@/lib/supabase'

/**
 * Features disponíveis no sistema
 */
export type Feature = 'gestao' | 'ferramentas' | 'cursos' | 'completo'

export type Area = 'nutri' | 'coach' | 'nutra' | 'wellness'

/**
 * Verifica se usuário tem acesso a uma feature específica
 * 
 * @param userId - ID do usuário
 * @param area - Área (nutri, coach, nutra, wellness)
 * @param feature - Feature a verificar (gestao, ferramentas, cursos, completo)
 * @returns true se usuário tem acesso, false caso contrário
 * 
 * Regras:
 * - Feature "completo" dá acesso a tudo
 * - Feature específica dá acesso apenas àquela funcionalidade
 * - Se não tiver assinatura ativa, retorna false
 */
export async function hasFeatureAccess(
  userId: string,
  area: Area,
  feature: Feature
): Promise<boolean> {
  try {
    // Buscar assinatura ativa
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select('features')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error) {
      console.error('❌ Erro ao verificar feature:', error)
      return false
    }

    if (!subscription) {
      console.log(`ℹ️ hasFeatureAccess: Usuário ${userId} não tem assinatura ativa para área ${area}`)
      return false
    }

    // Fallback Nutri: assinatura ativa sem features preenchidas = acesso completo à plataforma (ferramentas + cursos)
    let features = (subscription.features as string[] | null) || []
    if (area === 'nutri' && features.length === 0) {
      console.log(`ℹ️ hasFeatureAccess: Nutri com assinatura ativa e features vazias — concedendo ferramentas + cursos`)
      features = ['ferramentas', 'cursos']
    }

    console.log(`ℹ️ hasFeatureAccess: Usuário ${userId} tem features:`, features, `(verificando: ${feature})`)

    // Se tem "completo", tem acesso a tudo
    if (features.includes('completo')) {
      return true
    }

    // Verificar se tem a feature específica
    const hasAccess = features.includes(feature)
    console.log(`ℹ️ hasFeatureAccess: Acesso ${hasAccess ? 'permitido' : 'negado'} para feature ${feature}`)
    return hasAccess
  } catch (error) {
    console.error('❌ Erro ao verificar feature:', error)
    return false
  }
}

/**
 * Verifica se usuário tem acesso a qualquer uma das features especificadas
 * 
 * @param userId - ID do usuário
 * @param area - Área
 * @param features - Array de features a verificar
 * @returns true se tiver acesso a pelo menos uma feature
 */
export async function hasAnyFeature(
  userId: string,
  area: Area,
  features: Feature[]
): Promise<boolean> {
  // Se "completo" está na lista, verificar apenas ele
  if (features.includes('completo')) {
    return hasFeatureAccess(userId, area, 'completo')
  }

  // Verificar cada feature
  for (const feature of features) {
    if (await hasFeatureAccess(userId, area, feature)) {
      return true
    }
  }

  return false
}

/**
 * Verifica se usuário tem acesso completo (todas as features)
 * 
 * @param userId - ID do usuário
 * @param area - Área
 * @returns true se tiver acesso completo
 */
export async function hasCompleteAccess(
  userId: string,
  area: Area
): Promise<boolean> {
  return hasFeatureAccess(userId, area, 'completo')
}

/**
 * Obtém todas as features ativas do usuário para uma área
 * 
 * @param userId - ID do usuário
 * @param area - Área
 * @returns Array de features ou null se não tiver assinatura
 */
export async function getUserFeatures(
  userId: string,
  area: Area
): Promise<Feature[] | null> {
  try {
    const { data: subscription, error } = await supabaseAdmin
      .from('subscriptions')
      .select('features')
      .eq('user_id', userId)
      .eq('area', area)
      .eq('status', 'active')
      .gt('current_period_end', new Date().toISOString())
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle()

    if (error || !subscription || !subscription.features) {
      return null
    }

    return subscription.features as Feature[]
  } catch (error) {
    console.error('❌ Erro ao buscar features:', error)
    return null
  }
}

/**
 * Verifica se feature é válida
 */
export function isValidFeature(feature: string): feature is Feature {
  return ['gestao', 'ferramentas', 'cursos', 'completo'].includes(feature)
}

/**
 * Valida array de features
 */
export function validateFeatures(features: string[]): Feature[] {
  return features.filter(isValidFeature) as Feature[]
}

