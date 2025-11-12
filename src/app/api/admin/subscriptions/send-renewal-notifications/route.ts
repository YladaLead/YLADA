import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { processRenewalNotifications } from '@/lib/subscription-renewal-notifications'

/**
 * POST /api/admin/subscriptions/send-renewal-notifications
 * Envia notificações de renovação para assinaturas migradas próximas do vencimento
 * Apenas admin pode executar
 * 
 * Body (opcional):
 * {
 *   days_ahead: number (default: 30)
 * }
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json().catch(() => ({}))
    const daysAhead = body.days_ahead || 30

    if (typeof daysAhead !== 'number' || daysAhead < 1 || daysAhead > 90) {
      return NextResponse.json(
        { error: 'days_ahead deve ser um número entre 1 e 90' },
        { status: 400 }
      )
    }

    console.log(`📧 Processando notificações de renovação (${daysAhead} dias à frente)...`)

    const results = await processRenewalNotifications(daysAhead)

    return NextResponse.json({
      success: true,
      message: `Processamento concluído. ${results.sent} emails enviados, ${results.failed} falharam.`,
      results,
    })
  } catch (error: any) {
    console.error('❌ Erro ao processar notificações de renovação:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar notificações' },
      { status: 500 }
    )
  }
}

