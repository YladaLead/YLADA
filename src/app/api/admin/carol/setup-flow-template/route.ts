import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'

/**
 * POST /api/admin/carol/setup-flow-template
 *
 * Cria o template "carol_pergunta_abertura" no Meta — template de abertura
 * que dispara o WhatsApp Flow de diagnóstico (ID: 1659434855284721).
 *
 * Execute uma vez. Após aprovação (~24-72h), use o template para outbound.
 */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  const wabaId = process.env.WHATSAPP_BUSINESS_ACCOUNT_ID
  const token = process.env.WHATSAPP_TOKEN

  if (!wabaId || !token) {
    return NextResponse.json(
      { error: 'WHATSAPP_BUSINESS_ACCOUNT_ID ou WHATSAPP_TOKEN não configurados' },
      { status: 500 }
    )
  }

  const FLOW_ID = '1659434855284721'

  const templatePayload = {
    name: 'carol_pergunta_abertura',
    category: 'UTILITY',
    language: 'pt_BR',
    components: [
      {
        type: 'BODY',
        text: 'Oi, {{1}}! Tenho uma pergunta que pode te ajudar a enxergar algo importante no seu negócio.\n\nNo fim do mês, o resultado da sua clínica reflete o esforço que você coloca nela?',
        example: {
          body_text: [['Juliana']],
        },
      },
      {
        type: 'BUTTONS',
        buttons: [
          {
            type: 'FLOW',
            text: 'Responder',
            flow_id: FLOW_ID,
            flow_action: 'navigate',
            navigate_screen: 'RESULTADO_ESFORCO',
          },
        ],
      },
    ],
  }

  try {
    const url = `https://graph.facebook.com/v18.0/${wabaId}/message_templates`

    const response = await fetch(url, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(templatePayload),
    })

    const result = await response.json()

    if (!response.ok) {
      console.error('[setup-flow-template] Erro da Meta API:', result)
      return NextResponse.json(
        { error: 'Erro ao criar template', details: result },
        { status: 400 }
      )
    }

    console.log('[setup-flow-template] Template criado:', result)

    return NextResponse.json({
      success: true,
      message: 'Template "carol_pergunta_abertura" submetido para aprovação',
      template_id: result.id,
      status: result.status,
      note: 'Aprovação em 24-72h. Categoria: UTILITY. Botão Flow → ID ' + FLOW_ID,
    })
  } catch (error) {
    const msg = error instanceof Error ? error.message : 'Erro desconhecido'
    console.error('[setup-flow-template] Erro:', msg)
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

/**
 * GET — retorna o payload do template sem submetê-lo (para conferência)
 */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  return NextResponse.json({
    template_name: 'carol_pergunta_abertura',
    category: 'UTILITY',
    language: 'pt_BR',
    body: 'Oi, {{1}}! Tenho uma pergunta que pode te ajudar a enxergar algo importante no seu negócio.\n\nNo fim do mês, o resultado da sua clínica reflete o esforço que você coloca nela?',
    button: {
      type: 'FLOW',
      text: 'Responder',
      flow_id: '1659434855284721',
      navigate_screen: 'RESULTADO_ESFORCO',
    },
    instructions: 'Faça POST neste endpoint para submeter o template ao Meta para aprovação.',
  })
}
