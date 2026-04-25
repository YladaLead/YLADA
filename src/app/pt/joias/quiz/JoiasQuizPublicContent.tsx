'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface JoiasQuizPublicContentProps {
  entradaComNicho?: boolean
}

export default function JoiasQuizPublicContent({ entradaComNicho = false }: JoiasQuizPublicContentProps) {
  const config = getPublicFlowConfig('joias')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
