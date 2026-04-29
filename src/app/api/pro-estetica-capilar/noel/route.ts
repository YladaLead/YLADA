import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import { isEsteticaMessageToneId, type EsteticaMessageToneId } from '@/config/estetica-message-tone'
import {
  PRO_ESTETICA_CAPILAR_VERTICAL_CODE,
  resolveEsteticaCapilarTenantContext,
} from '@/lib/pro-estetica-capilar-server'
import { formatLinksAtivosParaNoel, getNoelYladaLinks } from '@/lib/noel-ylada-links'
import {
  buildCanonicalQuizMarkdownForProLideresResponse,
  isProLideresNoelShortApprovalAfterQuizDraft,
  runProLideresNoelLinkPipeline,
  type ProLideresNoelLastLinkContext,
} from '@/lib/pro-lideres-noel-link-generation'
import {
  hideProLideresYladaLinkFromTeamCatalog,
  isProLideresYladaLinkVisibleToTeamInCatalog,
} from '@/lib/pro-lideres-ylada-catalog-team-visibility'
import {
  sanitizeProLideresQuizMarkdownToCanonicalUrl,
  stripMarkdownProLideresProximoPassoSection,
} from '@/lib/ylada-quiz-markdown-url-canonicalize'
import { buildCapilarNoelSystemPromptBody } from '@/lib/pro-estetica-capilar-noel-system-prompt'
import {
  buildEsteticaProQuizLinkRulesBlock,
  ESTETICA_NOEL_APROVACAO_CURTA_PT,
  ESTETICA_NOEL_MODO_EXECUTOR_LINK_PT,
  ESTETICA_NOEL_PEDIDO_SEM_GERACAO_PT,
} from '@/lib/pro-estetica-noel-link-system-blocks'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

type HistoryTurn = { role?: string; content?: string }

