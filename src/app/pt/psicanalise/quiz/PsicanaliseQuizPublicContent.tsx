'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface PsicanaliseQuizPublicContentProps {
  entradaComNicho?: boolean
}

export default function PsicanaliseQuizPublicContent({ entradaComNicho = false }: PsicanaliseQuizPublicContentProps) {
  const config = getPublicFlowConfig('psicanalise')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
