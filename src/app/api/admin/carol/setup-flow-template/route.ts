import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'

const FLOW_ID = '1659434855284721'

// Todos os templates que precisam ser submetidos ao Meta
const ALL_TEMPLATES = [
  {
    name: 'carol_pergunta_abertura',
    category: 'UTILITY',
    language: 'pt_BR',
    components: [
      {
        type: 'BODY',
        text: 'Oi, {{1}}! Tenho uma pergunta que pode te ajudar a enxergar algo importante no seu negócio.\n\nNo fim do mês, o resultado da sua clínica reflete o esforço que você coloca nela?',
        example: { body_text: [['Juliana']] },
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
  },
  {
    name: 'carol_diagnostico_gratuito',
    category: 'UTILITY',
    language: 'pt_BR',
    components: [
      {
        type: 'BODY',
        text: 'Oi, {{1}}! Sou a Carol, da equipe do Andre Faula.\n\nPreparamos um diagnóstico gratuito de 3 minutos para profissionais de estética identificarem os principais pontos de melhoria no negócio.\n\nPosso te enviar?',
        example: { body_text: [['Juliana']] },
      },
    ],
  },
  {
    name: 'carol_insight_estetica',
    category: 'UTILITY',
    language: 'pt_BR',
    components: [
      {
        type: 'BODY',
        text: 'Oi, {{1}}! Aqui é a Carol, da equipe do Andre Faula.\n\nO Andre mapeou os 3 pontos que mais travam o crescimento de clínicas de estética no Brasil. É um material gratuito e direto ao ponto.\n\nVocê gostaria de receber?',
        example: { body_text: [['Juliana']] },
      },
    ],
  },
  {
    name: 'carol_checklist_negocios',
    category: 'UTILITY',
    language: 'pt_BR',
    components: [
      {
        type: 'BODY',
        text: 'Oi, {{1}}! Sou a Carol, da equipe do Andre Faula.\n\nCriamos uma avaliação gratuita para profissionais de estética entenderem onde o negócio está saudável e onde há espaço para crescer.\n\nPosso compartilhar com você?',
        example: { body_text: [['Juliana']] },
      },
    ],
  },
]

async function submitTemplate(
  wabaId: string,
  token: string,
  template: (typeof ALL_TEMPLATES)[0]
) {
  const url = `https://graph.facebook.com/v18.0/${wabaId}/message_templates`
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(template),
  })
  const result = await response.json()
  return { ok: response.ok, name: template.name, result }
}

/**
 * POST /api/admin/carol/setup-flow-template
 *
 * Submete TODOS os templates ao Meta de uma vez.
 * Execute uma vez após o deploy. Aprovação em 24-72h.
 *
 * Query param: ?only=carol_pergunta_abertura  → submete só esse
 * Sem query param → submete todos os 4
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

  const only = request.nextUrl.searchParams.get('only')
  const templates = only
    ? ALL_TEMPLATES.filter((t) => t.name === only)
    : ALL_TEMPLATES

  if (templates.length === 0) {
    return NextResponse.json({ error: `Template "${only}" não encontrado` }, { status: 400 })
  }

  const results = []

  for (const template of templates) {
    try {
      const res = await submitTemplate(wabaId, token, template)
      results.push(res)
      console.log(`[setup-templates] ${template.name}:`, res.result)
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Erro desconhecido'
      results.push({ ok: false, name: template.name, result: { error: msg } })
    }
  }

  const allOk = results.every((r) => r.ok)
  const submitted = results.filter((r) => r.ok).map((r) => r.name)
  const failed = results.filter((r) => !r.ok).map((r) => ({ name: r.name, error: r.result }))

  return NextResponse.json({
    success: allOk,
    submitted,
    failed,
    note: 'Aprovação em 24-72h. Acompanhe em: business.facebook.com → WhatsApp Manager → Modelos de mensagem',
    results,
  })
}

/**
 * GET — lista os templates que serão submetidos (sem submeter)
 */
export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  return NextResponse.json({
    templates: ALL_TEMPLATES.map((t) => ({
      name: t.name,
      category: t.category,
      language: t.language,
      body: t.components.find((c) => c.type === 'BODY')?.text,
      has_flow_button: t.components.some((c) =>
        c.type === 'BUTTONS'
      ),
    })),
    instructions: [
      'POST /api/admin/carol/setup-flow-template → submete todos os 4 templates',
      'POST /api/admin/carol/setup-flow-template?only=carol_pergunta_abertura → submete só esse',
    ],
    flow_id: FLOW_ID,
  })
}
