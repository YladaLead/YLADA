/**
 * Faixas de pontuação da Avaliação do Perfil Metabólico (5 MCQs × 0–3, máx. 15).
 * Alinhadas ao template Wellness `metabolic-profile-assessment/page.tsx`.
 */
export const AVALIACAO_PERFIL_METABOLICO_RISK_BANDS = {
  /** ≥12 → metabolismo lento (arquétipo urgente no link Pro Líderes). */
  altoMin: 12,
  /** ≥8 → metabolismo moderado. */
  medioMin: 8,
} as const

export const AVALIACAO_PERFIL_METABOLICO_FLOW_ID = 'avaliacao-perfil-metabolico' as const
