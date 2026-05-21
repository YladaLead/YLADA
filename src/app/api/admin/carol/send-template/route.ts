import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { sendWhatsAppTemplate } from '@/lib/carol/sender'
import { registerOutboundSend, normalizeCarolPhone } from '@/lib/carol/register-outbound'

// Templates disponíveis para envio outbound
export const AVAILABLE_TEMPLATES = [
  {
    name: 'carol_diagnostico_gratuito',
    label: 'Diagnóstico gratuito',
    description: 'Diagnóstico de 3 minutos para identificar pontos de melhoria',
    variables: ['nome'],
  },
  {
    name: 'carol_insight_estetica',
    label: 'Insight estética',
    description: '3 pontos que travam o crescimento de clínicas de estética',
    variables: ['nome'],
  },
  {
    name: 'carol_checklist_negocios',
    label: 'Checklist de negócios',
    description: 'Avaliação gratuita de saúde do negócio',
    variables: ['nome'],
  },
] as const

export type TemplateName = (typeof AVAILABLE_TEMPLATES)[number]['name']

export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  let body: { phone: string; template: TemplateName; nome: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const { phone, template, nome } = body

  if (!phone || !template || !nome) {
    return NextResponse.json(
      { error: 'Campos obrigatórios: phone, template, nome' },
      { status: 400 }
    )
  }

  const validNames = AVAILABLE_TEMPLATES.map((t) => t.name)
  if (!validNames.includes(template)) {
    return NextResponse.json({ error: 'Template inválido' }, { status: 400 })
  }

  // Normaliza número (remove +, espaços, traços)
  const phoneClean = normalizeCarolPhone(phone)
  if (phoneClean.length < 10) {
    return NextResponse.json({ error: 'Número de telefone inválido' }, { status: 400 })
  }

  try {
    // Envia o template via WhatsApp API
    await sendWhatsAppTemplate(phoneClean, template, [nome])

    await registerOutboundSend({
      phone: phoneClean,
      template,
      nome,
      source: 'admin',
    })

    return NextResponse.json({
      success: true,
      message: `Template "${template}" enviado para +${phoneClean}`,
    })
  } catch (error) {
    console.error('[send-template] Erro:', error)
    const msg = error instanceof Error ? error.message : 'Erro desconhecido'
    return NextResponse.json({ error: msg }, { status: 500 })
  }
}

export async function GET(request: NextRequest) {
  const auth = await requireApiAuth(request, ['admin'])
  if (auth instanceof NextResponse) return auth

  return NextResponse.json({ templates: AVAILABLE_TEMPLATES })
}
