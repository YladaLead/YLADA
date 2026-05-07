/**
 * Padrão único para fluxos de quiz/diagnóstico públicos em `/l/[slug]`.
 * @see .cursor/rules/ylada-public-quiz-intro.mdc
 */

export type ConfigDrivenPublicStep = 'intro' | 'form' | 'result' | 'limit_reached' | 'access_paused'

/**
 * Efeito de sincronização: quando a API devolve diagnóstico + metrics_id, o passo deve
 * tornar-se `result` — exceto na **intro**, para nunca saltar a primeira tela por estado
 * residual (HMR, restore, etc.).
 */
export function shouldAdvanceConfigDrivenStepToResult(
  step: ConfigDrivenPublicStep,
  hasDiagnosis: boolean,
  hasMetricsId: boolean
): boolean {
  if (!hasDiagnosis || !hasMetricsId) return false
  if (step === 'intro') return false
  return step !== 'result'
}
