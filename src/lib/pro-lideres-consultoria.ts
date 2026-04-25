import { randomBytes } from 'crypto'

export const PRO_LIDERES_CONSULTORIA_KINDS = [
  'roteiro',
  'formulario',
  'checklist',
  'dicas',
  'documento',
] as const

export type ProLideresConsultoriaMaterialKind = (typeof PRO_LIDERES_CONSULTORIA_KINDS)[number]

export type ConsultoriaFormField = {
  id: string
  label: string
  type: 'text' | 'textarea' | 'select' | 'checkbox_group'
  options?: string[]
  required?: boolean
  /** Só mostrar / validar quando a resposta de `fieldId` contém `substring` (ex.: opção «Outros»). */
  visibleWhenAnswerIncludes?: { fieldId: string; substring: string }
}

export type ConsultoriaRoteiroStep = {
  title: string
  detail?: string
  links?: { label: string; url: string }[]
}

export type ConsultoriaContent =
  | { steps: ConsultoriaRoteiroStep[] }
  | { fields: ConsultoriaFormField[] }
  | { items: { text: string }[] }
  | { tips: string[] }
  | { markdown: string }

export type ProLideresConsultoriaMaterialRow = {
  id: string
  created_at: string
  updated_at: string
  title: string
  material_kind: ProLideresConsultoriaMaterialKind
  description: string | null
  content: Record<string, unknown>
  sort_order: number
  is_published: boolean
  created_by_user_id: string | null
}

export type ProLideresConsultoriaShareLinkRow = {
  id: string
  material_id: string
  token: string
  label: string | null
  leader_tenant_id: string | null
  expires_at: string | null
  created_at: string
}

export type ProLideresConsultoriaFormResponseRow = {
  id: string
  material_id: string
  share_link_id: string | null
  leader_tenant_id: string | null
  respondent_name: string | null
  respondent_email: string | null
  answers: Record<string, unknown>
  submitted_at: string
}

export function generateConsultoriaShareToken(): string {
  return randomBytes(24).toString('base64url')
}

export function proLideresConsultoriaResponderPath(token: string): string {
  return `/pro-lideres/consultoria/responder/${encodeURIComponent(token)}`
}

export function buildProLideresConsultoriaResponderUrl(origin: string, token: string): string {
  return `${origin.replace(/\/$/, '')}${proLideresConsultoriaResponderPath(token)}`
}

export function isConsultoriaMaterialKind(v: string): v is ProLideresConsultoriaMaterialKind {
  return (PRO_LIDERES_CONSULTORIA_KINDS as readonly string[]).includes(v)
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null && !Array.isArray(v)
}

export function normalizeConsultoriaContent(
  kind: ProLideresConsultoriaMaterialKind,
  raw: unknown
): Record<string, unknown> {
  if (!isPlainObject(raw)) {
    return defaultContentForKind(kind)
  }
  switch (kind) {
    case 'roteiro': {
      const stepsIn = Array.isArray(raw.steps) ? raw.steps : []
      const steps: ConsultoriaRoteiroStep[] = stepsIn.map((s) => {
        if (!isPlainObject(s)) return { title: '' }
        const title = String(s.title ?? '').trim().slice(0, 500)
        const detail = String(s.detail ?? '').trim().slice(0, 20000)
        const linksRaw = Array.isArray(s.links) ? s.links : []
        const links = linksRaw
          .map((l) => {
            if (!isPlainObject(l)) return null
            const label = String(l.label ?? '').trim().slice(0, 200)
            const url = String(l.url ?? '').trim().slice(0, 2000)
            if (!label && !url) return null
            return { label, url }
          })
          .filter(Boolean) as { label: string; url: string }[]
        return { title, detail: detail || undefined, links: links.length ? links : undefined }
      })
      return { steps }
    }
    case 'formulario': {
      const fieldsIn = Array.isArray(raw.fields) ? raw.fields : []
      const fields: ConsultoriaFormField[] = fieldsIn.map((f, i) => {
        if (!isPlainObject(f)) {
          return { id: `campo_${i + 1}`, label: '', type: 'text' as const, required: false }
        }
        const id = String(f.id ?? `campo_${i + 1}`)
          .trim()
          .replace(/\s+/g, '_')
          .slice(0, 80) || `campo_${i + 1}`
        const label = String(f.label ?? '').trim().slice(0, 500)
        const typeRaw = String(f.type ?? 'text').toLowerCase()
        const type: ConsultoriaFormField['type'] =
          typeRaw === 'textarea'
            ? 'textarea'
            : typeRaw === 'select'
              ? 'select'
              : typeRaw === 'checkbox_group'
                ? 'checkbox_group'
                : 'text'
        const options = Array.isArray(f.options)
          ? f.options.map((o) => String(o).trim().slice(0, 200)).filter(Boolean)
          : undefined
        const withOptions =
          (type === 'select' || type === 'checkbox_group') && options?.length ? options : undefined
        return {
          id,
          label,
          type,
          options: withOptions,
          required: Boolean(f.required),
        }
      })
      return { fields }
    }
    case 'checklist': {
      const itemsIn = Array.isArray(raw.items) ? raw.items : []
      const items = itemsIn.map((it) => {
        if (!isPlainObject(it)) return { text: '' }
        return { text: String(it.text ?? '').trim().slice(0, 1000) }
      })
      return { items }
    }
    case 'dicas': {
      const tipsIn = Array.isArray(raw.tips) ? raw.tips : []
      const tips = tipsIn.map((t) => String(t).trim().slice(0, 2000)).filter((t) => t.length > 0)
      return { tips }
    }
    case 'documento': {
      const markdown = String(raw.markdown ?? '').slice(0, 100000)
      return { markdown }
    }
    default:
      return defaultContentForKind(kind)
  }
}

