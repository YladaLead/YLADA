'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface CoachQuizPublicContentProps {
  entradaComNicho?: boolean
}

export default function CoachQuizPublicContent({ entradaComNicho = false }: CoachQuizPublicContentProps) {
  const config = getPublicFlowConfig('coach')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
