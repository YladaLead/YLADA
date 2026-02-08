/**
 * POST /api/admin/whatsapp/v2/worker
 * Worker único Carol v2: boas-vindas sem clique, pré-aula, follow-up não respondeu.
 * Respeita horário comercial e kill-switch (isCarolAutomationDisabled).
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getCarolAutomationDisabled } from '@/lib/carol-admin-settings'
import { runWorker } from '@/lib/carol-v2/worker'

export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult
  if (await getCarolAutomationDisabled()) {
    return NextResponse.json(
      { disabled: true, message: 'Automação temporariamente desligada' },
      { status: 200 }
    )
  }
  try {
    const body = await request.json().catch(() => ({}))
    const area = (body.area as string) || 'nutri'
    const result = await runWorker(area)
    return NextResponse.json({
      success: result.ok,
      skipped: result.skipped,
      reason: result.reason,
      ...result,
      timestamp: new Date().toISOString(),
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[Worker v2] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao executar worker', details: msg },
      { status: 500 }
    )
  }
}
