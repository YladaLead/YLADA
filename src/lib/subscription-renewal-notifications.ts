/**
 * Sistema de notificações automáticas para assinaturas migradas
 * Envia emails antes do vencimento para que usuário refaça checkout
 */

import { supabaseAdmin } from './supabase'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from './resend'

export interface SubscriptionNeedingRenewal {
  id: string
  user_id: string
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  plan_type: 'monthly' | 'annual'
  current_period_end: string
  requires_manual_renewal: boolean
  migrated_from?: string
  user_email?: string
  days_until_expiry: number
}

/**
 * Busca assinaturas migradas que precisam renovação e estão próximas do vencimento
 */
export async function getSubscriptionsNeedingRenewal(
  daysAhead: number = 30
): Promise<SubscriptionNeedingRenewal[]> {
  try {
    const targetDate = new Date()
    targetDate.setDate(targetDate.getDate() + daysAhead)

    // Buscar assinaturas migradas que vencem em N dias
    const { data, error } = await supabaseAdmin
      .from('subscriptions')
      .select(`
        id,
        user_id,
        area,
        plan_type,
        current_period_end,
        requires_manual_renewal,
        migrated_from,
        user_profiles!inner(email)
      `)
      .eq('status', 'active')
      .eq('requires_manual_renewal', true)
      .gte('current_period_end', new Date().toISOString()) // Ainda não venceu
      .lte('current_period_end', targetDate.toISOString()) // Vence em N dias ou menos

    if (error) {
      console.error('❌ Erro ao buscar assinaturas precisando renovação:', error)
      return []
    }

    return (data || []).map((sub: any) => {
      const expiryDate = new Date(sub.current_period_end)
      const now = new Date()
      const diffTime = expiryDate.getTime() - now.getTime()
      // Usar Math.floor para arredondar para baixo (se faltam 2.1 dias, mostra 2 dias)
      // Math.ceil estava causando erro: se faltam 2.1 dias, mostrava 3 dias
      const daysUntilExpiry = Math.floor(diffTime / (1000 * 60 * 60 * 24))

      return {
        id: sub.id,
        user_id: sub.user_id,
        area: sub.area,
        plan_type: sub.plan_type,
        current_period_end: sub.current_period_end,
        requires_manual_renewal: sub.requires_manual_renewal,
        migrated_from: sub.migrated_from,
        user_email: sub.user_profiles?.email,
        days_until_expiry: daysUntilExpiry,
      }
    })
  } catch (error) {
    console.error('❌ Erro ao buscar assinaturas precisando renovação:', error)
    return []
  }
}

/**
 * Envia email de notificação de renovação
 */
