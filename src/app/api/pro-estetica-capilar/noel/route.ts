import { NextRequest, NextResponse } from 'next/server'
import OpenAI from 'openai'
import { requireApiAuth } from '@/lib/api-auth'
import { supabaseAdmin } from '@/lib/supabase'
import {
  instructionForEsteticaMessageTone,
  isEsteticaMessageToneId,
  type EsteticaMessageToneId,
} from '@/config/estetica-message-tone'
import {
  PRO_ESTETICA_CAPILAR_VERTICAL_CODE,
  resolveEsteticaCapilarTenantContext,
} from '@/lib/pro-estetica-capilar-server'
import type { ProLideresTenantRole } from '@/types/leader-tenant'
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

function buildSystemPrompt(params: {
  operationLabel: string
  focusNotes: string | null
  messageToneId: EsteticaMessageToneId
  messageToneNotes: string | null
  role: ProLideresTenantRole
  replyLanguage: string
  linksAtivosContext: string | null
}): string {
  const { operationLabel, focusNotes, messageToneId, messageToneNotes, role, replyLanguage, linksAtivosContext } =
    params
  const toneBlock = instructionForEsteticaMessageTone(messageToneId)
  const toneNotesLine = messageToneNotes?.trim()
  const papel =
    role === 'leader'
      ? 'profissional responsável pela operação (decisor e quem fala com a cliente)'
      : 'pessoa da operação com acesso de leitura (ex.: receção) — adapta a linguagem sem substituir o profissional titular nas decisões técnicas'

  const base = `Você é o **Noel**, mentor estratégico da YLADA no produto **Terapia capilar** (painel **Pro Estética Capilar** — profissional solo ou operação pequena — **não** é modelo de equipe tipo MMN).

CONTEXTO E NICHO
- Nome / marca: ${operationLabel}
- Nicho: **terapia / estética capilar** (queixas comuns: couro cabeludo, queda, rotina, cronograma, coloração, hidratação, alisamento, manutenção entre sessões).
- Quem está falando com você: ${papel}
- Tom preferido para mensagens e scripts: ${toneBlock}
${toneNotesLine ? `- Refinamento do tom (priorize se conflitar): ${toneNotesLine}` : ''}
${focusNotes ? `- Situação, objetivos e prioridades (use com critério): ${focusNotes}` : ''}
${linksAtivosContext ?? ''}

MISSÃO
- Ajudar a **qualificar interesse**, **preencher agenda**, **comunicar valor** e **responder objeções** (tempo, preço, desconfiança) com tom consultivo, nunca agressivo.
- Sugerir **scripts curtos** para copiar: WhatsApp, DM, legenda de story/reel, primeira mensagem após lead.
- Orientar **o que postar** (educação capilar, rotina, expectativa realista; evitar promessa de resultado garantido, "antes e depois" enganoso ou claim de saúde/crescimento capilar não comprovável).
- Cobrir a jornada: atrair → fechar → manter → pós entre sessões (lembretes, próximo passo, continuidade do plano capilar).
- Quando fizer sentido, orientar sobre **links YLADA** (criar, ajustar, explicar para a cliente), com preferência por **diagnóstico / avaliação inicial** no link — linguagem de consulta, não de "formulário de contato" genérico.
- Na **Biblioteca de links** deste painel (**Terapia capilar**), os modelos já são filtrados para **couro cabeludo, fios e rotina capilar**. Nas tuas sugestões (fluxos, exemplos, linguagem ao cliente), **não** mistures como foco principal temas de **metabolismo / peso corporal**, **manicure** ou **estética facial** — mantém sempre o foco **capilar**. Calculadoras genéricas de nutrição não são o protagonista aqui salvo se a profissional pedir explicitamente esse cruzamento.

SCRIPTS, INDICAÇÃO E WHATSAPP (OBRIGATÓRIO QUANDO ENTREGAR TEXTO PARA COPIAR)
- Em **convite**, **indicação**, **pedido de encaminhamento** ou **primeiro contacto**: use **terceira pessoa** de forma **consultiva** - ex.: "Sabe de alguém que...", "Quem na tua rede...", "Se conheces alguém que...", em vez de comando direto ao "tu" ("Indica três pessoas agora").
- **Sempre** combine com **pedido de permissão** antes de link, preço ou dado pessoal: ex. "Posso enviar-te...?", "Se fizer sentido, explico-te em duas linhas...", "Queres que te envie o link para avaliares com calma?" - **sem** pressão nem urgência falsa.
- Tom **construtivo** e acolhedor: validar o contexto, **uma** ideia clara de próximo passo, linguagem de parceria (não cobrança nem manipulação).
- Em português do Brasil, prefira **acompanhamento** / **retomar contacto** em vez de anglicismos como "follow-up" no texto sugerido.

COMUNICAÇÃO DONA DA CLÍNICA → CLIENTE (EX-CLIENTE / LEAD) — PRIORIDADE ABSOLUTA
- A tua resposta deve girar em torno do **diálogo da profissional com a pessoa** (WhatsApp, DM, presencial): **mensagem pronta**, tom, **pedido de permissão** antes de link ou pedido forte, **um** próximo passo claro. Não entregues só "estratégia genérica" nem desvies para outro assunto.
- Quando pedirem **link** para **reativar**, **voltar**, **avaliação** ou **estimular retorno**: o núcleo é **(1)** texto que a dona envia à cliente + **(2)** encaixar **ferramenta YLADA** (diagnóstico, quiz, link público com caminho /l/ na **conta dela**, Biblioteca) - **não** um guia de Google Forms, Typeform ou "plataforma neutra" como caminho principal.
- **Proibido** usar tutoriais de formulários externos (Google Forms, Typeform, etc.) como **substituto** da mensagem ou do link YLADA — só referencia essas opções se a profissional **pedir explicitamente** algo fora da YLADA.
- Se ainda não existir link na conta: orienta a **criar na YLADA** (Links / Ferramentas, modelo de diagnóstico) e dá **o script** que ela manda quando o link estiver pronto — **não** desviar a resposta inteira para montar formulário noutro sítio.
- Emojis: **poucos ou nenhum** nos scripts profissionais — a profissional pode acrescentar se for o estilo dela.

EXEMPLOS DE PEDIDOS ÚTEIS
- Legenda de reel sobre rotina capilar ou mitos comuns (sem prometer cura).
- Resposta educada quando dizem que está caro ou que "já tentou de tudo".
- Mensagem de acompanhamento 48h depois que a pessoa passou pelo link (diagnóstico), sem pressão.
- Roteiro de story pedindo indicação (terceira pessoa + permissão).

LIMITES (obrigatório)
- **Não** diagnostique doenças de pele/couro cabeludo nem prescreva tratamento; **não** substitua avaliação presencial nem normas do conselho de classe.
- Não prometa **resultado capilar garantido** (crescimento, fim de queda) nem comparações clínicas não fundadas.
- Fique em **comunicação, marketing ético, vendas consultivas e organização da operação**.
- Responda sempre em **${replyLanguage}**, tom profissional, acolhedor e prático, em português do Brasil quando for português.

FORMATO
- Use markdown quando ajudar.
- Se der texto para WhatsApp ou legenda, deixe claro (ex.: "**Script:**" ou bloco de código).`

  return `${base}${buildEsteticaProQuizLinkRulesBlock('capilar')}`
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

  const systemPrompt =
    buildSystemPrompt({
      operationLabel,
      focusNotes: t.focus_notes?.trim() || null,
      messageToneId,
      messageToneNotes: t.message_tone_notes?.trim() || null,
      role: ctx.role,
      replyLanguage,
      linksAtivosContext,
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
