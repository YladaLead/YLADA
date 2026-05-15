/**
 * Biblioteca de fluxos do vertical Coach de bem-estar.
 *
 * Espelha os mesmos fluxos do Pro Líderes, removendo apenas os dois que
 * têm referências explícitas a produtos Herbalife:
 *   - 'ja-usa-energia-acelera'   (produto de energia MLM)
 *   - 'ja-consome-bem-estar'     (produto de bem-estar MLM)
 *
 * Os links gerados apontam para /pt/coach-bem-estar/{userSlug}/{toolSlug}
 * em vez de /pt/wellness/ — mesmo conteúdo, branding independente.
 */
import type { FluxoCliente } from '@/types/wellness-system'
import { getProLideresSalesPresetFluxos } from '@/lib/pro-lideres/pro-lideres-sales-preset-fluxos'
import { getProLideresRecruitmentPresetFluxos } from '@/lib/pro-lideres/pro-lideres-recruitment-preset-fluxos'

/** IDs de recrutamento com linguagem Herbalife — excluídos do Coach de bem-estar. */
const RECRUTAMENTO_IDS_EXCLUIDOS = new Set([
  'ja-usa-energia-acelera',
  'ja-consome-bem-estar',
])

/**
 * Fluxos de VENDAS para o Coach de bem-estar.
 * Inclui todos os 21 fluxos de clientes (energia, digestão, mente, rotina)
 * + calculadoras básicas (água, calorias, proteína).
 */
export function getCoachBemEstarSalesFluxos(): FluxoCliente[] {
  return getProLideresSalesPresetFluxos()
}

/**
 * Fluxos de RECRUTAMENTO para o Coach de bem-estar.
 * 15 fluxos (17 do Pro Líderes - 2 Herbalife).
 * Quizzes de entrada: Ganhos · Potencial · Propósito.
 * Perfis clássicos: renda extra, mães em casa, perderam emprego, etc.
 */
export function getCoachBemEstarRecruitmentFluxos(): FluxoCliente[] {
  return getProLideresRecruitmentPresetFluxos().filter(
    (f) => !RECRUTAMENTO_IDS_EXCLUIDOS.has(f.id)
  )
}
