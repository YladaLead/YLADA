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
  runProLideresNoelLinkPipeline,
  type ProLideresNoelLastLinkContext,
} from '@/lib/pro-lideres-noel-link-generation'

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
- Relembra que o link entra na biblioteca de links do líder e pode ser partilhado com a equipa no **Painel Pro Líderes → Catálogo** (visibilidade).`

const PEDIDO_SEM_GERACAO_PT = `[PEDIDO DE LINK SEM GERAÇÃO NESTE TURNO]
O líder pediu quiz/link/fluxo mas o backend **não** devolveu URL (tema insuficiente, limite de links, sessão sem permissão nas APIs Ylada, ou erro técnico).
- Não inventes URL nem digas que o link foi criado.
- Explica em 1–2 frases e sugere: tema explícito (ex.: "quiz para…"), ou criar em **Links / Ferramentas** na conta Ylada; depois o link aparece no **Catálogo** do Pro Líderes.
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

  const extraSystemParts: string[] = []
  if (linkGeradoBlock) {
    extraSystemParts.push(MODO_EXECUTOR_LINK_PT)
    extraSystemParts.push(linkGeradoBlock)
  } else if (linkModeEnabled && shouldGenerateNewLink) {
    extraSystemParts.push(PEDIDO_SEM_GERACAO_PT)
  }

  const systemPrompt =
    buildProLideresNoelSystemPrompt({
      operationLabel,
      verticalCode,
      focusNotes: t.focus_notes?.trim() || null,
      role: ctx.role,
      replyLanguage,
      linksAtivosContext,
      painelTarefasDiariasUrl,
    }) + extraSystemParts.join('\n')

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
      const marker = '### Quiz e link (oficial'
      if (!text.includes(marker)) {
        const intro = [
          'Perfeito — o diagnóstico/link **já foi gravado** na sua conta YLADA (**Links / Ferramentas** na matriz).',
          '',
          '**Sugestão de próximos passos para você:**',
          '1. **Revisar** título e perguntas (*Editar perguntas* / *Editar na Ylada* abaixo da mensagem, ou na matriz). Quando aparecerem, os botões **Links na Ylada** e **Links no painel** abrem a lista na matriz e a visão no Pro Líderes.',
          '2. **Abrir** o link público ou usar **Copiar link público** (um botão só abaixo da mensagem) para testar como o contato vê o fluxo.',
          '3. No **Pro Líderes → Catálogo de ferramentas**, liberar o fluxo para a equipe (é onde o time vê o que você ativa), conforme a política da operação.',
          '4. Se quiser mudanças de texto ou de foco, **escreva neste chat** — o Noel continua como co-editor até você fechar a versão.',
          '',
          'Abaixo está o bloco **Quiz e link (oficial)** com as perguntas alinhadas ao link público e à edição.',
        ].join('\n')
        const footer = buildCanonicalQuizMarkdownForProLideresResponse(
          canonicalAppendix.title,
          canonicalAppendix.url,
          canonicalAppendix.flowId,
          canonicalAppendix.config
        )
        text = `${intro}\n\n---\n\n${footer}`
      }
    }

    return NextResponse.json({
      response: text,
      noelProfileId,
      lastLinkContext: lastLinkContextOut ?? null,
    })
  } catch (e) {
    console.error('[pro-lideres/noel]', e)
    return NextResponse.json({ error: 'Falha ao gerar resposta. Tente novamente.' }, { status: 502 })
  }
}
