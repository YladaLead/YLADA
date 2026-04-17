import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { buildProLideresNoelLabAgentSystemPrompt } from '@/lib/pro-lideres-noel-lab-agent-prompt'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type TranscriptTurn = { from?: string; text?: string }

/**
 * POST /api/pro-lideres/noel-lab/agent
 * Gera a **próxima** mensagem do presidente simulado (laboratório de testes ao Noel).
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
  if (!ctx || ctx.role !== 'leader') {
    return NextResponse.json({ error: 'Laboratório disponível apenas para o líder do espaço.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  let body: { scenarioId?: string; transcript?: TranscriptTurn[] }
  try {
    body = await request.json()
  } catch {
    return NextResponse.json({ error: 'JSON inválido' }, { status: 400 })
  }

  const scenarioId = typeof body.scenarioId === 'string' ? body.scenarioId.trim() || 'geral' : 'geral'
  const transcript = Array.isArray(body.transcript) ? body.transcript : []

  const t = ctx.tenant
  const operationLabel =
    t.display_name?.trim() || t.team_name?.trim() || t.slug || 'Pro Líderes'
  const verticalCode = (t.vertical_code ?? 'h-lider').trim() || 'h-lider'

  const lines = transcript
    .filter((x) => x && typeof x.text === 'string' && x.text.trim())
    .map((x) => {
      const from =
        x.from === 'noel'
          ? 'Noel'
          : x.from === 'leader'
            ? 'Líder (mensagem manual — testador)'
            : 'Presidente (simulado)'
      return `${from}: ${String(x.text).trim()}`
    })
    .join('\n\n')

  const userContent =
    (lines
      ? `Transcrição até agora:\n\n${lines}\n\n`
      : 'Ainda não há mensagens na sessão de teste.\n\n') +
    'Escreva APENAS a próxima mensagem do presidente (uma pergunta ou pedido curto). Sem prefixos de papel, sem aspas em volta de tudo, sem título. Português do Brasil.'

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: buildProLideresNoelLabAgentSystemPrompt({
            scenarioId,
            operationLabel,
            verticalCode,
          }),
        },
        { role: 'user', content: userContent },
      ],
      temperature: 0.88,
      max_tokens: 500,
    })
    const question = completion.choices[0]?.message?.content?.trim()
    if (!question) {
      return NextResponse.json({ error: 'Resposta vazia do agente' }, { status: 502 })
    }
    return NextResponse.json({ question, scenarioId })
  } catch (e) {
    console.error('[pro-lideres/noel-lab/agent]', e)
    return NextResponse.json({ error: 'Falha ao gerar pergunta do agente.' }, { status: 502 })
  }
}
