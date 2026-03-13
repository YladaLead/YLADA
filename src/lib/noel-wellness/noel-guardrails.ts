/**
 * Guardrails do Noel: validação da resposta antes de enviar ao usuário.
 * Garante consistência, previsibilidade e estabilidade (Response Pipeline).
 *
 * Fluxo: LLM Response → Guardrails Validator → Final Response (ou regenerar/simplificar).
 * Ver: docs/YLADA-ARQUITETURA-COMPLETA.md
 */

export type GuardrailFailureReason =
  | 'missing_next_action'
  | 'too_long'
  | 'too_short'
  | 'possibly_generic'

export interface GuardrailResult {
  valid: boolean
  reason?: GuardrailFailureReason
  /** Sugestão para nova geração (ex.: "Inclua uma Próxima ação clara."). */
  suggestion?: string
}

const MAX_LENGTH = 1800
const MIN_LENGTH = 20

/** Padrões que indicam "próxima ação" (flexível). */
const NEXT_ACTION_PATTERNS = [
  /próxim[ao]\s*(passo|ação|acao)/i,
  /próxima\s*ação/i,
  /próximo\s*passo/i,
  /ação\s*(sugerida|imediata|agora)/i,
  /o\s*que\s*fazer\s*(agora|hoje)/i,
  /(faça|fale|envie|liste)\s*(agora|hoje|em\s*24h)/i,
  /^\s*\d+[\.\)]\s*[^\n]+/m,
]

/** Frases genéricas que indicam resposta vaga (opcional). */
const GENERIC_PHRASES = [
  /^(\s*)(você pode|tente|talvez|é possível)/im,
  /(não\s*há\s*uma\s*resposta\s*única|depende\s*de)/i,
]

/**
 * Valida a resposta do Noel antes de enviar ao usuário.
 * Verifica: tamanho, presença de ação clara, e (opcional) se não é genérica demais.
 */
export function validateNoelResponse(response: string): GuardrailResult {
  const trimmed = response?.trim() ?? ''

  if (trimmed.length < MIN_LENGTH) {
    return {
      valid: false,
      reason: 'too_short',
      suggestion: 'Resposta muito curta; inclua orientação e próxima ação.',
    }
  }

  if (trimmed.length > MAX_LENGTH) {
    return {
      valid: false,
      reason: 'too_long',
      suggestion: `Resuma em até ${MAX_LENGTH} caracteres e inclua Próxima ação.`,
    }
  }

  const hasNextAction = NEXT_ACTION_PATTERNS.some((p) => p.test(trimmed))
  if (!hasNextAction) {
    return {
      valid: false,
      reason: 'missing_next_action',
      suggestion: 'Inclua uma "Próxima ação" ou "Próximo passo" claro.',
    }
  }

  const looksGeneric = GENERIC_PHRASES.some((p) => p.test(trimmed))
  if (looksGeneric && trimmed.length < 150) {
    return {
      valid: false,
      reason: 'possibly_generic',
      suggestion: 'Seja mais específico: inclua exemplo ou ação concreta.',
    }
  }

  return { valid: true }
}

/**
 * Mensagem de fallback quando a resposta falha na validação (ex.: após 1 retry).
 */
export const NOEL_FALLBACK_RESPONSE = `Vamos simplificar em um passo prático.

**Diagnóstico rápido:** Preciso te orientar de forma mais direta.

**Próxima ação:** Me diga em uma frase: qual é o principal desafio agora — atrair pessoas, criar diagnóstico ou organizar sua rotina? A partir disso te dou o próximo passo exato.`
