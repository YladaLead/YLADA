/**
 * Links do hub /pt/segmentos → funil matriz em /pt/entrada/{area} quando o motor standard está ativo.
 */

import { areaUsesStandardPublicFlowMotor } from '@/config/ylada-public-flow-registry'

/** Destino ao tocar no segmento: /pt/entrada/{id} com handoff antes da landing pública da área. */
export function getMatrixHubHrefForArea(areaId: string): string {
  if (areaUsesStandardPublicFlowMotor(areaId)) {
    return `/pt/entrada/${areaId}`
  }
  return `/pt/${areaId}`
}
