/**
 * Links do hub /pt/segmentos → quiz standard (Estética) ou entrada só-nicho (Med/Psi)
 * em /pt/entrada/{area}, com handoff antes da landing da área.
 */

import { areaUsesStandardPublicFlowMotor } from '@/config/ylada-public-flow-registry'
import { supportsMatrixEntradaNicho } from '@/lib/ylada-matrix-entrada-fallback'

/** Destino ao tocar no segmento no piloto: /pt/entrada/{id} quando há funil matriz ou pack só-nicho. */
export function getMatrixHubHrefForArea(areaId: string): string {
  if (areaUsesStandardPublicFlowMotor(areaId) || supportsMatrixEntradaNicho(areaId)) {
    return `/pt/entrada/${areaId}`
  }
  return `/pt/${areaId}`
}
