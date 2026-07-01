/**
 * Noel Pro Líderes unificado na matriz (`POST /api/ylada/noel`).
 * Flag OFF = hook inerte (byte-idêntico). Spec: blueprint Noel_Completo §9.3 r20.
 */

/** Modelo padrão do Noel (matriz + ramos PL unificados). */
export const NOEL_CHAT_MODEL = 'gpt-4o-mini'

/** Liga injeção do bloco `[CONTEXTO PRO LÍDERES]` na rota da matriz. OFF por padrão. */
export function isNoelProLideresUnifiedEnabled(): boolean {
  return (
    process.env.NOEL_PRO_LIDERES_UNIFIED_ENABLED === 'true' ||
    process.env.NOEL_PRO_LIDERES_UNIFIED_ENABLED === '1'
  )
}
