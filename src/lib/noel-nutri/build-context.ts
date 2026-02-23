/**
 * Noel Nutri — Arquitetura consolidada.
 * Backend decide: intenção, estado, prioridade_calculada, links_ativos.
 * Modelo só executa: transforma prioridade_calculada em FOCO / AÇÃO / ONDE / MÉTRICA.
 * URLs: mesmo padrão da área Captar, via url-utils (buildNutriToolUrl / buildNutriQuizUrl).
 */

import { supabaseAdmin } from '@/lib/supabase'
import { buildNutriToolUrl, buildNutriQuizUrl } from '@/lib/url-utils'

/** Nome que a nutricionista vê em Ferramentas/Captar (evita siglas como DSVS solto). */
const NOME_AMIGAVEL_POR_TEMPLATE: Record<string, string> = {
  'calc-hidratacao': 'Calculadora de Água',
  'calc-proteina': 'Calculadora de Proteína',
  'calc-imc': 'Calculadora de IMC',
  'calc-calorias': 'Calculadora de Calorias',
  'quiz-dsvs': 'Quiz',
  'quiz-ganhos': 'Quiz Ganhos',
  'quiz-potencial': 'Quiz Potencial',
  'quiz-interativo': 'Quiz Interativo'
}

/** Tags/objetivo por template para ranking (emagrecimento → quiz; água → calculadora de água). */
const TAGS_POR_TEMPLATE: Record<string, string[]> = {
  'calc-hidratacao': ['agua', 'hidratacao', 'água', 'hidratação'],
  'calc-proteina': ['proteina', 'proteína', 'proteínas'],
  'calc-imc': ['imc', 'peso'],
  'calc-calorias': ['calorias'],
  'quiz-dsvs': ['emagrecimento', 'emagrecer', 'nutricao'],
  'quiz-ganhos': ['emagrecimento', 'ganhos'],
  'quiz-potencial': ['emagrecimento', 'potencial'],
  'quiz-interativo': ['emagrecimento', 'interativo']
}
import { detectarIntencaoNutri, type IntencaoNutri } from './detect-intencao'

export type { IntencaoNutri }

/** Link com nome, tipo, URL e tags para ranking por objetivo (emagrecimento, água, etc.). */
export type LinkAtivo = { nome: string; tipo: string; url: string; tags?: string[] }

/** Formato definitivo do contexto enviado ao Noel (4.1-mini só executa isso). */
export interface ContextoNoelDefinitivo {
  area: string
  intencao: IntencaoNutri
  estado: {
    meta_semanal: number
    conversas_esta_semana: number
    tem_leads_pendentes: boolean
    tem_links_ativos: boolean
  }
  prioridade_calculada: string
  links_ativos: LinkAtivo[]
  /** true = pergunta é "qual meu link?" → responder direto com o link, manter 4 blocos. */
  lookup_de_link?: boolean
  /** Texto pronto [Nome](URL) para colar em ONDE APLICAR e AÇÃO — evita modelo escrever só o nome. */
  link_sugerido_onde_aplicar?: string
  /** true = lead pediu link de tema que não existe (ex.: quiz endometriose); não sugerir link; dizer para criar em Ferramentas. */
  nao_sugerir_link_especifico?: boolean
  modo_resposta: 'executivo'
}

/** Base URL: em prod nunca localhost. NEXT_PUBLIC_SITE_URL > NEXT_PUBLIC_APP_URL > prod default (ylada.com). */
function getBaseUrl(): string {
  const site = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL
  if (site && !site.includes('localhost')) return site.replace(/\/$/, '')
  if (process.env.NODE_ENV === 'production') return 'https://www.ylada.com'
  return process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
}

/** Detecta pergunta explícita de "qual é meu link X?" → responder lookup sem puxar só captação. */
function isLookupDeLink(mensagem: string): boolean {
  if (!mensagem || typeof mensagem !== 'string') return false
  const t = mensagem.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim()
  const padroes = [
    'qual meu link', 'qual o link', 'qual link', 'qual e meu link', 'qual é meu link',
    'link do meu quiz', 'link do quiz', 'link da calculadora', 'link da ferramenta',
    'meu link para', 'link para enviar', 'qual url', 'qual o link do', 'link do '
  ]
  return padroes.some(p => t.includes(p))
}

