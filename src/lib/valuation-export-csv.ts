import type { ValuationApiData } from '@/lib/admin/ylada-valuation-queries'

function csvEscape(s: string): string {
  const t = String(s ?? '').replace(/"/g, '""')
  if (/[",\n\r]/.test(t)) return `"${t}"`
  return t
}

/** Gera CSV com abas lógicas (seções separadas por linha em branco + comentário). */
export function buildValuationCsv(data: ValuationApiData): string {
  const lines: string[] = []
  const opt = data.loadOptions
  lines.push(`# Valuation YLADA — export`)
  lines.push(`# Parâmetros: min_diag_conv=${opt.minDiagnosesConversion}, min_diag_combo=${opt.minDiagnosesCombo}, min_cnt_top=${opt.minCntTop}, rank<=${opt.topRankMax}`)
  lines.push('')

  lines.push('NARRATIVA')
  lines.push(['id', 'titulo', 'detalhe'].map(csvEscape).join(','))
  for (const n of data.narrativeInsights ?? []) {
    lines.push([n.id, n.title, n.detail].map(csvEscape).join(','))
  }
  lines.push('')

  lines.push('CONVERSAO_WHATSAPP')
  lines.push(
    ['segmento', 'tipo_intencao', 'question_id', 'resposta', 'diagnosticos', 'cliques', 'conv_pct']
      .map(csvEscape)
      .join(',')
  )
  for (const r of data.intentConversion ?? []) {
    lines.push(
      [
        r.segment,
        r.intent_category,
        r.question_id,
        r.answer_display,
        String(r.diagnoses),
        String(r.diagnoses_clicked),
        r.conversion_pct != null ? String(r.conversion_pct) : '',
      ]
        .map(csvEscape)
        .join(',')
    )
  }
  lines.push('')

  lines.push('COMBINACOES')
  lines.push(
    ['segmento', 'tipo1', 'resposta1', 'tipo2', 'resposta2', 'diagnosticos'].map(csvEscape).join(',')
  )
  for (const r of data.intentCombinations ?? []) {
    lines.push(
      [
        r.segment,
        r.intent_category_1,
        r.answer_display_1,
        r.intent_category_2,
        r.answer_display_2,
        String(r.diagnosis_count),
      ]
        .map(csvEscape)
        .join(',')
    )
  }
  lines.push('')

  lines.push('TOP_RESPOSTAS')
  lines.push(
    ['segmento', 'tipo', 'question_id', 'resposta', 'qtd', 'diagnosticos', 'rank']
      .map(csvEscape)
      .join(',')
  )
  for (const r of data.intentTop ?? []) {
    lines.push(
      [
        r.segment,
        r.intent_category,
        r.question_id,
        r.answer_display,
        String(r.cnt),
        String(r.diagnosis_count),
        String(r.rank),
      ]
        .map(csvEscape)
        .join(',')
    )
  }
  lines.push('')

  lines.push('TENDENCIAS_MENSAIS')
  lines.push(['mes', 'segmento', 'tipo', 'respostas', 'diagnosticos'].map(csvEscape).join(','))
  for (const t of data.trends ?? []) {
    lines.push(
      [t.month_ref, t.segment, t.intent_category, String(t.answer_count), String(t.diagnosis_count)]
        .map(csvEscape)
        .join(',')
    )
  }
  lines.push('')

  lines.push('TENDENCIAS_MOM')
  lines.push(
    [
      'mes',
      'segmento',
      'tipo',
      'respostas',
      'respostas_mes_anterior',
      'variacao_pct',
      'diagnosticos',
      'diagnosticos_mes_anterior',
      'variacao_diag_pct',
    ]
      .map(csvEscape)
      .join(',')
  )
  for (const t of data.trendsMom ?? []) {
    lines.push(
      [
        t.month_ref,
        t.segment,
        t.intent_category,
        String(t.answer_count),
        t.answer_count_prev != null ? String(t.answer_count_prev) : '',
        t.answer_mom_pct != null ? String(t.answer_mom_pct) : '',
        String(t.diagnosis_count),
        t.diagnosis_count_prev != null ? String(t.diagnosis_count_prev) : '',
        t.diagnosis_mom_pct != null ? String(t.diagnosis_mom_pct) : '',
      ]
        .map(csvEscape)
        .join(',')
    )
  }

  return lines.join('\n')
}

export function downloadValuationCsv(data: ValuationApiData, filename = 'valuation-ylada.csv'): void {
  const blob = new Blob([buildValuationCsv(data)], { type: 'text/csv;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  a.click()
  URL.revokeObjectURL(url)
}
