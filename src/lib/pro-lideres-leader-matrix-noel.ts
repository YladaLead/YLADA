/**
 * Ramo líder do Noel unificado na matriz (`/api/ylada/noel` + papel=leader).
 * Reutiliza pipeline de links e pós-processamento do `/api/pro-lideres/noel`.
 */
import type { NextRequest } from 'next/server'
import type { SupabaseClient } from '@supabase/supabase-js'
import { sanitizeNoelAssistantOutput } from '@/lib/noel-output-sanitize'
import { polishNoelAssistantMarkdownForChat } from '@/lib/noel-assistant-markdown-format'
import {
  isNoelProLideresLeaderConducaoEnabled,
  isProLideresLeaderConversationalQuery,
  leaderConversationalSystemHint,
  normalizeLeaderFluxoDraftPreview,
} from '@/lib/pro-lideres-noel-leader-conducao'
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
import type { LeaderTenantRow } from '@/types/leader-tenant'

const MODO_EXECUTOR_LINK_PT = `[MODO EXECUTOR — LINK]
O sistema pode ter acabado de gerar um link real na conta YLADA deste líder (bloco [LINK GERADO…] ou [LINK AJUSTADO…] abaixo, se existir).
- Se existir esse bloco: responde só com introdução curta em português; não listes perguntas no texto; não coloques outro URL — o bloco **### Quiz e link (oficial)** no fim da resposta traz o link certo.
- Relembra: o link fica em **Links / Ferramentas** na matriz; a **equipe só vê em Meus links** no painel depois de **Disponibilizar à equipe** no chat ou ao ativar a visibilidade em **Meus links**. **Não** inventes URL de caminhos **/l/…** no texto — só o anexo oficial/backend.`

const APROVACAO_CURTA_SEM_SEGUNDA_CONFIRMACAO_PT = `[APROVAÇÃO CURTA — JÁ É "SIM" DEFINITIVO]
A mensagem atual do líder é **aprovação curta** (gostei, ok, sim, aprovo, gera o link…) **logo após** o **rascunho** do quiz no histórico.
- **Proibido** pedir nova confirmação: "confirme que deseja prosseguir", "pode confirmar", "você gostaria de gerar o link", "só para confirmar", "posso criar o link agora?".
- Responda **de forma assertiva**: no máximo **2 frases curtas** — reconhecer a aprovação e dizer que o link está **gravado** / que o bloco **### Quiz e link (oficial)** (se existir nesta resposta) é a fonte de verdade; remeta aos **botões** do chat (copiar, abrir, publicar, equipe, biblioteca). **Sem** nova pergunta ao líder neste turno.`

const PEDIDO_SEM_GERACAO_PT = `[PEDIDO DE LINK SEM GERAÇÃO NESTE TURNO]
O líder pediu quiz/link/fluxo mas o backend **não** devolveu URL (tema insuficiente, limite de links, sessão sem permissão nas APIs Ylada, ou erro técnico).
- Não inventes URL nem digas que o link foi criado.
- Explica em 1–2 frases e sugere: tema explícito (ex.: "quiz para…"), ou criar em **Links / Ferramentas** na conta Ylada; depois o link aparece no **Catálogo** do Pro Líderes.
- Se a mensagem do líder foi só **aprovação curta** (**gostei**, **ok**, **concordo**) após o rascunho, pede **uma** vez **"gera o link"** ou que **cole de novo** o bloco do quiz — isso reforça o pedido para o sistema.
- Podes ainda entregar um **roteiro de perguntas** só em texto para usar já no WhatsApp, se fizer sentido.`

export type ProLideresLeaderMatrixLinkTurn = {
  linkGeradoBlock: string
  lastLinkContextOut?: ProLideresNoelLastLinkContext
  lastLinkContextForResponse: ProLideresNoelLastLinkContext | null
  canonicalAppendix: {
    title: string
    url: string
    flowId: string
    config: Record<string, unknown> | null
  } | null
  yladaSegment: string
  linkModeEnabled: boolean
  shouldGenerateNewLink: boolean
}