/** Extrai tema pedido em "quiz de X", "link do X", etc. Retorna null se não for pedido específico. */
function extrairTemaPedidoLink(mensagem: string): string | null {
  if (!mensagem || typeof mensagem !== 'string') return null
  const t = mensagem.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim()
  const match = t.match(/(?:quiz|link|calculadora)\s+(?:de|do|da)\s+([a-záàâãéêíóôõúç\s]{2,40})/i)
  if (!match) return null
  return match[1].trim().replace(/\s+/g, ' ') || null
}

/** Temas genéricos: não tratar como "pedido de link inexistente" (ex.: "meu quiz" = só quer o link do quiz). */
const TEMAS_GENERICOS = new Set([
  'meu quiz', 'minha quiz', 'meu link', 'minha link', 'quiz', 'link', 'calculadora', 'ferramenta',
  'minha calculadora', 'minha ferramenta', 'meu', 'minha', 'o quiz', 'a calculadora', 'a ferramenta'
])

/** true se o usuário pediu link de um tema ESPECÍFICO que não existe (ex.: quiz de endometriose). Não ativar para "qual link do meu quiz?". */
function pediuLinkInexistente(mensagem: string, links: LinkAtivo[]): boolean {
  const tema = extrairTemaPedidoLink(mensagem)
  if (!tema || links.length === 0) return false
  const temaNorm = tema.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '').trim()
  if (temaNorm.length < 4) return false
  if (TEMAS_GENERICOS.has(temaNorm)) return false
  const algumMatch = links.some(l => {
    const nomeNorm = (l.nome || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    const tagsNorm = (l.tags || []).map(t => t.toLowerCase().normalize('NFD').replace(/\p{M}/gu, ''))
    return nomeNorm.includes(temaNorm) || temaNorm.includes(nomeNorm) || tagsNorm.some(tag => tag.includes(temaNorm) || temaNorm.includes(tag))
  })
  return !algumMatch
}

export interface NoelNutriContextResult {
  contextBlock: string
  /** Contexto estruturado (para log/debug). */
  contexto: ContextoNoelDefinitivo
}

/** Resultado da função compartilhada de links (usado pelo build-context e pelo GET /api/nutri/noel/links). */
export interface NoelNutriLinksResult {
  links: LinkAtivo[]
  linkPrincipal: { nome: string; url: string; markdown: string } | null
}

/**
 * Retorna apenas a lista de links ativos e o link principal (primeiro da ordenação).
 * Usado por buildNoelNutriContext e por GET /api/nutri/noel/links.
 */
