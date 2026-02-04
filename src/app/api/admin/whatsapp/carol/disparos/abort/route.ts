import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { requestDisparoAbort } from '@/lib/whatsapp-carol-ai'

const TIPOS = ['remarketing', 'welcome', 'reminders', 'remarketing_hoje_20h'] as const

/**
 * POST /api/admin/whatsapp/carol/disparos/abort
 * Sinaliza para parar o disparo em massa em andamento (remarketing, welcome ou reminders).
 */
export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json().catch(() => ({}))
    const { tipo } = body as { tipo?: string }

    if (!tipo || !TIPOS.includes(tipo as (typeof TIPOS)[number])) {
      return NextResponse.json(
        { error: 'tipo inválido. Use "remarketing", "welcome", "reminders" ou "remarketing_hoje_20h"' },
        { status: 400 }
      )
    }

    await requestDisparoAbort(tipo as (typeof TIPOS)[number])
    return NextResponse.json({ success: true, message: 'Parar disparo solicitado.' })
  } catch (error: any) {
    console.error('[Carol Disparos Abort] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao solicitar parada', details: error.message },
      { status: 500 }
    )
  }
}