export function defaultContentForKind(kind: ProLideresConsultoriaMaterialKind): Record<string, unknown> {
  switch (kind) {
    case 'roteiro':
      return { steps: [{ title: 'Passo 1', detail: '', links: [] }] }
    case 'formulario':
      return {
        fields: [
          { id: 'nome', label: 'Nome', type: 'text', required: true },
          { id: 'notas', label: 'Notas', type: 'textarea', required: false },
        ],
      }
    case 'checklist':
      return { items: [{ text: 'Primeiro item' }] }
    case 'dicas':
      return { tips: ['Primeira dica'] }
    case 'documento':
      return { markdown: '# Documento\n\nEscreve aqui o conteúdo em Markdown.\n' }
    default:
      return {}
  }
}

export function getConsultoriaFormFields(content: Record<string, unknown>): ConsultoriaFormField[] {
  const fields = Array.isArray(content.fields) ? content.fields : []
  return fields.filter((f): f is ConsultoriaFormField => {
    if (!isPlainObject(f)) return false
    const id = String(f.id ?? '').trim()
    const label = String(f.label ?? '').trim()
    return id.length > 0 && label.length > 0
  }) as ConsultoriaFormField[]
}

export function isConsultoriaFieldVisibleForAnswers(
  f: ConsultoriaFormField,
  answers: Record<string, unknown>
): boolean {
  if (!f.visibleWhenAnswerIncludes) return true
  const p = answers[f.visibleWhenAnswerIncludes.fieldId]
  const parentStr = p == null ? '' : String(p)
  return parentStr.includes(f.visibleWhenAnswerIncludes.substring)
}

export function validateConsultoriaFormAnswers(
  fields: ConsultoriaFormField[],
  answers: Record<string, unknown>
): { ok: true } | { ok: false; error: string } {
  for (const f of fields) {
    if (!isConsultoriaFieldVisibleForAnswers(f, answers)) {
      continue
    }
    const v = answers[f.id]
    if (f.required) {
      const s = v == null ? '' : String(v).trim()
      if (!s) {
        return { ok: false, error: `O campo "${f.label}" é obrigatório.` }
      }
    }
    if (f.type === 'select' && f.options?.length) {
      const s = v == null ? '' : String(v).trim()
      if (s && !f.options.includes(s)) {
        return { ok: false, error: `Valor inválido no campo "${f.label}".` }
      }
    }
    if (f.type === 'checkbox_group' && f.options?.length) {
      const lines = String(v ?? '')
        .split('\n')
        .map((x) => x.trim())
        .filter(Boolean)
      for (const line of lines) {
        if (!f.options.includes(line)) {
          return { ok: false, error: `Opção inválida em "${f.label}".` }
        }
      }
    }
  }
  return { ok: true }
}

export function consultoriaKindLabel(kind: ProLideresConsultoriaMaterialKind): string {
  switch (kind) {
    case 'roteiro':
      return 'Passo a passo'
    case 'formulario':
      return 'Formulário'
    case 'checklist':
      return 'Checklist'
    case 'dicas':
      return 'Dicas'
    case 'documento':
      return 'Documento'
    default:
      return kind
  }
}