export async function getNoelNutriLinks(
  userId: string,
  userMessage?: string
): Promise<NoelNutriLinksResult> {
  if (!supabaseAdmin) return { links: [], linkPrincipal: null }

  const baseUrl = getBaseUrl()

  let catalogNomeBySlug: Record<string, string> = {}
  try {
    const { data: catalogTemplates } = await supabaseAdmin
      .from('templates_nutrition')
      .select('slug, name')
      .eq('is_active', true)
      .eq('language', 'pt')
      .limit(100)
    ;(catalogTemplates || []).forEach((row: { slug?: string; name?: string }) => {
      if (row.slug && row.name) catalogNomeBySlug[row.slug] = row.name.trim()
    })
  } catch {
    catalogNomeBySlug = {}
  }

  const [profileSlugResult, toolsResult, quizzesResult] = await Promise.all([
    supabaseAdmin.from('user_profiles').select('user_slug').eq('user_id', userId).maybeSingle(),
    supabaseAdmin
      .from('user_templates')
      .select('id, title, slug, template_slug')
      .eq('user_id', userId)
      .eq('profession', 'nutri')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(15),
    supabaseAdmin
      .from('quizzes')
      .select('id, titulo, slug')
      .eq('user_id', userId)
      .eq('profession', 'nutri')
      .eq('status', 'active')
      .order('created_at', { ascending: false })
      .limit(10)
  ])

  const userSlug = profileSlugResult.data?.user_slug ?? null
  const links: LinkAtivo[] = []

  if (userSlug) {
    ;(toolsResult.data || []).forEach((t: { title?: string; slug?: string; template_slug?: string }) => {
      if (t.slug) {
        const tituloReal = (t.title || '').trim()
        const slugBase = t.slug.replace(/-\d+$/, '')
        const nomeDoCatalogo = catalogNomeBySlug[t.slug] || catalogNomeBySlug[slugBase]
        const nomeAmigavel =
          tituloReal ||
          nomeDoCatalogo ||
          (t.template_slug && NOME_AMIGAVEL_POR_TEMPLATE[t.template_slug]) ||
          'Ferramenta'
        const tags = (t.template_slug && TAGS_POR_TEMPLATE[t.template_slug]) || []
        links.push({
          nome: nomeAmigavel,
          tipo: (t.template_slug && (t.template_slug.startsWith('quiz-') ? 'quiz' : t.template_slug.startsWith('calc-') ? 'calculadora' : 'ferramenta')) || 'ferramenta',
          url: buildNutriToolUrl(userSlug, t.slug, baseUrl),
          tags: tags.length ? tags : undefined
        })
      }
    })
    ;(quizzesResult.data || []).forEach((q: { titulo?: string; slug?: string }) => {
      if (q.slug) {
        const slugBase = q.slug.replace(/-\d+$/, '')
        const nomeAmigavel = (NOME_AMIGAVEL_POR_TEMPLATE[slugBase] || (q.titulo || 'Quiz').trim()) as string
        const tituloNorm = (q.titulo || '').toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
        const tagsQuiz: string[] = []
        if (/emagrec|agua|hidrat|proteina|intestino|caloria|imc/.test(tituloNorm)) {
          if (/agua|hidrat/.test(tituloNorm)) tagsQuiz.push('agua', 'hidratacao')
          if (/emagrec/.test(tituloNorm)) tagsQuiz.push('emagrecimento')
          if (/proteina/.test(tituloNorm)) tagsQuiz.push('proteina')
          if (/intestino/.test(tituloNorm)) tagsQuiz.push('intestino')
          if (/caloria/.test(tituloNorm)) tagsQuiz.push('calorias')
          if (/imc/.test(tituloNorm)) tagsQuiz.push('imc')
        }
        if (tagsQuiz.length === 0) tagsQuiz.push('emagrecimento')
        links.push({
          nome: nomeAmigavel,
          tipo: 'quiz',
          url: buildNutriQuizUrl(userSlug, q.slug, baseUrl),
          tags: tagsQuiz
        })
      }
    })
  }

  const ordemTipo: Record<string, number> = { quiz: 0, calculadora: 1, ferramenta: 2 }
  if (userMessage && userMessage.trim()) {
    const msgNorm = userMessage.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
    const palavras = ['emagrecimento', 'emagrecer', 'agua', 'água', 'hidratacao', 'hidratação', 'proteina', 'proteína', 'intestino', 'caloria', 'imc']
    const palavrasNaPergunta = palavras.filter(p => msgNorm.includes(p))
    if (palavrasNaPergunta.length > 0) {
      links.sort((a, b) => {
        const aMatch = (a.tags || []).some(tag => palavrasNaPergunta.some(p => tag.includes(p) || p.includes(tag)))
        const bMatch = (b.tags || []).some(tag => palavrasNaPergunta.some(p => tag.includes(p) || p.includes(tag)))
        if (aMatch !== bMatch) return aMatch ? -1 : 1
        return (ordemTipo[a.tipo] ?? 2) - (ordemTipo[b.tipo] ?? 2)
      })
    } else {
      links.sort((a, b) => (ordemTipo[a.tipo] ?? 2) - (ordemTipo[b.tipo] ?? 2))
    }
  } else {
    links.sort((a, b) => (ordemTipo[a.tipo] ?? 2) - (ordemTipo[b.tipo] ?? 2))
  }

  const primeiro = links.length > 0 ? links[0] : null
  const linkPrincipal = primeiro
    ? { nome: primeiro.nome, url: primeiro.url, markdown: `[${primeiro.nome}](${primeiro.url})` }
    : null

  return { links, linkPrincipal }
}

