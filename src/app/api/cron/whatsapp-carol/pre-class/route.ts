/**
 * GET /api/cron/whatsapp-carol/pre-class
 *
 * @deprecated Use Worker. Envia lembretes pré-aula (2h, 12h, 10min antes).
 * Automação oficial: POST /api/admin/whatsapp/automation/process-all
 * ou incluir pre-class no worker. Mantido para chamada manual.
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
