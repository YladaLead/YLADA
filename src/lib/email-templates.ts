import { resend, isResendConfigured, FROM_EMAIL, FROM_NAME } from '@/lib/resend'

/**
 * Envia e-mail de recuperação de senha (reset password) customizado
 */
export async function sendPasswordResetEmail(data: {
  email: string
  userName?: string
  area: 'wellness' | 'nutri' | 'coach' | 'nutra' | 'ylada' | 'admin'
  resetLink: string
  baseUrl: string
}): Promise<void> {
  console.log('📧 sendPasswordResetEmail chamado:', {
    email: data.email,
    area: data.area,
    hasResetLink: !!data.resetLink,
    baseUrl: data.baseUrl,
  })

  // Verificar se Resend está configurado
  if (!isResendConfigured() || !resend) {
    const errorMsg = 'Resend não está configurado. Verifique RESEND_API_KEY.'
    console.error('❌', errorMsg)
    throw new Error(errorMsg)
  }

  const areaName = {
    wellness: 'Wellness',
    nutri: 'Nutri',
    coach: 'Coach',
    nutra: 'Nutra',
    ylada: 'YLADA',
    admin: 'Admin',
  }[data.area]

  const userName = data.userName || (data.area === 'nutri' ? 'Nutri-Empresária' : 'Utilizador(a)')

  console.log('📧 Enviando e-mail de reset de senha via Resend:', {
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: `🔐 Redefinir sua senha - YLADA ${areaName}`,
    resetLink: data.resetLink,
    hasResend: !!resend,
  })

  const { error, data: emailData } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: `🔐 Redefinir sua senha - YLADA ${areaName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Redefinir Senha - YLADA ${areaName}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
            <!-- Header com gradiente -->
            <div style="background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🔐 Redefinir Senha
              </h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">
                YLADA ${areaName}
              </p>
            </div>
            
            <!-- Conteúdo principal -->
            <div style="padding: 40px 30px;">
              <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0 0 20px 0;">
                Olá, <strong>${userName}</strong>! 👋
              </p>
              
              <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0 0 20px 0;">
                Recebemos uma solicitação para redefinir a senha da sua conta no YLADA ${areaName}.
              </p>
              
              <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0 0 30px 0;">
                Clique no botão abaixo para criar uma nova senha:
              </p>
              
              <div style="text-align: center; margin: 40px 0;">
                <a href="${data.resetLink}" 
                   style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                  🔑 Redefinir Minha Senha
                </a>
              </div>
              
              <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 30px 0; border-radius: 5px;">
                <p style="margin: 0; font-size: 14px; color: #92400e; line-height: 1.6;">
                  <strong>⚠️ Importante:</strong> Este link é válido por <strong>1 hora</strong> e pode ser usado apenas <strong>uma vez</strong>. Se você não solicitou esta redefinição, pode ignorar este e-mail com segurança.
                </p>
              </div>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px; line-height: 1.6;">
                Se o botão não funcionar, copie e cole o link abaixo no seu navegador:
              </p>
              
              <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
                ${data.resetLink}
              </p>
              
              <p style="font-size: 14px; color: #6b7280; margin-top: 30px; line-height: 1.6;">
                Se você não solicitou esta redefinição, sua senha permanecerá a mesma.
              </p>
            </div>
            
            <!-- Footer -->
            <div style="background: #f9fafb; padding: 30px; text-align: center; border-top: 1px solid #e5e7eb;">
              <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                © ${new Date().getFullYear()} YLADA. Todos os direitos reservados.
              </p>
              <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                Este e-mail foi enviado para ${data.email}
              </p>
              <p style="margin: 10px 0 0 0; color: #9ca3af; font-size: 12px;">
                Portal Solutions Tech & Innovation LTDA - CNPJ: 63.447.492/0001-88
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('❌ Erro ao enviar e-mail de reset de senha:', {
      error,
      message: error.message,
      name: error.name,
      details: JSON.stringify(error, null, 2),
    })
    throw new Error(`Erro ao enviar e-mail: ${error.message || 'Erro desconhecido'}`)
  }

  console.log('✅ E-mail de reset de senha enviado com sucesso:', {
    email: data.email,
    emailId: emailData?.id,
    area: data.area,
  })
}

/**
 * Envia e-mail de recuperação de acesso (access link)
 */
export async function sendRecoveryEmail(data: {
  email: string
  userName?: string
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  accessToken: string
  baseUrl: string
}): Promise<void> {
  // Usar sendPasswordResetEmail como base ou criar template específico
  // Por enquanto, redirecionar para página de acesso por token
  const accessLink = `${data.baseUrl}/pt/${data.area}/acesso?token=${data.accessToken}`
  
  // Reutilizar lógica similar ao sendPasswordResetEmail
  console.log('📧 sendRecoveryEmail chamado:', {
    email: data.email,
    area: data.area,
    hasAccessToken: !!data.accessToken,
    baseUrl: data.baseUrl,
  })

  if (!isResendConfigured() || !resend) {
    const errorMsg = 'Resend não está configurado. Verifique RESEND_API_KEY.'
    console.error('❌', errorMsg)
    throw new Error(errorMsg)
  }

  const areaName = {
    wellness: 'Wellness',
    nutri: 'Nutri',
    coach: 'Coach',
    nutra: 'Nutra',
  }[data.area]

  const userName = data.userName || 'Nutri-Empresária'

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: `🔗 Link de Acesso - YLADA ${areaName}`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Link de Acesso - YLADA ${areaName}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
            <div style="background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🔗 Link de Acesso
              </h1>
              <p style="color: #e0e7ff; margin: 10px 0 0 0; font-size: 16px;">
                YLADA ${areaName}
              </p>
            </div>
            <div style="padding: 40px 30px;">
              <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0 0 20px 0;">
                Olá, <strong>${userName}</strong>! 👋
              </p>
              <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0 0 30px 0;">
                Clique no botão abaixo para acessar sua conta:
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${accessLink}" 
                   style="display: inline-block; background: linear-gradient(135deg, #2563EB 0%, #1E40AF 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(37, 99, 235, 0.3);">
                  🔑 Acessar Minha Conta
                </a>
              </div>
              <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
                ${accessLink}
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('❌ Erro ao enviar e-mail de recuperação:', error)
    throw new Error(`Erro ao enviar e-mail: ${error.message || 'Erro desconhecido'}`)
  }
}

/**
 * Envia e-mail de boas-vindas após pagamento
 */
export async function sendWelcomeEmail(data: {
  email: string
  userName?: string
  area: 'wellness' | 'nutri' | 'coach' | 'nutra'
  planType?: string
  accessToken: string
  baseUrl: string
}): Promise<void> {
  const accessLink = `${data.baseUrl}/pt/${data.area}/acesso?token=${data.accessToken}`
  
  console.log('📧 sendWelcomeEmail chamado:', {
    email: data.email,
    area: data.area,
    planType: data.planType,
    hasAccessToken: !!data.accessToken,
    baseUrl: data.baseUrl,
  })

  if (!isResendConfigured() || !resend) {
    const errorMsg = 'Resend não está configurado. Verifique RESEND_API_KEY.'
    console.error('❌', errorMsg)
    throw new Error(errorMsg)
  }

  const areaName = {
    wellness: 'Wellness',
    nutri: 'Nutri',
    coach: 'Coach',
    nutra: 'Nutra',
  }[data.area]

  const userName = data.userName || 'Nutri-Empresária'

  const { error } = await resend.emails.send({
    from: `${FROM_NAME} <${FROM_EMAIL}>`,
    to: data.email,
    subject: `🎉 Bem-vindo(a) ao YLADA ${areaName}!`,
    html: `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Bem-vindo - YLADA ${areaName}</title>
        </head>
        <body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f9fafb;">
          <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 0;">
            <div style="background: linear-gradient(135deg, #10B981 0%, #059669 100%); padding: 40px 30px; text-align: center;">
              <h1 style="color: #ffffff; margin: 0; font-size: 28px; font-weight: 700;">
                🎉 Bem-vindo(a)!
              </h1>
              <p style="color: #d1fae5; margin: 10px 0 0 0; font-size: 16px;">
                YLADA ${areaName}
              </p>
            </div>
            <div style="padding: 40px 30px;">
              <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0 0 20px 0;">
                Olá, <strong>${userName}</strong>! 👋
              </p>
              <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0 0 20px 0;">
                Seu pagamento foi confirmado e sua conta está ativa!
              </p>
              <p style="font-size: 16px; color: #1f2937; line-height: 1.6; margin: 0 0 30px 0;">
                Clique no botão abaixo para acessar sua conta:
              </p>
              <div style="text-align: center; margin: 40px 0;">
                <a href="${accessLink}" 
                   style="display: inline-block; background: linear-gradient(135deg, #10B981 0%, #059669 100%); color: white; padding: 16px 40px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px; box-shadow: 0 4px 6px rgba(16, 185, 129, 0.3);">
                  🚀 Acessar Minha Conta
                </a>
              </div>
              <p style="font-size: 12px; color: #9ca3af; word-break: break-all; background: #f3f4f6; padding: 15px; border-radius: 5px; margin: 15px 0;">
                ${accessLink}
              </p>
            </div>
          </div>
        </body>
      </html>
    `,
  })

  if (error) {
    console.error('❌ Erro ao enviar e-mail de boas-vindas:', error)
    throw new Error(`Erro ao enviar e-mail: ${error.message || 'Erro desconhecido'}`)
  }
}
