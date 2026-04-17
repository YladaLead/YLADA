/**
 * Geração de links YLADA a partir do Noel Pro Líderes (interpret + generate),
 * reutilizando as mesmas APIs que a matriz — o link fica em `ylada_links` do utilizador autenticado.
 */
import type { NextRequest } from 'next/server'
import { formatDisplayTitle } from '@/lib/ylada/strategic-intro'
import { YLADA_SEGMENT_CODES } from '@/config/ylada-areas'

type FormField = { id?: string; label?: string; type?: string; options?: string[] }

export type ProLideresNoelLastLinkContext = {
  flow_id: string
  interpretacao: Record<string, unknown>
  questions: Array<{ id: string; label: string; type?: string; options?: string[] }>
  url?: string
  title?: string
  link_id?: string
}

export function mapProLideresVerticalToYladaSegment(verticalCode: string): string {
  const v = verticalCode.trim().toLowerCase()
  if (v === 'h-lider' || v.startsWith('h-')) return 'nutra'
  const candidate = v.replace(/_/g, '-')
  if (YLADA_SEGMENT_CODES.includes(candidate as (typeof YLADA_SEGMENT_CODES)[number])) return candidate
  return 'ylada'
}

function extractRequestedTitleFromMessage(message: string): string | null {
  const raw = (message || '').trim()
  if (!raw) return null
  const cleaned = raw.replace(/\s+/g, ' ')
  const match =
    cleaned.match(/(?:diagn[oó]stico|quiz|calculadora)\s+para\s+(.+)$/i) ||
    cleaned.match(/(?:quero|cria|criar|gera|gerar)\s+(?:um|uma)?\s*(?:diagn[oó]stico|quiz|calculadora)\s+de\s+(.+)$/i) ||
    cleaned.match(/(?:quero|cria|criar|gera|gerar)\s+(?:um|uma)?\s*(?:diagn[oó]stico|quiz|calculadora)\s+para\s+(.+)$/i)
  const candidate = (match?.[1] ?? '').trim().replace(/[.!?]+$/, '')
  if (!candidate || candidate.length < 4) return null
  return candidate.slice(0, 140)
}

function buildLinkBlock(
  title: string,
  flowId: string,
  url: string,
  config: Record<string, unknown> | null
): { descResumida: string; conteudoReal: string } {
  const form = config?.form as { fields?: FormField[] } | undefined
  const fields = Array.isArray(form?.fields) ? form.fields : []
  const firstWithOptions = fields.find((f) => Array.isArray(f.options) && f.options.length > 0)
  const isCalculadora = flowId === 'calculadora_projecao'

  let descResumida: string
  let conteudoReal = ''

  if (isCalculadora) {
    descResumida = `Criei a calculadora "${title}". Você vai atrair quem gosta de ver números e cenários possíveis.`
  } else if (firstWithOptions) {
    const themePart = title.includes(' — ') ? title.split(' — ').slice(1).join(' — ').trim() : title
    const quizName = themePart || title
    descResumida = `Criei o quiz "${quizName}". Você vai atrair pessoas que buscam isso.`
    conteudoReal = fields
      .map((f, i) => {
        const options = Array.isArray(f.options) && f.options.length > 0 ? f.options! : []
        const optsBlock = options.map((opt, j) => `${String.fromCharCode(65 + j)}) ${opt}`).join('\n')
        const pergunta = `**${i + 1}. ${f.label ?? ''}**`
        return optsBlock ? `${pergunta}\n${optsBlock}\n` : `${pergunta}\n`
      })
      .join('\n\n')
  } else {
    const themePart = title.includes(' — ') ? title.split(' — ').slice(1).join(' — ').trim() : title
    const linkName = themePart || title
    descResumida = `Criei o quiz "${linkName}". Você vai atrair pessoas que buscam isso.`
  }

  return { descResumida, conteudoReal }
}

export function buildCanonicalQuizMarkdownForProLideresResponse(
  title: string,
  url: string,
  flowId: string,
  config: Record<string, unknown> | null
): string {
  const { conteudoReal } = buildLinkBlock(title, flowId, url, config)
  const lines: string[] = []
  lines.push('### Quiz e link (oficial — igual ao link público e à edição)')
  lines.push('')
  if (conteudoReal.trim()) {
    lines.push(conteudoReal.trim())
    lines.push('')
  }
  lines.push(`[Acesse seu quiz](${url})`)
  return lines.join('\n')
}

