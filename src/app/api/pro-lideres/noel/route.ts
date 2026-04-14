import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type HistoryTurn = { role?: string; content?: string }

function buildSystemPrompt(params: {
  operationLabel: string
  verticalCode: string
  focusNotes: string | null
  role: ProLideresTenantRole
  replyLanguage: string
}): string {
  const { operationLabel, verticalCode, focusNotes, role, replyLanguage } = params
  const papel = role === 'leader' ? 'líder (dono do espaço)' : 'membro da equipe'

  return `És o **Noel**, mentor da YLADA no produto **Pro Líderes**.

CONTEXTO DA OPERAÇÃO
- Nome / operação: ${operationLabel}
- Código de vertical (ex. h-lider = Herbalife): ${verticalCode}
- Quem fala contigo é: ${papel}
${focusNotes ? `- Notas de foco do líder (usa com critério): ${focusNotes}` : ''}

MISSÃO
- Ajuda em **campo**: WhatsApp, primeiro contacto, pedir permissão antes de enviar link, explicar ferramentas YLADA (quizzes, calculadoras, links /l/…), recrutamento e vendas no tom consultivo.
- Preferência por **scripts curtos** prontos a copiar (podes usar bloco \`\`\` para a mensagem sugerida).
- Responde sempre em **${replyLanguage}**, com tom profissional, caloroso e prático.
- Não prometas rendimentos nem garantias ilegais; evita alegações de cura ou violar regras de marca — mantém-te em orientação de conversa e processo.

FORMATO
- Usa markdown quando ajudar (títulos curtos, listas).
- Se deres um script para WhatsApp, identifica claramente (ex.: "**Script:**" ou bloco de código).`
}

/**
 * POST /api/pro-lideres/noel
 * Chat do mentor no painel Pro Líderes — **só o líder** do tenant (equipa usa scripts, sem Noel).
 */
export async function POST(request: NextRequest) {
  const auth = await requireApiAuth(request)
  if (auth instanceof NextResponse) return auth
  const { user } = auth

  if (!process.env.OPENAI_API_KEY) {
    return NextResponse.json({ error: 'OpenAI não configurado' }, { status: 503 })
  }

  if (!supabaseAdmin) {
    return NextResponse.json({ error: 'Servidor sem service role' }, { status: 503 })
  }

  const ctx = await resolveProLideresTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Sem acesso a um espaço Pro Líderes.' }, { status: 403 })
  }
  if (ctx.role !== 'leader') {
    return NextResponse.json(
      { error: 'O mentor Noel neste espaço está disponível apenas para o líder. Usa Scripts e o catálogo partilhado.' },
      { status: 403 }
    )
  }

  let body: { message?: string; conversationHistory?: HistoryTurn[]; locale?: string }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const message = typeof body.message === 'string' ? body.message.trim() : ''
  if (!message) {
    return NextResponse.json({ error: 'Mensagem vazia' }, { status: 400 })
  }

  const history = Array.isArray(body.conversationHistory) ? body.conversationHistory : []
  const locale = typeof body.locale === 'string' ? body.locale : 'pt'
  const replyLanguage = locale === 'en' ? 'English' : 'Português (Brasil)'

  const t = ctx.tenant
  const operationLabel =
    t.display_name?.trim() || t.team_name?.trim() || t.slug || 'Pro Líderes'
  const verticalCode = (t.vertical_code ?? 'h-lider').trim() || 'h-lider'

  const systemPrompt = buildSystemPrompt({
    operationLabel,
    verticalCode,
    focusNotes: t.focus_notes?.trim() || null,
    role: ctx.role,
    replyLanguage,
  })

  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...history
      .filter((h) => (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
      .slice(-14)
      .map((h) => ({
        role: h.role as 'user' | 'assistant',
        content: h.content as string,
      })),
    { role: 'user', content: message },
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openaiMessages,
      temperature: 0.65,
      max_tokens: 1800,
    })
    const text = completion.choices[0]?.message?.content?.trim()
    if (!text) {
      return NextResponse.json({ error: 'Resposta vazia do modelo' }, { status: 502 })
    }
    return NextResponse.json({ response: text })
  } catch (e) {
    console.error('[pro-lideres/noel]', e)
    return NextResponse.json({ error: 'Falha ao gerar resposta. Tente novamente.' }, { status: 502 })
  }
}
