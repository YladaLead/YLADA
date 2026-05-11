import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { resolveProLideresTenantContext } from '@/lib/pro-lideres-server'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import {
  buildProLideresMemberNoelSystemPrompt,
} from '@/lib/pro-lideres-member-noel-prompt'
import { buildProLideresMemberNoelCatalogExcerpt } from '@/lib/pro-lideres-member-noel-catalog'
import {
  fetchProLideresMemberTabulatorName,
  proLideresMemberHasNoelMemberSubscription,
  proLideresNoelMemberUserInOfferScope,
  normalizeNoelMemberOfferScope,
} from '@/lib/pro-lideres-noel-member-access'
import type { LeaderTenantRow } from '@/types/leader-tenant'

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
 * POST /api/pro-lideres/membro/noel
 * Noel membro para a equipe (add-on `pro_lideres_noel_member` + oferta do líder).
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

  const t = ctx.tenant as LeaderTenantRow
  if (!t.noel_member_offer_enabled) {
    return NextResponse.json(
      { error: 'O líder não disponibilizou o Noel para a equipe neste momento.' },
      { status: 403 }
    )
  }

  const isLeader = ctx.role === 'leader'
  const isMember = ctx.role === 'member'

  if (!isLeader && !isMember) {
    return NextResponse.json({ error: 'Este Noel é só para membros da equipe ou para gestão do espaço.' }, { status: 403 })
  }

  const paid = await requireProLideresPaidContext(supabaseAdmin, user)
  if (!paid.ok) return paid.response

  const scope = normalizeNoelMemberOfferScope(t.noel_member_offer_scope)
  const tabulatorName = await fetchProLideresMemberTabulatorName(supabaseAdmin, t.id, user.id)

  if (isMember) {
    if (!proLideresNoelMemberUserInOfferScope({ offerScope: scope, tabulatorName })) {
      return NextResponse.json(
        {
          error:
            'Neste espaço o Noel está limitado a quem tem tabulador cadastrado e o seu perfil não tem tabulador associado.',
        },
        { status: 403 }
      )
    }

    const hasSub = await proLideresMemberHasNoelMemberSubscription(user.id)
    if (!hasSub) {
      return NextResponse.json(
        {
          error:
            'Ative a assinatura Noel membro Pro Líderes (Mercado Pago) na área do membro para continuar.',
          code: 'pro_lideres_noel_member_required',
        },
        { status: 402 }
      )
    }
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
  const historyNorm = history
    .filter((h) => (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
    .map((h) => ({ role: h.role as string, content: h.content as string }))

  const locale = typeof body.locale === 'string' ? body.locale : 'pt'
  const replyLanguage = locale === 'en' ? 'English' : 'Português (Brasil)'

  const operationLabel =
    t.display_name?.trim() || t.team_name?.trim() || t.slug || 'Pro Líderes'
  const verticalCode = (t.vertical_code ?? 'h-lider').trim() || 'h-lider'
  const baseUrl = requestOrigin(request).replace(/\/$/, '')

  let catalogExcerpt: string | null = null
  try {
    catalogExcerpt = await buildProLideresMemberNoelCatalogExcerpt(supabaseAdmin, {
      tenant: t,
      memberUserId: user.id,
      baseUrl,
    })
  } catch (e) {
    console.warn('[pro-lideres/membro/noel] catálogo', e)
  }

  const systemPrompt = buildProLideresMemberNoelSystemPrompt({
    operationLabel,
    verticalCode,
    replyLanguage,
    catalogExcerpt,
    tabulatorName,
  })

  const openaiMessages: OpenAI.Chat.ChatCompletionMessageParam[] = [
    { role: 'system', content: systemPrompt },
    ...historyNorm.slice(-14).map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    })),
    { role: 'user', content: message },
  ]

  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: openaiMessages,
      temperature: 0.45,
      max_tokens: 1400,
    })
    const text = completion.choices[0]?.message?.content?.trim()
    if (!text) {
      return NextResponse.json({ error: 'Resposta vazia do modelo' }, { status: 502 })
    }
    return NextResponse.json({
      response: text,
      noelProfileId: 'noel_pro_lideres_member_field_v1',
      lastLinkContext: null,
    })
  } catch (e) {
    console.error('[pro-lideres/membro/noel]', e)
    return NextResponse.json({ error: 'Falha ao gerar resposta. Tente novamente.' }, { status: 502 })
  }
}
