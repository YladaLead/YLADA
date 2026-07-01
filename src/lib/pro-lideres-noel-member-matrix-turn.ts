/**
 * Ramo membro do Noel unificado na matriz — acesso, prompt e resposta (sem geração de link).
 */
import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import type OpenAI from 'openai'
import type { SupabaseClient, User } from '@supabase/supabase-js'
import { applyNoelPersonaToSystemPrompt } from '@/lib/ylada-flow/noel/persona'
import { buildProLideresMemberNoelSystemPrompt } from '@/lib/pro-lideres-member-noel-prompt'
import {
  buildProLideresMemberNoelDailyTasksExcerpt,
  buildProLideresMemberNoelObjectionExcerpt,
  fetchProLideresMemberNoelObjection,
} from '@/lib/pro-lideres-member-noel-context'
import { buildProLideresMemberNoelCatalogExcerpt } from '@/lib/pro-lideres-member-noel-catalog'
import {
  buildProLideresMemberNoelCatalogHint,
  matchProLideresMemberNoelCatalog,
} from '@/lib/pro-lideres-member-noel-catalog-match'
import {
  classifyProLideresMemberNoelMessage,
  type ProLideresMemberNoelRoute,
} from '@/lib/pro-lideres-member-noel-router'
import { normalizeProLideresMemberNoelResponse } from '@/lib/pro-lideres-member-noel-response'
import {
  fetchProLideresMemberTabulatorName,
  normalizeNoelMemberOfferScope,
  proLideresMemberHasNoelMemberSubscription,
  proLideresNoelMemberUserInOfferScope,
} from '@/lib/pro-lideres-noel-member-access'
import { requireProLideresPaidContext } from '@/lib/pro-lideres-subscription-access'
import { NOEL_CHAT_MODEL } from '@/lib/pro-lideres-noel-unified-flag'
import type { ProLideresNoelMatrixSession } from '@/lib/pro-lideres-noel-context-block'
import {
  isNoelRecomendadorEnabled,
  construirCriterioMembro,
  recomendarParaNoel,
  buildRecomendacaoCuradaBlockMembro,
} from '@/lib/ylada-flow/recomendador/noel-wiring'
import type { LeaderTenantRow } from '@/types/leader-tenant'

export type ProLideresMemberMatrixTurn = {
  systemPrompt: string
  route: ProLideresMemberNoelRoute
  temperature: number
  maxTokens: number
}

type HistoryTurn = { role: string; content: string }

import { resolveProLideresNoelPublicBaseUrl } from '@/lib/pro-lideres-noel-public-base-url'

function replyLanguageLabel(locale: string | undefined): string {
  if (locale === 'en') return 'English'
  if (locale === 'es') return 'Español'
  return 'Português (Brasil)'
}

function operationLabelFromTenant(t: LeaderTenantRow): string {
  return t.display_name?.trim() || t.team_name?.trim() || t.slug || 'Pro Líderes'
}

/** Valida oferta + assinatura antes do chat membro na matriz. */
export async function assertProLideresMemberMatrixChatAccess(
  supabase: SupabaseClient,
  user: User,
  session: ProLideresNoelMatrixSession
): Promise<NextResponse | null> {
  const t = session.tenant
  if (!t.noel_member_offer_enabled) {
    return NextResponse.json(
      { error: 'O líder não disponibilizou o Noel para a equipe neste momento.' },
      { status: 403 }
    )
  }

  const paid = await requireProLideresPaidContext(supabase, user)
  if (!paid.ok) return paid.response

  if (session.tenantRole === 'leader') return null

  const scope = normalizeNoelMemberOfferScope(t.noel_member_offer_scope)
  const tabulatorName = await fetchProLideresMemberTabulatorName(supabase, t.id, user.id)
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
        error: 'Renove o Noel no painel para continuar o chat.',
        code: 'pro_lideres_noel_member_required',
      },
      { status: 402 }
    )
  }

  return null
}

export type BuildProLideresMemberMatrixTurnInput = {
  supabase: SupabaseClient
  user: User
  request: NextRequest
  message: string
  conversationHistory: HistoryTurn[]
  locale?: string
  session: ProLideresNoelMatrixSession
}

