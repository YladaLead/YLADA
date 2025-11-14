import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'

// POST - Receber dados do formulário de contato
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, profissao, pais, email, telefone } = body

    // Validação básica
    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Nome e e-mail são obrigatórios' },
        { status: 400 }
      )
    }

    // Validar formato de email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      )
    }

    // Capturar IP e User Agent
    const ip = request.headers.get('x-forwarded-for') || 
               request.headers.get('x-real-ip') || 
               'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Sanitizar dados
    const sanitizedData = {
      nome: nome.trim().substring(0, 255),
      profissao: profissao?.trim().substring(0, 255) || null,
      pais: pais?.trim().substring(0, 100) || null,
      email: email.trim().toLowerCase().substring(0, 255),
      telefone: telefone?.trim().replace(/\D/g, '').substring(0, 20) || null,
      ip_address: ip,
      user_agent: userAgent.substring(0, 500),
    }

    // Salvar no Supabase
    const { data: submission, error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert({
        nome: sanitizedData.nome,
        profissao: sanitizedData.profissao,
        pais: sanitizedData.pais,
        email: sanitizedData.email,
        telefone: sanitizedData.telefone,
        ip_address: sanitizedData.ip_address,
        user_agent: sanitizedData.user_agent,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError)
      // Continuar mesmo se der erro no banco, para não perder o email
    }

    // Enviar email de notificação
    if (isResendConfigured() && resend) {
      try {
        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h1 style="color: #2563eb; margin-bottom: 20px;">📧 Novo Contato - YLADA</h1>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                  <h2 style="color: #111827; margin-top: 0;">Dados do Contato</h2>
                  
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Nome:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.nome}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">E-mail:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.email}</td>
                    </tr>
                    ${sanitizedData.telefone ? `
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">Telefone:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.telefone}</td>
                    </tr>
                    ` : ''}
                    ${sanitizedData.profissao ? `
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">Profissão:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.profissao}</td>
                    </tr>
                    ` : ''}
                    ${sanitizedData.pais ? `
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">País:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.pais}</td>
                    </tr>
                    ` : ''}
                  </table>
                </div>

                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <p style="color: #6b7280; font-size: 12px; margin: 0;">
                    <strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })}<br>
                    <strong>IP:</strong> ${sanitizedData.ip_address}
                  </p>
                </div>
              </div>
            </body>
          </html>
        `

        // Enviar para o email configurado (ou usar um padrão)
        const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || FROM_EMAIL

        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: notificationEmail,
          replyTo: sanitizedData.email,
          subject: `📧 Novo contato: ${sanitizedData.nome}`,
          html: emailHtml,
        })

        console.log('✅ Email de notificação enviado com sucesso')
      } catch (emailError: any) {
        console.error('❌ Erro ao enviar email:', emailError)
        // Não falhar a requisição se o email falhar
      }
    } else {
      console.warn('⚠️ Resend não configurado, email não será enviado')
    }

    return NextResponse.json({
      success: true,
      message: 'Formulário enviado com sucesso',
      submissionId: submission?.id,
    })
  } catch (error: any) {
    console.error('Erro ao processar formulário de contato:', error)
    return NextResponse.json(
      { error: error.message || 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

