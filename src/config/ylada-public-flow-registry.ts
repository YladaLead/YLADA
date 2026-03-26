/**
 * Registry do funil público por código de área da matriz YLADA.
 * Fase 1: apenas estetica. Novas áreas: buildXPublicFlowConfig + entrada no mapa.
 */

import { buildEsteticaPublicFlowConfig } from '@/config/ylada-public-flow-estetica'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'

const CONFIG_BY_AREA: Record<string, () => PublicFlowConfig> = {
  estetica: buildEsteticaPublicFlowConfig,
}

const configCache = new Map<string, PublicFlowConfig>()

/** Instância estável por área (evita re-renders desnecessários no motor). */
export function getPublicFlowConfig(areaCodigo: string): PublicFlowConfig | null {
  const build = CONFIG_BY_AREA[areaCodigo]
  if (!build) return null
  let cached = configCache.get(areaCodigo)
  if (!cached) {
    cached = build()
    configCache.set(areaCodigo, cached)
  }
  return cached
}