/** Pipeline PL + visibilidade no catálogo da equipe. */
export async function runProLideresLeaderMatrixLinkTurn(params: {
  request: NextRequest
  message: string
  conversationHistory: Array<{ role: string; content: string }>
  locale?: string
  tenant: LeaderTenantRow
  sessionUserId: string
  supabase: SupabaseClient
  lastLinkContext?: ProLideresNoelLastLinkContext | null
}): Promise<ProLideresLeaderMatrixLinkTurn> {
  const verticalCode = (params.tenant.vertical_code ?? 'h-lider').trim() || 'h-lider'
  const pipeline = await runProLideresNoelLinkPipeline({
    request: params.request,
    message: params.message,
    conversationHistory: params.conversationHistory,
    locale: params.locale,
    verticalCode,
    ownerUserId: params.tenant.owner_user_id,
    sessionUserId: params.sessionUserId,
    lastLinkContext: params.lastLinkContext,
  })

  let lastLinkContextForResponse: ProLideresNoelLastLinkContext | null =
    pipeline.lastLinkContextOut ?? null

  if (pipeline.lastLinkContextOut?.link_id) {
    try {
      await hideProLideresYladaLinkFromTeamCatalog(
        params.supabase,
        params.tenant.id,
        pipeline.lastLinkContextOut.link_id
      )
      const vis = await isProLideresYladaLinkVisibleToTeamInCatalog(
        params.supabase,
        params.tenant.id,
        pipeline.lastLinkContextOut.link_id
      )
      lastLinkContextForResponse = {
        ...pipeline.lastLinkContextOut,
        visible_to_team_in_catalog: vis,
      }
    } catch (e) {
      console.warn('[pro-lideres-leader-matrix-noel] visibilidade catálogo:', e)
      lastLinkContextForResponse = pipeline.lastLinkContextOut
    }
  }

  return {
    linkGeradoBlock: pipeline.linkGeradoBlock,
    lastLinkContextOut: pipeline.lastLinkContextOut,
    lastLinkContextForResponse,
    canonicalAppendix: pipeline.canonicalAppendix,
    yladaSegment: pipeline.yladaSegment,
    linkModeEnabled: pipeline.linkModeEnabled,
    shouldGenerateNewLink: pipeline.shouldGenerateNewLink,
  }
}

/** Instruções extras no system prompt do líder unificado (paridade com `/api/pro-lideres/noel`). */
export function buildProLideresLeaderMatrixSystemExtras(params: {
  message: string
  conversationHistory: Array<{ role: string; content: string }>
  linkGeradoBlock: string
  linkModeEnabled: boolean
  shouldGenerateNewLink: boolean
}): string[] {
  const extras: string[] = []
  if (isProLideresLeaderConversationalQuery(params.message)) {
    extras.push(leaderConversationalSystemHint())
  }
  if (isProLideresNoelShortApprovalAfterQuizDraft(params.message, params.conversationHistory)) {
    extras.push(APROVACAO_CURTA_SEM_SEGUNDA_CONFIRMACAO_PT)
  }
  if (params.linkGeradoBlock) {
    extras.push(MODO_EXECUTOR_LINK_PT)
    extras.push(params.linkGeradoBlock)
  } else if (params.linkModeEnabled && params.shouldGenerateNewLink) {
    extras.push(PEDIDO_SEM_GERACAO_PT)
  }
  return extras
}

/** Anexa bloco oficial PL ou aplica polish conversacional (sem link). */
export function finalizeProLideresLeaderMatrixAssistantText(params: {
  text: string
  message: string
  conversationHistory: Array<{ role: string; content: string }>
  linkModeEnabled: boolean
  canonicalAppendix: ProLideresLeaderMatrixLinkTurn['canonicalAppendix']
  lastLinkContextForResponse: ProLideresNoelLastLinkContext | null
}): string {
  let text = params.text

  if (params.linkModeEnabled && params.canonicalAppendix && params.lastLinkContextForResponse?.url) {
    const footer = buildCanonicalQuizMarkdownForProLideresResponse(
      params.canonicalAppendix.title,
      params.canonicalAppendix.url,
      params.canonicalAppendix.flowId,
      params.canonicalAppendix.config
    )
    const officialHeading = /(^|\n)(\*{0,2}#{1,3}\s*quiz\s+e\s+link\s*\(oficial[^\n]*)/i
    const headingMatch = text.match(officialHeading)
    if (headingMatch && headingMatch.index !== undefined) {
      const cut = headingMatch.index
      const shortApproval = isProLideresNoelShortApprovalAfterQuizDraft(
        params.message,
        params.conversationHistory
      )
      const prefix = shortApproval
        ? 'Combinado — o link já está gravado na sua conta YLADA.'
        : text.slice(0, cut).trimEnd()
      text = `${prefix}\n\n${footer}`
    } else {
      const intro =
        'O link **já foi gravado** na sua conta YLADA. Use os botões abaixo da mensagem (copiar, abrir, editar, catálogo, biblioteca, equipe).'
      text = `${intro}\n\n---\n\n${footer}`
    }
  } else {
    text = polishNoelAssistantMarkdownForChat(text)
  }

  if (params.lastLinkContextForResponse?.url?.trim()) {
    text = sanitizeProLideresQuizMarkdownToCanonicalUrl(text, params.lastLinkContextForResponse.url)
    text = stripMarkdownProLideresProximoPassoSection(text)
  }

  if (isNoelProLideresLeaderConducaoEnabled()) {
    text = normalizeLeaderFluxoDraftPreview(text)
  }

  return sanitizeNoelAssistantOutput(text)
}