function buildNoelLinkBlock(
  title: string,
  url: string,
  descResumida: string,
  conteudoReal: string,
  modo: 'novo' | 'ajustado'
): string {
  const tituloBloco = modo === 'novo' ? 'LINK GERADO AGORA PARA ESTE PEDIDO' : 'LINK AJUSTADO E GERADO'
  const intro =
    modo === 'novo'
      ? 'O sistema acabou de criar um link para o profissional.'
      : 'O sistema criou um novo link com as alterações pedidas.'

  let block = `\n[${tituloBloco}]\n${intro}\n\n⚠️ CRÍTICO: O texto "[${tituloBloco}]" é APENAS uma marcação interna para o sistema. NUNCA inclua isso na resposta ao líder.\n\n🚨 O sistema ANEXARÁ automaticamente ao final da sua mensagem um bloco **### Quiz e link (oficial)** com as perguntas exatas e o link — a mesma fonte do link público e da tela "Editar perguntas".\n\nSUA RESPOSTA AO LÍDER DEVE SER SÓ:\n- Introdução breve e natural (3–6 frases): parabenize, diga o tema, que o quiz está pronto e que abaixo (no bloco oficial) estão as perguntas iguais ao que o cliente verá.\n- Opcional: **título** em uma linha (ex.: **Diagnóstico rápido — [tema]**).\n- Uma frase de valor (ex.: qualificar leads, conversa no WhatsApp).\n- NÃO liste perguntas nem opções A/B no texto — isso gera divergência com o link real.\n- NÃO inclua link markdown [texto](url) na sua resposta — o bloco oficial já trará o único link correto.\n- NÃO escreva "Copiar link" nem "Clique aqui para acessar" soltos.\n\nREFERÊNCIA INTERNA (não copie na resposta — só para você saber o tema):\n${conteudoReal || '(calculadora ou fluxo sem lista de opções)'}\n\nLink que será anexado pelo sistema: ${url}\n\nDICA: Convide o líder a rolar até **Quiz e link (oficial)** para testar e copiar o link. Lembre que o link fica na conta YLADA dele e pode ser partilhado com a equipa no **Catálogo** do Pro Líderes (visibilidade).`

  if (modo === 'ajustado') {
    block += '\nSe for ajuste: pode dizer brevemente "Pronto" ou "Concluído" antes do link.'
  }

  return block
}

function isIntencaoAjustarLink(message: string): boolean {
  const m = message.toLowerCase().trim()
  const termos = [
    'não gostei', 'nao gostei', 'troca', 'trocar', 'acrescenta', 'acrescentar', 'adiciona', 'adicionar',
    'muda', 'mudar', 'ajusta', 'ajustar', 'altera', 'alterar', 'modifica', 'modificar',
    'essa pergunta', 'a pergunta', 'as perguntas', 'inclui', 'incluir', 'coloca', 'colocar',
    'tira', 'remover', 'tirar', 'substitui', 'substituir', 'em vez de', 'no lugar de',
    'quinta pergunta', 'quarta pergunta', 'mais uma pergunta', 'outra pergunta', 'uma pergunta a mais',
  ]
  return termos.some((t) => m.includes(t))
}

function isExplicitNoLinkRequest(message: string): boolean {
  const m = message.toLowerCase().trim()
  return /sem criar link|sem link|sem diagnóstico|sem diagnostico|só direção|so direcao|só direcao|apenas direção|apenas direcao|só script|apenas script|não gere link|nao gere link|não gerar link|nao gerar link|sem quiz|sem fluxo|apenas responda sem link/.test(
    m
  )
}