function requestOrigin(request: NextRequest): string {
  try {
    return new URL(request.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://www.ylada.com'
  }
}

/**
 * POST /api/pro-estetica-capilar/noel — mentor no painel Pro Estética Capilar (chat + geração de links como na matriz).
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

  const ctx = await resolveEsteticaCapilarTenantContext(supabaseAdmin, user)
  if (!ctx) {
    return NextResponse.json({ error: 'Sem acesso ao espaço Terapia capilar.' }, { status: 403 })
  }

  let body: {
    message?: string
    conversationHistory?: HistoryTurn[]
    locale?: string
    lastLinkContext?: ProLideresNoelLastLinkContext | null
  }
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

  const t = ctx.tenant
  const operationLabel = t.display_name?.trim() || t.team_name?.trim() || t.slug || 'Terapia capilar'
  const verticalCode = (t.vertical_code ?? PRO_ESTETICA_CAPILAR_VERTICAL_CODE).trim() || PRO_ESTETICA_CAPILAR_VERTICAL_CODE

  const messageToneId: EsteticaMessageToneId = isEsteticaMessageToneId(t.message_tone)
    ? t.message_tone
    : 'profissional'

  const baseUrl = requestOrigin(request).replace(/\/$/, '')
  const linksRows = await getNoelYladaLinks(t.owner_user_id, baseUrl)
  const linksAtivosContext = linksRows.length ? formatLinksAtivosParaNoel(linksRows) : null

  const lastLinkContext =
    body.lastLinkContext &&
    typeof body.lastLinkContext === 'object' &&
    typeof body.lastLinkContext.flow_id === 'string'
      ? body.lastLinkContext
      : null

  const pipeline = await runProLideresNoelLinkPipeline({
    request,
    message,
    conversationHistory: historyNorm,
    locale,
    verticalCode,
    ownerUserId: t.owner_user_id,
    sessionUserId: user.id,
    lastLinkContext,
  })

  const { linkGeradoBlock, lastLinkContextOut, canonicalAppendix, linkModeEnabled, shouldGenerateNewLink } =
    pipeline

  let lastLinkContextForResponse: ProLideresNoelLastLinkContext | null = lastLinkContextOut ?? null
  if (lastLinkContextOut?.link_id) {
    try {
      await hideProLideresYladaLinkFromTeamCatalog(supabaseAdmin, ctx.tenant.id, lastLinkContextOut.link_id)
      const vis = await isProLideresYladaLinkVisibleToTeamInCatalog(
        supabaseAdmin,
        ctx.tenant.id,
        lastLinkContextOut.link_id
      )
      lastLinkContextForResponse = { ...lastLinkContextOut, visible_to_team_in_catalog: vis }
    } catch (e) {
      console.warn('[pro-estetica-capilar/noel] visibilidade catálogo:', e)
      lastLinkContextForResponse = lastLinkContextOut
    }
  }

  const extraSystemParts: string[] = []
  if (isProLideresNoelShortApprovalAfterQuizDraft(message, historyNorm)) {
    extraSystemParts.push(ESTETICA_NOEL_APROVACAO_CURTA_PT)
  }
  if (linkGeradoBlock) {
    extraSystemParts.push(ESTETICA_NOEL_MODO_EXECUTOR_LINK_PT)
    extraSystemParts.push(linkGeradoBlock)
  } else if (linkModeEnabled && shouldGenerateNewLink) {
    extraSystemParts.push(ESTETICA_NOEL_PEDIDO_SEM_GERACAO_PT)
  }

  const systemPromptBody = buildCapilarNoelSystemPromptBody({
    operationLabel,
    focusNotes: t.focus_notes?.trim() || null,
    messageToneId,
    messageToneNotes: t.message_tone_notes?.trim() || null,
    role: ctx.role,
    replyLanguage,
    linksAtivosContext,
  })
  const systemPrompt = `${systemPromptBody}${buildEsteticaProQuizLinkRulesBlock('capilar')}${extraSystemParts.join('\n')}`

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
      temperature: 0.58,
      max_tokens: 1800,
    })
    let text = completion.choices[0]?.message?.content?.trim()
    if (!text) {
      return NextResponse.json({ error: 'Resposta vazia do modelo' }, { status: 502 })
    }

    text = text.replace(/\[LINK GERADO AGORA[^\]]*\]/gi, '')
    text = text.replace(/\[LINK AJUSTADO[^\]]*\]/gi, '')
    text = text.replace(/\[LINK GERADO AGORA PARA ESTE PEDIDO\]/gi, '')
    text = text.replace(/\[LINK AJUSTADO E GERADO\]/gi, '')
    text = text.replace(/^\s*\[LINK GERADO AGORA[^\]]*\]\s*$/gim, '')
    text = text.replace(/^\s*\[LINK AJUSTADO[^\]]*\]\s*$/gim, '')
    text = text.replace(/\n{3,}/g, '\n\n')

    if (linkModeEnabled && canonicalAppendix && lastLinkContextOut?.url) {
      const footer = buildCanonicalQuizMarkdownForProLideresResponse(
        canonicalAppendix.title,
        canonicalAppendix.url,
        canonicalAppendix.flowId,
        canonicalAppendix.config
      )
      const officialHeading = /(^|\n)(\*{0,2}#{1,3}\s*quiz\s+e\s+link\s*\(oficial[^\n]*)/i
      const headingMatch = text.match(officialHeading)
      if (headingMatch && headingMatch.index !== undefined) {
        const cut = headingMatch.index
        const shortApproval = isProLideresNoelShortApprovalAfterQuizDraft(message, historyNorm)
        const prefix = shortApproval
          ? 'Combinado — o link já está gravado na sua conta YLADA.'
          : text.slice(0, cut).trimEnd()
        text = `${prefix}\n\n${footer}`
      } else {
        const intro =
          'O link **já foi gravado** na sua conta YLADA. Use os botões abaixo da mensagem (copiar, abrir, editar, catálogo, disponibilizar à equipe).'
        text = `${intro}\n\n---\n\n${footer}`
      }
    }

    if (lastLinkContextForResponse?.url?.trim()) {
      text = sanitizeProLideresQuizMarkdownToCanonicalUrl(text, lastLinkContextForResponse.url)
      text = stripMarkdownProLideresProximoPassoSection(text)
    }

    return NextResponse.json({
      response: text,
      lastLinkContext: lastLinkContextForResponse,
    })
  } catch (e) {
    console.error('[pro-estetica-capilar/noel]', e)
    return NextResponse.json({ error: 'Falha ao gerar resposta. Tente novamente.' }, { status: 502 })
  }
}
