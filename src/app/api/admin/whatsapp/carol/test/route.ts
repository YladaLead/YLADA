import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { getCarolAutomationDisabled } from '@/lib/carol-admin-settings'
import { generateCarolResponse } from '@/lib/whatsapp-carol-ai'

/**
 * POST /api/admin/whatsapp/carol/test
 * Endpoint para testar a Carol sem salvar no banco. Desligado quando isCarolAutomationDisabled.
 */
export async function POST(request: NextRequest) {
  const authResult = await requireApiAuth(request, ['admin'])
  if (authResult instanceof NextResponse) return authResult
  if (await getCarolAutomationDisabled()) {
    return NextResponse.json({ disabled: true, message: 'Automação temporariamente desligada' }, { status: 503 })
  }
  try {
    const body = await request.json()
    const { message, conversationHistory, context } = body

    if (!message || typeof message !== 'string') {
      return NextResponse.json(
        { error: 'Mensagem é obrigatória' },
        { status: 400 }
      )
    }

    // Verificar se OpenAI está configurado
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: 'OpenAI API Key não configurada' },
        { status: 500 }
      )
    }

    // Importar função de geração de resposta (versão que não salva no banco)
    // Vamos usar a função generateCarolResponse diretamente
    const response = await generateCarolResponse(
      message,
      conversationHistory || [],
      {
        tags: context?.tags || [],
        workshopSessions: context?.workshopSessions || [],
        leadName: context?.leadName,
        hasScheduled: context?.hasScheduled,
        scheduledDate: context?.scheduledDate,
        participated: context?.participated,
        isFirstMessage: context?.isFirstMessage
      }
    )

    return NextResponse.json({
      success: true,
      response
    })
  } catch (error: any) {
    console.error('[Carol Test] Erro:', error)
    return NextResponse.json(
      { error: error.message || 'Erro ao processar teste' },
      { status: 500 }
    )
  }
}
