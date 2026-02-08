import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'
import { getCarolAutomationDisabled } from '@/lib/carol-admin-settings'
import { isWhatsAppAutoInviteEnabled } from '@/config/whatsapp-automation'

/**
 * POST - Salvar inscrição no workshop
 */
export async function POST(request: NextRequest) {
  try {
    let body: any = {}
    try {
      body = await request.json()
    } catch (jsonError) {
      console.error('Erro ao fazer parse do JSON:', jsonError)
      return NextResponse.json(
        { error: 'Dados inválidos. Verifique os campos do formulário.' },
        { status: 400 }
      )
    }
    
    const { nome, email, telefone, crn, source } = body

    // Validação básica
    if (!nome || !email || !telefone) {
      return NextResponse.json(
        { error: 'Nome, e-mail e telefone são obrigatórios' },
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
      email: email.trim().toLowerCase().substring(0, 255),
      telefone: telefone.trim().replace(/\D/g, '').substring(0, 20),
      crn: crn?.trim().substring(0, 50) || null,
      source: source || 'workshop_landing_page',
      ip_address: ip,
      user_agent: userAgent.substring(0, 500),
    }

    // Salvar no Supabase (tabela workshop_inscricoes)
    // Se a tabela não existir, criar uma tabela de contatos genérica
    let submissionId: string | null = null

    try {
      // Tentar salvar em tabela específica de workshop
      const { data: submission, error: dbError } = await supabaseAdmin
        .from('workshop_inscricoes')
        .insert({
          nome: sanitizedData.nome,
          email: sanitizedData.email,
          telefone: sanitizedData.telefone,
          crn: sanitizedData.crn,
          source: sanitizedData.source,
          ip_address: sanitizedData.ip_address,
          user_agent: sanitizedData.user_agent,
          workshop_type: 'nutri_semanal',
          status: 'inscrito'
        })
        .select()
        .single()

      if (dbError) {
        // Se a tabela não existir, usar contact_submissions como fallback
        console.warn('⚠️ Tabela workshop_inscricoes não encontrada, usando contact_submissions:', dbError.message)
        
        const { data: fallbackSubmission, error: fallbackError } = await supabaseAdmin
          .from('contact_submissions')
          .insert({
            nome: sanitizedData.nome,
            email: sanitizedData.email,
            telefone: sanitizedData.telefone,
            profissao: sanitizedData.crn ? `Nutricionista - ${sanitizedData.crn}` : 'Nutricionista',
            pais: 'BR',
            ip_address: sanitizedData.ip_address,
            user_agent: sanitizedData.user_agent,
          })
          .select()
          .single()

        if (fallbackError) {
          console.error('❌ Erro ao salvar inscrição:', fallbackError)
          // Continuar mesmo se der erro no banco, para não perder o email
        } else {
          submissionId = fallbackSubmission?.id || null
        }
      } else {
        submissionId = submission?.id || null
        console.log('✅ Inscrição salva com sucesso:', submissionId)
      }
    } catch (dbError: any) {
      console.error('❌ Erro ao salvar no banco:', dbError)
      // Continuar para enviar email mesmo se der erro no banco
    }

    // Enviar email de confirmação para o inscrito
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
                <h1 style="color: #2563EB; margin-bottom: 20px;">🎓 Inscrição Confirmada!</h1>
                
                <p style="color: #111827; font-size: 16px; line-height: 1.6;">
                  Olá <strong>${sanitizedData.nome}</strong>,
                </p>
                
                <p style="color: #111827; font-size: 16px; line-height: 1.6;">
                  Seu cadastro para receber informações do <strong>Workshop para Nutricionistas</strong> foi confirmado!
                </p>
                
                <div style="background-color: #E9F1FF; padding: 20px; border-radius: 6px; margin: 20px 0;">
                  <h2 style="color: #2563EB; margin-top: 0;">📱 O que você vai receber</h2>
                  <p style="color: #111827; margin: 8px 0;">✅ <strong>Data e horário</strong> do próximo workshop</p>
                  <p style="color: #111827; margin: 8px 0;">✅ <strong>Link de acesso</strong> exclusivo</p>
                  <p style="color: #111827; margin: 8px 0;">✅ <strong>Lembrete</strong> 1h antes do evento</p>
                  <p style="color: #111827; margin: 8px 0; margin-top: 12px;"><strong>Formato:</strong> Online (Zoom/Google Meet) | <strong>Duração:</strong> 60-90 minutos</p>
                </div>
                
                <div style="background-color: #FFF4E6; padding: 20px; border-radius: 6px; margin: 20px 0;">
                  <h3 style="color: #FF9800; margin-top: 0;">⏰ Quando você será avisada?</h3>
                  <p style="color: #111827; margin: 0;">
                    Assim que o próximo workshop for agendado, você receberá um <strong>WhatsApp</strong> e um <strong>email</strong> com todas as informações. Fique de olho!
                  </p>
                </div>
                
                <p style="color: #111827; font-size: 16px; line-height: 1.6; margin-top: 20px;">
                  Ficamos felizes em tê-la conosco! Qualquer dúvida, entre em contato conosco.
                </p>
                
                <p style="color: #6b7280; font-size: 14px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  <strong>Equipe YLADA</strong><br>
                  Transformando nutricionistas em Nutri-Empresárias
                </p>
              </div>
            </body>
          </html>
        `

        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: sanitizedData.email,
          subject: '🎓 Cadastro Confirmado - Você receberá a data do workshop',
          html: emailHtml,
        })

        console.log('✅ Email de confirmação enviado para:', sanitizedData.email)
      } catch (emailError: any) {
        console.error('❌ Erro ao enviar email de confirmação:', emailError)
        // Não falhar a requisição se o email falhar
      }
    }

    // 🚫 DISPARO PROATIVO (AUTO-INVITE) — agora é opcional e por padrão fica DESLIGADO.
    // Ideia: deixar a Carol apenas responder quando a pessoa chama no WhatsApp.
    // Se quiser reativar no futuro: WHATSAPP_AUTO_INVITE=true no .env
    //
    // (Quando ligado) Envia WhatsApp em background e espera 60s antes de enviar,
    // para dar tempo da pessoa clicar no botão WhatsApp primeiro.
    const carolDisabled = await getCarolAutomationDisabled()
    if (isWhatsAppAutoInviteEnabled() && sanitizedData.telefone && !carolDisabled) {
      const phoneClean = sanitizedData.telefone.replace(/\D/g, '')
      const leadName = sanitizedData.nome
      const userIdPromise = supabaseAdmin
        .from('user_profiles')
        .select('user_id')
        .or('is_admin.eq.true,perfil.eq.nutri')
        .limit(1)
        .maybeSingle()
        .then(({ data }) => data?.user_id || '00000000-0000-0000-0000-000000000000')
      Promise.resolve(userIdPromise).then(async (userId) => {
        try {
          const { sendWorkshopInviteToFormLead } = await import('@/lib/whatsapp-form-automation')
          const automationResult = await sendWorkshopInviteToFormLead(
            phoneClean,
            leadName,
            'nutri',
            userId
          )
          if (automationResult.success) {
            console.log('✅ Mensagem WhatsApp automática enviada para:', phoneClean)
          } else {
            console.warn('⚠️ Falha ao enviar mensagem automática:', automationResult.error)
          }
        } catch (automationError: any) {
          console.error('⚠️ Erro ao executar automação WhatsApp:', automationError)
        }
      }).catch(() => {})
      // Não aguardar a automação — resposta da API volta imediatamente
    } else if (sanitizedData.telefone && (carolDisabled || !isWhatsAppAutoInviteEnabled())) {
      console.log('[Workshop Inscrição] Disparo proativo desligado - WhatsApp não enviado automaticamente.')
    }

    // Enviar email de notificação para o admin
    if (isResendConfigured() && resend) {
      try {
        const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || FROM_EMAIL
        
        const notificationHtml = `
          <!DOCTYPE html>
          <html>
            <head>
              <meta charset="utf-8">
            </head>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
                <h1 style="color: #0B57FF; margin-bottom: 20px;">🎓 Nova Inscrição no Workshop</h1>
                
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin-bottom: 20px;">
                  <h2 style="color: #111827; margin-top: 0;">Dados da Inscrição</h2>
                  
                  <table style="width: 100%; border-collapse: collapse;">
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151; width: 120px;">Nome:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.nome}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">E-mail:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.email}</td>
                    </tr>
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">Telefone:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.telefone}</td>
                    </tr>
                    ${sanitizedData.crn ? `
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">CRN:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.crn}</td>
                    </tr>
                    ` : ''}
                    <tr>
                      <td style="padding: 8px 0; font-weight: bold; color: #374151;">Fonte:</td>
                      <td style="padding: 8px 0; color: #111827;">${sanitizedData.source}</td>
                    </tr>
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

        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: notificationEmail,
          replyTo: sanitizedData.email,
          subject: `🎓 Nova inscrição no workshop: ${sanitizedData.nome}`,
          html: notificationHtml,
        })

        console.log('✅ Email de notificação enviado para admin')
      } catch (notificationError: any) {
        console.error('❌ Erro ao enviar email de notificação:', notificationError)
        // Não falhar a requisição se o email falhar
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Inscrição realizada com sucesso',
      submissionId: submissionId,
    })
  } catch (error: any) {
    console.error('Erro ao processar inscrição no workshop:', error)
    
    // Garantir que sempre retornamos JSON válido
    const errorMessage = error?.message || 'Erro interno do servidor'
    
    return NextResponse.json(
      { 
        success: false,
        error: errorMessage 
      },
      { 
        status: 500,
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
  }
}

