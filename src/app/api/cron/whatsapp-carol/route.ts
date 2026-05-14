import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/cron/whatsapp-carol
 *
 * Cron da Vercel não está em uso (plano gratuito). O painel admin de automação
 * em lote (workshop / Nutri) foi descontinuado; a operação atual é Carol (Meta).
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      cron_nao_usado: true,
      message:
        'Cron não configurado. Automação workshop legada: use POST /api/admin/whatsapp/automation/process-all apenas se ainda integrarem esse fluxo. Carol (Meta): /admin/whatsapp/carol/chat.',
      process_all: 'POST /api/admin/whatsapp/automation/process-all',
      admin_page: '/admin/whatsapp/carol/chat',
    },
    { status: 200 }
  )
}
