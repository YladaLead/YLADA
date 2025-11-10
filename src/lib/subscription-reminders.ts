/**
 * Sistema de avisos para assinaturas que estão vencendo
 * Envia e-mail 7 dias antes do vencimento para assinaturas PIX
 */

import { supabaseAdmin } from './supabase'

export interface ExpiringSubscription {
  id: string
  user_id: string
  area: string
  plan_type: string
  current_period_end: string
  user_email?: string
}

/**
 * Busca assinaturas que vencem em N dias
 */
export async function getExpiringSubscriptions(daysBefore: number = 7): Promise<ExpiringSubscription[]> {
  const targetDate = new Date()
  targetDate.setDate(targetDate.getDate() + daysBefore)
  
  // Buscar assinaturas ativas que vencem em N dias
  // E que são PIX (não têm mercadopago_subscription_id ou têm payment_method = 'pix')
  const { data, error } = await supabaseAdmin
    .from('subscriptions')
    .select(`
      id,
      user_id,
      area,
      plan_type,
      current_period_end,
      gateway,
      user_profiles!inner(email)
    `)
    .eq('status', 'active')
    .eq('plan_type', 'monthly')
    .gte('current_period_end', new Date().toISOString()) // Ainda não venceu
    .lte('current_period_end', targetDate.toISOString()) // Vence em N dias ou menos
    .is('reminder_sent', false) // Ainda não enviou aviso
    .or('gateway.eq.mercadopago,payment_method.eq.pix') // Mercado Pago ou PIX

  if (error) {
    console.error('❌ Erro ao buscar assinaturas vencendo:', error)
    return []
  }

  return (data || []).map((sub: any) => ({
    id: sub.id,
    user_id: sub.user_id,
    area: sub.area,
    plan_type: sub.plan_type,
    current_period_end: sub.current_period_end,
    user_email: sub.user_profiles?.email,
  }))
}

/**
 * Marca aviso como enviado
 */
export async function markReminderSent(subscriptionId: string): Promise<void> {
  await supabaseAdmin
    .from('subscriptions')
    .update({ reminder_sent: true })
    .eq('id', subscriptionId)
}

/**
 * Envia e-mail de aviso (placeholder - implementar com serviço de e-mail)
 */
export async function sendRenewalReminder(subscription: ExpiringSubscription): Promise<void> {
  // TODO: Implementar envio de e-mail real
  console.log('📧 Enviando aviso de renovação:', {
    user_id: subscription.user_id,
    area: subscription.area,
    expires_at: subscription.current_period_end,
    email: subscription.user_email,
  })

  // Marcar como enviado
  await markReminderSent(subscription.id)
}

