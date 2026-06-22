/**
 * Copy pública das calculadoras: resumo de inputs na tela + prefill WhatsApp humanizado.
 * Spec: inputs visíveis mas limpos — sem dump "Campo: valor".
 */
import type { Language } from '@/lib/i18n'
import type { FormulaResult } from '@/lib/ylada-flow/bibliotecas/formulas'
import { applyDevolutivaTokens } from '@/lib/ylada-flow/ylada-flow-calculator-runtime'

export type CalculatorFieldLike = {
  id: string
  label: string
  type?: string
  options?: Array<{ value: number; label: string }>
}

function pickNumeric(
  values: Record<string, number | undefined>,
  aliases: string[]
): number | undefined {
  for (const key of aliases) {
    const v = values[key]
    if (v === undefined || v === null || Number.isNaN(Number(v))) continue
    return Number(v)
  }
  return undefined
}

function findField(fields: CalculatorFieldLike[], aliases: string[]): CalculatorFieldLike | undefined {
  const set = new Set(aliases.map((a) => a.toLowerCase()))
  return fields.find((f) => set.has((f.id || '').trim().toLowerCase()))
}

function fieldSelectLabel(field: CalculatorFieldLike | undefined, value: number | undefined): string | null {
  if (value === undefined || value === null || !field?.options?.length) return null
  const opt = field.options.find((o) => Number(o.value) === Number(value))
  return opt?.label?.trim() || null
}

function shortenObjective(raw: string, locale: Language, forWhatsApp = false): string {
  const l = raw.toLowerCase()
  if (locale === 'en') {
    if (/lose|perder|emagrec/i.test(l)) return forWhatsApp ? 'want to lose weight' : 'lose weight'
    if (/gain|ganhar|massa/i.test(l)) return forWhatsApp ? 'want to gain muscle' : 'gain muscle'
    if (/maintain|manter/i.test(l)) return forWhatsApp ? 'want to maintain weight' : 'maintain weight'
    return raw.trim()
  }
  if (locale === 'es') {
    if (/perder|bajar/i.test(l)) return forWhatsApp ? 'quiero perder peso' : 'perder peso'
    if (/ganar|masa/i.test(l)) return forWhatsApp ? 'quiero ganar masa' : 'ganar masa'
    if (/mantener/i.test(l)) return forWhatsApp ? 'quiero mantener el peso' : 'mantener peso'
    return raw.trim()
  }
  if (/perder|emagrec/i.test(l)) return forWhatsApp ? 'quero perder peso' : 'perder peso'
  if (/ganhar|massa/i.test(l)) return forWhatsApp ? 'quero ganhar massa' : 'ganhar massa'
  if (/manter/i.test(l)) return forWhatsApp ? 'quero manter o peso' : 'manter peso'
  return raw.trim()
}

function shortenActivity(raw: string, locale: Language): string {
  const l = raw.toLowerCase()
  if (locale === 'en') {
    if (/almost|sedent|pouco|não me movimento/i.test(l)) return 'sedentary'
    if (/light|leve|caminh/i.test(l)) return 'light activity'
    if (/1.a 3|1-3|moder/i.test(l)) return 'train 1–3×/week'
    if (/4.a 6|4-6|intenso/i.test(l)) return 'train 4–6×/week'
    if (/atleta|athlete|pesado/i.test(l)) return 'heavy training'
    return raw.trim()
  }
  if (locale === 'es') {
    if (/sedent|poco|no me movimiento/i.test(l)) return 'sedentario'
    if (/leve|camin/i.test(l)) return 'actividad leve'
    if (/1.a 3|1-3|moder/i.test(l)) return 'entreno 1–3×/sem'
    if (/4.a 6|4-6|intenso/i.test(l)) return 'entreno 4–6×/sem'
    if (/atleta|pesado/i.test(l)) return 'entreno intenso'
    return raw.trim()
  }
  if (/quase não|sedent|pouco/i.test(l)) return 'sedentário'
  if (/caminh|leve/i.test(l)) return 'caminhadas leves'
  if (/1 a 3|1-3/i.test(l)) return 'treino 1–3×/sem'
  if (/4 a 6|4-6/i.test(l)) return 'treino 4–6×/sem'
  if (/atleta|pesado/i.test(l)) return 'treino intenso'
  return raw.trim()
}