export async function sendRenewalNotification(
  subscription: SubscriptionNeedingRenewal
): Promise<boolean> {
  if (!subscription.user_email) {
    console.error('❌ Email do usuário não encontrado para subscription:', subscription.id)
    return false
  }

  if (!isResendConfigured() || !resend) {
    console.error('❌ Resend não está configurado')
    return false
  }

  const areaNames: Record<string, string> = {
    wellness: 'Wellness',
    nutri: 'Nutrição',
    coach: 'Coaching',
    nutra: 'Nutraceuticos',
  }

  const areaName = areaNames[subscription.area] || subscription.area
  const daysText = subscription.days_until_expiry === 1 
    ? '1 dia' 
    : `${subscription.days_until_expiry} dias`
  
  const renewalUrl = `${process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'https://www.ylada.com'}/pt/${subscription.area}/checkout?plan=${subscription.plan_type}`

  const subject = subscription.days_until_expiry <= 1
    ? `⚠️ Última chance! Sua assinatura ${areaName} vence ${subscription.days_until_expiry === 0 ? 'hoje' : 'amanhã'}`
    : subscription.days_until_expiry <= 3
    ? `⏰ Sua assinatura ${areaName} vence em ${daysText} - Renove agora`
    : `📅 Sua assinatura ${areaName} vence em ${daysText} - Renove para continuar`

  const urgencyColor = subscription.days_until_expiry <= 1 
    ? '#dc2626' // vermelho
    : subscription.days_until_expiry <= 3
    ? '#f59e0b' // laranja
    : '#10b981' // verde

  try {
    const { error, data } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: subscription.user_email,
      subject,
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
              <h1 style="color: white; margin: 0; font-size: 28px;">${subscription.days_until_expiry <= 1 ? '⚠️' : '📅'} Renovação de Assinatura</h1>
            </div>
            
            <div style="background: #f9fafb; padding: 30px; border-radius: 0 0 10px 10px; border: 1px solid #e5e7eb;">
              <p style="font-size: 18px; margin-top: 0;">Olá!</p>
              
              <p style="font-size: 16px;">
                Sua assinatura <strong>${areaName}</strong> está próxima do vencimento.
              </p>
              
              <div style="background: white; border-left: 4px solid ${urgencyColor}; padding: 20px; margin: 20px 0; border-radius: 5px;">
                <p style="margin: 0; font-size: 16px;">
                  <strong style="color: ${urgencyColor}; font-size: 20px;">${daysText}</strong><br>
                  <span style="color: #6b7280;">restam para o vencimento</span>
                </p>
              </div>
              
              ${subscription.migrated_from ? `
                <p style="font-size: 14px; color: #6b7280; background: #fef3c7; padding: 15px; border-radius: 5px; margin: 20px 0;">
                  <strong>ℹ️ Importante:</strong> Como sua assinatura foi migrada do sistema anterior, 
                  você precisará refazer o checkout para continuar com acesso automático e renovação recorrente.
                </p>
              ` : ''}
              
              <p style="font-size: 16px;">
                Para continuar aproveitando todos os recursos da plataforma, renove sua assinatura agora:
              </p>
              
              <div style="text-align: center; margin: 30px 0;">
                <a href="${renewalUrl}" 
                   style="display: inline-block; background: #10b981; color: white; padding: 15px 40px; 
                          text-decoration: none; border-radius: 8px; font-weight: bold; font-size: 18px;
                          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                  🔄 Renovar Assinatura Agora
                </a>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
                <strong>O que acontece se não renovar?</strong><br>
                Seu acesso será bloqueado automaticamente quando a assinatura vencer. 
                Você pode reativar a qualquer momento renovando sua assinatura.
              </p>
              
              <hr style="border: none; border-top: 1px solid #e5e7eb; margin: 30px 0;">
              
              <p style="font-size: 12px; color: #9ca3af; text-align: center; margin: 0;">
                Este é um e-mail automático. Por favor, não responda.<br>
                Se você tiver dúvidas, entre em contato através do suporte da plataforma.
              </p>
            </div>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Erro ao enviar email de renovação:', error)
      return false
    }

    console.log('✅ Email de renovação enviado:', {
      subscription_id: subscription.id,
      email: subscription.user_email,
      days_until_expiry: subscription.days_until_expiry,
      message_id: data?.id,
    })

    return true
  } catch (error) {
    console.error('❌ Erro ao enviar email de renovação:', error)
    return false
  }
}

/**
 * Processa e envia notificações para todas as assinaturas que precisam renovação
 */
export async function processRenewalNotifications(daysAhead: number = 30): Promise<{
  total: number
  sent: number
  failed: number
}> {
  const subscriptions = await getSubscriptionsNeedingRenewal(daysAhead)
  
  const results = {
    total: subscriptions.length,
    sent: 0,
    failed: 0,
  }

  for (const subscription of subscriptions) {
    // Enviar notificação apenas em intervalos específicos (7, 3, 1 dias antes)
    const days = subscription.days_until_expiry
    if (days === 7 || days === 3 || days === 1 || days === 0) {
      const success = await sendRenewalNotification(subscription)
      if (success) {
        results.sent++
      } else {
        results.failed++
      }
    }
  }

  return results
}

