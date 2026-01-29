/**
 * POST /api/admin/whatsapp/automation/welcome
 * Agenda boas-vindas para leads que preencheram workshop
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { scheduleWelcomeMessages } from '@/lib/whatsapp-automation/welcome'
import { isWhatsAppAutoWelcomeEnabled } from '@/config/whatsapp-automation'

export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (!isWhatsAppAutoWelcomeEnabled()) {
      return NextResponse.json(
        {
          disabled: true,
          message: 'Boas-vindas automáticas estão desativadas (WHATSAPP_AUTO_WELCOME!=true). Use o disparo manual em /admin/whatsapp/cadastros-workshop.',
        },
        { status: 200 }
      )
    }

    // Agendar boas-vindas
    const result = await scheduleWelcomeMessages()

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[Automation Welcome] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao agendar boas-vindas', details: error.message },
      { status: 500 }
    )
  }
}
