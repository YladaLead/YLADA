/**
 * Memória da Jornada do Noel — §13 passo 4 / §13-bis camada 5.
 * Lê eventos comportamentais (ylada_behavioral_events) + estado do Board
 * no início da conversa para conduzir de onde a pessoa está.
 *
 * LGPD: resumo interno para o prompt — sem expor payload cru nem dados de leads.
 */

import { supabaseAdmin } from '@/lib/supabase'

const MAX_BEHAVIORAL_EVENTS = 40

/** Liga leitura de eventos + Board na rota do Noel. OFF por padrão (inerte). */
export function isNoelJornadaMemoryEnabled(): boolean {
  return (
    process.env.NOEL_JORNADA_MEMORY_ENABLED === 'true' ||
    process.env.NOEL_JORNADA_MEMORY_ENABLED === '1'
  )
}

export type JornadaGavetaId = 'norte' | 'raio_x' | 'scripts' | 'links'

export interface BehavioralEventRow {
  event_type: string
  created_at: string
}

export interface BoardGavetaSnapshot {
  gaveta: JornadaGavetaId
  label: string
  acesa: boolean
  cards: number
}

export interface JornadaMemorySnapshot {
  segment: string
  boardArea: string
  eventos: BehavioralEventRow[]
  gavetas: BoardGavetaSnapshot[]
  etapaInferida: string
  acoesResumo: string[]
}

const GAVETA_KEYWORDS: Array<{ id: JornadaGavetaId; label: string; keywords: string[] }> = [
  { id: 'norte', label: 'Meu Norte', keywords: ['norte', 'missão', 'missao', 'propósito', 'proposito', 'meta'] },
  { id: 'raio_x', label: 'Meu Raio-X', keywords: ['raio', 'raio-x', 'gap', 'inventário', 'inventario'] },
  { id: 'scripts', label: 'Meus Scripts', keywords: ['script', 'whatsapp', 'mensagem'] },
  { id: 'links', label: 'Meus Links', keywords: ['link', 'diagnóstico', 'diagnostico'] },
]

const EVENTO_PARA_ACAO: Record<string, string> = {
  user_created: 'criou a conta',
  diagnosis_created: 'criou um diagnóstico/link',
  diagnosis_answered: 'recebeu respostas no diagnóstico',
  diagnosis_shared: 'compartilhou um link de diagnóstico',
  lead_contact_clicked: 'teve lead clicando no WhatsApp',
  upgrade_to_pro: 'fez upgrade para Pro',
  funnel_entrada_nicho: 'entrou no nicho',
  funnel_hub_segmento_clicado: 'escolheu segmento no hub',
  freemium_limit_hit: 'atingiu limite do plano gratuito',
  freemium_paywall_view: 'viu paywall',
  freemium_upgrade_cta_click: 'clicou em upgrade',
  referral_landing_view: 'abriu link de indicação',
  referral_signup: 'indicou alguém que se cadastrou',
  referral_activated: 'indicação ativou na plataforma',
}

/** Infere a etapa da jornada a partir dos tipos de evento (sem payload). */
export function inferirEtapaJornada(eventTypes: string[]): string {
  const set = new Set(eventTypes)
  if (set.has('lead_contact_clicked')) return 'conversa_com_leads'
  if (set.has('diagnosis_answered')) return 'leads_responderam'
  if (set.has('diagnosis_shared')) return 'link_compartilhado'
  if (set.has('diagnosis_created')) return 'link_criado'
  if (set.has('user_created') || set.size === 0) return 'entrada'
  return 'em_progresso'
}

const ETAPA_PARA_CONDUCAO: Record<string, string> = {
  entrada: 'A pessoa está no começo — acolha e proponha o primeiro passo concreto (criar ou mandar o 1º link).',
  link_criado: 'Já tem link/diagnóstico — próximo passo é compartilhar e colocar em ação, não recriar do zero.',
  link_compartilhado: 'Já compartilhou — oriente a acompanhar respostas e conduzir quem aparecer.',
  leads_responderam: 'Leads responderam — foque em aprofundar dor e conversa (DETECTAR), não em novo link.',
  conversa_com_leads: 'Conversa avançando — mantenha foco em fechamento emocional e próximo movimento prático.',
  em_progresso: 'Jornada em andamento — retome de onde parou sem repetir o que já foi feito.',
}

/** Resume eventos em ações legíveis (deduplica por tipo, ignora ruído de uso do Noel). */
export function resumirAcoesComportamentais(eventos: BehavioralEventRow[]): string[] {
  const vistos = new Set<string>()
  const acoes: string[] = []

  for (const ev of eventos) {
    if (ev.event_type === 'noel_analysis_used') continue
    if (vistos.has(ev.event_type)) continue
    vistos.add(ev.event_type)
    const label = EVENTO_PARA_ACAO[ev.event_type]
    if (label) acoes.push(label)
  }

  const usosNoel = eventos.filter((e) => e.event_type === 'noel_analysis_used').length
  if (usosNoel > 0) {
    acoes.push(`usou o Noel ${usosNoel} vez${usosNoel > 1 ? 'es' : ''} recentemente`)
  }

  return acoes
}