function getInicioFimSemana(): { inicio: string; fim: string } {
  const hoje = new Date()
  hoje.setHours(0, 0, 0, 0)
  const diasDesdeSegunda = (hoje.getDay() + 6) % 7
  const inicioSemana = new Date(hoje)
  inicioSemana.setDate(hoje.getDate() - diasDesdeSegunda)
  inicioSemana.setHours(0, 0, 0, 0)
  const fimSemana = new Date(inicioSemana)
  fimSemana.setDate(inicioSemana.getDate() + 6)
  fimSemana.setHours(23, 59, 59, 999)
  return { inicio: inicioSemana.toISOString(), fim: fimSemana.toISOString() }
}

/** Prioridade de captação quando atrás da meta (reutilizada pela regra disciplinadora). */
function prioridadeCaptacao(estado: { meta_semanal: number; conversas_esta_semana: number }): string {
  const { meta_semanal, conversas_esta_semana } = estado
  if (conversas_esta_semana === 0) return 'Ativar primeira conversa da semana'
  const faltam = meta_semanal - conversas_esta_semana
  return faltam === 1 ? 'Ativar mais 1 conversa esta semana' : `Ativar mais ${faltam} conversas esta semana`
}

/**
 * Calcula a prioridade em uma única string. Backend decide; modelo só formata.
 * Regra disciplinadora: atrás da meta → prioridade = captação, exceto:
 * - conversão com leads pendentes (mantém fechamento);
 * - lookup de link ("qual meu link?") → responde direto com o link, sem puxar só captação.
 */
function calcularPrioridade(
  intencao: IntencaoNutri,
  estado: { meta_semanal: number; conversas_esta_semana: number; tem_leads_pendentes: boolean; tem_links_ativos: boolean },
  jornadaIniciada: boolean,
  lookupDeLink: boolean
): string {
  const { meta_semanal, conversas_esta_semana, tem_leads_pendentes } = estado

  if (!jornadaIniciada) {
    return 'Conduzir Dia 1 da Jornada'
  }

  // Lookup de link: entregar o link solicitado e sugerir enviar para 1 pessoa (mantém 4 blocos)
  if (lookupDeLink) {
    return 'Entregar o link solicitado; sugerir enviar para 1 pessoa'
  }

  // Disciplinador: atrás da meta → prioridade sempre captação (exceto fechar lead que já respondeu)
  const atrasDaMeta = conversas_esta_semana < meta_semanal
  if (atrasDaMeta && !(intencao === 'conversao' && tem_leads_pendentes)) {
    return prioridadeCaptacao(estado)
  }

  switch (intencao) {
    case 'captacao':
      if (conversas_esta_semana >= meta_semanal) return 'Manter rotina: usar links para qualificar ou captar novos'
      return prioridadeCaptacao(estado)
    case 'conversao':
      return tem_leads_pendentes
        ? 'Enviar script de fechamento para lead que respondeu'
        : 'Preparar script de fechamento para quando o lead responder'
    case 'organizacao':
      return 'Organizar agenda em blocos fixos de atendimento e captação'
    case 'desbloqueio':
    default:
      return 'Qualificar leads ou fechar consulta esta semana'
  }
}

