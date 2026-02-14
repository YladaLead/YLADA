/**
 * POST /api/admin/whatsapp/automation/remate-valor-novo-participou
 * Disparo único (temporário): uma mensagem de remate "valor novo" para quem já participou e não pagou.
 * Uma vez por pessoa; respeita horário permitido e usa delay entre envios.
 */

import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getCarolAutomationDisabled } from '@/lib/carol-admin-settings'
import { sendRemateValorNovoParticipou } from '@/lib/whatsapp-carol-ai'

export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult
  if (await getCarolAutomationDisabled()) {
    return NextResponse.json(
      { success: false, disabled: true, message: 'Automação temporariamente desligada' },
      { status: 200 }
    )
  }
  try {
    const result = await sendRemateValorNovoParticipou()
    return NextResponse.json({
      success: true,
      sent: result.sent,
      errors: result.errors,
    })
  } catch (error: any) {
    console.error('[remate-valor-novo-participou]', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao enviar' },
      { status: 500 }
    )
  }
}
