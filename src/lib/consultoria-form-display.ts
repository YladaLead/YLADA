import type { ConsultoriaFormField } from '@/lib/pro-lideres-consultoria'
import { isConsultoriaFieldVisibleForAnswers } from '@/lib/pro-lideres-consultoria'

export type ConsultoriaAnswerRow = { label: string; value: string; fieldId: string }

export type ConsultoriaAnswerSection = {
  sectionKey: string
  sectionTitle: string
  rows: ConsultoriaAnswerRow[]
}

const LEADING_SECTION_NUM = /^(\d+)\.\s*/

/** Agrupa linhas pelo prefixo numérico do rótulo (ex.: «1. …», «2. …») para leitura em blocos. */
export function groupConsultoriaAnswerRowsBySection(rows: ConsultoriaAnswerRow[]): ConsultoriaAnswerSection[] {
  const sections: ConsultoriaAnswerSection[] = []
  let current: ConsultoriaAnswerSection | null = null

  for (const row of rows) {
    const m = row.label.match(LEADING_SECTION_NUM)
    const key = m ? m[1]! : '_extra'
    const title = m ? `Bloco ${m[1]}` : 'Outros campos'

    if (!current || current.sectionKey !== key) {
      current = { sectionKey: key, sectionTitle: title, rows: [] }
      sections.push(current)
    }
    current.rows.push(row)
  }

  return sections
}

/** Mapeia respostas JSON para linhas legíveis (pergunta → resposta), incluindo chaves extra sem campo definido. */
export function consultoriaAnswersToDisplayRows(
  fields: ConsultoriaFormField[],
  answers: Record<string, unknown>
): ConsultoriaAnswerRow[] {
  const rows: ConsultoriaAnswerRow[] = []
  const seen = new Set<string>()
  for (const f of fields) {
    seen.add(f.id)
    if (!isConsultoriaFieldVisibleForAnswers(f, answers)) {
      continue
    }
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
