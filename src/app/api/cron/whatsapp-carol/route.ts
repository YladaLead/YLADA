import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/cron/whatsapp-carol
 *
 * Cron não é mais usado. Automação oficial = worker on-demand:
 *   POST /api/admin/whatsapp/automation/process-all
 *   POST /api/admin/whatsapp/automation/process
 * Este endpoint existe só por compatibilidade e sempre retorna esta mensagem.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      cron_nao_usado: true,
      message: 'Cron não é usado. Use o worker: POST /api/admin/whatsapp/automation/process-all ou process',
      worker_process_all: '/api/admin/whatsapp/automation/process-all',
      worker_process: '/api/admin/whatsapp/automation/process',
    },
    { status: 200 }
  )
}
