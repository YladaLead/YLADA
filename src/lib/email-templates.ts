import { resend, FROM_EMAIL, FROM_NAME } from './resend'

export interface WelcomeEmailData {
  email: string
  userName?: string
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  planType: 'monthly' | 'annual'
  accessToken: string
  baseUrl: string
}

export interface RecoveryEmailData {
  email: string
  userName?: string
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  accessToken: string
  baseUrl: string
}

export interface RenewalReminderData {
  email: string
  userName?: string
  area: string
  expiresAt: string
  renewalUrl: string
}

/**
 * Envia e-mail de boas-vindas após pagamento confirmado
 */
export async function sendWelcomeEmail(data: WelcomeEmailData): Promise<void> {
  const areaName = {
    wellness: 'Wellness',
    nutri: 'Nutri',
    coach: 'Coach',
    nutra: 'Nutra',
  }[data.area]

  const planName = data.planType === 'monthly' ? 'Mensal' : 'Anual'
  const accessUrl = `${data.baseUrl}/pt/${data.area}/acesso?token=${data.accessToken}`

  console.log('📧 Enviando e-mail de boas-vindas via Resend:', {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: '🎉 Bem-vindo ao YLADA! Seu acesso está pronto',
    accessUrl,
  })

  const { error, data: emailData } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: '🎉 Bem-vindo ao YLADA! Seu acesso está pronto',
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🎉 Bem-vindo ao YLADA!</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Olá${data.userName ? ` ${data.userName}` : ''}!
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Parabéns! Sua assinatura do <strong>YLADA ${areaName} - Plano ${planName}</strong> foi ativada com sucesso.
            </p>
            
            <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #065f46;">
                ✅ Seu acesso está pronto!
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${accessUrl}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                🚀 Acessar Meu Dashboard
              </a>
            </div>
            
            <div style="background: #f9fafb; padding: 20px; border-radius: 8px; margin: 20px 0;">
              <p style="margin: 0 0 10px 0; font-weight: 600; font-size: 14px;">📋 Próximos Passos:</p>
              <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #6b7280;">
                <li style="margin-bottom: 8px;">Acesse seu dashboard usando o botão acima</li>
                <li style="margin-bottom: 8px;">Complete seu perfil com nome e cidade</li>
                <li style="margin-bottom: 8px;">Crie suas primeiras ferramentas e comece a gerar leads!</li>
              </ol>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 30px;">
              <strong>⚠️ Importante:</strong> Este link de acesso é válido por 30 dias. 
              Se você perder este e-mail, pode solicitar um novo link na página de login.
            </p>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              Precisa de ajuda? Entre em contato conosco através do suporte no dashboard.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} YLADA. Todos os direitos reservados.</p>
            <p style="margin: 5px 0 0 0;">Este e-mail foi enviado para ${data.email}</p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('❌ Erro ao enviar e-mail de boas-vindas:', {
      error,
      message: error.message,
      name: error.name,
      details: JSON.stringify(error, null, 2),
      email: data.email,
    })
    throw new Error(`Erro ao enviar e-mail: ${error.message || 'Erro desconhecido'}`)
  }

  console.log('✅ E-mail de boas-vindas enviado com sucesso:', {
    email: data.email,
    emailId: emailData?.id,
    area: data.area,
    planType: data.planType,
  })
}

/**
 * Envia e-mail de recuperação de acesso
 */
export async function sendRecoveryEmail(data: RecoveryEmailData): Promise<void> {
  console.log('📧 sendRecoveryEmail chamado:', {
    email: data.email,
    area: data.area,
    hasToken: !!data.accessToken,
    baseUrl: data.baseUrl,
  })

  const areaName = {
    wellness: 'Wellness',
    nutri: 'Nutri',
    coach: 'Coach',
    nutra: 'Nutra',
  }[data.area]

  const accessUrl = `${data.baseUrl}/pt/${data.area}/acesso?token=${data.accessToken}`

  console.log('📧 Enviando e-mail via Resend:', {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: `🔐 Acesso ao seu YLADA ${areaName}`,
    accessUrl,
  })

  const { error, data: emailData } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: `🔐 Acesso ao seu YLADA ${areaName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">🔐 Acesso ao YLADA</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Olá${data.userName ? ` ${data.userName}` : ''}!
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Você solicitou um link de acesso ao seu YLADA ${areaName}. Clique no botão abaixo para acessar seu dashboard:
            </p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${accessUrl}" 
                 style="display: inline-block; background: #10b981; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                🚀 Acessar Dashboard
              </a>
            </div>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; font-size: 14px; color: #92400e;">
                <strong>⚠️ Segurança:</strong> Este link é válido por 30 dias e pode ser usado apenas uma vez.
              </p>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              Se você não solicitou este link, pode ignorar este e-mail com segurança.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} YLADA. Todos os direitos reservados.</p>
            <p style="margin: 5px 0 0 0;">Este e-mail foi enviado para ${data.email}</p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('❌ Erro ao enviar e-mail de recuperação:', {
      error,
      message: error.message,
      name: error.name,
      details: JSON.stringify(error, null, 2),
    })
    throw new Error(`Erro ao enviar e-mail: ${error.message || 'Erro desconhecido'}`)
  }

  console.log('✅ E-mail de recuperação enviado com sucesso:', {
    email: data.email,
    emailId: emailData?.id,
    area: data.area,
  })
}

/**
 * Envia e-mail de lembrete de renovação (PIX/Boleto)
 */
export async function sendRenewalReminder(data: RenewalReminderData): Promise<void> {
  const expiresDate = new Date(data.expiresAt).toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: `⏰ Sua assinatura YLADA vence em breve`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
          <div style="background: linear-gradient(135deg, #f59e0b 0%, #d97706 100%); padding: 30px; text-align: center; border-radius: 10px 10px 0 0;">
            <h1 style="color: white; margin: 0; font-size: 28px;">⏰ Renovação Pendente</h1>
          </div>
          
          <div style="background: #ffffff; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 10px 10px;">
            <p style="font-size: 16px; margin-bottom: 20px;">
              Olá${data.userName ? ` ${data.userName}` : ''}!
            </p>
            
            <p style="font-size: 16px; margin-bottom: 20px;">
              Sua assinatura do <strong>YLADA ${data.area}</strong> vence em <strong>${expiresDate}</strong>.
            </p>
            
            <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px;">
              <p style="margin: 0; font-size: 16px; font-weight: 600; color: #92400e;">
                ⚠️ Para continuar usando o YLADA sem interrupções, renove sua assinatura agora.
              </p>
            </div>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${data.renewalUrl}" 
                 style="display: inline-block; background: #f59e0b; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                🔄 Renovar Assinatura
              </a>
            </div>
            
            <p style="font-size: 14px; color: #6b7280; margin-top: 20px;">
              Se você já renovou, pode ignorar este e-mail.
            </p>
          </div>
          
          <div style="text-align: center; margin-top: 20px; padding: 20px; color: #9ca3af; font-size: 12px;">
            <p style="margin: 0;">© ${new Date().getFullYear()} YLADA. Todos os direitos reservados.</p>
            <p style="margin: 5px 0 0 0;">Este e-mail foi enviado para ${data.email}</p>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('❌ Erro ao enviar lembrete de renovação:', error)
    throw new Error(`Erro ao enviar e-mail: ${error.message}`)
  }

  console.log('✅ Lembrete de renovação enviado:', data.email)
}

