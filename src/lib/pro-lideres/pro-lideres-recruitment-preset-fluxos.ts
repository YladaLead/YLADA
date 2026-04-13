import type { FluxoCliente } from '@/types/wellness-system'
import { getFluxoRecrutamentoById } from '@/lib/wellness-system/fluxos-recrutamento'
import { proLideresRecruitmentQuizFluxos } from '@/lib/pro-lideres/pro-lideres-recruitment-quiz-fluxos'

/**
 * Presets de Recrutamento Pro Líderes: os 3 quizzes clássicos + Renda Extra Imediata +
 * Mães que Querem Trabalhar de Casa (mesmo motor /l/… e diagnóstico que os restantes).
 */
export function getProLideresRecruitmentPresetFluxos(): FluxoCliente[] {
  const extra: FluxoCliente[] = []
  const renda = getFluxoRecrutamentoById('renda-extra-imediata')
  const maes = getFluxoRecrutamentoById('maes-trabalhar-casa')
  if (renda) extra.push(renda)
  if (maes) extra.push(maes)
  return [...proLideresRecruitmentQuizFluxos, ...extra]
}
