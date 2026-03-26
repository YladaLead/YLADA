'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface EsteticaQuizPublicContentProps {
  /** true = /pt/estetica: escolhe nicho → quiz personalizado → resultado */
  entradaComNicho?: boolean
}

/**
 * Funil público Estética — delega a {@link YladaPublicEntryFlow} + registry (Fase 1 matriz).
 */
export default function EsteticaQuizPublicContent({ entradaComNicho = false }: EsteticaQuizPublicContentProps) {
  const config = getPublicFlowConfig('estetica')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
