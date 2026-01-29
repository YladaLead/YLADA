/**
 * POST /api/admin/whatsapp/workshop/participants/reenviar-remarketing
 * Reenvia a mensagem de remarketing para uma pessoa já marcada como "Não participou".
 * Útil quando o disparo automático falhou ou quando a pessoa foi marcada em outro momento.
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { sendRemarketingToNonParticipant } from '@/lib/whatsapp-carol-ai'
import { isCarolAutomationDisabled } from '@/config/whatsapp-automation'

export async function POST(request: NextRequest) {
  try {
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    if (isCarolAutomationDisabled()) {
      return NextResponse.json(
        { success: false, error: 'Automação está desligada. Ligue CAROL_AUTOMATION_DISABLED=false.' },
        { status: 503 }
      )
    }

    const body = await request.json()
    const { conversationId, force } = body

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId é obrigatório' },
        { status: 400 }
      )
    }

    // force: true = reenvio manual pelo admin — ignora regra de 2h e horário permitido
    const result = await sendRemarketingToNonParticipant(conversationId, { force: force === true })

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Remarketing enviado com sucesso!',
      })
    }

    return NextResponse.json({
      success: false,
      error: result.error || 'Não foi possível enviar o remarketing.',
    }, { status: 400 })
  } catch (error: any) {
    console.error('[Reenviar Remarketing] Erro:', error)
    return NextResponse.json(
      { success: false, error: error?.message || 'Erro ao reenviar remarketing' },
      { status: 500 }
    )
  }
}
