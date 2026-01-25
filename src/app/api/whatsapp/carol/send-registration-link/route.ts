import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { sendRegistrationLinkAfterClass } from '@/lib/whatsapp-carol-ai'

/**
 * POST /api/whatsapp/carol/send-registration-link
 * Envia link de cadastro quando pessoa participa da aula
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar se é admin
    const authResult = await requireApiAuth(request, ['admin'])
    if (authResult instanceof NextResponse) {
      return authResult
    }

    const body = await request.json()
    const { conversationId } = body

    if (!conversationId) {
      return NextResponse.json(
        { error: 'conversationId é obrigatório' },
        { status: 400 }
      )
    }

    const result = await sendRegistrationLinkAfterClass(conversationId)

    if (result.success) {
      return NextResponse.json({
        success: true,
        message: 'Link de cadastro enviado com sucesso',
      })
    } else {
      return NextResponse.json(
        { error: result.error || 'Erro ao enviar link de cadastro' },
        { status: 500 }
      )
    }
  } catch (error: any) {
    console.error('[Carol] Erro ao enviar link de cadastro:', error)
    return NextResponse.json(
      { error: 'Erro ao processar requisição', details: error.message },
      { status: 500 }
    )
  }
}
