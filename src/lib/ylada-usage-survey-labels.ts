/** Labels para painel admin e export CSV (espelha a pesquisa em YladaUsageSurveyPage). */

export const USAGE_SURVEY_PROFILE_LABELS: Record<string, string> = {
  '1': 'Travado no início (não criou diagnóstico)',
  '2': 'Criou mas não compartilhou',
  '3': 'Compartilhou, sem conversa no WhatsApp',
  '4': 'Já teve conversa (em movimento)',
}

export const USAGE_SURVEY_OBJECTIVE_LABELS: Record<string, string> = {
  clientes: 'Conseguir mais clientes',
  conversao: 'Melhorar conversão',
  organizar: 'Organizar atendimentos',
  testar: 'Testar / entender ferramenta',
  outro: 'Outro',
}

export function formatUsageSurveyObjective(id: string, other?: string): string {
  const base = USAGE_SURVEY_OBJECTIVE_LABELS[id] || id
  if (id === 'outro' && other?.trim()) return `${base}: ${other.trim()}`
  return base
}

function topCounts(map: Record<string, number>, limit: number): Array<{ key: string; count: number }> {
  return Object.entries(map)
    .map(([key, count]) => ({ key, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, limit)
}

export function aggregateUsageSurveyAnswers(rows: Array<{ answers?: Record<string, unknown> }>) {
  const objectiveCounts: Record<string, number> = {}
  const blockerCounts: Record<string, number> = {}
  for (const row of rows) {
    const a = row.answers
    if (!a || typeof a !== 'object') continue
    const o = typeof a.objective === 'string' ? a.objective : ''
    if (o) objectiveCounts[o] = (objectiveCounts[o] ?? 0) + 1
    const b = typeof a.blocker === 'string' ? a.blocker.trim() : ''
    if (b) blockerCounts[b] = (blockerCounts[b] ?? 0) + 1
  }
  const n = rows.length || 1
  const objectiveTop = topCounts(objectiveCounts, 8).map((x) => ({
    ...x,
    pct: Math.round((x.count / n) * 100),
  }))
  const blockerTop = topCounts(blockerCounts, 8).map((x) => ({
    ...x,
    pct: Math.round((x.count / n) * 100),
  }))
  return { objectiveCounts, blockerCounts, objectiveTop, blockerTop, sampleSize: rows.length }
}

export function buildUsageSurveyInsights(input: {
  totalInDb: number
  profileCounts: Record<string, number>
  aggregationSampleSize: number
  objectiveTop: Array<{ key: string; count: number; pct: number }>
  blockerTop: Array<{ key: string; count: number; pct: number }>
}): string[] {
  const lines: string[] = []
  const { totalInDb, profileCounts, aggregationSampleSize, objectiveTop, blockerTop } = input

  if (totalInDb < 3) {
    lines.push('Poucas respostas ainda — os números abaixo são indicativos; volte após mais envios da pesquisa.')
    return lines
  }

  const p = (n: number) => (totalInDb > 0 ? Math.round((n / totalInDb) * 100) : 0)
  const p1 = profileCounts['1'] ?? 0
  const p2 = profileCounts['2'] ?? 0
  const p3 = profileCounts['3'] ?? 0
  const p4 = profileCounts['4'] ?? 0

  if (p(p2) >= 20) {
    lines.push(
      `${p(p2)}% no perfil “criou mas não compartilhou”. Reforce: cartão “Seu caminho”, Noel com texto para enviar o link, e lembretes de “mandar hoje”.`
    )
  }
  if (p(p1) >= 20) {
    lines.push(
      `${p(p1)}% ainda não criaram diagnóstico. Melhore: primeiro acesso, banner pós-cadastro e caminho curto até “Links → novo”.`
    )
  }
  if (p(p3) >= 15) {
    lines.push(
      `${p(p3)}% compartilharam sem conversa no WhatsApp. Reforce primeira mensagem ao lead e expectativas realistas.`
    )
  }
  if (p(p4) >= 30) {
    lines.push(
      `${p(p4)}% já geraram conversa — bom sinal. Foque em consistência (ritual diário, mais diagnósticos).`
    )
  }

  const topObj = objectiveTop[0]
  if (topObj && aggregationSampleSize >= 5 && topObj.pct >= 30) {
    lines.push(
      `Objetivo mais citado (amostra recente): ${USAGE_SURVEY_OBJECTIVE_LABELS[topObj.key] || topObj.key} (~${topObj.pct}% das ${aggregationSampleSize} últimas). Alinhe landing e Noel a essa promessa.`
    )
  }

  const topBlock = blockerTop[0]
  if (topBlock && topBlock.count >= 3) {
    const short =
      topBlock.key.length > 80 ? `${topBlock.key.slice(0, 77)}…` : topBlock.key
    lines.push(
      `Trava mais citada: “${short}” (${topBlock.count} vezes na amostra). Priorize tutorial curto ou Noel nesse ponto.`
    )
  }

  if (lines.length === 0) {
    lines.push('Distribuição ainda equilibrada entre perfis — continue coletando para padrões mais claros.')
  }

  return lines
}

/** Itens acionáveis para produto/conteúdo/suporte (painel admin). */
export type UsageSurveyActionItem = {
  priority: 'alta' | 'media' | 'baixa'
  title: string
  basis: string
  steps: string[]
}

function norm(s: string): string {
  return s
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{M}/gu, '')
}

export function buildUsageSurveyRecommendedActions(input: {
  totalInDb: number
  profileCounts: Record<string, number>
  aggregationSampleSize: number
  objectiveTop: Array<{ key: string; count: number; pct: number }>
  blockerTop: Array<{ key: string; count: number; pct: number }>
}): UsageSurveyActionItem[] {
  const { totalInDb, profileCounts, aggregationSampleSize, objectiveTop, blockerTop } = input
  if (totalInDb < 1) return []

  const pctOfTotal = (n: number) => (totalInDb > 0 ? Math.round((n / totalInDb) * 100) : 0)
  const p1 = profileCounts['1'] ?? 0
  const p2 = profileCounts['2'] ?? 0
  const p3 = profileCounts['3'] ?? 0
  const p4 = profileCounts['4'] ?? 0

  const items: UsageSurveyActionItem[] = []
  const seenTitles = new Set<string>()

  const push = (item: UsageSurveyActionItem) => {
    if (seenTitles.has(item.title)) return
    seenTitles.add(item.title)
    items.push(item)
  }

  if (pctOfTotal(p1) >= 15) {
    push({
      priority: 'alta',
      title: 'Desbloquear o primeiro diagnóstico',
      basis: `${pctOfTotal(p1)}% ainda no perfil 1 (não criou diagnóstico).`,
      steps: [
        'Colocar um único CTA prioritário após o cadastro: “Criar meu primeiro diagnóstico”.',
        'Noel: atalho pronto no primeiro login (“Quero criar meu link de diagnóstico”).',
        'Reduzir passos até “Links → novo”: tour de 60s ou checklist de 3 itens.',
      ],
    })
  }

  if (pctOfTotal(p2) >= 15) {
    push({
      priority: 'alta',
      title: 'Transformar “criou” em “compartilhou”',
      basis: `${pctOfTotal(p2)}% no perfil 2 (criou e não compartilhou).`,
      steps: [
        'Lembrete in-app no dia seguinte: “Enviar link hoje” com texto sugerido pelo Noel.',
        'Modelo de mensagem/WhatsApp copiável na tela do diagnóstico.',
        'Mostrar “Seu caminho” com meta semanal de 1 envio de link.',
      ],
    })
  }

  if (pctOfTotal(p3) >= 12) {
    push({
      priority: 'media',
      title: 'Ajudar quem compartilhou mas não teve retorno',
      basis: `${pctOfTotal(p3)}% no perfil 3 (sem conversa no WhatsApp).`,
      steps: [
        'Conteúdo sobre follow-up: segunda mensagem, timing, objeções leves.',
        'Noel: scripts para reengajar lead que abriu e não respondeu.',
        'Expectativas realistas (taxa de resposta) na própria pesquisa ou onboarding.',
      ],
    })
  }

  if (pctOfTotal(p4) >= 25) {
    push({
      priority: 'media',
      title: 'Manter ritmo de quem já converte',
      basis: `${pctOfTotal(p4)}% no perfil 4 (já houve conversa).`,
      steps: [
        'Rotina sugerida: novo diagnóstico + reativação de leads antigos.',
        'Destaque de “vitórias” no app para reforçar o hábito.',
        'Pesquisa NPS/CSAT só para este segmento, se quiser refinar retenção.',
      ],
    })
  }

  const topObj = objectiveTop[0]
  if (topObj && aggregationSampleSize >= 3 && topObj.pct >= 25) {
    const label = USAGE_SURVEY_OBJECTIVE_LABELS[topObj.key] || topObj.key
    push({
      priority: 'media',
      title: `Alinhar produto e comunicação ao objetivo “${label}”`,
      basis: `~${topObj.pct}% das respostas recentes citam esse objetivo.`,
      steps: [
        'Revisar headline da landing e primeiras telas para bater com essa promessa.',
        'Ajustar prompts do Noel e templates de mensagem para o mesmo foco.',
        'Garantir que métricas no app reflitam esse objetivo (ex.: envios, respostas).',
      ],
    })
  }

  const topBlock = blockerTop[0]
  if (topBlock && topBlock.count >= 2) {
    const bn = norm(topBlock.key)
    if (/entend|como usar|nao sei|duvida|confus|uso/.test(bn)) {
      push({
        priority: 'alta',
        title: 'Reduzir “não sei usar” com educação curta',
        basis: `Trava mais frequente na amostra: “${truncSnippet(topBlock.key, 70)}”.`,
        steps: [
          'Publicar 3 tutoriais curtos: criar link, enviar, acompanhar resposta.',
          'Noel: modo “me ensina o passo a passo de hoje” com uma tarefa por dia.',
          'Busca na central de ajuda por “primeiro link” e “primeira mensagem”.',
        ],
      })
    } else if (/tempo|correria|dispon/.test(bn)) {
      push({
        priority: 'media',
        title: 'Respeitar falta de tempo com fluxos mínimos',
        basis: `Trava citada: “${truncSnippet(topBlock.key, 70)}”.`,
        steps: [
          'Fluxo “5 minutos”: um link, uma mensagem pronta, um lembrete.',
          'Notificações com horário configurável e texto curto.',
          'Templates “copiar e colar” para reduzir fricção.',
        ],
      })
    } else if (/medo|vergonha|receio|insegur/.test(bn)) {
      push({
        priority: 'media',
        title: 'Endereçar insegurança para enviar ou falar',
        basis: `Trava citada: “${truncSnippet(topBlock.key, 70)}”.`,
        steps: [
          'Exemplos reais (anonimizados) de mensagens que funcionaram.',
          'Noel com tom de “rascunho seguro” e opção de editar antes de enviar.',
          'Mini-guia de objeções e respostas curtas.',
        ],
      })
    } else if (/resultado|funciona|nao vejo/.test(bn)) {
      push({
        priority: 'media',
        title: 'Mostrar progresso e próximo passo quando “não vejo resultado”',
        basis: `Trava citada: “${truncSnippet(topBlock.key, 70)}”.`,
        steps: [
          'Indicadores simples: links enviados, aberturas, respostas (quando houver).',
          'Conteúdo sobre prazo típico até primeira resposta.',
          'Oferta de revisão de mensagem/link pelo Noel quando estiver parado.',
        ],
      })
    }
  }

  if (items.length === 0) {
    push({
      priority: 'baixa',
      title: 'Coletar mais respostas antes de priorizar',
      basis: 'Poucos dados ou distribuição ainda equilibrada.',
      steps: [
        'Manter a pesquisa ativa em /pt/pesquisa-uso-ylada.',
        'Revisar este painel após dezenas de respostas novas.',
        'Exportar CSV periodicamente para cruzar com cohort ou suporte.',
      ],
    })
  }

  const order = { alta: 0, media: 1, baixa: 2 }
  items.sort((a, b) => order[a.priority] - order[b.priority])
  return items.slice(0, 8)
}

function truncSnippet(s: string, max: number): string {
  const t = s.replace(/\s+/g, ' ').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max - 1)}…`
}