function shortenClimate(raw: string, locale: Language): string {
  const l = raw.toLowerCase()
  if (locale === 'en') {
    if (/muito quente|very hot/i.test(l)) return 'very hot climate'
    if (/quente|hot/i.test(l)) return 'hot climate'
    return 'mild climate'
  }
  if (locale === 'es') {
    if (/muy caliente|muito quente/i.test(l)) return 'clima muy caliente'
    if (/quente|caliente/i.test(l)) return 'clima caliente'
    return 'clima templado'
  }
  if (/muito quente/i.test(l)) return 'clima muito quente'
  if (/quente/i.test(l)) return 'clima quente'
  if (/ameno|temperado/i.test(l)) return 'clima ameno'
  return raw.trim()
}

function shortenSex(raw: string, locale: Language): string | null {
  const l = raw.toLowerCase()
  if (/fem|mulher|woman/i.test(l)) return locale === 'en' ? 'woman' : locale === 'es' ? 'mujer' : 'mulher'
  if (/masc|homem|man/i.test(l)) return locale === 'en' ? 'man' : locale === 'es' ? 'hombre' : 'homem'
  return null
}

function formatKg(value: number, locale: Language): string {
  const loc = locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR'
  const n = value.toLocaleString(loc, { maximumFractionDigits: 1 })
  return locale === 'en' ? `${n} kg` : `${n} kg`
}

function formatCm(value: number): string {
  return `${Math.round(value)} cm`
}

function formatAge(value: number, locale: Language): string {
  const y = Math.round(value)
  if (locale === 'en') return `${y} years`
  if (locale === 'es') return `${y} años`
  return `${y} anos`
}

/** Partes curtas para "90 kg · perder peso" (sem rótulos de formulário). */
export function buildCalculatorInputsRecapParts(
  formulaId: string | undefined,
  fields: CalculatorFieldLike[],
  values: Record<string, number | undefined>,
  locale: Language,
  opts?: { forWhatsApp?: boolean }
): string[] {
  const forWhatsApp = opts?.forWhatsApp === true
  const parts: string[] = []

  const peso = pickNumeric(values, ['peso', 'p1', 'p3', 'peso_kg'])
  const altura = pickNumeric(values, ['altura', 'p4', 'altura_cm'])
  const idade = pickNumeric(values, ['idade', 'p1'])
  const sexoVal = pickNumeric(values, ['sexo', 'p2'])
  const objetivoVal = pickNumeric(values, ['objetivo', 'p6'])
  const atividadeVal = pickNumeric(values, ['atividade', 'p2', 'p5'])
  const climaVal = pickNumeric(values, ['clima', 'p3'])

  const sexoField = findField(fields, ['sexo', 'p2'])
  const objetivoField = findField(fields, ['objetivo', 'p6'])
  const atividadeField = findField(fields, ['atividade', 'p2', 'p5'])
  const climaField = findField(fields, ['clima', 'p3'])

  switch (formulaId) {
    case 'proteina-gkg-v1': {
      if (peso !== undefined) parts.push(formatKg(peso, locale))
      const objLabel = fieldSelectLabel(objetivoField, objetivoVal)
      if (objLabel) parts.push(shortenObjective(objLabel, locale, forWhatsApp))
      break
    }
    case 'imc-oms-v1': {
      if (peso !== undefined) parts.push(formatKg(peso, locale))
      if (altura !== undefined) parts.push(formatCm(altura))
      const idadeForImc = pickNumeric(values, ['idade'])
      if (idadeForImc !== undefined) parts.push(formatAge(idadeForImc, locale))
      const sexLabel = fieldSelectLabel(sexoField, sexoVal)
      const sexShort = sexLabel ? shortenSex(sexLabel, locale) : null
      if (sexShort) parts.push(sexShort)
      break
    }
    case 'calorias-mifflin-v1': {
      const sexLabel = fieldSelectLabel(sexoField, sexoVal)
      const sexShort = sexLabel ? shortenSex(sexLabel, locale) : null
      if (sexShort) parts.push(sexShort)
      const idadeCal = pickNumeric(values, ['idade'])
      if (idadeCal !== undefined) parts.push(formatAge(idadeCal, locale))
      if (peso !== undefined) parts.push(formatKg(peso, locale))
      const actLabel = fieldSelectLabel(atividadeField, atividadeVal)
      if (actLabel) parts.push(shortenActivity(actLabel, locale))
      const objLabel = fieldSelectLabel(objetivoField, objetivoVal)
      if (objLabel) parts.push(shortenObjective(objLabel, locale, forWhatsApp))
      break
    }
    case 'hidratacao-35ml-kg-v1': {
      if (peso !== undefined) parts.push(formatKg(peso, locale))
      const actLabel = fieldSelectLabel(atividadeField, atividadeVal)
      if (actLabel) parts.push(shortenActivity(actLabel, locale))
      const climaLabel = fieldSelectLabel(climaField, climaVal)
      if (climaLabel) parts.push(shortenClimate(climaLabel, locale))
      break
    }
    default: {
      if (peso !== undefined) parts.push(formatKg(peso, locale))
      if (altura !== undefined) parts.push(formatCm(altura))
      const idadeGeneric = pickNumeric(values, ['idade'])
      if (idadeGeneric !== undefined && formulaId !== 'imc-oms-v1') {
        parts.push(formatAge(idadeGeneric, locale))
      }
      const objLabel = fieldSelectLabel(objetivoField, objetivoVal)
      if (objLabel) parts.push(shortenObjective(objLabel, locale, forWhatsApp))
    }
  }

  return parts
}

