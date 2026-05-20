/**
 * Sistema de Notificações para NOEL Sales Support
 * Notifica admin quando NOEL não sabe responder na página de vendas
 */

import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from './resend'
import { supabaseAdmin } from './supabase'

export interface NoelUnansweredNotificationData {
  question: string
  response: string
  userEmail?: string
  timestamp: Date
  conversationHistory?: Array<{ role: 'user' | 'assistant'; content: string }>
}

const SUPPORT_EMAIL = 'ylada.app@gmail.com'
const ADMIN_EMAIL = 'ylada.app@gmail.com'

/**
 * Busca user_id do admin pelo email
 */
async function getAdminUserId(): Promise<string | null> {
  if (!supabaseAdmin) {
    console.warn('[NOEL Sales Support] Supabase admin não disponível')
    return null
  }

  try {
    // Buscar usuário pelo email usando auth.admin.getUserByEmail
    try {
      const { data: userData, error } = await supabaseAdmin.auth.admin.getUserByEmail(ADMIN_EMAIL)
      
      if (error || !userData?.user) {
        console.warn('[NOEL Sales Support] Admin não encontrado pelo email:', ADMIN_EMAIL)
        return null
      }

      return userData.user.id
    } catch (getUserError: any) {
      // Se getUserByEmail não funcionar, tentar listUsers
      console.log('[NOEL Sales Support] Tentando buscar via listUsers...')
      
      const { data: authData, error } = await supabaseAdmin.auth.admin.listUsers()
      
      if (error) {
        console.error('[NOEL Sales Support] Erro ao buscar usuários:', error)
        return null
      }

      // Encontrar admin pelo email
      const admin = authData.users.find(user => 
        user.email === ADMIN_EMAIL || 
        user.email?.toLowerCase() === ADMIN_EMAIL.toLowerCase()
      )

      if (admin) {
        return admin.id
      }

      console.warn('[NOEL Sales Support] Admin não encontrado pelo email:', ADMIN_EMAIL)
      return null
    }
  } catch (error) {
    console.error('[NOEL Sales Support] Erro ao buscar admin:', error)
    return null
  }
}

/**
 * Envia push notification para o admin
 */
async function sendPushNotificationToAdmin(
  adminUserId: string,
  data: NoelUnansweredNotificationData
): Promise<boolean> {
  if (!supabaseAdmin) {
    return false
  }

  try {
    // Buscar subscriptions do admin
    const { data: subscriptions, error } = await supabaseAdmin
      .from('push_subscriptions')
      .select('*')
      .eq('user_id', adminUserId)

    if (error || !subscriptions || subscriptions.length === 0) {
      console.log('[NOEL Sales Support] Admin não tem push subscriptions ativas')
      return false
    }

    // Importar web-push dinamicamente
    let webpush: any = null
    try {
      webpush = require('web-push')
    } catch (e) {
      console.warn('[NOEL Sales Support] web-push não instalado')
      return false
    }

    // Validar VAPID keys
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@ylada.com'

    if (!vapidPublicKey || !vapidPrivateKey) {
      console.warn('[NOEL Sales Support] VAPID keys não configuradas')
      return false
    }

    // Configurar web-push
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                   process.env.VERCEL_URL 
                     ? `https://${process.env.VERCEL_URL}` 
                     : 'http://localhost:3000'

    // Preparar payload
    const payload = JSON.stringify({
      title: '🔴 NOEL não soube responder',
      body: `Pergunta: ${data.question.substring(0, 100)}${data.question.length > 100 ? '...' : ''}`,
      icon: '/images/logo/ylada/novo/ylada-icon-512.png',
      badge: '/images/logo/ylada/novo/ylada-icon-512.png',
      tag: 'noel-unanswered',
      data: {
        url: `${baseUrl}/pt/wellness/suporte`,
        question: data.question,
        response: data.response,
        userEmail: data.userEmail,
      },
      requireInteraction: true,
    })

    // Enviar para cada subscription do admin
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth,
              },
            },
            payload
          )
          return { success: true }
        } catch (error: any) {
          console.error('[NOEL Sales Support] Erro ao enviar push:', error)
          // Se subscription inválida, remover do banco
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabaseAdmin
              .from('push_subscriptions')
              .delete()
              .eq('id', sub.id)
          }
          return { success: false, error: error.message }
        }
      })
    )

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    console.log(`[NOEL Sales Support] Push notifications enviadas: ${successful}/${subscriptions.length}`)
    
    return successful > 0
  } catch (error) {
    console.error('[NOEL Sales Support] Erro ao enviar push notification:', error)
    return false
  }
}

/**
 * Gera HTML do email de notificação
 */
function generateUnansweredEmail(
  data: NoelUnansweredNotificationData,
  baseUrl: string
): string {
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
          <div style="background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🔴 NOEL não soube responder</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Página de vendas - Suporte Sales</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <!-- Question -->
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 10px 0;">❓ Pergunta do usuário:</h2>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">${data.question}</p>
              </div>
            </div>

            <!-- Response -->
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 10px 0;">💬 Resposta do NOEL:</h2>
              <div style="background-color: #fef2f2; padding: 15px; border-radius: 6px; border: 1px solid #fecaca;">
                <p style="margin: 0; color: #991b1b; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.response}</p>
              </div>
            </div>

            <!-- Metadata -->
            <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
              ${data.userEmail ? `
              <div style="flex: 1; min-width: 150px;">
                <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Email do usuário</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #111827; font-weight: 500;">${data.userEmail}</p>
              </div>
              ` : ''}
              <div style="flex: 1; min-width: 150px;">
                <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Data/Hora</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #111827; font-weight: 500;">${new Date(data.timestamp).toLocaleString('pt-BR')}</p>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="${baseUrl}/pt/wellness/suporte" style="display: inline-block; background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                Ver no Suporte
              </a>
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                Esta notificação foi enviada porque o NOEL não conseguiu responder adequadamente à pergunta do usuário na página de vendas.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Notifica admin quando NOEL não soube responder
 * Envia email + push notification
 */
export async function notifyAdminNoelUnanswered(
  data: NoelUnansweredNotificationData
): Promise<{ emailSent: boolean; pushSent: boolean }> {
  const results = {
    emailSent: false,
    pushSent: false,
  }

  // 1. Enviar email
  if (isResendConfigured() && resend) {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 
                     process.env.VERCEL_URL 
                       ? `https://${process.env.VERCEL_URL}` 
                       : 'http://localhost:3000'

      const emailHtml = generateUnansweredEmail(data, baseUrl)

      const result = await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: ADMIN_EMAIL,
        subject: `🔴 NOEL não soube responder - Página de Vendas`,
        html: emailHtml,
      })

      if (!result.error) {
        results.emailSent = true
        console.log(`[NOEL Sales Support] ✅ Email enviado para ${ADMIN_EMAIL}`)
      } else {
        console.error('[NOEL Sales Support] Erro ao enviar email:', result.error)
      }
    } catch (error) {
      console.error('[NOEL Sales Support] Erro ao enviar email:', error)
    }
  }

  // 2. Enviar push notification
  try {
    const adminUserId = await getAdminUserId()
    if (adminUserId) {
      results.pushSent = await sendPushNotificationToAdmin(adminUserId, data)
      if (results.pushSent) {
        console.log(`[NOEL Sales Support] ✅ Push notification enviada para admin`)
      }
    }
  } catch (error) {
    console.error('[NOEL Sales Support] Erro ao enviar push:', error)
  }

  return results
}
