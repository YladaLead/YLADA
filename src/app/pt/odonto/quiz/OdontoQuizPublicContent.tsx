'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface OdontoQuizPublicContentProps {
  entradaComNicho?: boolean
}

export default function OdontoQuizPublicContent({ entradaComNicho = false }: OdontoQuizPublicContentProps) {
  const config = getPublicFlowConfig('odonto')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
