import { NextRequest, NextResponse } from 'next/server'
import { resend, FROM_EMAIL, FROM_NAME } from '@/lib/resend'

/**
 * POST /api/email/test
 * Rota de teste para verificar se o Resend está funcionando
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email } = body

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      )
    }

    console.log('🧪 Teste de envio de e-mail:', {
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      hasApiKey: !!process.env.RESEND_API_KEY,
      apiKeyPrefix: process.env.RESEND_API_KEY?.substring(0, 10) + '...',
    })

    // Tentar enviar e-mail de teste
    const { error, data } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: email,
      subject: '🧪 Teste de E-mail - YLADA',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
          </head>
          <body style="font-family: Arial, sans-serif; padding: 20px;">
            <h1 style="color: #10b981;">🧪 Teste de E-mail</h1>
            <p>Este é um e-mail de teste do sistema YLADA.</p>
            <p>Se você recebeu este e-mail, significa que o Resend está funcionando corretamente!</p>
            <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
            <p><strong>De:</strong> ${FROM_NAME} &lt;${FROM_EMAIL}&gt;</p>
            <p><strong>Para:</strong> ${email}</p>
          </body>
        </html>
      `,
    })

    if (error) {
      console.error('❌ Erro ao enviar e-mail de teste:', {
        error,
        message: error.message,
        name: error.name,
        details: JSON.stringify(error, null, 2),
      })
      
      return NextResponse.json(
        { 
          success: false,
          error: error.message || 'Erro desconhecido',
          details: process.env.NODE_ENV === 'development' ? {
            errorType: error.name,
            fullError: JSON.stringify(error, null, 2),
          } : undefined
        },
        { status: 500 }
      )
    }

    console.log('✅ E-mail de teste enviado com sucesso:', {
      email,
      emailId: data?.id,
      from: FROM_EMAIL,
    })

    return NextResponse.json({
      success: true,
      message: 'E-mail de teste enviado com sucesso!',
      emailId: data?.id,
      from: FROM_EMAIL,
      to: email,
    })
  } catch (error: any) {
    console.error('❌ Erro geral no teste de e-mail:', error)
    return NextResponse.json(
      { 
        success: false,
        error: error.message || 'Erro ao processar teste',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    )
  }
}

