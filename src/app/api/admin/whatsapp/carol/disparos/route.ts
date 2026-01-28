import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { isCarolAutomationDisabled } from '@/config/whatsapp-automation'
import { sendWelcomeToNonContactedLeads, sendRemarketingToNonParticipants, sendWorkshopReminders } from '@/lib/whatsapp-carol-ai'

/**
 * POST /api/admin/whatsapp/carol/disparos
 * Dispara mensagens automáticas. Desligado quando isCarolAutomationDisabled (PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md).
 */
export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult
  if (isCarolAutomationDisabled()) {
    return NextResponse.json({ disabled: true, message: 'Automação temporariamente desligada' }, { status: 503 })
  }
  try {
    const body = await request.json()
    const { tipo } = body // 'welcome', 'remarketing' ou 'reminders'

    if (tipo === 'welcome') {
      // Disparar boas-vindas para quem preencheu mas não chamou
      const result = await sendWelcomeToNonContactedLeads()
      return NextResponse.json({
        success: true,
        tipo: 'welcome',
        ...result,
      })
    } else if (tipo === 'remarketing') {
      // Disparar remarketing para quem não participou
      const result = await sendRemarketingToNonParticipants()
      return NextResponse.json({
        success: true,
        tipo: 'remarketing',
        ...result,
      })
    } else if (tipo === 'reminders') {
      // Disparar lembretes de reunião
      const result = await sendWorkshopReminders()
      return NextResponse.json({
        success: true,
        tipo: 'reminders',
        ...result,
      })
    } else {
      return NextResponse.json(
        { error: 'Tipo inválido. Use "welcome", "remarketing" ou "reminders"' },
        { status: 400 }
      )
    }
  } catch (error: any) {
    console.error('[Carol Disparos] Erro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar disparo', details: error.message },
      { status: 500 }
    )
  }
}
