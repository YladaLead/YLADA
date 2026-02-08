/**
 * NOEL YLADA - API por segmento (rota/mercado: med, psi, odonto, nutra, coach)
 * POST /api/ylada/noel
 * Body: { message, conversationHistory?, segment?: string, area?: string }
 * Preferir segment; area mantido por compatibilidade. Contexto do Noel = segment (camada 2).
 * @see docs/TRES-CAMADAS-PRODUCT-SEGMENT-PROFESSION.md
 */
import { NextRequest, NextResponse } from 'next/server'
import { requireApiAuth } from '@/lib/api-auth'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'
import OpenAI from 'openai'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

const SEGMENT_CONTEXT: Record<string, string> = {
  med: 'Você é o Noel, mentor da YLADA para a área de Medicina. Oriente o profissional (médico ou especialista) sobre rotina, links inteligentes, diagnóstico e formação empresarial. Tom direto e prático.',
  psi: 'Você é o Noel, mentor da YLADA para a área de Psicologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  psicanalise: 'Você é o Noel, mentor da YLADA para a área de Psicanálise. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  odonto: 'Você é o Noel, mentor da YLADA para a área de Odontologia. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  nutra: 'Você é o Noel, mentor da YLADA para a área Nutra (vendedores de suplementos). Oriente sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
  coach: 'Você é o Noel, mentor da YLADA para a área de Coach. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.',
}

export async function POST(request: NextRequest) {
  try {
    const auth = await requireApiAuth(request, ['med', 'psi', 'psicanalise', 'odonto', 'nutra', 'coach', 'nutri', 'wellness', 'admin'])
    if (auth instanceof NextResponse) return auth
    const { user } = auth

    const body = await request.json()
    const { message, conversationHistory = [], segment, area = 'med' } = body as {
      message?: string
      conversationHistory?: { role: 'user' | 'assistant'; content: string }[]
      segment?: string
      area?: string
    }

    if (!message || typeof message !== 'string' || !message.trim()) {
      return NextResponse.json({ error: 'Mensagem é obrigatória.' }, { status: 400 })
    }

    const segmentKey = (segment ?? area) as string
    const validSegment = YLADA_SEGMENT_CODES.includes(segmentKey as any) ? segmentKey : 'med'
    const systemContent =
      SEGMENT_CONTEXT[validSegment] ||
      'Você é o Noel, mentor da YLADA. Oriente o profissional sobre rotina, links inteligentes e formação empresarial. Tom direto e prático.'

    const messages: OpenAI.Chat.ChatCompletionMessageParam[] = [
      { role: 'system', content: systemContent },
      ...conversationHistory.slice(-12).map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user', content: message.trim() },
    ]

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages,
      max_tokens: 1024,
      temperature: 0.7,
    })

    const responseText =
      completion.choices[0]?.message?.content?.trim() ||
      'Desculpe, não consegui processar. Tente novamente.'

    return NextResponse.json({
      response: responseText,
      segment: validSegment,
      area: validSegment,
    })
  } catch (error: unknown) {
    console.error('[/api/ylada/noel]', error)
    const message = error instanceof Error ? error.message : 'Erro ao processar mensagem.'
    return NextResponse.json(
      { error: message },
      { status: error instanceof Error && message.includes('Acesso negado') ? 403 : 500 }
    )
  }
}
