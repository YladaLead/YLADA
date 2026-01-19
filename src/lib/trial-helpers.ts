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

  const nowIso = new Date().toISOString()

  // Verificar se já tem trial ativo (compatível com bancos que ainda não aceitam plan_type='trial')
  // Regra: qualquer subscription ativa e não expirada cujo stripe_subscription_id comece com 'trial_'
  const { data: existingTrial, error: existingTrialError } = await supabaseAdmin
    .from('subscriptions')
    .select('id, current_period_end')
    .eq('user_id', userId)
    .eq('area', area)
    .eq('status', 'active')
    .like('stripe_subscription_id', 'trial_%')
    .gt('current_period_end', nowIso)
    .order('current_period_end', { ascending: false })
    .maybeSingle()

  if (existingTrialError) {
    console.warn('⚠️ Erro ao verificar trial existente (seguindo mesmo assim):', existingTrialError)
  }

  if (existingTrial?.id) {
    console.log('⚠️ Usuário já tem trial ativo, retornando existente')
    return {
      subscription_id: existingTrial.id,
      expires_at: existingTrial.current_period_end,
    }
  }

  const stripeSubId = `trial_${userId}_${Date.now()}`

  // Criar trial
  // 1) Tentativa principal: plan_type = 'trial'
  // 2) Fallback: se o banco ainda não tem a constraint atualizada, usar plan_type = 'free' mas com expiração de 3 dias
  let subscription: { id: string; current_period_end: string } | null = null
  let error: any = null

  const attemptInsert = async (plan_type: 'trial' | 'free') => {
    return await supabaseAdmin
      .from('subscriptions')
      .insert({
        user_id: userId,
        area,
        plan_type,
        status: 'active',
        current_period_start: periodStart.toISOString(),
        current_period_end: periodEnd.toISOString(),
        stripe_account: null,
        stripe_subscription_id: stripeSubId,
        stripe_customer_id: null,
        stripe_price_id: null,
        amount: 0,
        currency: 'BRL',
      })
      .select('id, current_period_end')
      .single()
  }

  const primary = await attemptInsert('trial')
  subscription = primary.data as any
  error = primary.error

  if (error) {
    const msg = `${error.message || ''} ${error.details || ''} ${error.hint || ''}`.toLowerCase()
    const isPlanTypeConstraint =
      error.code === '23514' || // check_violation
      msg.includes('subscriptions_plan_type_check') ||
      (msg.includes('plan_type') && msg.includes('check'))

    if (isPlanTypeConstraint) {
      console.warn('⚠️ Banco sem plan_type=trial. Usando fallback plan_type=free (expira em 3 dias).', {
        code: error.code,
        message: error.message,
      })
      const fallback = await attemptInsert('free')
      subscription = fallback.data as any
      error = fallback.error
    }
  }

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
