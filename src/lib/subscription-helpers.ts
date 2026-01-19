import { supabaseAdmin } from '@/lib/supabase'

/**
 * Verifica se usuário tem assinatura ativa para uma área específica
 * Inclui planos pagos (monthly, annual), gratuitos (free) e trials (trial)
 */
export async function hasActiveSubscription(
  userId: string,
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
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
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
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
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
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
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
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

