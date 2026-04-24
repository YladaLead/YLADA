import { consultoriaAnswersToDisplayRows } from '@/lib/consultoria-form-display'
import type { ConsultoriaFormField } from '@/lib/pro-lideres-consultoria'

export type ConsultoriaCsvResponseRow = {
  id: string
  submitted_at: string
  respondent_name?: string | null
  respondent_email?: string | null
  answers: unknown
}

function normalizeAnswers(raw: unknown): Record<string, unknown> {
  if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw as Record<string, unknown>
  return {}
}

function csvEscape(cell: string): string {
  const s = cell ?? ''
  if (/[";\n\r]/.test(s)) {
    return `"${s.replace(/"/g, '""')}"`
  }
  return s
}

function columnHeadersForFields(fields: ConsultoriaFormField[]): { id: string; header: string }[] {
  const counts = new Map<string, number>()
  return fields.map((f) => {
    const base = (f.label || '').trim() || f.id
    const n = (counts.get(base) ?? 0) + 1
    counts.set(base, n)
    const header = n === 1 ? base : `${base} (${n})`
    return { id: f.id, header }
  })
}

/** CSV UTF-8 com separador ponto e vírgula (lista do Excel em português) e colunas por campo. */
export function consultoriaFormResponsesToCsv(
  fields: ConsultoriaFormField[],
  responses: ConsultoriaCsvResponseRow[]
): string {
  const fieldIds = new Set(fields.map((f) => f.id))
  const colMeta = ['id_envio', 'data_envio', 'nome_respondente', 'email_respondente']
  const fieldCols = columnHeadersForFields(fields)

  const extraKeySet = new Set<string>()
  for (const r of responses) {
    const ans = normalizeAnswers(r.answers)
    for (const k of Object.keys(ans)) {
      if (!fieldIds.has(k)) extraKeySet.add(k)
    }
  }
  const extraKeys = [...extraKeySet].sort()

  const sep = ';'
  const headerLine = [...colMeta, ...fieldCols.map((c) => c.header), ...extraKeys].map(csvEscape).join(sep)

  const lines: string[] = [headerLine]

  for (const r of responses) {
    const ans = normalizeAnswers(r.answers)
    const displayRows = consultoriaAnswersToDisplayRows(fields, ans)
    const byFieldId = new Map(displayRows.map((x) => [x.fieldId, x.value]))

    const core = [r.id, r.submitted_at, r.respondent_name ?? '', r.respondent_email ?? ''].map((v) =>
      csvEscape(String(v ?? ''))
    )

    const fieldVals = fieldCols.map(({ id }) => {
      const v = byFieldId.get(id)
      const s = v == null || v === '—' ? '' : String(v)
      return csvEscape(s)
    })

    const extraVals = extraKeys.map((k) => {
      const v = ans[k]
      const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v)
      return csvEscape(s)
    })

    lines.push([...core, ...fieldVals, ...extraVals].join(sep))
  }

  return lines.join('\r\n')
}

export function consultoriaCsvFilenameBase(businessName: string, suffix: string): string {
  const safe = businessName
    .trim()
    .replace(/[<>:"/\\|?*\u0000-\u001f]+/g, '')
    .replace(/\s+/g, '-')
    .slice(0, 48)
  const base = safe || 'clinica'
  const suf = suffix.replace(/[<>:"/\\|?*]+/g, '-').slice(0, 40)
  return `${base}-${suf}.csv`
}
