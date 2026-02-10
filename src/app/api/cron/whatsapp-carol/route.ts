import { NextRequest, NextResponse } from 'next/server'

/**
 * GET /api/cron/whatsapp-carol
 *
 * Cron da Vercel não está em uso (plano gratuito). Use o botão "Processar tudo"
 * no admin (/admin/whatsapp/automation) a cada ~10 min antes da aula para
 * enviar lembretes (2h/12h/10min) e remarketing para todos.
 */
export async function GET(request: NextRequest) {
  return NextResponse.json(
    {
      cron_nao_usado: true,
      message: 'Cron não configurado (uso manual). Use o botão "Processar tudo" no admin WhatsApp a cada ~10 min antes da aula para enviar lembretes e remarketing.',
      process_all: 'POST /api/admin/whatsapp/automation/process-all',
      admin_page: '/admin/whatsapp/automation',
    },
    { status: 200 }
  )
}