/** Monta prompt + router do membro (mesma lógica da rota dedicada, sem criar link). */
export async function buildProLideresMemberMatrixTurn(
  input: BuildProLideresMemberMatrixTurnInput
): Promise<ProLideresMemberMatrixTurn> {
  const t = input.session.tenant
  const baseUrl = resolveProLideresNoelPublicBaseUrl(input.request).replace(/\/$/, '')
  const message = input.message.trim()
  const historyNorm = input.conversationHistory
    .filter((h) => (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
    .map((h) => ({ role: h.role, content: h.content }))

  let catalogExcerpt: string | null = null
  let dailyTasksExcerpt: string | null = null
  let objectionExcerpt: string | null = null

  try {
    catalogExcerpt = await buildProLideresMemberNoelCatalogExcerpt(input.supabase, {
      tenant: t,
      memberUserId: input.user.id,
      baseUrl,
    })
  } catch (e) {
    console.warn('[pro-lideres-noel-member-matrix] catálogo', e)
  }

  try {
    dailyTasksExcerpt = await buildProLideresMemberNoelDailyTasksExcerpt(input.supabase, {
      tenant: t,
      role: input.session.tenantRole,
    })
  } catch (e) {
    console.warn('[pro-lideres-noel-member-matrix] tarefas', e)
  }

  const objectionProbe = [
    ...historyNorm.filter((h) => h.role === 'user').slice(-2).map((h) => h.content),
    message,
  ]
    .join(' ')
    .slice(-2500)

  try {
    const obj = await fetchProLideresMemberNoelObjection(objectionProbe)
    objectionExcerpt = buildProLideresMemberNoelObjectionExcerpt(obj)
  } catch (e) {
    console.warn('[pro-lideres-noel-member-matrix] objeção', e)
  }

  const tabulatorName = await fetchProLideresMemberTabulatorName(
    input.supabase,
    t.id,
    input.user.id
  )
  const priorUserTurns = historyNorm.filter((h) => h.role === 'user').length
  const route = classifyProLideresMemberNoelMessage(message, {
    hasObjectionBase: Boolean(objectionExcerpt),
  })
  const catalogMatches = matchProLideresMemberNoelCatalog(message, catalogExcerpt)
  const catalogHint = buildProLideresMemberNoelCatalogHint(catalogMatches)

  let systemPrompt = buildProLideresMemberNoelSystemPrompt({
    operationLabel: operationLabelFromTenant(t),
    verticalCode: (t.vertical_code ?? 'h-lider').trim() || 'h-lider',
    replyLanguage: replyLanguageLabel(input.locale),
    catalogExcerpt,
    tabulatorName,
    focusNotes: t.focus_notes?.trim() || null,
    dailyTasksExcerpt,
    objectionExcerpt,
    route,
    catalogHint,
    priorUserTurns,
  })

  if (isNoelRecomendadorEnabled()) {
    try {
      const rec = recomendarParaNoel(construirCriterioMembro({ message, audience: route.audience }))
      if (rec) systemPrompt += buildRecomendacaoCuradaBlockMembro(rec)
    } catch (e) {
      console.warn('[pro-lideres-noel-member-matrix] recomendador', e)
    }
  }

  systemPrompt += `\n\n[UNIFICAÇÃO MATRIZ]\nMotor unificado YLADA — **sem** criar link; só Meus Links.`

  return {
    systemPrompt,
    route,
    temperature: 0.55,
    maxTokens: 1600,
  }
}

export type HandleProLideresMemberMatrixChatInput = {
  openai: OpenAI
  turn: ProLideresMemberMatrixTurn
  message: string
  conversationHistory: HistoryTurn[]
  area: string
}

/** Executa o turno membro e devolve JSON `{ response }` — sem pipeline de link da matriz. */
export async function handleProLideresMemberMatrixChat(
  input: HandleProLideresMemberMatrixChatInput
): Promise<NextResponse> {
  const historyNorm = input.conversationHistory
    .filter((h) => (h.role === 'user' || h.role === 'assistant') && typeof h.content === 'string')
    .slice(-14)
    .map((h) => ({
      role: h.role as 'user' | 'assistant',
      content: h.content,
    }))

  const completion = await input.openai.chat.completions.create({
    model: NOEL_CHAT_MODEL,
    messages: [
      { role: 'system', content: applyNoelPersonaToSystemPrompt(input.turn.systemPrompt) },
      ...historyNorm,
      { role: 'user', content: input.message.trim() },
    ],
    temperature: input.turn.temperature,
    max_tokens: input.turn.maxTokens,
  })

  const raw = completion.choices[0]?.message?.content?.trim()
  if (!raw) {
    return NextResponse.json({ error: 'Resposta vazia do modelo' }, { status: 502 })
  }

  const text = normalizeProLideresMemberNoelResponse(raw, input.turn.route, input.message)
  return NextResponse.json({
    response: text,
    segment: input.area,
    area: input.area,
    lastLinkContext: null,
  })
}
