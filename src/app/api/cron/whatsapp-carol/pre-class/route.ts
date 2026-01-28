import { NextResponse } from 'next/server'

/**
 * GET /api/cron/whatsapp-carol/pre-class
 *
 * Cron não é mais usado. Pré-aula e demais disparos são feitos pelo worker:
 *   POST /api/admin/whatsapp/automation/process-all
 * Este endpoint existe só por compatibilidade e sempre retorna esta mensagem.
 */
export async function GET() {
  return NextResponse.json(
    {
      cron_nao_usado: true,
      message: 'Cron não é usado. Use o worker: POST /api/admin/whatsapp/automation/process-all',
      worker_process_all: '/api/admin/whatsapp/automation/process-all',
    },
    { status: 200 }
  )
}