export async function buildNoelNutriContext(
  userId: string,
  userMessage?: string
): Promise<NoelNutriContextResult | null> {
  if (!supabaseAdmin) return null

  const { inicio: inicioSemana, fim: fimSemana } = getInicioFimSemana()
  const lookup_de_link = userMessage ? isLookupDeLink(userMessage) : false

  const [
    linksResult,
    jornadaResult,
    profileResult,
    linkEventsSemanaResult,
    clientsPendentesResult
  ] = await Promise.all([
    getNoelNutriLinks(userId, userMessage),
    supabaseAdmin
      .from('journey_progress')
      .select('day_number')
      .eq('user_id', userId)
      .order('day_number', { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabaseAdmin.from('user_profiles').select('meta_conversas_semana').eq('user_id', userId).maybeSingle(),
    supabaseAdmin
      .from('link_events')
      .select('id')
      .eq('user_id', userId)
      .eq('area', 'nutri')
      .in('event_type', ['whatsapp_click', 'lead_capture'])
      .gte('created_at', inicioSemana)
      .lte('created_at', fimSemana),
    supabaseAdmin
      .from('clients')
      .select('id')
      .eq('user_id', userId)
      .in('status', ['lead', 'pre_consulta'])
      .limit(1)
  ])

  const links_ativos = linksResult.links

  const jornadaIniciada = jornadaResult.data?.day_number != null
  const meta_semanal = Math.min(50, Math.max(1, profileResult.data?.meta_conversas_semana ?? 5))
  let conversas_esta_semana = linkEventsSemanaResult.data?.length ?? 0
  if (linkEventsSemanaResult.error) {
    const { data: leadsSemana } = await supabaseAdmin
      .from('leads')
      .select('id')
      .eq('user_id', userId)
      .gte('created_at', inicioSemana)
      .lte('created_at', fimSemana)
    conversas_esta_semana = leadsSemana?.length ?? 0
  }

  const tem_leads_pendentes = (clientsPendentesResult.data?.length ?? 0) > 0
  const tem_links_ativos = links_ativos.length >= 1

  const intencao = userMessage ? detectarIntencaoNutri(userMessage) : 'desbloqueio'
  const estado = {
    meta_semanal,
    conversas_esta_semana,
    tem_leads_pendentes,
    tem_links_ativos
  }

  const prioridade_calculada = calcularPrioridade(intencao, estado, jornadaIniciada, lookup_de_link)

  // Anti-alucinação: se pediu link de tema que não existe (ex.: quiz de endometriose), não sugerir link
  const linkInexistente = userMessage ? pediuLinkInexistente(userMessage, links_ativos) : false
  const nao_sugerir_link_especifico = linkInexistente

  // Backend monta o link exato para o modelo colar (evita "DSVS" sem URL). Não enviar se pediu tema inexistente.
  const precisaDeLink = (intencao === 'captacao' || intencao === 'desbloqueio' || lookup_de_link) && intencao !== 'conversao' && !nao_sugerir_link_especifico
  const primeiroLink = links_ativos.length > 0 ? links_ativos[0] : null
  const link_sugerido_onde_aplicar =
    precisaDeLink && primeiroLink ? `[${primeiroLink.nome}](${primeiroLink.url})` : undefined

  const contexto: ContextoNoelDefinitivo = {
    area: 'nutri',
    intencao,
    estado,
    prioridade_calculada,
    links_ativos,
    ...(lookup_de_link && { lookup_de_link: true }),
    ...(link_sugerido_onde_aplicar && { link_sugerido_onde_aplicar }),
    ...(nao_sugerir_link_especifico && { nao_sugerir_link_especifico: true }),
    modo_resposta: 'executivo'
  }

  let contextBlock = `=== CONTEXTO ===\n${JSON.stringify(contexto, null, 2)}\n=== FIM ===`

  if (nao_sugerir_link_especifico) {
    contextBlock += `\n\nResponda em conversa: diga que não há esse link, sugira criar em Ferramentas ou listar os disponíveis. NÃO sugira um link da lista.`
  } else if (link_sugerido_onde_aplicar) {
    contextBlock += `\n\nUse EXATAMENTE o texto de "link_sugerido_onde_aplicar" quando indicar o link (copie e cole). Não escreva só o nome.`
  }
  if (intencao === 'conversao') {
    contextBlock += `\n\nEntregue o script de fechamento em texto copiável e diga para usar no WhatsApp/conversa com o lead: "Oi [nome], que bom que você respondeu! Que tal agendarmos sua consulta esta semana? Você prefere [manhã/tarde] e [dia]? Assim fechamos seu plano."`
  }

  return {
    contextBlock,
    contexto
  }
}