function isIntencaoCriarLink(
  message: string,
  conversationHistory?: Array<{ role: string; content: string }>
): boolean {
  const m = message.toLowerCase().trim()
  const termos = [
    'quero um link', 'quero uma calculadora', 'quero um quiz', 'quero uma ferramenta',
    'preciso de um link', 'preciso de uma calculadora', 'preciso de um quiz', 'preciso de uma ferramenta',
    'criar um link', 'criar uma calculadora', 'criar um quiz', 'gerar um link', 'gerar um quiz',
    'ferramenta para', 'link para', 'quiz para', 'calculadora para',
    'atrair pacientes', 'atrair clientes', 'conteúdo para o paciente', 'tema da minha especialidade',
    'qualificar quem quer agendar', 'quanto está deixando de faturar', 'mostrar valor',
    'para engajar', 'para captar', 'para meus clientes', 'para meus pacientes',
    'despertar curiosidade', 'link que atrai',
    'quero captar', 'captar pacientes', 'captar clientes', 'quero atrair',
    'emagrecimento', 'para emagrecimento', 'pacientes para emagrecer',
    'intestino', 'energia', 'ansiedade', 'bem-estar', 'suplementação',
    'me ajuda a criar', 'me dá um', 'me faz um', 'cria um', 'cria uma',
    'criar esse fluxo', 'esse fluxo para mim', 'cria esse fluxo', 'criar o fluxo',
    'meu link',
    'e meu link',
    'quero o link',
    'gera o link',
    'gera um link',
    'gerar o link',
    'gerar um link',
    'cria o link',
    'cria um link',
    'me dá o link', 'me entrega o link', 'cadê o link', 'onde está o link', 'entregar o link',
    'criar o link', 'link desse', 'link desse diagnóstico', 'link desse quiz', 'link do diagnóstico',
    'pode criar esse', 'pode gerar o link', 'gera esse link',
    'tizerpatide', 'tirzepatida', 'ozempic', 'wegovy', 'mounjaro', 'zepbound', 'semaglutida', 'liraglutida',
    'formulário', 'formulario', 'questionário', 'questionario', 'montar um formul', 'criar um formul',
    'pesquisa com pergunt', 'lista de pergunt',
  ]
  if (termos.some((t) => m.includes(t))) return true

  const lastAssistant =
    conversationHistory?.filter((h) => h.role === 'assistant').pop()?.content?.toLowerCase() ?? ''
  const perguntouCriar =
    lastAssistant.includes('quer que eu crie') ||
    lastAssistant.includes('quero criar') ||
    lastAssistant.includes('criar um link') ||
    lastAssistant.includes('criar um diagnóstico') ||
    lastAssistant.includes('qual tema')
  const pareceConfirmacao = /^sim[\s,]|^sim\s/i.test(m) || (m.startsWith('sim') && m.length > 4)
  if (perguntouCriar && pareceConfirmacao) {
    const rest = m.replace(/^sim[\s,]+/i, '').trim()
    if (rest.length >= 3) return true
  }
  return false
}

function isIntencaoRecuperarLinkExistente(message: string): boolean {
  const m = message.toLowerCase().trim()
  return /link do último|link do ultimo|último diagnóstico|ultimo diagnostico|link para compartilhar|me dá o link|me de o link|cadê o link|cade o link|onde está o link|onde esta o link/.test(
    m
  )
}

type NoelResponseMode = 'modo_link' | 'modo_mentor' | 'modo_copy' | 'modo_execucao'

function classifyNoelResponseMode(
  message: string,
  conversationHistory?: Array<{ role: string; content: string }>
): NoelResponseMode {
  const m = message.toLowerCase().trim()
  if (isExplicitNoLinkRequest(m)) {
    if (/script|mensagem|copy|cta|story|legenda|tom|follow[- ]?up/.test(m)) return 'modo_copy'
    if (/ação|acao|executa|execute|tarefa|métrica|metrica|hoje|amanhã|amanha|próximo passo|proximo passo/.test(m)) {
      return 'modo_execucao'
    }
    return 'modo_mentor'
  }

  if (isIntencaoCriarLink(message, conversationHistory) || isIntencaoAjustarLink(message)) {
    return 'modo_link'
  }

  if (/script|mensagem|copy|cta|story|legenda|humaniza|menos vendedor|tom/.test(m)) return 'modo_copy'
  if (/ação|acao|executa|execute|tarefa|métrica|metrica|hoje|amanhã|amanha|próximo passo|proximo passo/.test(m)) {
    return 'modo_execucao'
  }
  return 'modo_mentor'
}

