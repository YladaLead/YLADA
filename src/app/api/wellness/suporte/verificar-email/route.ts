/**
 * POST /api/wellness/suporte/verificar-email
 * Envia código de verificação por email para ações de suporte
 */

import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'
import crypto from 'crypto'

// Armazenar códigos temporariamente (em produção, usar Redis ou banco)
// Compartilhado com a rota de validação
const verificationCodes = new Map<string, { code: string; expiresAt: number; email: string }>()

// Exportar funções para uso compartilhado
export function getVerificationCode(verificationId: string) {
  return verificationCodes.get(verificationId)
}

export function deleteVerificationCode(verificationId: string) {
  verificationCodes.delete(verificationId)
}

export function setVerificationCode(verificationId: string, data: { code: string; expiresAt: number; email: string }) {
  verificationCodes.set(verificationId, data)
}

// Limpar códigos expirados a cada 5 minutos
setInterval(() => {
  const now = Date.now()
  for (const [key, value] of verificationCodes.entries()) {
    if (value.expiresAt < now) {
      verificationCodes.delete(key)
    }
  }
}, 5 * 60 * 1000)

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, action } = body // action: 'access-link' | 'reset-password'

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'E-mail inválido' },
        { status: 400 }
      )
    }

    if (!action || !['access-link', 'reset-password'].includes(action)) {
      return NextResponse.json(
        { error: 'Ação inválida' },
        { status: 400 }
      )
    }

    // Verificar se email existe no sistema
    const { data: authUser, error: listError } = await supabaseAdmin.auth.admin.listUsers()
    
    if (listError) {
      console.error('❌ Erro ao listar usuários:', listError)
      return NextResponse.json(
        { error: 'Erro ao verificar e-mail' },
        { status: 500 }
      )
    }

    const user = authUser?.users?.find(u => 
      u.email?.toLowerCase() === email.toLowerCase()
    )

    if (!user) {
      // Por segurança, não revelar se email existe
      return NextResponse.json({
        success: true,
        message: 'Se o e-mail estiver cadastrado, você receberá um código de verificação.',
      })
    }

    // Verificar se tem assinatura ativa (para gerar link de acesso)
    if (action === 'access-link') {
      const { data: subscription } = await supabaseAdmin
        .from('subscriptions')
        .select('id, area, status')
        .eq('user_id', user.id)
        .eq('status', 'active')
        .single()

      if (!subscription) {
        return NextResponse.json({
          success: true,
          message: 'Se o e-mail estiver cadastrado, você receberá um código de verificação.',
        })
      }
    }

    // Gerar código de 6 dígitos
    const code = crypto.randomInt(100000, 999999).toString()
    const expiresAt = Date.now() + 10 * 60 * 1000 // 10 minutos

    // Gerar ID único para esta verificação
    const verificationId = crypto.randomBytes(16).toString('hex')
    setVerificationCode(verificationId, { code, expiresAt, email: email.toLowerCase() })

    // Enviar código por email
    if (isResendConfigured() && resend) {
      const actionText = action === 'access-link' ? 'gerar link de acesso' : 'recuperar senha'
      
      const emailHtml = `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 0; margin: 0; background-color: #f5f5f5;">
            <div style="max-width: 600px; margin: 0 auto; background-color: white; padding: 0;">
              <div style="background: linear-gradient(135deg, #10b981 0%, #059669 100%); padding: 30px; text-align: center;">
                <h1 style="color: white; margin: 0; font-size: 24px; font-weight: 600;">🔐 Código de Verificação</h1>
              </div>
              <div style="padding: 30px;">
                <p style="color: #374151; font-size: 16px; line-height: 1.6;">
                  Você solicitou ${actionText} para sua conta Wellness System.
                </p>
                <div style="background-color: #f9fafb; border: 2px solid #10b981; border-radius: 8px; padding: 20px; text-align: center; margin: 20px 0;">
                  <p style="margin: 0; font-size: 32px; font-weight: 700; color: #10b981; letter-spacing: 8px;">${code}</p>
                </div>
                <p style="color: #6b7280; font-size: 14px; line-height: 1.6;">
                  Este código expira em <strong>10 minutos</strong> e é válido apenas para ${actionText}.
                </p>
                <p style="color: #6b7280; font-size: 12px; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb;">
                  Se você não solicitou este código, ignore este e-mail.
                </p>
              </div>
            </div>
          </body>
        </html>
      `

      await resend.emails.send({
        from: `${FROM_NAME} <${FROM_EMAIL}>`,
        to: email,
        subject: `🔐 Código de Verificação - Wellness System`,
        html: emailHtml,
      })
    }

    // Retornar verificationId (não o código!)
    return NextResponse.json({
      success: true,
      verificationId,
      message: 'Código de verificação enviado para seu e-mail!',
    })
  } catch (error: any) {
    console.error('❌ Erro ao verificar email:', error)
    return NextResponse.json(
      { error: 'Erro ao processar solicitação' },
      { status: 500 }
    )
  }
}

