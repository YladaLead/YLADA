'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface PerfumariaQuizPublicContentProps {
  entradaComNicho?: boolean
}

export default function PerfumariaQuizPublicContent({ entradaComNicho = false }: PerfumariaQuizPublicContentProps) {
  const config = getPublicFlowConfig('perfumaria')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
