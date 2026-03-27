/**
 * Sistema de Notificações para Suporte
 * Envia notificações quando tickets são criados ou atualizados
 */

import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from './resend'
import { supabaseAdmin } from './supabase'
import { isTelegramSupportConfigured, sendTelegramSupportMessage } from './telegram-support'
import { PLATFORM_SUPPORT_AREA } from './platform-support-constants'

/** Link para o admin abrir o ticket (email, Telegram, push do atendente). */
export function getSupportTicketStaffUrl(ticketId: string, area: string, baseUrl: string): string {
  if (area === PLATFORM_SUPPORT_AREA) {
    return `${baseUrl}/admin/suporte/tickets/${ticketId}`
  }
  return `${baseUrl}/pt/${area}/suporte/tickets/${ticketId}`
}

/** Link para o usuário final abrir a conversa no app. */
export function getSupportTicketUserUrl(ticketId: string, area: string, baseUrl: string): string {
  if (area === PLATFORM_SUPPORT_AREA) {
    return `${baseUrl}/pt/suporte/tickets/${ticketId}`
  }
  return `${baseUrl}/pt/${area}/suporte/tickets/${ticketId}`
}

// Importar web-push dinamicamente
let webpush: any = null
try {
  webpush = require('web-push')
} catch (e) {
  console.warn('[Support Notifications] web-push não instalado')
}

export interface TicketNotificationData {
  ticketId: string
  area: string
  assunto: string
  primeiraMensagem: string
  prioridade: string
  categoria?: string
  userName?: string
  userEmail?: string
  createdAt: string
}

/**
 * Busca emails dos atendentes online de uma área
 */
async function getOnlineAgentsEmails(area: string): Promise<string[]> {
  if (!supabaseAdmin) {
    console.warn('[Support Notifications] Supabase admin não disponível')
    return []
  }

  try {
    // Buscar atendentes online da área
    const { data: agents, error } = await supabaseAdmin
      .from('support_agents')
      .select('user_id')
      .eq('area', area)
      .eq('status', 'online')

    if (error || !agents || agents.length === 0) {
      console.log(`[Support Notifications] Nenhum atendente online encontrado para área: ${area}`)
      return []
    }

    // Buscar emails dos atendentes
    const emails: string[] = []
    for (const agent of agents) {
      try {
        const { data: userData } = await supabaseAdmin.auth.admin.getUserById(agent.user_id)
        if (userData?.user?.email) {
          emails.push(userData.user.email)
        }
      } catch (error) {
        console.error(`[Support Notifications] Erro ao buscar email do atendente ${agent.user_id}:`, error)
      }
    }

    return emails
  } catch (error) {
    console.error('[Support Notifications] Erro ao buscar atendentes:', error)
    return []
  }
}

/**
 * Gera HTML do email de notificação de novo ticket
 */
