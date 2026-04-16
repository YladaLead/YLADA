import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  buildProLideresNoelSystemPrompt,
  resolveProLideresNoelProfileId,
} from '@/lib/pro-lideres-noel-prompt'
import { formatLinksAtivosParaNoel, getNoelYladaLinks } from '@/lib/noel-ylada-links'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function requestOrigin(request: NextRequest): string {
  try {
    return new URL(request.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://www.ylada.com'
  }
}

type HistoryTurn = { role?: string; content?: string }

/**
 * POST /api/pro-lideres/noel
 * Chat do mentor no painel Pro Líderes — **só o líder** do tenant (equipe usa scripts, sem Noel).
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

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

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

  const noelProfileId = resolveProLideresNoelProfileId(verticalCode)
  const baseUrl = requestOrigin(request)
  const linksRows = await getNoelYladaLinks(t.owner_user_id, baseUrl)
  const linksAtivosContext = linksRows.length ? formatLinksAtivosParaNoel(linksRows) : null

  const systemPrompt = buildProLideresNoelSystemPrompt({
    operationLabel,
    verticalCode,
    focusNotes: t.focus_notes?.trim() || null,
    role: ctx.role,
    replyLanguage,
    linksAtivosContext,
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
    return NextResponse.json({ response: text, noelProfileId })
  } catch (e) {
    console.error('[pro-lideres/noel]', e)
    return NextResponse.json({ error: 'Falha ao gerar resposta. Tente novamente.' }, { status: 502 })
  }
}
