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
  FLUXO_PRESET_GANHAR_MASSA_MUSCULAR,
  proLideresNoelThreadMentionsMassaMuscular,
} from '@/lib/pro-lideres-noel-flow-preset-massa-muscular'
import {
  rewriteYladaQuizUrlsInMarkdownToCanonical,
  stripBareYladaPublicQuizUrlLines,
  stripMarkdownProLideresProximoPassoSection,
} from '@/lib/ylada-quiz-markdown-url-canonicalize'

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })

function requestOrigin(request: NextRequest): string {
  try {
    return new URL(request.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://www.ylada.com'
  }
}

type HistoryTurn = { role?: string; content?: string }

const MODO_EXECUTOR_LINK_PT = `[MODO EXECUTOR — LINK]
O sistema pode ter acabado de gerar um link real na conta YLADA deste líder (bloco [LINK GERADO…] ou [LINK AJUSTADO…] abaixo, se existir).
- Se existir esse bloco: responde só com introdução curta em português; não listes perguntas no texto; não coloques outro URL — o bloco **### Quiz e link (oficial)** no fim da resposta traz o link certo.
- Relembra: o link fica em **Links / Ferramentas** na matriz; a **equipe só vê no Catálogo** depois de **Disponibilizar à equipe** no chat ou ativar em **Catálogo → Minhas ferramentas**. **Não** inventes URL de caminhos **/l/…** no texto — só o anexo oficial/backend.`

const APROVACAO_CURTA_SEM_SEGUNDA_CONFIRMACAO_PT = `[APROVAÇÃO CURTA — JÁ É "SIM" DEFINITIVO]
A mensagem atual do líder é **aprovação curta** (gostei, ok, sim, aprovo, gera o link…) **logo após** o **rascunho** do quiz no histórico.
- **Proibido** pedir nova confirmação: "confirme que deseja prosseguir", "pode confirmar", "você gostaria de gerar o link", "só para confirmar", "posso criar o link agora?".
- Responda **de forma assertiva**: no máximo **2 frases curtas** — reconhecer a aprovação e dizer que o link está **gravado** / que o bloco **### Quiz e link (oficial)** (se existir nesta resposta) é a fonte de verdade; remeta aos **botões** do chat (copiar, abrir, publicar, equipe). **Sem** nova pergunta ao líder neste turno.`

const PEDIDO_SEM_GERACAO_PT = `[PEDIDO DE LINK SEM GERAÇÃO NESTE TURNO]
O líder pediu quiz/link/fluxo mas o backend **não** devolveu URL (tema insuficiente, limite de links, sessão sem permissão nas APIs Ylada, ou erro técnico).
- Não inventes URL nem digas que o link foi criado.
- Explica em 1–2 frases e sugere: tema explícito (ex.: "quiz para…"), ou criar em **Links / Ferramentas** na conta Ylada; depois o link aparece no **Catálogo** do Pro Líderes.
- Se a mensagem do líder foi só **aprovação curta** (**gostei**, **ok**, **concordo**) após o rascunho, pede **uma** vez **"gera o link"** ou que **cole de novo** o bloco do quiz — isso reforça o pedido para o sistema.
- Podes ainda entregar um **roteiro de perguntas** só em texto para usar já no WhatsApp, se fizer sentido.`

/**
 * POST /api/pro-lideres/noel
 * Chat do mentor no painel Pro Líderes — **só o líder** do tenant (equipe usa scripts, sem Noel).
 * Geração de link: mesmas APIs `/api/ylada/interpret` + `/api/ylada/links/generate` que a matriz (cookie da sessão).
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
  const operationLabel =
    t.display_name?.trim() || t.team_name?.trim() || t.slug || 'Pro Líderes'
  const verticalCode = (t.vertical_code ?? 'h-lider').trim() || 'h-lider'

  const noelProfileId = resolveProLideresNoelProfileId(verticalCode)
  const baseUrl = requestOrigin(request).replace(/\/$/, '')
  const painelTarefasDiariasUrl = `${baseUrl}/pro-lideres/painel/tarefas`
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
      console.warn('[pro-lideres/noel] visibilidade catálogo (novo/ajustado link):', e)
      lastLinkContextForResponse = lastLinkContextOut
    }
  }

  const extraSystemParts: string[] = []
  if (isProLideresNoelShortApprovalAfterQuizDraft(message, historyNorm)) {
    extraSystemParts.push(APROVACAO_CURTA_SEM_SEGUNDA_CONFIRMACAO_PT)
  }
  if (linkGeradoBlock) {
    extraSystemParts.push(MODO_EXECUTOR_LINK_PT)
    extraSystemParts.push(linkGeradoBlock)
  } else if (linkModeEnabled && shouldGenerateNewLink) {
    extraSystemParts.push(PEDIDO_SEM_GERACAO_PT)
  }

  const histBlob = [message, ...historyNorm.map((h) => h.content)].join('\n')
  const massaPresetAppendix = proLideresNoelThreadMentionsMassaMuscular(histBlob)
    ? `\n[REFERÊNCIA — exemplo «Ganhar massa muscular» (espelhe estrutura e tom quando o pedido for compatível)]\n${FLUXO_PRESET_GANHAR_MASSA_MUSCULAR}\n`
    : ''

  const systemPrompt =
    buildProLideresNoelSystemPrompt({
      operationLabel,
      verticalCode,
      focusNotes: t.focus_notes?.trim() || null,
      role: ctx.role,
      replyLanguage,
      linksAtivosContext,
      painelTarefasDiariasUrl,
    }) +
    massaPresetAppendix +
    extraSystemParts.join('\n')

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
      temperature: 0.52,
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
      /** Modelo pode já incluir «Quiz e link (oficial)» com URL errado — substituímos pelo bloco canónico do backend. */
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
          'O link **já foi gravado** na sua conta YLADA. Use os botões abaixo da mensagem (copiar, abrir, editar, catálogo, biblioteca, equipe).'
        text = `${intro}\n\n---\n\n${footer}`
      }
      text = rewriteYladaQuizUrlsInMarkdownToCanonical(text, lastLinkContextOut.url)
      text = stripBareYladaPublicQuizUrlLines(text, lastLinkContextOut.url)
      text = stripMarkdownProLideresProximoPassoSection(text)
    }

    return NextResponse.json({
      response: text,
      noelProfileId,
      lastLinkContext: lastLinkContextForResponse,
    })
  } catch (e) {
    console.error('[pro-lideres/noel]', e)
    return NextResponse.json({ error: 'Falha ao gerar resposta. Tente novamente.' }, { status: 502 })
  }
}
