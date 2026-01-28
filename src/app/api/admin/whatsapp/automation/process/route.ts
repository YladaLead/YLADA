/**
 * POST /api/admin/whatsapp/automation/process
 * Worker on-demand. Desligado quando isCarolAutomationDisabled (PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md).
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { isCarolAutomationDisabled } from '@/config/whatsapp-automation'
import { processScheduledMessages } from '@/lib/whatsapp-automation/worker'

export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) {
    return authResult
  }
  if (isCarolAutomationDisabled()) {
    return NextResponse.json({ disabled: true, message: 'Automação temporariamente desligada' }, { status: 200 })
  }
  try {
    const body = await request.json().catch(() => ({}))
    const limit = typeof body.limit === 'number' ? body.limit : 50

    // Processar mensagens pendentes
    const result = await processScheduledMessages(limit)

    return NextResponse.json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error: any) {
    console.error('[Automation Process] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar mensagens', details: error.message },
      { status: 500 }
    )
  }
}
