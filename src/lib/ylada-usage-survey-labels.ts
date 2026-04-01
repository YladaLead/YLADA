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