/** Classifica board pelo nome nas 4 gavetas da spec (r54). */
export function classificarGavetaBoard(nome: string): JornadaGavetaId | null {
  const n = nome.toLowerCase().normalize('NFD').replace(/\p{M}/gu, '')
  for (const g of GAVETA_KEYWORDS) {
    if (g.keywords.some((k) => n.includes(k.normalize('NFD').replace(/\p{M}/gu, '')))) {
      return g.id
    }
  }
  return null
}

/** Monta snapshot das 4 gavetas (estrutura fixa; acende se tem cards). */
export function montarSnapshotGavetas(
  boards: Array<{ nome: string; cardCount: number }>,
): BoardGavetaSnapshot[] {
  const porGaveta = new Map<JornadaGavetaId, number>()

  for (const b of boards) {
    const gaveta = classificarGavetaBoard(b.nome)
    if (!gaveta) continue
    porGaveta.set(gaveta, (porGaveta.get(gaveta) ?? 0) + b.cardCount)
  }

  return GAVETA_KEYWORDS.map((g) => ({
    gaveta: g.id,
    label: g.label,
    acesa: (porGaveta.get(g.id) ?? 0) > 0,
    cards: porGaveta.get(g.id) ?? 0,
  }))
}

/** Monta snapshot completo a partir de dados já lidos (testável sem DB). */
export function buildJornadaMemorySnapshot(input: {
  segment: string
  boardArea: string
  eventos: BehavioralEventRow[]
  boards: Array<{ nome: string; cardCount: number }>
}): JornadaMemorySnapshot {
  const eventTypes = input.eventos.map((e) => e.event_type)
  return {
    segment: input.segment,
    boardArea: input.boardArea,
    eventos: input.eventos,
    gavetas: montarSnapshotGavetas(input.boards),
    etapaInferida: inferirEtapaJornada(eventTypes),
    acoesResumo: resumirAcoesComportamentais(input.eventos),
  }
}

/** Formata snapshot para injeção no prompt do Noel. */
export function formatJornadaMemoryForPrompt(snapshot: JornadaMemorySnapshot | null): string {
  if (!snapshot) return ''

  const linhas: string[] = []
  linhas.push(`Etapa inferida: ${snapshot.etapaInferida}`)
  linhas.push(`Condução sugerida: ${ETAPA_PARA_CONDUCAO[snapshot.etapaInferida] ?? ETAPA_PARA_CONDUCAO.em_progresso}`)

  if (snapshot.acoesResumo.length > 0) {
    linhas.push(`O que já fez (comportamento): ${snapshot.acoesResumo.join('; ')}`)
  } else {
    linhas.push('O que já fez: pouco histórico registrado ainda — trate como início de jornada.')
  }

  const gavetasAcesas = snapshot.gavetas.filter((g) => g.acesa).map((g) => g.label)
  const gavetasVazias = snapshot.gavetas.filter((g) => !g.acesa).map((g) => g.label)
  if (gavetasAcesas.length > 0) {
    linhas.push(`Board aceso em: ${gavetasAcesas.join(', ')}`)
  }
  if (gavetasVazias.length > 0) {
    linhas.push(`Board ainda vazio em: ${gavetasVazias.join(', ')}`)
  }

  linhas.push(
    'REGRAS: use esta memória só para conduzir o próximo passo. NÃO repita perguntas sobre o que já consta. NÃO cite payloads, timestamps nem dados pessoais de leads.',
  )

  return linhas.join('\n')
}

async function fetchBehavioralEvents(userId: string): Promise<BehavioralEventRow[]> {
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('ylada_behavioral_events')
    .select('event_type, created_at')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(MAX_BEHAVIORAL_EVENTS)

  if (error) {
    console.warn('[Noel] fetchBehavioralEvents:', error.message)
    return []
  }

  return (data ?? []) as BehavioralEventRow[]
}

async function fetchBoardsWithCounts(
  userId: string,
  boardArea: string,
): Promise<Array<{ nome: string; cardCount: number }>> {
  if (!supabaseAdmin) return []

  const { data, error } = await supabaseAdmin
    .from('ylada_boards')
    .select('nome, ylada_board_cards(count)')
    .eq('tenant_id', `${userId}:${boardArea}`)
    .order('ordem', { ascending: true })

  if (error) {
    console.warn('[Noel] fetchBoardsWithCounts:', error.message)
    return []
  }

  return (data ?? []).map((row) => {
    const cards = row.ylada_board_cards as Array<{ count: number }> | undefined
    return {
      nome: String(row.nome ?? ''),
      cardCount: cards?.[0]?.count ?? 0,
    }
  })
}

/** Carrega memória da jornada (eventos + Board) para o Noel. */
export async function loadJornadaMemoryForNoel(
  userId: string,
  segment: string,
  boardArea: string,
): Promise<JornadaMemorySnapshot> {
  const area = boardArea.trim() || segment
  const [eventos, boards] = await Promise.all([
    fetchBehavioralEvents(userId),
    fetchBoardsWithCounts(userId, area),
  ])

  return buildJornadaMemorySnapshot({ segment, boardArea: area, eventos, boards })
}
