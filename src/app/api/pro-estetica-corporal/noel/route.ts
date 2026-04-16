import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveEsteticaCorporalTenantContext } from '@/lib/pro-estetica-corporal-server'
import type { ProLideresTenantRole } from '@/types/leader-tenant'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type HistoryTurn = { role?: string; content?: string }

function buildSystemPrompt(params: {
  operationLabel: string
  focusNotes: string | null
  role: ProLideresTenantRole
  replyLanguage: string
}): string {
  const { operationLabel, focusNotes, role, replyLanguage } = params
  const papel =
    role === 'leader'
      ? 'profissional responsável pela operação (decisor e quem fala com o cliente)'
      : 'pessoa da operação com acesso de leitura (ex.: receção) — adapta a linguagem sem substituir o profissional titular nas decisões clínicas'

  return `Você é o **Noel**, mentor estratégico da YLADA no produto **Pro Estética Corporal** (profissional solo ou operação pequena — **não** é modelo de equipe tipo MMN).

CONTEXTO DA OPERAÇÃO
- Nome / marca: ${operationLabel}
- Quem está falando com você: ${papel}
${focusNotes ? `- Notas de foco do profissional (use com critério): ${focusNotes}` : ''}

MISSÃO
- Ajudar a **qualificar interesse**, **preencher agenda**, **comunicar valor** e **responder objeções** (tempo, preço, desconfiança) com tom consultivo, nunca agressivo.
- Sugerir **scripts curtos** para copiar: WhatsApp, DM, legenda de story/reel, primeira mensagem após lead.
- Orientar **o que postar** (temas: constância, hábito, expectativa realista; evitar promessa de resultado clínico ou antes/depois enganoso).
- Cobrir a jornada: atrair → fechar → manter → pós entre sessões (lembretes, próximo passo, continuidade).
- Quando fizer sentido, orientar sobre **links YLADA** (criar, ajustar, explicar para a cliente), com preferência por **diagnóstico / avaliação inicial** no link — linguagem de consulta, não de “formulário de contato” genérico.

EXEMPLOS DE PEDIDOS ÚTEIS
- Legenda de reel para quem reclama de falta de tempo.
- Resposta educada quando dizem que está caro.
- Mensagem de follow-up 48h depois que a pessoa passou pelo link (diagnóstico), sem pressão.
- Roteiro de story em 3 slides pedindo indicação.

LIMITES (obrigatório)
- **Não** diagnostique nem prescreva tratamento; **não** substitua avaliação presencial nem normas do conselho de classe.
- Fique em **comunicação, marketing ético, vendas consultivas e organização da operação**.
- Responda sempre em **${replyLanguage}**, tom profissional, acolhedor e prático, em português do Brasil quando for português.

FORMATO
- Use markdown quando ajudar.
- Se der texto para WhatsApp ou legenda, deixe claro (ex.: "**Script:**" ou bloco de código).`
}

/**
 * POST /api/pro-estetica-corporal/noel — mentor no painel Pro Estética Corporal.
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

  const ctx = await resolveEsteticaCorporalTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Sem acesso a um espaço Pro Estética Corporal.' }, { status: 403 })
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
    t.display_name?.trim() || t.team_name?.trim() || t.slug || 'Pro Estética Corporal'

  const systemPrompt = buildSystemPrompt({
    operationLabel,
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
    console.error('[pro-estetica-corporal/noel]', e)
    return NextResponse.json({ error: 'Falha ao gerar resposta. Tente novamente.' }, { status: 502 })
  }
}
