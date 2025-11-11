import { NextRequest, NextResponse } from 'next/server'
import { supabaseAdmin } from '@/lib/supabase'
import { isResendConfigured, resend, FROM_EMAIL, FROM_NAME } from '@/lib/resend'

/**
 * GET /api/webhooks/mercado-pago/diagnostico
 * Endpoint de diagnóstico para verificar configuração do sistema de e-mail
 */
export async function GET(request: NextRequest) {
  try {
    const diagnostics: any = {
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      checks: {},
      errors: [],
      warnings: [],
    }

    // 1. Verificar RESEND_API_KEY
    const resendApiKey = process.env.RESEND_API_KEY
    diagnostics.checks.resendApiKey = {
      exists: !!resendApiKey,
      prefix: resendApiKey ? resendApiKey.substring(0, 10) + '...' : 'NÃO CONFIGURADA',
      length: resendApiKey?.length || 0,
    }

    if (!resendApiKey) {
      diagnostics.errors.push('RESEND_API_KEY não está configurada')
    }

    // 2. Verificar se Resend está configurado
    const resendConfigured = isResendConfigured()
    diagnostics.checks.resendConfigured = resendConfigured

    if (!resendConfigured) {
      diagnostics.errors.push('Resend não está configurado (isResendConfigured() retornou false)')
    }

    // 3. Verificar resend client
    diagnostics.checks.resendClient = {
      exists: !!resend,
      type: resend ? typeof resend : 'null',
    }

    // 4. Verificar FROM_EMAIL e FROM_NAME
    diagnostics.checks.emailConfig = {
      fromEmail: FROM_EMAIL,
      fromName: FROM_NAME,
      fromEmailExists: !!FROM_EMAIL,
      fromNameExists: !!FROM_NAME,
    }

    // 5. Verificar base URLs
    diagnostics.checks.baseUrls = {
      NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL || 'NÃO CONFIGURADA',
      NEXT_PUBLIC_APP_URL_PRODUCTION: process.env.NEXT_PUBLIC_APP_URL_PRODUCTION || 'NÃO CONFIGURADA',
    }

    // 6. Verificar últimas subscriptions sem e-mail enviado
    try {
      const { data: subscriptions, error: subError } = await supabaseAdmin
        .from('subscriptions')
        .select(`
          id,
          user_id,
          area,
          plan_type,
          welcome_email_sent,
          welcome_email_sent_at,
          created_at,
          user_profiles!inner(email, nome_completo)
        `)
        .order('created_at', { ascending: false })
        .limit(5)

      if (subError) {
        diagnostics.warnings.push(`Erro ao buscar subscriptions: ${subError.message}`)
      } else {
        diagnostics.checks.recentSubscriptions = {
          count: subscriptions?.length || 0,
          subscriptions: subscriptions?.map((sub: any) => ({
            id: sub.id,
            email: sub.user_profiles?.email,
            nome: sub.user_profiles?.nome_completo,
            area: sub.area,
            planType: sub.plan_type,
            welcomeEmailSent: sub.welcome_email_sent,
            welcomeEmailSentAt: sub.welcome_email_sent_at,
            createdAt: sub.created_at,
          })) || [],
        }
      }
    } catch (error: any) {
      diagnostics.warnings.push(`Erro ao verificar subscriptions: ${error.message}`)
    }

    // 7. Testar envio de e-mail (se configurado)
    if (resendConfigured && resend) {
      const testEmail = request.nextUrl.searchParams.get('testEmail')
      if (testEmail && testEmail.includes('@')) {
        try {
          const { error, data } = await resend.emails.send({
            from: `${FROM_NAME} <${FROM_EMAIL}>`,
            to: testEmail,
            subject: '🧪 Teste de Diagnóstico - YLADA',
            html: `
              <h1>🧪 Teste de Diagnóstico</h1>
              <p>Este é um e-mail de teste do sistema de diagnóstico.</p>
              <p><strong>Data/Hora:</strong> ${new Date().toLocaleString('pt-BR')}</p>
              <p><strong>De:</strong> ${FROM_NAME} &lt;${FROM_EMAIL}&gt;</p>
            `,
          })

          if (error) {
            diagnostics.checks.testEmail = {
              sent: false,
              error: error.message,
            }
            diagnostics.errors.push(`Erro ao enviar e-mail de teste: ${error.message}`)
          } else {
            diagnostics.checks.testEmail = {
              sent: true,
              emailId: data?.id,
              to: testEmail,
            }
          }
        } catch (error: any) {
          diagnostics.checks.testEmail = {
            sent: false,
            error: error.message,
          }
          diagnostics.errors.push(`Erro ao enviar e-mail de teste: ${error.message}`)
        }
      } else {
        diagnostics.checks.testEmail = {
          note: 'Para testar envio de e-mail, adicione ?testEmail=seu@email.com na URL',
        }
      }
    }

    // Resumo
    diagnostics.summary = {
      allChecksPassed: diagnostics.errors.length === 0,
      totalErrors: diagnostics.errors.length,
      totalWarnings: diagnostics.warnings.length,
    }

    return NextResponse.json(diagnostics, {
      status: diagnostics.errors.length > 0 ? 500 : 200,
    })
  } catch (error: any) {
    return NextResponse.json(
      {
        error: 'Erro ao executar diagnóstico',
        message: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      { status: 500 }
    )
  }
}

