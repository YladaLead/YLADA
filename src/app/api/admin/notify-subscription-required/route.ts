import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'
import { supabaseAdmin } from '@/lib/supabase'

const CHECKOUT_NUTRI_URL =
  process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') + '/pt/nutri/checkout' ||
  'https://www.ylada.com/pt/nutri/checkout'

/**
 * POST /api/admin/notify-subscription-required
 *
 * Envia e-mail informando que o acesso à plataforma agora exige assinatura.
 * Uso: notificar usuários que estavam sem plano (ex.: Sueli Iglesias).
 *
 * Apenas admin pode executar.
 *
 * Body:
 * - email?: string  — e-mail do destinatário
 * - userId?: string — ou ID do usuário (busca e-mail no perfil)
 */
export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) return authResult

    if (!isResendConfigured() || !resend) {
      return NextResponse.json(
        { error: 'Resend não está configurado. Verifique RESEND_API_KEY.' },
        { status: 500 }
      )
    }

    const body = await request.json().catch(() => ({}))
    const { email: emailBody, userId } = body

    let toEmail: string | null = null
    let nome = ''

    if (emailBody && typeof emailBody === 'string') {
      toEmail = emailBody.trim()
    } else if (userId && typeof userId === 'string') {
      const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('email, nome_completo')
        .eq('user_id', userId)
        .maybeSingle()
      if (profile?.email) {
        toEmail = profile.email
        nome = profile.nome_completo || ''
      }
    }

    if (!toEmail || !toEmail.includes('@')) {
      return NextResponse.json(
        { error: 'Envie "email" ou "userId" no body para identificar o destinatário.' },
        { status: 400 }
      )
    }

    const saudacao = nome ? `Olá, ${nome.split(' ')[0]}!` : 'Olá!'

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
        </head>
        <body style="margin: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background: #f5f5f5; padding: 24px;">
          <div style="max-width: 560px; margin: 0 auto; background: #fff; border-radius: 12px; padding: 32px; box-shadow: 0 2px 8px rgba(0,0,0,0.06);">
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #1a1a1a;">
              ${saudacao}
            </p>
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #333; line-height: 1.5;">
              Identificamos que sua conta na plataforma YLADA Nutri estava ativa sem um plano de assinatura ativo.
            </p>
            <p style="margin: 0 0 16px 0; font-size: 16px; color: #333; line-height: 1.5;">
              A partir de agora, o acesso à plataforma exige assinatura. Para continuar usando todas as ferramentas, cursos e recursos, basta escolher um plano:
            </p>
            <p style="margin: 24px 0;">
              <a href="${CHECKOUT_NUTRI_URL}" style="display: inline-block; background: #16a34a; color: #fff; text-decoration: none; padding: 12px 24px; border-radius: 8px; font-weight: 600; font-size: 16px;">
                Ver planos e assinar
              </a>
            </p>
            <p style="margin: 24px 0 0 0; font-size: 14px; color: #666;">
              Qualquer dúvida, estamos à disposição.<br>
              <strong>Equipe YLADA</strong>
            </p>
          </div>
        </body>
      </html>
    `

    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: toEmail,
      subject: 'YLADA Nutri – Acesso à plataforma e planos',
      html,
    })

    if (error) {
      console.error('❌ Erro ao enviar e-mail (notify-subscription-required):', error)
      return NextResponse.json(
        { error: error.message || 'Falha ao enviar e-mail' },
        { status: 500 }
      )
    }

    console.log(`✅ E-mail enviado para ${toEmail} (notify-subscription-required)`)
    return NextResponse.json({
      success: true,
      sentTo: toEmail,
      message: 'E-mail enviado com sucesso.',
    })
  } catch (err: unknown) {
    console.error('❌ notify-subscription-required:', err)
    return NextResponse.json(
      { error: err instanceof Error ? err.message : 'Erro ao processar requisição' },
      { status: 500 }
    )
  }
}
