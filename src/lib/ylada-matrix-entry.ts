/**
 * Links do hub /pt/segmentos → áreas com funil matriz (standard) passam por /pt/entrada/{area}
 * antes da raiz da área, para escolher nicho e gravar handoff (Fase 3).
 */

import { areaUsesStandardPublicFlowMotor } from '@/config/ylada-public-flow-registry'

/** Destino ao tocar no segmento no piloto: funil matriz ou raiz clássica /pt/{id}. */
export function getMatrixHubHrefForArea(areaId: string): string {
  if (areaUsesStandardPublicFlowMotor(areaId)) {
    return `/pt/entrada/${areaId}`
  }
  return `/pt/${areaId}`
}
