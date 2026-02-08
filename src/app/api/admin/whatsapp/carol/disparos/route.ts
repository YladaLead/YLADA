import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getCarolAutomationDisabled } from '@/lib/carol-admin-settings'
import {
  sendWelcomeToNonContactedLeads,
  sendRemarketingToNonParticipants,
  sendRemarketingAulaHoje20h,
  sendWorkshopReminders,
  clearDisparoAbort,
} from '@/lib/whatsapp-carol-ai'

/**
 * POST /api/admin/whatsapp/carol/disparos
 * Dispara mensagens automáticas. Desligado quando isCarolAutomationDisabled (PASSO-A-PASSO-DESLIGAR-AUTOMACAO.md).
 */
export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult
  if (await getCarolAutomationDisabled()) {
    return NextResponse.json({ disabled: true, message: 'Automação temporariamente desligada' }, { status: 503 })
  }
  try {
    const body = await request.json()
    const { tipo } = body // 'welcome', 'remarketing' ou 'reminders'

    if (tipo === 'welcome') {
      await clearDisparoAbort('welcome')
      const result = await sendWelcomeToNonContactedLeads()
      await clearDisparoAbort('welcome')
      return NextResponse.json({
        success: true,
        tipo: 'welcome',
        ...result,
      })
    } else if (tipo === 'remarketing') {
      await clearDisparoAbort('remarketing')
      const result = await sendRemarketingToNonParticipants()
      await clearDisparoAbort('remarketing')
      return NextResponse.json({
        success: true,
        tipo: 'remarketing',
        ...result,
      })
    } else if (tipo === 'remarketing_hoje_20h') {
      await clearDisparoAbort('remarketing_hoje_20h')
      const result = await sendRemarketingAulaHoje20h()
      await clearDisparoAbort('remarketing_hoje_20h')
      return NextResponse.json({
        success: true,
        tipo: 'remarketing_hoje_20h',
        ...result,
      })
    } else if (tipo === 'reminders') {
      await clearDisparoAbort('reminders')
      const result = await sendWorkshopReminders()
      await clearDisparoAbort('reminders')
      return NextResponse.json({
        success: true,
        tipo: 'reminders',
        ...result,
      })
    } else {
      return NextResponse.json(
        { error: 'Tipo inválido. Use "welcome", "remarketing", "remarketing_hoje_20h" ou "reminders"' },
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