function generateTicketNotificationEmail(
  data: TicketNotificationData,
  baseUrl: string,
  ticketPath: string
): string {
  const prioridadeEmoji: Record<string, string> = {
    baixa: '🟢',
    normal: '🟡',
    alta: '🟠',
    urgente: '🔴'
  }

  const prioridadeLabel: Record<string, string> = {
    baixa: 'Baixa',
    normal: 'Normal',
    alta: 'Alta',
    urgente: 'Urgente'
  }

  const emoji = prioridadeEmoji[data.prioridade] || '🟡'
  const label = prioridadeLabel[data.prioridade] || 'Normal'

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
          <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🎫 Novo Ticket de Suporte</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">Área: ${data.area.toUpperCase()}</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <!-- Prioridade -->
            <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid ${data.prioridade === 'urgente' ? '#ef4444' : data.prioridade === 'alta' ? '#f59e0b' : '#3b82f6'};">
              <div style="display: flex; align-items: center; gap: 10px;">
                <span style="font-size: 24px;">${emoji}</span>
                <div>
                  <strong style="color: #111827; font-size: 14px;">Prioridade:</strong>
                  <span style="color: #6b7280; font-size: 14px; margin-left: 5px;">${label}</span>
                </div>
              </div>
            </div>

            <!-- Informações do Ticket -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">📋 Informações do Ticket</h2>
              
              <table style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151; width: 140px; font-size: 14px;">ID do Ticket:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px; font-family: monospace;">${data.ticketId.substring(0, 8)}...</td>
                </tr>
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151; font-size: 14px;">Assunto:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px;">${data.assunto || 'Sem assunto'}</td>
                </tr>
                ${data.categoria ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151; font-size: 14px;">Categoria:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px;">${data.categoria}</td>
                </tr>
                ` : ''}
                ${data.userName ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151; font-size: 14px;">Usuário:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px;">${data.userName}</td>
                </tr>
                ` : ''}
                ${data.userEmail ? `
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151; font-size: 14px;">Email:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px;">${data.userEmail}</td>
                </tr>
                ` : ''}
                <tr>
                  <td style="padding: 8px 0; font-weight: 600; color: #374151; font-size: 14px;">Data/Hora:</td>
                  <td style="padding: 8px 0; color: #111827; font-size: 14px;">${new Date(data.createdAt).toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}</td>
                </tr>
              </table>
            </div>

            <!-- Mensagem -->
            <div style="margin-bottom: 25px;">
              <h2 style="color: #111827; font-size: 18px; font-weight: 600; margin: 0 0 15px 0;">💬 Mensagem do Usuário</h2>
              <div style="background-color: #f9fafb; padding: 20px; border-radius: 8px; border-left: 4px solid #3b82f6;">
                <p style="color: #111827; font-size: 14px; line-height: 1.6; margin: 0; white-space: pre-wrap;">${data.primeiraMensagem}</p>
              </div>
            </div>

            <!-- Botão de Ação -->
            <div style="text-align: center; margin: 30px 0;">
              <a href="${ticketPath}" 
                 style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(0,0,0,0.1);">
                📥 Ver Ticket e Responder
              </a>
            </div>

            <!-- Footer -->
            <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px;">
              <p style="color: #6b7280; font-size: 12px; margin: 0; line-height: 1.6;">
                Esta é uma notificação automática do sistema de suporte YLADA.<br>
                Você está recebendo porque é um atendente online da área ${data.area.toUpperCase()}.<br>
                <strong>Não responda este email.</strong> Use o sistema para responder ao ticket.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Envia notificação de novo ticket para atendentes online
 */
export async function notifyAgentsNewTicket(data: TicketNotificationData): Promise<{
  success: boolean
  emailsSent: number
  errors: string[]
}> {
  const errors: string[] = []
  let emailsSent = 0

  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://www.ylada.com'
  const ticketPath = getSupportTicketStaffUrl(data.ticketId, data.area, baseUrl)

  try {
    if (data.area === PLATFORM_SUPPORT_AREA && isTelegramSupportConfigured()) {
      const preview =
        data.primeiraMensagem.length > 400
          ? `${data.primeiraMensagem.slice(0, 400)}…`
          : data.primeiraMensagem
      const tgText =
        `🎫 YLADA — novo ticket (plataforma)\n` +
        `Assunto: ${data.assunto || '—'}\n` +
        `Usuário: ${data.userName || '—'}${data.userEmail ? ` (${data.userEmail})` : ''}\n` +
        `Prioridade: ${data.prioridade}\n\n` +
        `${preview}\n\n` +
        `Abrir: ${ticketPath}`
      sendTelegramSupportMessage(tgText).catch((e) =>
        console.error('[Support Notifications] Telegram:', e)
      )
    }

    if (!isResendConfigured() || !resend) {
      console.warn('[Support Notifications] Resend não configurado, emails de ticket não serão enviados')
      return {
        success: data.area === PLATFORM_SUPPORT_AREA && isTelegramSupportConfigured(),
        emailsSent: 0,
        errors: ['Resend não configurado']
      }
    }

    const agentEmails = await getOnlineAgentsEmails(data.area)
    const notificationEmail = process.env.SUPPORT_NOTIFICATION_EMAIL || process.env.CONTACT_NOTIFICATION_EMAIL
    const emailsToNotify =
      agentEmails.length > 0 ? agentEmails : notificationEmail ? [notificationEmail] : []

    if (emailsToNotify.length === 0) {
      console.warn(
        '[Support Notifications] Nenhum email para notificar (sem atendentes online e sem email de notificação configurado)'
      )
      return {
        success: emailsSent > 0 || (data.area === PLATFORM_SUPPORT_AREA && isTelegramSupportConfigured()),
        emailsSent: 0,
        errors: ['Nenhum email para notificar']
      }
    }

    const emailHtml = generateTicketNotificationEmail(data, baseUrl, ticketPath)

    for (const email of emailsToNotify) {
      try {
        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: email,
          subject: `🎫 Novo Ticket ${data.area.toUpperCase()} - ${data.prioridade === 'urgente' ? '🔴 URGENTE' : data.prioridade === 'alta' ? '🟠 ALTA' : ''} ${data.assunto || 'Sem assunto'}`,
          html: emailHtml,
        })

        emailsSent++
        console.log(`[Support Notifications] ✅ Email enviado para: ${email}`)
      } catch (emailError: any) {
        const errorMsg = `Erro ao enviar para ${email}: ${emailError.message}`
        errors.push(errorMsg)
        console.error(`[Support Notifications] ❌ ${errorMsg}`)
      }
    }

    return {
      success: emailsSent > 0,
      emailsSent,
      errors
    }
  } catch (error: any) {
    const errorMsg = `Erro ao processar notificações: ${error.message}`
    errors.push(errorMsg)
    console.error(`[Support Notifications] ❌ ${errorMsg}`)
    return {
      success: false,
      emailsSent,
      errors
    }
  }
}

