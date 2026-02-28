/**
 * Validação de saída do motor de diagnóstico (contrato fixo).
 * consequence = marcador de perda/estagnação/risco OU verbo de impacto.
 * growth_potential = marcador de ganho OU verbo de ganho.
 * cta_text = imperativo (não consultivo).
 */
import type { DiagnosisDecisionOutput } from './diagnosis-types'
import { DiagnosisValidationError } from './diagnosis-types'

const MIN_SUMMARY_LEN = 180
const MAX_SUMMARY_LEN = 350
const MIN_CONSEQUENCE_LEN_FOR_VERB = 25
const MIN_GROWTH_LEN_FOR_VERB = 25

/** Marcadores de perda, estagnação ou risco invisível (consequence). */
const CONSEQUENCE_MARKERS = [
  'perda', 'perder', 'estagnação', 'estagnar', 'risco', 'piorar', 'piora',
  'continuar', 'ciclo', 'frustração', 'ignorar', 'desistir', 'estável',
  'quebra', 'repetir', 'isolado', 'invisível', 'oculto', 'inconsistente', 'instável',
  'corrige efeito', 'não a causa', 'mal calibrado', 'acima do realista',
]

/** Verbos de impacto (tensão): consequence pode ter keyword OU comprimento + um destes. */
const CONSEQUENCE_IMPACT_VERBS = [
  'perder', 'limitar', 'comprometer', 'deixar', 'manter', 'reduzir', 'travar',
  'piorar', 'repetir', 'ignorar', 'desistir', 'acumular', 'deixando', 'limitam',
]

/** Marcadores de ganho concreto (growth_potential). */
const GROWTH_MARKERS = [
  'aumentar', 'melhorar', 'elevar', 'ampliar', 'crescer', 'destravar',
  'ajustar', 'calibrar', 'ganho', 'potencial', 'progresso', 'segurança',
  'consistência', 'previsível', 'leve', 'coerente', 'direcionado',
  'boa notícia', 'dá para', 'possível', 'chance',
]

/** Verbos de ganho: growth_potential pode ter keyword OU comprimento + um destes. */
const GROWTH_GAIN_VERBS = [
  'aumentar', 'melhorar', 'elevar', 'ampliar', 'crescer', 'destravar',
  'ajustar', 'calibrar', 'avançar', 'evoluir',
]

/** Padrões consultivos (CTA não pode começar assim). */
const CTA_CONSULTIVE_PATTERNS = /^(quero\s|quer\sque\s)/i

function hasMarker(text: string, markers: string[]): boolean {
  const lower = text.toLowerCase().trim()
  return markers.some((m) => {
    const re = new RegExp(`\\b${m.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    return re.test(lower)
  })
}

function hasImpactVerbOrNegation(text: string): boolean {
  const lower = text.toLowerCase().trim()
  if (lower.length < MIN_CONSEQUENCE_LEN_FOR_VERB) return false
  const hasVerb = CONSEQUENCE_IMPACT_VERBS.some((v) => {
    const re = new RegExp(`\\b${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    return re.test(lower)
  })
  if (hasVerb) return true
  return /\bnão\b.*\b(ajustar|melhorar|avançar|resolver|mudar|evoluir)\b/i.test(lower)
}

function hasGainVerb(text: string): boolean {
  const lower = text.toLowerCase().trim()
  if (lower.length < MIN_GROWTH_LEN_FOR_VERB) return false
  return GROWTH_GAIN_VERBS.some((v) => {
    const re = new RegExp(`\\b${v.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
    return re.test(lower)
  })
}

function isImperativeCta(text: string): boolean {
  const t = text.trim()
  if (!t.length) return false
  return !CTA_CONSULTIVE_PATTERNS.test(t)
}

/**
 * Valida o objeto de saída. Lança DiagnosisValidationError se algum campo
 * não atender às regras (vazio, sem marcador semântico ou CTA consultivo).
 */
export function validateDiagnosisDecision(out: DiagnosisDecisionOutput): void {
  const trim = (s: string) => (s ?? '').trim()

  if (!trim(out.profile_title).length) {
    throw new DiagnosisValidationError('profile_title é obrigatório', 'profile_title')
  }

  const summary = trim(out.profile_summary)
  if (summary.length < MIN_SUMMARY_LEN) {
    throw new DiagnosisValidationError(
      `profile_summary deve ter ao menos ${MIN_SUMMARY_LEN} caracteres`,
      'profile_summary'
    )
  }
  if (summary.length > MAX_SUMMARY_LEN) {
    throw new DiagnosisValidationError(
      `profile_summary deve ter no máximo ${MAX_SUMMARY_LEN} caracteres`,
      'profile_summary'
    )
  }

  if (!trim(out.main_blocker).length) {
    throw new DiagnosisValidationError('main_blocker é obrigatório (único bloqueio visível)', 'main_blocker')
  }

  const consequence = trim(out.consequence)
  if (!consequence.length) {
    throw new DiagnosisValidationError('consequence é obrigatório', 'consequence')
  }
  const consequenceHasTension =
    hasMarker(consequence, CONSEQUENCE_MARKERS) || hasImpactVerbOrNegation(consequence)
  if (!consequenceHasTension) {
    throw new DiagnosisValidationError(
      'consequence deve conter marcador de perda/estagnação/risco ou verbo de impacto (ex.: perder, limitar, comprometer, deixar, travar)',
      'consequence'
    )
  }

  const growth = trim(out.growth_potential)
  if (!growth.length) {
    throw new DiagnosisValidationError('growth_potential é obrigatório', 'growth_potential')
  }
  const growthHasGain = hasMarker(growth, GROWTH_MARKERS) || hasGainVerb(growth)
  if (!growthHasGain) {
    throw new DiagnosisValidationError(
      'growth_potential deve conter marcador de ganho concreto ou verbo de ganho (ex.: aumentar, melhorar, elevar, ampliar, crescer, destravar)',
      'growth_potential'
    )
  }

  const cta = trim(out.cta_text)
  if (!cta.length) {
    throw new DiagnosisValidationError('cta_text é obrigatório', 'cta_text')
  }
  if (!isImperativeCta(cta)) {
    throw new DiagnosisValidationError(
      'cta_text deve ser imperativo (não pode começar com "Quero" ou "Quer que")',
      'cta_text'
    )
  }

  if (!trim(out.whatsapp_prefill).length) {
    throw new DiagnosisValidationError('whatsapp_prefill é obrigatório', 'whatsapp_prefill')
  }
}
