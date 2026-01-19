import { supabaseAdmin } from '@/lib/supabase'
import crypto from 'crypto'

/**
 * Gera token único para link de trial
 */
export function generateTrialToken(): string {
  return crypto.randomBytes(32).toString('base64url')
}

/**
 * Cria um link de convite para trial de 3 dias
 */
export async function createTrialInvite(data: {
  email: string
  nome_completo?: string
  whatsapp?: string
  created_by_user_id?: string
  created_by_email?: string
  expires_in_days?: number // Padrão: 7 dias para usar o link
}): Promise<{ token: string; invite_url: string }> {
  const token = generateTrialToken()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + (data.expires_in_days || 7))

  const { error } = await supabaseAdmin
    .from('trial_invites')
    .insert({
      token,
      email: data.email.toLowerCase().trim(),
      nome_completo: data.nome_completo,
      whatsapp: data.whatsapp,
      created_by_user_id: data.created_by_user_id,
      created_by_email: data.created_by_email,
      expires_at: expiresAt.toISOString(),
      status: 'pending',
    })

  if (error) {
    console.error('❌ Erro ao criar convite de trial:', error)
    throw new Error('Erro ao criar convite de trial')
  }

  const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.ylada.com'
  const invite_url = `${baseUrl}/pt/wellness/trial/${token}`

  console.log('✅ Convite de trial criado:', {
    email: data.email,
    token,
    expires_at: expiresAt.toISOString(),
  })

  return { token, invite_url }
}

/**
 * Valida e usa um token de trial (marca como usado)
 */
export async function validateAndUseTrialInvite(
  token: string
): Promise<{
  email: string
  nome_completo?: string
  whatsapp?: string
  created_by_user_id?: string
} | null> {
  const { data, error } = await supabaseAdmin
    .from('trial_invites')
    .select('email, nome_completo, whatsapp, created_by_user_id, status, used_at, expires_at')
    .eq('token', token)
    .single()

  if (error || !data) {
    console.warn('⚠️ Token de trial não encontrado:', token)
    return null
  }

  // Verificar se já foi usado
  if (data.used_at) {
    console.warn('⚠️ Token de trial já foi usado:', token)
    return null
  }

  // Verificar se expirou
  const expiresAt = new Date(data.expires_at)
  if (expiresAt < new Date()) {
    console.warn('⚠️ Token de trial expirado:', token)
    // Marcar como expirado
    await supabaseAdmin
      .from('trial_invites')
      .update({ status: 'expired' })
      .eq('token', token)
    return null
  }

  // Verificar status
  if (data.status !== 'pending') {
    console.warn('⚠️ Token de trial não está pendente:', token, data.status)
    return null
  }

  // NÃO marcar como usado ainda - será marcado quando criar a conta
  // Isso permite que a pessoa veja os dados pré-preenchidos antes de criar

  console.log('✅ Token de trial validado:', {
    email: data.email,
    token,
  })

  return {
    email: data.email,
    nome_completo: data.nome_completo || undefined,
    whatsapp: data.whatsapp || undefined,
    created_by_user_id: data.created_by_user_id || undefined,
  }
}

/**
 * Cria trial de 3 dias para um usuário
 */
export async function createTrialSubscription(
  userId: string,
  area: 'wellness' | 'nutri' | 'coach' | 'nutra' = 'wellness',
  inviteToken?: string
): Promise<{ subscription_id: string; expires_at: string }> {
  const periodStart = new Date()
  const periodEnd = new Date()
  periodEnd.setDate(periodEnd.getDate() + 3) // 3 dias de trial

  // Verificar se já tem trial ativo
  const existingTrial = await supabaseAdmin
    .from('subscriptions')
    .select('id')
    .eq('user_id', userId)
    .eq('area', area)
    .eq('plan_type', 'trial')
    .eq('status', 'active')
    .gt('current_period_end', new Date().toISOString())
    .maybeSingle()

  if (existingTrial?.id) {
    console.log('⚠️ Usuário já tem trial ativo, retornando existente')
    const { data: sub } = await supabaseAdmin
      .from('subscriptions')
      .select('id, current_period_end')
      .eq('id', existingTrial.id)
      .single()
    
    return {
      subscription_id: sub!.id,
      expires_at: sub!.current_period_end,
    }
  }

  // Criar trial
  const { data: subscription, error } = await supabaseAdmin
    .from('subscriptions')
    .insert({
      user_id: userId,
      area,
      plan_type: 'trial',
      status: 'active',
      current_period_start: periodStart.toISOString(),
      current_period_end: periodEnd.toISOString(),
      stripe_account: null,
      stripe_subscription_id: `trial_${userId}_${Date.now()}`,
      stripe_customer_id: null,
      stripe_price_id: null,
      amount: 0,
      currency: 'BRL',
    })
    .select('id, current_period_end')
    .single()

  if (error) {
    console.error('❌ Erro ao criar trial:', error)
    throw new Error('Erro ao criar trial')
  }

  // Se veio de invite, marcar como usado
  if (inviteToken) {
    await supabaseAdmin
      .from('trial_invites')
      .update({ 
        status: 'used',
        used_at: new Date().toISOString(),
        used_by_user_id: userId 
      })
      .eq('token', inviteToken)
  }

  console.log('✅ Trial criado:', {
    userId,
    area,
    subscription_id: subscription.id,
    expires_at: subscription.current_period_end,
  })

  return {
    subscription_id: subscription.id,
    expires_at: subscription.current_period_end,
  }
}