export function buildCalculatorInputsRecapLine(
  intro: string,
  parts: string[],
  locale: Language
): string | null {
  if (!parts.length) return intro.trim() || null
  const sep = ' · '
  const body = parts.join(sep)
  const lead =
    intro.trim() ||
    (locale === 'en'
      ? 'Based on what you provided'
      : locale === 'es'
        ? 'Según lo que indicaste'
        : 'Com base no que você informou')
  const normalizedLead = lead.replace(/:+\s*$/, '')
  return `${normalizedLead}: ${body}`
}

function calculatorShortName(title: string, formulaId: string | undefined, locale: Language): string {
  const t = title.toLowerCase()
  if (formulaId === 'proteina-gkg-v1' || t.includes('prote'))
    return locale === 'en' ? 'protein calculator' : locale === 'es' ? 'calculadora de proteína' : 'calculadora de proteína'
  if (formulaId === 'imc-oms-v1' || t.includes('imc'))
    return locale === 'en' ? 'BMI calculator' : locale === 'es' ? 'calculadora de IMC' : 'calculadora de IMC'
  if (formulaId === 'calorias-mifflin-v1' || t.includes('caloria'))
    return locale === 'en' ? 'calorie calculator' : locale === 'es' ? 'calculadora de calorías' : 'calculadora de calorias'
  if (formulaId === 'hidratacao-35ml-kg-v1' || t.includes('água') || t.includes('agua') || t.includes('hidrata'))
    return locale === 'en' ? 'hydration calculator' : locale === 'es' ? 'calculadora de hidratación' : 'calculadora de hidratação'
  return title.trim()
}