function shouldBlockAutoLinkForClientFollowUp(message: string): boolean {
  const m = message.toLowerCase().trim()
  const falaDeCarteira =
    /(?:minha|uma|para uma|para minha)?\s*(cliente|paciente)|retorno|follow[- ]?up|pós[- ]?proced|reagendar|sumiu|já fez|ja fez|carteira/.test(
      m
    )
  const pediuScript = /script|mensagem|whatsapp|texto para enviar/.test(m)
  const negouCaptacao = /sem falar em atrair|sem captar|não captar|nao captar|não prospectar|nao prospectar/.test(m)
  const pediuLinkExplito =
    /quero (o )?link|me dá o link|me de o link|gera (o )?link|cria (o )?link|quiz|diagnóstico|diagnostico|calculadora/.test(
      m
    )
  return falaDeCarteira && (pediuScript || negouCaptacao) && !pediuLinkExplito
}

function requestOrigin(request: NextRequest): string {
  try {
    return new URL(request.url).origin
  } catch {
    return process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, '') || 'https://www.ylada.com'
  }
}

export async function runProLideresNoelLinkPipeline(params: {
  request: NextRequest
  message: string
  conversationHistory: Array<{ role: string; content: string }>
  locale?: string
  verticalCode: string
  ownerUserId: string
  sessionUserId: string
  lastLinkContext?: ProLideresNoelLastLinkContext | null
}): Promise<{
  linkGeradoBlock: string
  lastLinkContextOut?: ProLideresNoelLastLinkContext
  canonicalAppendix: {
    title: string
    url: string
    flowId: string
    config: Record<string, unknown> | null
  } | null
  yladaSegment: string
  linkModeEnabled: boolean
  shouldGenerateNewLink: boolean
}> {
  const {
    request,
    message,
    conversationHistory,
    locale: localeRaw,
    verticalCode,
    ownerUserId,
    sessionUserId,
    lastLinkContext,
  } = params

  const yladaSegment = mapProLideresVerticalToYladaSegment(verticalCode)
  const locale = localeRaw === 'en' || localeRaw === 'es' ? localeRaw : undefined
  const baseUrl = requestOrigin(request)
  const cookie = request.headers.get('cookie') || ''

  const linkModeEnabled = classifyNoelResponseMode(message, conversationHistory) === 'modo_link'
  const retrieveExistingLinkIntent = isIntencaoRecuperarLinkExistente(message)
  const shouldGenerateNewLink =
    linkModeEnabled && isIntencaoCriarLink(message, conversationHistory) && !retrieveExistingLinkIntent
  const blockAutoLinkForClientFollowUp = shouldBlockAutoLinkForClientFollowUp(message)

  let linkGeradoBlock = ''
  let lastLinkContextOut: ProLideresNoelLastLinkContext | undefined
  let canonicalAppendix: {
    title: string
    url: string
    flowId: string
    config: Record<string, unknown> | null
  } | null = null

  if (sessionUserId !== ownerUserId) {
    return {
      linkGeradoBlock: '',
      lastLinkContextOut: undefined,
      canonicalAppendix: null,
      yladaSegment,
      linkModeEnabled,
      /** Só o dono do tenant pode gravar links na conta YLADA via estas APIs. */
      shouldGenerateNewLink: false,
    }
  }

  if (!linkModeEnabled || blockAutoLinkForClientFollowUp) {
    return {
      linkGeradoBlock: '',
      lastLinkContextOut: undefined,
      canonicalAppendix: null,
      yladaSegment,
      linkModeEnabled,
      shouldGenerateNewLink,
    }
  }

  const requestedTitle = extractRequestedTitleFromMessage(message)

  // Ajuste em link criado na conversa anterior
  if (
    linkModeEnabled &&
    lastLinkContext?.flow_id &&
    lastLinkContext?.interpretacao &&
    isIntencaoAjustarLink(message)
  ) {
    try {
      const interpretRes = await fetch(`${baseUrl}/api/ylada/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify({
          text: message.trim(),
          segment: yladaSegment,
          previousLinkContext: {
            flow_id: lastLinkContext.flow_id,
            theme: (lastLinkContext.interpretacao as { tema?: string })?.tema ?? '',
            questions: lastLinkContext.questions ?? [],
          },
          ...(locale && { locale }),
        }),
      })
      const interpretJson = await interpretRes.json().catch(() => ({}))
      const data = interpretJson?.data
      const flowId = data?.flow_id
      const interpretacao = data?.interpretacao
      const questions = Array.isArray(data?.questions) ? data.questions : lastLinkContext.questions
      const confidence = typeof data?.confidence === 'number' ? data.confidence : 0.8

      if (flowId && interpretacao && confidence >= 0.5) {
        const genRes = await fetch(`${baseUrl}/api/ylada/links/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            cookie,
            'x-ylada-public-origin': baseUrl,
          },
          body: JSON.stringify({
            flow_id: flowId,
            interpretacao,
            questions: questions.length > 0 ? questions : undefined,
            title: requestedTitle ?? undefined,
            segment: yladaSegment,
            ...(locale && { locale }),
          }),
        })
        const genJson = await genRes.json().catch(() => ({}))
        if (genJson?.success && genJson?.data?.url) {
          const titleRaw = genJson.data.title || genJson.data.slug || 'Link'
          const title = formatDisplayTitle(titleRaw)
          lastLinkContextOut = {
            flow_id: flowId,
            interpretacao,
            questions,
            url: genJson.data.url,
            title,
            link_id: genJson.data.id,
          }
          canonicalAppendix = {
            title,
            url: genJson.data.url,
            flowId,
            config: (genJson.data.config as Record<string, unknown> | undefined) ?? null,
          }
          const { descResumida, conteudoReal } = buildLinkBlock(title, flowId, genJson.data.url, genJson.data.config ?? null)
          linkGeradoBlock = buildNoelLinkBlock(title, genJson.data.url, descResumida, conteudoReal, 'ajustado')
        }
      }
    } catch (e) {
      console.warn('[pro-lideres/noel] ajuste interpret/generate:', e)
    }
  }

  // Novo link (Pro Líderes: tenta mesmo sem perfil Noel completo — interpret usa contexto mínimo)
  if (!linkGeradoBlock && shouldGenerateNewLink) {
    try {
      const interpretRes = await fetch(`${baseUrl}/api/ylada/interpret`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', cookie },
        body: JSON.stringify({
          text: message.trim(),
          segment: yladaSegment,
          ...(locale && { locale }),
        }),
      })
      const interpretJson = await interpretRes.json().catch(() => ({}))
      const data = interpretJson?.data
      const flowId = data?.flow_id
      const interpretacao = data?.interpretacao
      const questions = Array.isArray(data?.questions) ? data.questions : []
      const confidence = typeof data?.confidence === 'number' ? data.confidence : 0

      if (flowId && interpretacao && confidence >= 0.5) {
        const genRes = await fetch(`${baseUrl}/api/ylada/links/generate`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            cookie,
            'x-ylada-public-origin': baseUrl,
          },
          body: JSON.stringify({
            flow_id: flowId,
            interpretacao,
            questions: questions.length > 0 ? questions : undefined,
            title: requestedTitle ?? undefined,
            segment: yladaSegment,
            ...(locale && { locale }),
          }),
        })
        const genJson = await genRes.json().catch(() => ({}))
        if (genJson?.success && genJson?.data?.url) {
          const titleRaw = genJson.data.title || genJson.data.slug || 'Link'
          const title = formatDisplayTitle(titleRaw)
          lastLinkContextOut = {
            flow_id: flowId,
            interpretacao,
            questions,
            url: genJson.data.url,
            title,
            link_id: genJson.data.id,
          }
          canonicalAppendix = {
            title,
            url: genJson.data.url,
            flowId,
            config: (genJson.data.config as Record<string, unknown> | undefined) ?? null,
          }
          const { descResumida, conteudoReal } = buildLinkBlock(title, flowId, genJson.data.url, genJson.data.config ?? null)
          linkGeradoBlock = buildNoelLinkBlock(title, genJson.data.url, descResumida, conteudoReal, 'novo')
        }
      }
    } catch (e) {
      console.warn('[pro-lideres/noel] interpret/generate:', e)
    }
  }

  return {
    linkGeradoBlock,
    lastLinkContextOut,
    canonicalAppendix,
    yladaSegment,
    linkModeEnabled,
    shouldGenerateNewLink,
  }
}
