import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'

const VALID_AREAS = [
  'profissional-liberal',
  'vendedores-geral',
  'psi',
  'psicanalise',
  'odonto',
  'coach',
] as const

// POST - Solicitar acesso a área em breve
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { nome, profissao, pais, email, area_interesse, telefone: telefoneBody } = body

    if (!nome || !email) {
      return NextResponse.json(
        { error: 'Nome e e-mail são obrigatórios' },
        { status: 400 }
      )
    }

    const telefoneDigits =
      typeof telefoneBody === 'string' ? telefoneBody.replace(/\D/g, '') : ''
    if (telefoneDigits.length < 10) {
      return NextResponse.json(
        { error: 'WhatsApp com DDI é obrigatório (código do país e número).' },
        { status: 400 }
      )
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      )
    }

    if (!area_interesse || !VALID_AREAS.includes(area_interesse)) {
      return NextResponse.json(
        { error: 'Área de interesse inválida' },
        { status: 400 }
      )
    }

    const ip = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || 'unknown'
    const userAgent = request.headers.get('user-agent') || 'unknown'

    const sanitizedData = {
      nome: nome.trim().substring(0, 255),
      profissao: profissao?.trim().substring(0, 255) || null,
      pais: pais?.trim().substring(0, 100) || null,
      email: email.trim().toLowerCase().substring(0, 255),
      telefone: telefoneDigits.substring(0, 20),
      area_interesse,
      source: 'area_solicitacao',
      ip_address: ip,
      user_agent: userAgent.substring(0, 500),
    }

    const { data: submission, error: dbError } = await supabaseAdmin
      .from('contact_submissions')
      .insert({
        nome: sanitizedData.nome,
        profissao: sanitizedData.profissao,
        pais: sanitizedData.pais,
        email: sanitizedData.email,
        telefone: sanitizedData.telefone,
        area_interesse: sanitizedData.area_interesse,
        source: sanitizedData.source,
        ip_address: sanitizedData.ip_address,
        user_agent: sanitizedData.user_agent,
      })
      .select()
      .single()

    if (dbError) {
      console.error('Erro ao salvar solicitação de área:', dbError)
    }

    if (isResendConfigured() && resend) {
      try {
        const areaLabels: Record<string, string> = {
          'profissional-liberal': 'Profissional liberal',
          'vendedores-geral': 'Vendedores em geral',
          psi: 'Psicologia',
          psicanalise: 'Psicanálise',
          odonto: 'Odontologia',
          coach: 'Coach',
        }
        const areaLabel = areaLabels[area_interesse] || area_interesse

        const emailHtml = `
          <!DOCTYPE html>
          <html>
            <head><meta charset="utf-8"></head>
            <body style="font-family: Arial, sans-serif; padding: 20px; background-color: #f5f5f5;">
              <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 30px; border-radius: 8px;">
                <h1 style="color: #2563eb;">📋 Nova solicitação de área - YLADA</h1>
                <div style="background-color: #f9fafb; padding: 20px; border-radius: 6px; margin: 20px 0;">
                  <p><strong>Área solicitada:</strong> ${areaLabel}</p>
                  <p><strong>Nome:</strong> ${sanitizedData.nome}</p>
                  <p><strong>E-mail:</strong> ${sanitizedData.email}</p>
                  <p><strong>WhatsApp (E.164):</strong> +${sanitizedData.telefone}</p>
                  ${sanitizedData.profissao ? `<p><strong>Profissão/Segmento:</strong> ${sanitizedData.profissao}</p>` : ''}
                  ${sanitizedData.pais ? `<p><strong>País:</strong> ${sanitizedData.pais}</p>` : ''}
                </div>
                <p style="color: #6b7280; font-size: 12px;">
                  ${new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' })} | IP: ${sanitizedData.ip_address}
                </p>
              </div>
            </body>
          </html>
        `

        const notificationEmail = process.env.CONTACT_NOTIFICATION_EMAIL || FROM_EMAIL
        await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: notificationEmail,
          replyTo: sanitizedData.email,
          subject: `📋 Solicitação de área: ${areaLabel} - ${sanitizedData.nome}`,
          html: emailHtml,
        })
      } catch (emailError: unknown) {
        console.error('Erro ao enviar email:', emailError)
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Solicitação registrada. Entraremos em contato quando a área estiver disponível.',
      submissionId: submission?.id,
    })
  } catch (error: unknown) {
    console.error('Erro ao processar solicitação:', error)
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}
