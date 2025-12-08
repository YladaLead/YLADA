/**
 * Sistema de Notificações para Learning Suggestions do NOEL
 * Envia notificações quando novas sugestões de aprendizado são criadas
 */

import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from './resend'
import { supabaseAdmin } from './supabase'

export interface LearningSuggestionNotificationData {
  suggestionId: string
  query: string
  suggestedResponse: string
  frequency: number
  suggestedCategory: string
  createdAt: string
}

/**
 * Busca email do admin principal
 * Por enquanto, usa uma variável de ambiente ou busca o primeiro admin
 */
async function getAdminEmail(): Promise<string | null> {
  if (!supabaseAdmin) {
    console.warn('[Wellness Learning Notifications] Supabase admin não disponível')
    return null
  }

  try {
    // Buscar email do admin (pode ser configurado via env ou buscar do banco)
    const adminEmail = process.env.ADMIN_EMAIL || process.env.NEXT_PUBLIC_ADMIN_EMAIL
    
    if (adminEmail) {
      return adminEmail
    }

    // Se não tiver env, buscar primeiro usuário admin do sistema
    // (implementação futura: buscar da tabela de admins)
    console.warn('[Wellness Learning Notifications] ADMIN_EMAIL não configurado')
    return null
  } catch (error) {
    console.error('[Wellness Learning Notifications] Erro ao buscar email do admin:', error)
    return null
  }
}

/**
 * Gera HTML do email de notificação de nova sugestão
 */
function generateLearningSuggestionEmail(
  data: LearningSuggestionNotificationData,
  baseUrl: string
): string {
  const frequencyBadge = data.frequency >= 5 ? '🔴' : data.frequency >= 3 ? '🟠' : '🟡'
  const frequencyLabel = data.frequency >= 5 ? 'Muito Frequente' : data.frequency >= 3 ? 'Frequente' : 'Recorrente'

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
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
            <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🧠 Nova Sugestão de Aprendizado - NOEL</h1>
            <p style="color: rgba(255,255,255,0.9); margin: 10px 0 0 0; font-size: 14px;">O NOEL identificou uma nova oportunidade de aprendizado</p>
          </div>

          <!-- Content -->
          <div style="padding: 30px;">
            <!-- Frequency Badge -->
            <div style="background-color: #fef3c7; border-left: 4px solid #f59e0b; padding: 15px; margin-bottom: 20px; border-radius: 4px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>${frequencyBadge} Frequência:</strong> ${frequencyLabel} (${data.frequency}x)
              </p>
            </div>

            <!-- Query -->
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 10px 0;">📝 Pergunta/Consulta:</h2>
              <div style="background-color: #f9fafb; padding: 15px; border-radius: 6px; border: 1px solid #e5e7eb;">
                <p style="margin: 0; color: #374151; font-size: 15px; line-height: 1.6;">${data.query}</p>
              </div>
            </div>

            <!-- Suggested Response -->
            <div style="margin-bottom: 20px;">
              <h2 style="font-size: 16px; font-weight: 600; color: #111827; margin: 0 0 10px 0;">💡 Resposta Sugerida:</h2>
              <div style="background-color: #ecfdf5; padding: 15px; border-radius: 6px; border: 1px solid #10b981;">
                <p style="margin: 0; color: #065f46; font-size: 14px; line-height: 1.6; white-space: pre-wrap;">${data.suggestedResponse.substring(0, 500)}${data.suggestedResponse.length > 500 ? '...' : ''}</p>
              </div>
            </div>

            <!-- Metadata -->
            <div style="display: flex; gap: 20px; margin-bottom: 20px; flex-wrap: wrap;">
              <div style="flex: 1; min-width: 150px;">
                <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Categoria Sugerida</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #111827; font-weight: 500;">${data.suggestedCategory || 'N/A'}</p>
              </div>
              <div style="flex: 1; min-width: 150px;">
                <p style="margin: 0; font-size: 12px; color: #6b7280; text-transform: uppercase; letter-spacing: 0.5px;">Data</p>
                <p style="margin: 5px 0 0 0; font-size: 14px; color: #111827; font-weight: 500;">${new Date(data.createdAt).toLocaleDateString('pt-BR')}</p>
              </div>
            </div>

            <!-- CTA Button -->
            <div style="text-align: center; margin-top: 30px;">
              <a href="${baseUrl}/admin/wellness/learning-suggestions" style="display: inline-block; background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; text-decoration: none; padding: 14px 28px; border-radius: 6px; font-weight: 600; font-size: 15px;">
                Revisar Sugestão
              </a>
            </div>

            <!-- Footer -->
            <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; font-size: 12px; color: #6b7280; text-align: center;">
                Esta notificação foi enviada porque o NOEL identificou uma consulta recorrente que pode ser adicionada ao banco de conhecimento.
              </p>
            </div>
          </div>
        </div>
      </body>
    </html>
  `
}

/**
 * Envia notificação por email quando uma nova sugestão de aprendizado é criada
 * Só envia se a frequência for >= 3 (sugestão recorrente)
 */
export async function notifyAdminNewLearningSuggestion(
  data: LearningSuggestionNotificationData
): Promise<boolean> {
  // Só notificar se frequência >= 3
  if (data.frequency < 3) {
    console.log(`[Wellness Learning Notifications] Frequência ${data.frequency} < 3, não notificando`)
    return false
  }

  if (!isResendConfigured()) {
    console.warn('[Wellness Learning Notifications] Resend não configurado, não é possível enviar email')
    return false
  }

  try {
    const adminEmail = await getAdminEmail()
    
    if (!adminEmail) {
      console.warn('[Wellness Learning Notifications] Email do admin não encontrado')
      return false
    }

    const baseUrl = process.env.NEXT_PUBLIC_APP_URL || process.env.VERCEL_URL 
      ? `https://${process.env.VERCEL_URL}` 
      : 'http://localhost:3000'

    const emailHtml = generateLearningSuggestionEmail(data, baseUrl)

    const result = await resend!.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: adminEmail,
      subject: `🧠 NOEL: Nova Sugestão de Aprendizado (${data.frequency}x)`,
      html: emailHtml,
    })

    if (result.error) {
      console.error('[Wellness Learning Notifications] Erro ao enviar email:', result.error)
      return false
    }

    console.log(`[Wellness Learning Notifications] ✅ Email enviado com sucesso para ${adminEmail}`)
    return true
  } catch (error) {
    console.error('[Wellness Learning Notifications] Erro ao enviar notificação:', error)
    return false
  }
}


