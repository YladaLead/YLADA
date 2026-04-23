import type { ConsultoriaFormField } from '@/lib/pro-lideres-consultoria'

export type ConsultoriaAnswerRow = { label: string; value: string; fieldId: string }

/** Mapeia respostas JSON para linhas legíveis (pergunta → resposta), incluindo chaves extra sem campo definido. */
export function consultoriaAnswersToDisplayRows(
  fields: ConsultoriaFormField[],
  answers: Record<string, unknown>
): ConsultoriaAnswerRow[] {
  const rows: ConsultoriaAnswerRow[] = []
  const seen = new Set<string>()
  for (const f of fields) {
    seen.add(f.id)
    const v = answers[f.id]
    let str = v == null ? '' : String(v).trim()
    if (str.length && f.type === 'checkbox_group') {
      str = str
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean)
        .join(' · ')
    }
    rows.push({ fieldId: f.id, label: f.label, value: str.length ? str : '—' })
  }
  for (const key of Object.keys(answers)) {
    if (seen.has(key)) continue
    const v = answers[key]
    rows.push({
      fieldId: key,
      label: key,
      value: v == null ? '—' : String(v).trim() || '—',
    })
  }
  return rows
}