/**
 * Envia push notification para usuário quando há nova mensagem no ticket
 */
async function sendPushNotificationForNewMessage(
  userId: string,
  ticketId: string,
  area: string,
  message: string,
  senderName: string,
  openUrl: string
): Promise<boolean> {
  try {
    // Verificar se web-push está disponível
    if (!webpush) {
      return false // web-push não instalado
    }

    // Validar VAPID keys
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
    const vapidSubject = process.env.VAPID_SUBJECT || 'mailto:admin@ylada.com'

    if (!vapidPublicKey || !vapidPrivateKey) {
      return false // VAPID keys não configuradas
    }

    // Configurar web-push
    webpush.setVapidDetails(vapidSubject, vapidPublicKey, vapidPrivateKey)

    // Buscar subscriptions do usuário
    const { data: subscriptions } = await supabaseAdmin
      ?.from('push_subscriptions')
      .select('*')
      .eq('user_id', userId)
      .eq('ativo', true)

    if (!subscriptions || subscriptions.length === 0) {
      return false // Usuário não tem subscriptions
    }

    const messagePreview = message.length > 100 ? message.substring(0, 100) + '...' : message
    const payload = JSON.stringify({
      title: `💬 Nova mensagem de ${senderName}`,
      body: messagePreview,
      icon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
      badge: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
      tag: `ticket-${ticketId}`,
      data: {
        url: openUrl,
        ticketId,
        area
      },
      requireInteraction: false
    })

    // Enviar para cada subscription
    const results = await Promise.allSettled(
      subscriptions.map(async (sub: any) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: {
                p256dh: sub.keys.p256dh,
                auth: sub.keys.auth
              }
            },
            payload
          )
          return { success: true }
        } catch (error: any) {
          console.error('[Support Notifications] Erro ao enviar push:', error)
          // Se subscription inválida, remover do banco
          if (error.statusCode === 410 || error.statusCode === 404) {
            await supabaseAdmin
              ?.from('push_subscriptions')
              .delete()
              .eq('id', sub.id)
          }
          return { success: false, error: error.message }
        }
      })
    )

    const successful = results.filter(r => r.status === 'fulfilled' && r.value.success).length
    console.log(`[Support Notifications] Push notifications enviadas: ${successful}/${subscriptions.length}`)
    
    return successful > 0
  } catch (error) {
    console.error('[Support Notifications] Erro ao enviar push notification:', error)
    return false
  }
}

