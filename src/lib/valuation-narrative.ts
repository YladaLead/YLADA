/**
 * Tendências mês a mês e bullets narrativos para o painel Valuation.
 */

export type TrendMomRow = {
  month_ref: string
  segment: string
  intent_category: string
  answer_count: number
  diagnosis_count: number
  prev_month_ref: string | null
  answer_count_prev: number | null
  diagnosis_count_prev: number | null
  answer_mom_pct: number | null
  diagnosis_mom_pct: number | null
}

export type NarrativeInsight = { id: string; title: string; detail: string }

function normMonthRef(s: string): string {
  const t = (s ?? '').trim()
  if (/^\d{4}-\d{2}-\d{2}/.test(t)) return t.slice(0, 10)
  const d = new Date(t)
  if (Number.isNaN(d.getTime())) return t.slice(0, 10)
  return d.toISOString().slice(0, 10)
}

function prevMonthIso(monthRef: string): string {
  const base = monthRef.slice(0, 10)
  const d = new Date(`${base}T12:00:00.000Z`)
  d.setUTCMonth(d.getUTCMonth() - 1)
  return d.toISOString().slice(0, 10)
}

type TrendRow = {
  month_ref: string
  segment: string
  intent_category: string
  answer_count: number
  diagnosis_count: number
}

/** Cruza tendências mensais com o mês anterior (mesmo segmento × tipo de intenção). */
export function buildTrendsMom(trends: TrendRow[]): TrendMomRow[] {
  if (!trends?.length) return []

  const index = new Map<string, TrendRow>()
  for (const t of trends) {
    const m = normMonthRef(t.month_ref)
    const key = `${t.segment}|${t.intent_category}|${m}`
    index.set(key, { ...t, month_ref: m })
  }

  const out: TrendMomRow[] = []
  for (const t of trends) {
    const m = normMonthRef(t.month_ref)
    const prev = prevMonthIso(m)
    const keyPrev = `${t.segment}|${t.intent_category}|${prev}`
    const prevRow = index.get(keyPrev)

    const acPrev = prevRow?.answer_count ?? null
    const dcPrev = prevRow?.diagnosis_count ?? null

    let answer_mom_pct: number | null = null
    let diagnosis_mom_pct: number | null = null
    if (prevRow && acPrev != null && acPrev > 0) {
      answer_mom_pct = Math.round(((t.answer_count - acPrev) / acPrev) * 1000) / 10
    }
    if (prevRow && dcPrev != null && dcPrev > 0) {
      diagnosis_mom_pct = Math.round(((t.diagnosis_count - dcPrev) / dcPrev) * 1000) / 10
    }

    out.push({
      month_ref: m,
      segment: t.segment,
      intent_category: t.intent_category,
      answer_count: t.answer_count,
      diagnosis_count: t.diagnosis_count,
      prev_month_ref: prevRow ? prev : null,
      answer_count_prev: acPrev,
      diagnosis_count_prev: dcPrev,
      answer_mom_pct,
      diagnosis_mom_pct,
    })
  }

  return out.sort((a, b) => {
    if (a.month_ref !== b.month_ref) return b.month_ref.localeCompare(a.month_ref)
    return a.segment.localeCompare(b.segment)
  })
}

type NarrativeInput = {
  answersTotal: number
  intentConversion: Array<{
    segment: string
    intent_category: string
    answer_display: string
    diagnoses: number
    diagnoses_clicked: number
    conversion_pct: number
  }>
  intentCombinations: Array<{
    segment: string
    answer_display_1: string
    answer_display_2: string
    diagnosis_count: number
  }>
  trendsMom?: TrendMomRow[]
}

export function buildNarrativeInsights(d: NarrativeInput): NarrativeInsight[] {
  const items: NarrativeInsight[] = []

  const conv = [...(d.intentConversion ?? [])].sort(
    (a, b) => (b.conversion_pct ?? 0) - (a.conversion_pct ?? 0)
  )[0]
  if (conv && conv.diagnoses >= 5 && conv.conversion_pct != null) {
    items.push({
      id: 'conv-top',
      title: 'Resposta com maior taxa de clique no WhatsApp (amostra mínima aplicada)',
      detail: `${conv.segment} · ${conv.intent_category}: “${truncate(conv.answer_display, 72)}” — ${Number(conv.conversion_pct).toFixed(1)}% de conversão (${conv.diagnoses_clicked}/${conv.diagnoses} diagnósticos com clique).`,
    })
  }

  const comb = [...(d.intentCombinations ?? [])].sort(
    (a, b) => (b.diagnosis_count ?? 0) - (a.diagnosis_count ?? 0)
  )[0]
  if (comb && comb.diagnosis_count >= 3) {
    items.push({
      id: 'combo-top',
      title: 'Par de intenções mais frequente no mesmo lead',
      detail: `${comb.segment}: “${truncate(comb.answer_display_1, 48)}” + “${truncate(comb.answer_display_2, 48)}” (${comb.diagnosis_count} diagnósticos).`,
    })
  }

  const mom = [...(d.trendsMom ?? [])].filter(
    (x) => x.prev_month_ref != null && x.answer_mom_pct != null && Math.abs(x.answer_mom_pct) >= 15
  )
  mom.sort((a, b) => Math.abs(b.answer_mom_pct ?? 0) - Math.abs(a.answer_mom_pct ?? 0))
  const topMom = mom[0]
  if (topMom) {
    items.push({
      id: 'mom-spike',
      title: 'Maior variação mês a mês (respostas)',
      detail: `${topMom.segment} · ${topMom.intent_category}: ${topMom.answer_mom_pct! > 0 ? '+' : ''}${topMom.answer_mom_pct}% vs mês anterior (${topMom.month_ref}).`,
    })
  }

  if (d.answersTotal < 50) {
    items.push({
      id: 'volume',
      title: 'Volume ainda limitado para conclusões fortes',
      detail: `Hoje há ${d.answersTotal.toLocaleString('pt-BR')} respostas estruturadas — à medida que o uso cresce, os rankings e combinações ficam mais estáveis.`,
    })
  }

  return items.slice(0, 6)
}

function truncate(s: string, max: number): string {
  const t = (s ?? '').trim()
  if (t.length <= max) return t
  return `${t.slice(0, max)}…`
}
