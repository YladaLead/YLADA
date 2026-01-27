import { NextRequest, NextResponse } from 'next/server'
import { 
  sendWelcomeToNonContactedLeads, 
  sendRemarketingToNonParticipants,
  sendPreClassNotifications,
  sendPostClassNotifications,
  sendFollowUpToNonResponders,
  sendSalesFollowUpAfterClass,
  sendWorkshopReminders
} from '@/lib/whatsapp-carol-ai'

/**
 * GET /api/cron/whatsapp-carol
 *
 * @deprecated Use WORKER on-demand. O sistema não usa mais Cron.
 * Automação oficial:
 *   POST /api/admin/whatsapp/automation/process-all  → boas-vindas + worker + participou/não participou
 *   POST /api/admin/whatsapp/automation/process      → processa fila de mensagens agendadas
 * Este endpoint fica só para compatibilidade/chamada manual.
 */
export async function GET(request: NextRequest) {
  try {
    // Automação principal = worker on-demand (process/process-all), não cron.

    const searchParams = request.nextUrl.searchParams
    const tipo = searchParams.get('tipo') // 'welcome', 'remarketing', 'pre-class', 'post-class', 'follow-up', 'sales-follow-up', 'reminders'
    
    if (!tipo) {
      return NextResponse.json(
        { error: 'Parâmetro "tipo" é obrigatório' },
        { status: 400 }
      )
    }

    let result

    if (tipo === 'welcome') {
      result = await sendWelcomeToNonContactedLeads()
    } else if (tipo === 'remarketing') {
      result = await sendRemarketingToNonParticipants()
    } else if (tipo === 'pre-class') {
      result = await sendPreClassNotifications()
    } else if (tipo === 'post-class') {
      result = await sendPostClassNotifications()
    } else if (tipo === 'follow-up') {
      result = await sendFollowUpToNonResponders()
    } else if (tipo === 'sales-follow-up') {
      result = await sendSalesFollowUpAfterClass()
    } else if (tipo === 'reminders') {
      result = await sendWorkshopReminders()
    } else {
      return NextResponse.json(
        { error: 'Tipo inválido. Use "welcome", "remarketing", "pre-class", "post-class", "follow-up", "sales-follow-up" ou "reminders"' },
        { status: 400 }
      )
    }

    return NextResponse.json({
      success: true,
      tipo,
      timestamp: new Date().toISOString(),
      ...result,
    })
  } catch (error: any) {
    console.error('[Worker/Legacy Carol] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar', details: error.message },
      { status: 500 }
    )
  }
}