/**
 * Envia notificação quando ticket recebe nova mensagem (email + push)
 */
export async function notifyAgentNewMessage(
  ticketId: string,
  area: string,
  message: string,
  agentId: string
): Promise<boolean> {
  let emailSent = false
  let pushSent = false

  // Enviar email
  if (isResendConfigured() && resend) {
    try {
      // Buscar email do atendente
      const { data: userData } = await supabaseAdmin?.auth.admin.getUserById(agentId)
      if (userData?.user?.email) {
        const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                       process.env.NEXT_PUBLIC_APP_URL || 
                       'https://www.ylada.com'
        const ticketUrl = getSupportTicketStaffUrl(ticketId, area, baseUrl)

        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: userData.user.email,
          subject: `💬 Nova mensagem no ticket ${ticketId.substring(0, 8)}...`,
          html: `
            <!DOCTYPE html>
            <html>
              <head>
                <meta charset="utf-8">
              </head>
              <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
                <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
                  <h1 style="color: #2563eb;">💬 Nova Mensagem no Ticket</h1>
                  <p>Você recebeu uma nova mensagem no ticket <strong>${ticketId.substring(0, 8)}...</strong></p>
                  <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; margin: 20px 0;">
                    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                  </div>
                  <a href="${ticketUrl}" 
                     style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
                    Ver Ticket
                  </a>
                </div>
              </body>
            </html>
          `,
        })
        emailSent = true
      }
    } catch (error) {
      console.error('[Support Notifications] Erro ao enviar email de nova mensagem:', error)
    }
  }

  // Enviar push notification
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://www.ylada.com'
  const agentOpenUrl = getSupportTicketStaffUrl(ticketId, area, baseUrl)
  pushSent = await sendPushNotificationForNewMessage(
    agentId,
    ticketId,
    area,
    message,
    'Usuário',
    agentOpenUrl
  )

  return emailSent || pushSent
}

/**
 * Envia notificação push quando usuário recebe nova mensagem de atendente
 */
/** Resposta do usuário em ticket `platform`: alerta rápido no Telegram (e-mail opcional reduz ruído). */
export async function notifyPlatformStaffUserReplied(params: {
  ticketId: string
  snippet: string
  userName?: string
  userEmail?: string
}): Promise<void> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://www.ylada.com'
  const path = getSupportTicketStaffUrl(params.ticketId, PLATFORM_SUPPORT_AREA, baseUrl)
  if (isTelegramSupportConfigured()) {
    const text =
      `💬 YLADA — nova mensagem (plataforma)\n` +
      `Ticket: ${params.ticketId.slice(0, 8)}…\n` +
      `Usuário: ${params.userName || '—'}${params.userEmail ? ` (${params.userEmail})` : ''}\n\n` +
      `${params.snippet.slice(0, 500)}${params.snippet.length > 500 ? '…' : ''}\n\n` +
      `Abrir: ${path}`
    await sendTelegramSupportMessage(text).catch((e) =>
      console.error('[Support Notifications] Telegram (reply):', e)
    )
  }
}

function escapeHtmlForEmail(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
}

/**
 * E-mail quando o usuário envia a **primeira** mensagem no chat da Nina (suporte in-app).
 * Destinatários: atendentes online da área (quando existir) ou SUPPORT_NOTIFICATION_EMAIL / CONTACT_NOTIFICATION_EMAIL.
 * Não bloqueia a resposta da API (chamar com void + .catch no caller).
 */