function formatResultPhrase(
  formulaId: string | undefined,
  resultNum: number,
  resultSuffix: string | undefined,
  locale: Language,
  decimalPlaces: number,
  nativeResult: FormulaResult | null
): string {
  const loc = locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR'
  const n = resultNum.toLocaleString(loc, {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimalPlaces,
  })

  switch (formulaId) {
    case 'proteina-gkg-v1':
      return locale === 'en'
        ? `it came out to ${n} g per day`
        : locale === 'es'
          ? `salió ${n} g por día`
          : `deu ${n} g por dia`
    case 'imc-oms-v1': {
      const classificacao =
        typeof nativeResult?.meta?.classificacao === 'string' ? nativeResult.meta.classificacao : ''
      const imcFmt = typeof nativeResult?.meta?.imc === 'number' ? String(nativeResult.meta.imc) : n
      if (classificacao) {
        return locale === 'en'
          ? `it came out to ${imcFmt} (${classificacao.toLowerCase()})`
          : locale === 'es'
            ? `dio ${imcFmt} (${classificacao.toLowerCase()})`
            : `deu ${imcFmt} (${classificacao.toLowerCase()})`
      }
      return locale === 'en' ? `it came out to ${imcFmt}` : locale === 'es' ? `dio ${imcFmt}` : `deu ${imcFmt}`
    }
    case 'calorias-mifflin-v1':
      return locale === 'en'
        ? `it came out to about ${n} kcal per day`
        : locale === 'es'
          ? `salió alrededor de ${n} kcal por día`
          : `deu cerca de ${n} kcal por dia`
    case 'hidratacao-35ml-kg-v1': {
      const copos = nativeResult?.copos ?? Math.round(resultNum)
      const ml = nativeResult?.valor ?? resultNum * 250
      const liters = (ml / 1000).toLocaleString(loc, { minimumFractionDigits: 1, maximumFractionDigits: 1 })
      return locale === 'en'
        ? `it came out to about ${liters} L per day (${copos} glasses)`
        : locale === 'es'
          ? `salió alrededor de ${liters} L por día (${copos} vasos)`
          : `deu cerca de ${liters} L por dia (${copos} copos)`
    }
    default: {
      const suf = (resultSuffix || '').trim()
      return locale === 'en'
        ? `the result was ${n}${suf ? ` ${suf}` : ''}`
        : locale === 'es'
          ? `el resultado fue ${n}${suf ? ` ${suf}` : ''}`
          : `o resultado foi ${n}${suf ? ` ${suf}` : ''}`
    }
  }
}

function formatNumericInputToken(value: number, fieldId: string, locale: Language): string {
  const loc = locale === 'en' ? 'en-US' : locale === 'es' ? 'es-ES' : 'pt-BR'
  const decimals = fieldId === 'peso' || fieldId === 'p1' ? 1 : 0
  return value.toLocaleString(loc, { minimumFractionDigits: 0, maximumFractionDigits: decimals })
}

/** Valor humano de um input pelo id da pergunta ({peso}, {p1}, {objetivo}, …). */
function resolveInputTokenValue(
  fieldId: string,
  fields: CalculatorFieldLike[],
  values: Record<string, number | undefined>,
  locale: Language
): string {
  const field = fields.find((f) => f.id === fieldId)
  const raw = values[fieldId]
  if (raw === undefined || raw === null || Number.isNaN(Number(raw))) return ''

  const tipo = (field?.type as string | undefined)?.toLowerCase()
  if (tipo === 'select' && field?.options?.length) {
    const label = fieldSelectLabel(field, raw)
    if (!label) return String(raw)
    if (fieldId === 'objetivo') return shortenObjective(label, locale)
    if (fieldId === 'sexo') return shortenSex(label, locale) ?? label
    if (fieldId === 'atividade' || fieldId === 'p2' || fieldId === 'p5') {
      return shortenActivity(label, locale)
    }
    if (fieldId === 'clima' || fieldId === 'p3') return shortenClimate(label, locale)
    return label
  }

  return formatNumericInputToken(Number(raw), fieldId, locale)
}

/** Substitui tokens de input e resultado no template handoff.prefillWhatsApp do molde. */
export function applyCalculatorPrefillWhatsAppTemplate(
  template: string,
  fields: CalculatorFieldLike[],
  values: Record<string, number | undefined>,
  opts: {
    resultNum: number
    locale: Language
    decimalPlaces?: number
    nativeResult?: FormulaResult | null
  }
): string {
  const { resultNum, locale, nativeResult = null } = opts
  const resultado: FormulaResult =
    nativeResult ??
    ({
      valor: resultNum,
      unidade: '',
    } satisfies FormulaResult)

  const withInputs = template.replace(/\{([a-zA-Z][a-zA-Z0-9_]*)\}/g, (full, key: string) => {
    const resultKeys = new Set([
      'resultado_ml',
      'resultado_litros',
      'resultado_copos',
      'gramas',
      'kcal',
      'imc',
      'classificacao',
    ])
    if (resultKeys.has(key)) return full
    return resolveInputTokenValue(key, fields, values, locale)
  })

  return applyDevolutivaTokens(withInputs, resultado)
}

