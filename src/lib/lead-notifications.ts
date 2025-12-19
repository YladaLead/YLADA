/**
 * Sistema de Notificações para Novos Leads
 * Envia email quando um novo lead é capturado
 */

import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from './resend'
import { supabaseAdmin } from './supabase'

export interface LeadNotificationData {
  leadId: string
  leadName: string
  leadPhone: string
  leadEmail?: string
  toolName: string
  result?: string
  userId: string
  createdAt: string
}

/**
 * Busca email do usuário (nutricionista/coach) pelo user_id
 */
async function getUserEmail(userId: string): Promise<string | null> {
  if (!supabaseAdmin) {
    console.warn('[Lead Notifications] Supabase admin não disponível')
    return null
  }

  try {
    const { data: userData, error } = await supabaseAdmin.auth.admin.getUserById(userId)
    
    if (error || !userData?.user?.email) {
      console.error('[Lead Notifications] Erro ao buscar email do usuário:', error)
      return null
    }

    return userData.user.email
  } catch (error: any) {
    console.error('[Lead Notifications] Erro ao buscar email:', error)
    return null
  }
}

/**
 * Gera HTML do email de notificação de novo lead
 */
function generateLeadNotificationEmail(data: LeadNotificationData, baseUrl: string): string {
  const leadsUrl = `${baseUrl}/pt/nutri/leads`
  
  return `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
      </head>
      <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5; margin: 0;">
        <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="color: #2563eb; margin: 0;">🎉 Novo Lead Capturado!</h1>
          </div>
          
          <div style="background-color: #f0f9ff; padding: 20px; border-radius: 8px; margin-bottom: 20px; border-left: 4px solid #2563eb;">
            <h2 style="color: #1e40af; margin-top: 0;">Informações do Lead</h2>
            <table style="width: 100%; border-collapse: collapse;">
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: bold; width: 120px;">Nome:</td>
                <td style="padding: 8px 0; color: #1e293b;">${data.leadName}</td>
              </tr>
              ${data.leadEmail ? `
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Email:</td>
                <td style="padding: 8px 0; color: #1e293b;">${data.leadEmail}</td>
              </tr>
              ` : ''}
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Telefone:</td>
                <td style="padding: 8px 0; color: #1e293b;">${data.leadPhone}</td>
              </tr>
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Ferramenta:</td>
                <td style="padding: 8px 0; color: #1e293b;">${data.toolName}</td>
              </tr>
              ${data.result ? `
              <tr>
                <td style="padding: 8px 0; color: #64748b; font-weight: bold;">Resultado:</td>
                <td style="padding: 8px 0; color: #1e293b;">${data.result}</td>
              </tr>
              ` : ''}
            </table>
          </div>

          <div style="text-align: center; margin-top: 30px;">
            <a href="${leadsUrl}" 
               style="display: inline-block; background-color: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">
              Ver Lead na Plataforma
            </a>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center;">
            <p style="margin: 0;">Este é um email automático. Não responda este email.</p>
            <p style="margin: 5px 0 0 0;">Você está recebendo este email porque um novo lead foi capturado em sua conta.</p>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Envia notificação de novo lead para o nutricionista/coach
 */
export async function notifyNewLead(data: LeadNotificationData): Promise<{
  success: boolean
  emailSent: boolean
  error?: string
}> {
  // Verificar se Resend está configurado
  if (!isResendConfigured() || !resend) {
    console.warn('[Lead Notifications] Resend não configurado, notificação não será enviada')
    return {
      success: false,
      emailSent: false,
      error: 'Resend não configurado'
    }
  }

  try {
    // Buscar email do usuário (nutricionista/coach)
    const userEmail = await getUserEmail(data.userId)
    
    if (!userEmail) {
      console.warn('[Lead Notifications] Email do usuário não encontrado para user_id:', data.userId)
      return {
        success: false,
        emailSent: false,
        error: 'Email do usuário não encontrado'
      }
    }

    // Obter base URL
    const baseUrl = process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 
                   process.env.NEXT_PUBLIC_APP_URL || 
                   'https://www.ylada.com'

    // Gerar HTML do email
    const emailHtml = generateLeadNotificationEmail(data, baseUrl)

    // Enviar email
    const result = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: userEmail,
      subject: `🎉 Novo Lead: ${data.leadName} - ${data.toolName}`,
      html: emailHtml,
    })

    if (result.error) {
      console.error('[Lead Notifications] Erro ao enviar email:', result.error)
      return {
        success: false,
        emailSent: false,
        error: result.error.message || 'Erro ao enviar email'
      }
    }

    console.log(`[Lead Notifications] ✅ Email enviado para: ${userEmail}`)
    
    return {
      success: true,
      emailSent: true
    }
  } catch (error: any) {
    const errorMsg = `Erro ao processar notificação: ${error.message}`
    console.error(`[Lead Notifications] ❌ ${errorMsg}`)
    return {
      success: false,
      emailSent: false,
      error: errorMsg
    }
  }
}