export async function notifyNinaSupportInquiry(params: {
  userId: string
  userEmail?: string | null
  displayName?: string | null
  message: string
  segment: string
  supportUi: 'matrix' | 'wellness'
}): Promise<{ emailsSent: number }> {
  if (process.env.NINA_SUPPORT_EMAIL_NOTIFY === '0' || process.env.NINA_SUPPORT_EMAIL_NOTIFY === 'false') {
    return { emailsSent: 0 }
  }

  if (!isResendConfigured() || !resend) {
    console.warn('[Support Notifications] Nina: Resend não configurado, e-mail não enviado')
    return { emailsSent: 0 }
  }

  const agentArea = params.supportUi === 'wellness' ? 'wellness' : params.segment
  const agentEmails = await getOnlineAgentsEmails(agentArea)
  const notificationEmail =
    process.env.SUPPORT_NOTIFICATION_EMAIL ||
    process.env.CONTACT_NOTIFICATION_EMAIL ||
    'ylada.app@gmail.com'
  const emailsToNotify = agentEmails.length > 0 ? agentEmails : [notificationEmail]

  const areaLabel = params.supportUi === 'wellness' ? 'Wellness' : params.segment
  const previewRaw =
    params.message.length > 800 ? `${params.message.slice(0, 800)}…` : params.message
  const preview = escapeHtmlForEmail(previewRaw).replace(/\r\n|\n/g, '<br/>')

  const nome = params.displayName?.trim() || '—'
  const email = params.userEmail?.trim() || '—'
  const html = `<!DOCTYPE html>
<html><head><meta charset="utf-8"/></head>
<body style="font-family:system-ui,sans-serif;padding:20px;background:#f5f5f5;">
  <div style="max-width:560px;margin:0 auto;background:#fff;padding:24px;border-radius:12px;">
    <h1 style="font-size:18px;color:#111;">Nova pergunta no suporte (Nina)</h1>
    <p style="color:#444;font-size:14px;margin:12px 0;"><strong>Área:</strong> ${escapeHtmlForEmail(areaLabel)}</p>
    <p style="color:#444;font-size:14px;margin:12px 0;"><strong>Nome:</strong> ${escapeHtmlForEmail(nome)}</p>
    <p style="color:#444;font-size:14px;margin:12px 0;"><strong>E-mail:</strong> ${escapeHtmlForEmail(email)}</p>
    <p style="color:#444;font-size:14px;margin:12px 0;"><strong>ID usuário:</strong> ${escapeHtmlForEmail(params.userId)}</p>
    <div style="margin-top:16px;padding:14px;background:#f9fafb;border-radius:8px;border:1px solid #e5e7eb;">
      <p style="margin:0 0 8px;font-size:13px;color:#6b7280;">Primeira mensagem</p>
      <p style="margin:0;font-size:14px;color:#111;line-height:1.5;">${preview}</p>
    </div>
    <p style="margin-top:16px;font-size:12px;color:#9ca3af;">Responda pelo WhatsApp de suporte ou quando o usuário abrir chamado, conforme o fluxo da equipe.</p>
  </div>
</body></html>`

  let emailsSent = 0
  for (const to of emailsToNotify) {
    try {
      await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to,
        subject: `💬 Nina — nova pergunta (${areaLabel})`,
        html,
      })
      emailsSent++
      console.log(`[Support Notifications] Nina inquiry enviado para: ${to}`)
    } catch (e: unknown) {
      console.error('[Support Notifications] Nina inquiry erro:', e)
    }
  }

  return { emailsSent }
}

export async function notifyUserNewMessage(
  ticketId: string,
  area: string,
  message: string,
  userId: string,
  senderName: string
): Promise<boolean> {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL_PRODUCTION ||
    process.env.NEXT_PUBLIC_APP_URL ||
    'https://www.ylada.com'
  const userOpenUrl = getSupportTicketUserUrl(ticketId, area, baseUrl)
  return await sendPushNotificationForNewMessage(
    userId,
    ticketId,
    area,
    message,
    senderName,
    userOpenUrl
  )
}

