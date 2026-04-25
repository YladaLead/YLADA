/**
 * Registry do funil público por código de área da matriz YLADA.
 * Fase 1: motor + Estética. Fase 2: alinhado a YLADA_AREAS.publicEntry === 'standard'.
 */

import { getYladaAreaPublicEntryMode } from '@/config/ylada-areas'
import { buildCoachPublicFlowConfig } from '@/config/ylada-public-flow-coach'
import { buildEsteticaPublicFlowConfig } from '@/config/ylada-public-flow-estetica'
import { buildFitnessPublicFlowConfig } from '@/config/ylada-public-flow-fitness'
import { buildJoiasPublicFlowConfig } from '@/config/ylada-public-flow-joias'
import { buildMedPublicFlowConfig } from '@/config/ylada-public-flow-med'
import { buildNutraPublicFlowConfig } from '@/config/ylada-public-flow-nutra'
import { buildNutriPublicFlowConfig } from '@/config/ylada-public-flow-nutri'
import { buildOdontoPublicFlowConfig } from '@/config/ylada-public-flow-odonto'
import { buildPerfumariaPublicFlowConfig } from '@/config/ylada-public-flow-perfumaria'
import { buildPsiPublicFlowConfig } from '@/config/ylada-public-flow-psi'
import { buildPsicanalisePublicFlowConfig } from '@/config/ylada-public-flow-psicanalise'
import { buildSellerPublicFlowConfig } from '@/config/ylada-public-flow-seller'
import type { PublicFlowConfig } from '@/config/ylada-public-flow-types'

const CONFIG_BY_AREA: Record<string, () => PublicFlowConfig> = {
  coach: buildCoachPublicFlowConfig,
  estetica: buildEsteticaPublicFlowConfig,
  fitness: buildFitnessPublicFlowConfig,
  joias: buildJoiasPublicFlowConfig,
  med: buildMedPublicFlowConfig,
  nutra: buildNutraPublicFlowConfig,
  nutri: buildNutriPublicFlowConfig,
  odonto: buildOdontoPublicFlowConfig,
  perfumaria: buildPerfumariaPublicFlowConfig,
  psi: buildPsiPublicFlowConfig,
  psicanalise: buildPsicanalisePublicFlowConfig,
  seller: buildSellerPublicFlowConfig,
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

/** Área declarada como standard no registro YLADA e com config de funil carregável. */
export function areaUsesStandardPublicFlowMotor(areaCodigo: string): boolean {
  return getYladaAreaPublicEntryMode(areaCodigo) === 'standard' && getPublicFlowConfig(areaCodigo) != null
}
