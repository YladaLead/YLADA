'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface FitnessQuizPublicContentProps {
  entradaComNicho?: boolean
}

export default function FitnessQuizPublicContent({ entradaComNicho = false }: FitnessQuizPublicContentProps) {
  const config = getPublicFlowConfig('fitness')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
