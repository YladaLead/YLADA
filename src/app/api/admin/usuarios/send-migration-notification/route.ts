import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { requireApiAuth } from '@/lib/api-auth'
import { resend, FROM_EMAIL, FROM_NAME, isResendConfigured } from '@/lib/resend'

/**
 * POST /api/admin/usuarios/send-migration-notification
 * Envia comunicado em massa para usuários migrados
 * Apenas admin pode executar
 * 
 * Body:
 * {
 *   message?: string (mensagem personalizada - opcional),
 *   area?: 'wellness' | 'nutri' | 'coach' | 'nutra' (filtrar por área - opcional),
 *   defaultPassword?: string (senha padrão - opcional, padrão: 'Ylada2025!')
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    // Verificar se Resend está configurado
    if (!isResendConfigured() || !resend) {
      return NextResponse.json(
        { error: 'Resend não está configurado. Verifique RESEND_API_KEY.' },
        { status: 500 }
      )
    }

    const body = await request.json()
    const { message, area, defaultPassword } = body
    const senhaPadrao = defaultPassword || 'Ylada2025!'

    // Buscar usuários migrados
    let subscriptionsQuery = supabaseAdmin
      .from('subscriptions')
      .select('user_id, area, is_migrated')
      .eq('is_migrated', true)
      .eq('status', 'active')

    if (area) {
      subscriptionsQuery = subscriptionsQuery.eq('area', area)
    }

    const { data: subscriptions, error: subsError } = await subscriptionsQuery

    if (subsError) {
      console.error('❌ Erro ao buscar assinaturas migradas:', subsError)
      return NextResponse.json(
        { error: 'Erro ao buscar usuários migrados', details: subsError.message },
        { status: 500 }
      )
    }

    if (!subscriptions || subscriptions.length === 0) {
      return NextResponse.json({
        success: true,
        sent: 0,
        failed: 0,
        message: 'Nenhum usuário migrado encontrado'
      })
    }

    // Buscar perfis dos usuários
    const userIds = subscriptions.map(s => s.user_id)
    const { data: profiles, error: profilesError } = await supabaseAdmin
      .from('user_profiles')
      .select('user_id, nome_completo, email, perfil')
      .in('user_id', userIds)

    if (profilesError) {
      console.error('❌ Erro ao buscar perfis:', profilesError)
      return NextResponse.json(
        { error: 'Erro ao buscar perfis de usuários', details: profilesError.message },
        { status: 500 }
      )
    }

    // Criar mapa de área por usuário
    const areaPorUsuario: Record<string, string> = {}
    subscriptions.forEach(sub => {
      areaPorUsuario[sub.user_id] = sub.area
    })

    // Preparar template do email
    const results = {
      sent: 0,
      failed: 0,
      errors: [] as any[]
    }

    // Enviar email para cada usuário
    for (const profile of profiles || []) {
      try {
        const userArea = areaPorUsuario[profile.user_id] || profile.perfil || 'wellness'
        const areaName = {
          wellness: 'Wellness',
          nutri: 'Nutri',
          coach: 'Coach',
          nutra: 'Nutra',
        }[userArea] || 'Wellness'

        const userName = profile.nome_completo || profile.email?.split('@')[0] || 'Usuário'

        // Montar HTML do email
        const emailHtml = `
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
                  Olá <strong>${userName}</strong>!
                </p>
                
                <p style="font-size: 16px; margin-bottom: 20px;">
                  Sua conta foi migrada com sucesso para a nova plataforma YLADA ${areaName}!
                </p>

                ${message ? `
                  <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px;">
                    <p style="margin: 0; font-size: 16px; color: #065f46;">
                      ${message.replace(/\n/g, '<br>')}
                    </p>
                  </div>
                ` : ''}

                <div style="background: #fef3c7; border-left: 4px solid #f59e0b; padding: 20px; margin: 20px 0; border-radius: 5px;">
                  <p style="margin: 0 0 10px 0; font-weight: 600; font-size: 16px; color: #92400e;">🔑 Acesso à Plataforma:</p>
                  <p style="margin: 0 0 10px 0; font-size: 14px; color: #78350f;">
                    <strong>Email:</strong> ${profile.email}<br>
                    <strong>Senha Padrão:</strong> <code style="background: #fef3c7; padding: 2px 6px; border-radius: 3px; font-family: monospace;">${senhaPadrao}</code>
                  </p>
                  <p style="margin: 10px 0 0 0; font-size: 12px; color: #92400e;">
                    ⚠️ <strong>Importante:</strong> Após fazer login, você precisará completar seu cadastro e poderá alterar sua senha.
                  </p>
                </div>

                <div style="background: #f0fdf4; border-left: 4px solid #10b981; padding: 20px; margin: 20px 0; border-radius: 5px;">
                  <p style="margin: 0 0 10px 0; font-weight: 600; font-size: 14px; color: #065f46;">📋 Próximos passos:</p>
                  <ol style="margin: 0; padding-left: 20px; font-size: 14px; color: #047857;">
                    <li style="margin-bottom: 8px;">Acesse a plataforma com seu email e a senha padrão acima</li>
                    <li style="margin-bottom: 8px;">Complete seu cadastro (nome, dados pessoais, etc.)</li>
                    <li style="margin-bottom: 8px;">Altere sua senha para uma senha pessoal e segura</li>
                    <li style="margin-bottom: 8px;">Explore todas as funcionalidades disponíveis na área ${areaName}</li>
                  </ol>
                </div>

                <div style="text-align: center; margin: 30px 0;">
                  <a href="https://www.ylada.com/pt/${userArea}/login" 
                     style="display: inline-block; background: #3b82f6; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; font-size: 16px;">
                    🚀 Acessar Plataforma
                  </a>
                </div>

                <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; margin-top: 30px; font-size: 12px; color: #6b7280;">
                  <p style="margin: 0;">
                    Se você tiver dúvidas ou precisar de ajuda, entre em contato conosco através do grupo ou da plataforma.
                  </p>
                  <p style="margin: 10px 0 0 0;">
                    <strong>Equipe YLADA</strong>
                  </p>
                </div>
              </div>
            </body>
          </html>
        `

        // Enviar email
        const { error: emailError } = await resend.emails.send({
          from: `${FROM_NAME} <${FROM_EMAIL}>`,
          to: profile.email || '',
          subject: '🎉 Bem-vindo ao YLADA! Sua conta foi migrada',
          html: emailHtml,
        })

        if (emailError) {
          console.error(`❌ Erro ao enviar email para ${profile.email}:`, emailError)
          results.failed++
          results.errors.push({
            email: profile.email,
            error: emailError.message
          })
        } else {
          results.sent++
          console.log(`✅ Email enviado para ${profile.email}`)
        }
      } catch (error: any) {
        console.error(`❌ Erro ao processar usuário ${profile.email}:`, error)
        results.failed++
        results.errors.push({
          email: profile.email,
          error: error.message || 'Erro desconhecido'
        })
      }
    }

    return NextResponse.json({
      success: true,
      sent: results.sent,
      failed: results.failed,
      total: (profiles || []).length,
      errors: results.errors,
      message: `${results.sent} email(s) enviado(s) com sucesso, ${results.failed} falharam`
    })
  } catch (error: any) {
    console.error('❌ Erro ao enviar notificações de migração:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao enviar notificações' },
      { status: 500 }
    )
  }
}

