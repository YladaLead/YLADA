/**
 * Sistema de Notificações para Suporte
 * Envia notificações quando tickets são criados ou atualizados
 */

import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from './resend'
import { supabaseAdmin } from './supabase'

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
function generateTicketNotificationEmail(data: TicketNotificationData, baseUrl: string): string {
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
              <a href="${baseUrl}/pt/nutri/suporte/tickets/${data.ticketId}" 
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

  // Verificar se Resend está configurado
  if (!isResendConfigured() || !resend) {
    console.warn('[Support Notifications] Resend não configurado, notificações não serão enviadas')
    return {
      success: false,
      emailsSent: 0,
      errors: ['Resend não configurado']
    }
  }

  try {
    // Obter base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                   process.env.NEXT_PUBLIC_APP_URL || 
                   'https://www.ylada.com'

    // Buscar emails dos atendentes online
    const agentEmails = await getOnlineAgentsEmails(data.area)

    // Se não há atendentes online, enviar para email de notificação geral (se configurado)
    const notificationEmail = process.env.SUPPORT_NOTIFICATION_EMAIL || process.env.CONTACT_NOTIFICATION_EMAIL
    
    const emailsToNotify = agentEmails.length > 0 
      ? agentEmails 
      : (notificationEmail ? [notificationEmail] : [])

    if (emailsToNotify.length === 0) {
      console.warn('[Support Notifications] Nenhum email para notificar (sem atendentes online e sem email de notificação configurado)')
      return {
        success: false,
        emailsSent: 0,
        errors: ['Nenhum email para notificar']
      }
    }

    // Gerar HTML do email
    const emailHtml = generateTicketNotificationEmail(data, baseUrl)

    // Enviar email para cada destinatário
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
 * Envia notificação quando ticket recebe nova mensagem (se atendente não está online)
 */
export async function notifyAgentNewMessage(
  ticketId: string,
  area: string,
  message: string,
  agentId: string
): Promise<boolean> {
  if (!isResendConfigured() || !resend) {
    return false
  }

  try {
    // Buscar email do atendente
    const { data: userData } = await supabaseAdmin?.auth.admin.getUserById(agentId)
    if (!userData?.user?.email) {
      return false
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                   process.env.NEXT_PUBLIC_APP_URL || 
                   'https://www.ylada.com'

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
              <a href="${baseUrl}/pt/${area}/suporte/tickets/${ticketId}" 
                 style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; margin-top: 20px;">
                Ver Ticket
              </a>
            </div>
          </body>
        </html>
      `,
    })

    return true
  } catch (error) {
    console.error('[Support Notifications] Erro ao enviar notificação de nova mensagem:', error)
    return false
  }
}

