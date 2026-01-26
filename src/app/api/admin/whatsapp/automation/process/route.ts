/**
 * POST /api/admin/whatsapp/automation/process
 * Worker on-demand - Processa mensagens agendadas pendentes
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { processScheduledMessages } from '@/lib/whatsapp-automation/worker'

export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

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
