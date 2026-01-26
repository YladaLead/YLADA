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
 * Endpoint para cron jobs (Vercel Cron ou similar)
 * 
 * Executa automaticamente:
 * - Boas-vindas para quem preencheu mas não chamou (a cada 1 hora)
 * - Remarketing para quem não participou (a cada 6 horas)
 * 
 * Proteção: Verificar header de autenticação do cron
 */
export async function GET(request: NextRequest) {
  try {
    // Verificar se é chamada do cron (Vercel Cron envia header Authorization)
    const authHeader = request.headers.get('authorization')
    const cronSecret = process.env.CRON_SECRET || 'your-secret-key'

    if (authHeader !== `Bearer ${cronSecret}`) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

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
    console.error('[Cron Carol] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar cron', details: error.message },
      { status: 500 }
    )
  }
}
