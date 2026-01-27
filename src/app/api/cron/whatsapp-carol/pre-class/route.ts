/**
 * GET /api/cron/whatsapp-carol/pre-class
 *
 * Envia lembretes de aula (2h, 12h, 10min antes) para quem tem sessão agendada.
 * Chamado automaticamente pelo cron a cada 15 min (vercel.json).
 * Também pode ser chamado manualmente para "disparo agora".
 */
import { NextResponse } from 'next/server'
import { sendPreClassNotifications } from '@/lib/whatsapp-carol-ai'

export async function GET() {
  try {
    const result = await sendPreClassNotifications()
    return NextResponse.json({
      success: true,
      tipo: 'pre-class',
      timestamp: new Date().toISOString(),
      ...result,
    })
  } catch (error: any) {
    console.error('[Cron Pre-Class] Erro:', error)
    return NextResponse.json(
      { success: false, error: error.message, details: error.message },
      { status: 500 }
    )
  }
}
