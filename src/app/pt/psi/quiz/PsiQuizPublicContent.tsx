'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface PsiQuizPublicContentProps {
  entradaComNicho?: boolean
}

export default function PsiQuizPublicContent({ entradaComNicho = false }: PsiQuizPublicContentProps) {
  const config = getPublicFlowConfig('psi')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
