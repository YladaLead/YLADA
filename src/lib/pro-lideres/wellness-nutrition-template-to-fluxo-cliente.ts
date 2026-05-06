/**
 * Converte linhas de `templates_nutrition` (Wellness) em `FluxoCliente`
 * para reutilizar `wellnessFluxoToYladaConfigJson` nos presets Pro Líderes.
 */
import type { FluxoCliente } from '@/types/wellness-system'

type PerguntaFluxo = FluxoCliente['perguntas'][number]

export type NutritionTemplateRow = {
  slug: string | null
  name: string | null
  type: string | null
  objective?: string | null
  title?: string | null
  description?: string | null
  content: unknown
}

function isPlainObject(v: unknown): v is Record<string, unknown> {
  return Boolean(v) && typeof v === 'object' && !Array.isArray(v)
}

function optionLabels(raw: unknown): string[] {
  if (!Array.isArray(raw)) return []
  const out: string[] = []
  for (const o of raw) {
    if (typeof o === 'string') {
      const t = o.trim()
      if (t) out.push(t)
      continue
    }
    if (isPlainObject(o)) {
      const label = typeof o.label === 'string' ? o.label.trim() : ''
      if (label) {
        out.push(label)
        continue
      }
      const text = typeof o.text === 'string' ? o.text.trim() : ''
      if (text) out.push(text)
    }
  }
  return out
}

function questionText(q: Record<string, unknown>): string {
  const t =
    (typeof q.question === 'string' && q.question.trim()) ||
    (typeof q.texto === 'string' && q.texto.trim()) ||
    (typeof q.label === 'string' && q.label.trim()) ||
    (typeof q.title === 'string' && q.title.trim())
  return t || 'Pergunta'
}

function nutritionQuestionToPergunta(q: unknown, index: number): PerguntaFluxo | null {
  if (!isPlainObject(q)) return null
  const texto = questionText(q)
  const opts = optionLabels(q.options ?? q.opcoes)
  const id = typeof q.id === 'string' && q.id.trim() ? q.id.trim() : `p${index + 1}`

  if (opts.length >= 2) {
    return { id, texto, tipo: 'multipla_escolha', opcoes: opts }
  }

  const t = (q.type as string | undefined)?.toLowerCase() ?? ''
  if (t.includes('scale') || t.includes('escala')) {
    const min = typeof q.min === 'number' ? q.min : 0
    const max = typeof q.max === 'number' ? q.max : 10
    return { id, texto, tipo: 'escala', escalaMin: min, escalaMax: max }
  }

  if (t.includes('yes') || t.includes('sim') || t === 'boolean') {
    return { id, texto, tipo: 'sim_nao' }
  }

  if (opts.length === 1) {
    return { id, texto, tipo: 'multipla_escolha', opcoes: [opts[0]!, 'Outro'] }
  }

  return null
}

function fieldToPergunta(field: unknown, index: number): PerguntaFluxo | null {
  if (!isPlainObject(field)) return null
  const label = typeof field.label === 'string' ? field.label.trim() : ''
  if (!label) return null
  const id = typeof field.id === 'string' && field.id.trim() ? field.id.trim() : `f${index + 1}`
  const ty = String(field.type ?? '').toLowerCase()

  if (ty === 'number' || ty === 'numeric' || ty === 'integer') {
    const min = typeof field.min === 'number' ? field.min : 0
    const max = typeof field.max === 'number' ? field.max : 24
    return { id, texto: label, tipo: 'escala', escalaMin: min, escalaMax: max }
  }

  if (ty === 'checkbox' || ty === 'boolean') {
    return { id, texto: label, tipo: 'sim_nao' }
  }

  const opts = optionLabels(field.options)
  if (opts.length >= 2) {
    return { id, texto: label, tipo: 'multipla_escolha', opcoes: opts }
  }

  return { id, texto: label, tipo: 'sim_nao' }
}

/**
 * Tenta montar um fluxo espelho a partir do JSON `content` do template.
 * Retorna `null` se não houver perguntas utilizáveis (ex.: content `{}`).
 */
export function nutritionTemplateRowToFluxoCliente(row: NutritionTemplateRow): FluxoCliente | null {
  const slug = (row.slug ?? '').trim().toLowerCase()
  if (!slug) return null

  const nome = (row.name ?? row.title ?? slug).trim() || slug
  const objetivo =
    (row.objective && String(row.objective).trim()) ||
    (row.description && String(row.description).trim()) ||
    `Espelho do catálogo Wellness: ${nome}`

  const content = isPlainObject(row.content) ? row.content : {}
  const questionsRaw = content.questions ?? content.perguntas

  let perguntas: PerguntaFluxo[] = []

  if (Array.isArray(questionsRaw) && questionsRaw.length > 0) {
    let i = 0
    for (const q of questionsRaw) {
      const p = nutritionQuestionToPergunta(q, i)
      if (p) {
        perguntas.push(p)
        i += 1
      }
    }
  }

  if (perguntas.length === 0 && Array.isArray(content.fields)) {
    let i = 0
    for (const f of content.fields) {
      const p = fieldToPergunta(f, i)
      if (p) {
        perguntas.push(p)
        i += 1
      }
    }
  }

  if (perguntas.length === 0) return null

  const descBase =
    (row.description && String(row.description).trim()) ||
    `Resultado alinhado ao tema “${nome}” — próximo passo: conversar com quem te enviou o link.`

  return {
    id: slug,
    nome,
    objetivo,
    perguntas,
    diagnostico: {
      titulo: `Perfil: ${nome}`,
      descricao: descBase,
      sintomas: ['Respostas usadas para personalizar a conversa', 'Sem diagnóstico clínico'],
      beneficios: ['Orientação prática com quem compartilhou o link', 'Próximo passo simples no WhatsApp'],
      mensagemPositiva: 'Obrigado por responder — com essas informações dá para seguir com clareza no WhatsApp.',
    },
    kitRecomendado: 'energia',
    cta: 'Quero falar no WhatsApp',
    tags: ['wellness-template', 'espelho-catalogo', slug],
  }
}

export function isPedindoDetoxNutritionRow(row: NutritionTemplateRow): boolean {
  const nomeLower = (row.name ?? '').toLowerCase()
  const slugLower = (row.slug ?? '').toLowerCase()
  return (
    nomeLower.includes('pedindo detox') ||
    nomeLower.includes('pedindo-detox') ||
    slugLower.includes('quiz-pedindo-detox') ||
    slugLower.includes('seu-corpo-esta-pedindo-detox') ||
    slugLower.includes('pedindo-detox')
  )
}
