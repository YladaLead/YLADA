/**
 * POST /api/admin/whatsapp/v2/disparar/link-pos-participou
 * Disparo manual do link pós-participou (Carol v2).
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { enviarLinkPosParticipou } from '@/lib/carol-v2/disparos'

export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult

  try {
    const body = await request.json().catch(() => ({}))
    const conversationId = body.conversationId as string
    const area = (body.area as string) || 'nutri'

    if (!conversationId || typeof conversationId !== 'string') {
      return NextResponse.json(
        { success: false, error: 'conversationId é obrigatório' },
        { status: 400 }
      )
    }

    const result = await enviarLinkPosParticipou(conversationId, area)
    return NextResponse.json({
      success: result.success,
      error: result.error ?? undefined,
    })
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : String(error)
    console.error('[v2 disparar link-pos-participou] Erro:', error)
    return NextResponse.json(
      { success: false, error: 'Erro ao disparar', details: msg },
      { status: 500 }
    )
  }
}
