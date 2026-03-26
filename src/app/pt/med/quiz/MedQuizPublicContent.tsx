'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface MedQuizPublicContentProps {
  entradaComNicho?: boolean
}

export default function MedQuizPublicContent({ entradaComNicho = false }: MedQuizPublicContentProps) {
  const config = getPublicFlowConfig('med')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