function defaultHelpAsk(locale: Language): string {
  if (locale === 'en') return 'Could you help me?'
  if (locale === 'es') return '¿Puedes ayudarme?'
  return 'Pode me ajudar?'
}

function helpIntentPhrase(formulaId: string | undefined, locale: Language): string {
  switch (formulaId) {
    case 'proteina-gkg-v1':
      return locale === 'en'
        ? "I'd like help fitting this into my routine."
        : locale === 'es'
          ? 'Quisiera ayuda para encajarlo en mi rutina.'
          : 'Queria ajuda pra encaixar na rotina.'
    case 'imc-oms-v1':
      return locale === 'en'
        ? "I'd like to understand what this number means for me."
        : locale === 'es'
          ? 'Quisiera entender qué significa este número para mí.'
          : 'Queria entender melhor o que esse número significa pra mim.'
    case 'calorias-mifflin-v1':
      return locale === 'en'
        ? "I'd like help using this number in practice."
        : locale === 'es'
          ? 'Quisiera ayuda para usar este número en la práctica.'
          : 'Queria ajuda pra usar esse número na prática.'
    case 'hidratacao-35ml-kg-v1':
      return locale === 'en'
        ? "I'd like help turning this into a habit."
        : locale === 'es'
          ? 'Quisiera ayuda para convertir esto en hábito.'
          : 'Queria ajuda pra transformar isso em hábito.'
    default:
      return locale === 'en'
        ? "I'd like to talk about this result."
        : locale === 'es'
          ? 'Quisiera hablar sobre este resultado.'
          : 'Queria conversar sobre esse resultado.'
  }
}

/** Prefill WhatsApp: molde handoff.prefillWhatsApp com tokens; fallback programático se ausente. */
export function buildCalculatorWhatsAppPrefillHuman(opts: {
  title: string
  formulaId?: string
  fields: CalculatorFieldLike[]
  values: Record<string, number | undefined>
  resultNum: number
  resultSuffix?: string
  locale: Language
  decimalPlaces?: number
  nativeResult?: FormulaResult | null
  prefillWhatsApp?: string
}): string {
  const {
    title,
    formulaId,
    fields,
    values,
    resultNum,
    resultSuffix,
    locale,
    decimalPlaces = 2,
    nativeResult = null,
    prefillWhatsApp,
  } = opts

  const moldTemplate = prefillWhatsApp?.trim()
  if (moldTemplate) {
    return applyCalculatorPrefillWhatsAppTemplate(moldTemplate, fields, values, {
      resultNum,
      locale,
      decimalPlaces,
      nativeResult,
    })
  }

  const calcName = calculatorShortName(title, formulaId, locale)
  const inputParts = buildCalculatorInputsRecapParts(formulaId, fields, values, locale, {
    forWhatsApp: true,
  })
  const inputsParenthetical = inputParts.length ? ` (${inputParts.join(', ')})` : ''
  const resultPhrase = formatResultPhrase(
    formulaId,
    resultNum,
    resultSuffix,
    locale,
    decimalPlaces,
    nativeResult
  )
  const helpIntent = helpIntentPhrase(formulaId, locale)
  const closing = defaultHelpAsk(locale)

  if (locale === 'en') {
    return `Hi! I used the ${calcName}${inputsParenthetical} and ${resultPhrase}. ${helpIntent} ${closing}`
  }
  if (locale === 'es') {
    return `¡Hola! Hice la ${calcName}${inputsParenthetical} y ${resultPhrase}. ${helpIntent} ${closing}`
  }
  return `Oi! Fiz a ${calcName}${inputsParenthetical} e ${resultPhrase}. ${helpIntent} ${closing}`
}
