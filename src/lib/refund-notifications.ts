/**
 * Sistema de Notificações para Solicitações de Reembolso
 * Envia email e WhatsApp quando alguém solicita reembolso
 */

import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from './resend'
import { supabaseAdmin } from './supabase'
import { sendWhatsAppMessage } from './z-api'

export interface RefundRequestNotificationData {
  subscriptionId: string
  userId: string
  userEmail: string
  userName: string
  area: 'nutri' | 'wellness' | 'coach'
  amount: number
  reason: string
  daysSincePurchase: number
  cancelAttemptId: string
}

/**
 * Busca email do admin
 */
async function getAdminEmail(): Promise<string | null> {
  const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL || 'ylada.app@gmail.com'
  return adminEmail
}

/**
 * Gera HTML do email de notificação de reembolso
 */
function generateRefundRequestEmail(data: RefundRequestNotificationData, baseUrl: string): string {
  const areaLabel = {
    nutri: 'Nutri',
    wellness: 'Wellness',
    coach: 'Coach'
  }

  const reasonLabels: Record<string, string> = {
    'no_time': 'Não tive tempo de usar',
    'didnt_understand': 'Não entendi como funciona',
    'no_value': 'Não vi valor ainda',
    'forgot_trial': 'Esqueci que o trial acabava',
    'too_expensive': 'Achei muito caro',
    'found_alternative': 'Encontrei uma alternativa',
    'other': 'Outro motivo'
  }

  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; padding: 0; margin: 0; background-color: #f5f5f5;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
          <!-- Header -->
          <div style="background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">
              💰 Solicitação de Reembolso
            </h1>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <p style="color: #374151; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
              Uma nova solicitação de reembolso foi registrada no sistema.
            </p>

            <div style="background-color: #f9fafb; border-left: 4px solid #dc2626; padding: 20px; margin: 20px 0; border-radius: 4px;">
              <h2 style="color: #111827; font-size: 18px; margin: 0 0 15px 0;">📋 Detalhes da Solicitação</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 40%;">Área:</td>
                  <td style="padding: 8px 0; color: #111827;">${areaLabel[data.area]}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Usuário:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.userName || 'N/A'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Email:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.userEmail}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Valor:</td>
                  <td style="padding: 8px 0; color: #111827; font-weight: 600;">R$ ${data.amount.toFixed(2).replace('.', ',')}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Motivo:</td>
                  <td style="padding: 8px 0; color: #111827;">${reasonLabels[data.reason] || data.reason}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Dias desde compra:</td>
                  <td style="padding: 8px 0; color: #111827;">${data.daysSincePurchase} ${data.daysSincePurchase === 1 ? 'dia' : 'dias'}</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: bold; color: #374151;">Subscription ID:</td>
                  <td style="padding: 8px 0; color: #111827; font-family: monospace; font-size: 12px;">${data.subscriptionId.substring(0, 8)}...</td>
                </tr>
              </table>
            </div>

            <div style="background-color: #fef2f2; border: 1px solid #fecaca; padding: 15px; border-radius: 6px; margin: 20px 0;">
              <p style="color: #991b1b; margin: 0; font-size: 14px; font-weight: 600;">
                ⚠️ Esta solicitação está dentro do prazo de garantia de 7 dias e requer atenção.
              </p>
            </div>

            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="color: #6b7280; font-size: 12px; margin: 0;">
                <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Envia notificação de solicitação de reembolso por email e WhatsApp
 */
export async function notifyAdminRefundRequest(
  data: RefundRequestNotificationData
): Promise<{ emailSent: boolean; whatsappSent: boolean }> {
  const results = {
    emailSent: false,
    whatsappSent: false
  }

  // 1. Enviar email
  if (isResendConfigured() && resend) {
    try {
      const adminEmail = await getAdminEmail()
      
      if (!adminEmail) {
        console.warn('[Refund Notifications] Email do admin não encontrado')
      } else {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                       process.env.VERCEL_URL 
                         ? `https://${process.env.VERCEL_URL}` 
                         : 'http://localhost:3000'

        const emailHtml = generateRefundRequestEmail(data, baseUrl)

        const result = await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: adminEmail,
          subject: `💰 Solicitação de Reembolso - ${data.area.toUpperCase()} - R$ ${data.amount.toFixed(2).replace('.', ',')}`,
          html: emailHtml
        })

        if (!result.error) {
          results.emailSent = true
          console.log(`[Refund Notifications] ✅ Email enviado para ${adminEmail}`)
        } else {
          console.error('[Refund Notifications] Erro ao enviar email:', result.error)
        }
      }
    } catch (error) {
      console.error('[Refund Notifications] Erro ao enviar email:', error)
    }
  }

  // 2. Enviar WhatsApp
  try {
    const notificationPhone = process.env.Z_API_NOTIFICATION_PHONE
    
    if (!notificationPhone) {
      console.log('[Refund Notifications] ℹ️ Z_API_NOTIFICATION_PHONE não configurado')
    } else {
      // Buscar instância Z-API (usar instância da área ou padrão)
      const { data: instances } = await supabaseAdmin
        .from('z_api_instances')
        .select('instance_id, token, area')
        .eq('is_active', true)
        .eq('is_connected', true)
        .order('created_at', { ascending: false })
        .limit(1)

      if (!instances || instances.length === 0) {
        console.warn('[Refund Notifications] ⚠️ Nenhuma instância Z-API conectada encontrada')
      } else {
        const instance = instances[0]
        
        // Formatar número
        let formattedPhone = notificationPhone.replace(/\D/g, '')
        const countryCodes = ['1', '55', '52', '54', '56', '57', '58', '591', '592', '593', '594', '595', '596', '597', '598', '599']
        const hasCountryCode = countryCodes.some(code => formattedPhone.startsWith(code))
        if (!hasCountryCode) {
          if (formattedPhone.startsWith('0')) {
            formattedPhone = formattedPhone.substring(1)
          }
          formattedPhone = `55${formattedPhone}`
        }

        // Formatar mensagem
        const areaLabel = {
          nutri: 'Nutri',
          wellness: 'Wellness',
          coach: 'Coach'
        }

        const reasonLabels: Record<string, string> = {
          'no_time': 'Não tive tempo',
          'didnt_understand': 'Não entendi',
          'no_value': 'Não vi valor',
          'forgot_trial': 'Esqueci trial',
          'too_expensive': 'Muito caro',
          'found_alternative': 'Alternativa',
          'other': 'Outro'
        }

        const whatsappMessage = `💰 *Solicitação de Reembolso*

📋 *Área:* ${areaLabel[data.area]}
👤 *Usuário:* ${data.userName || 'N/A'}
📧 *Email:* ${data.userEmail}
💵 *Valor:* R$ ${data.amount.toFixed(2).replace('.', ',')}
📝 *Motivo:* ${reasonLabels[data.reason] || data.reason}
📅 *Dias desde compra:* ${data.daysSincePurchase} ${data.daysSincePurchase === 1 ? 'dia' : 'dias'}

⚠️ *Dentro da garantia de 7 dias*

Verifique no sistema para processar o reembolso.`

        const result = await sendWhatsAppMessage(
          formattedPhone,
          whatsappMessage,
          instance.instance_id,
          instance.token
        )

        if (result.success) {
          results.whatsappSent = true
          console.log(`[Refund Notifications] ✅ WhatsApp enviado para ${formattedPhone}`)
        } else {
          console.error('[Refund Notifications] Erro ao enviar WhatsApp:', result.error)
        }
      }
    }
  } catch (error) {
    console.error('[Refund Notifications] Erro ao enviar WhatsApp:', error)
  }

  return results
}
