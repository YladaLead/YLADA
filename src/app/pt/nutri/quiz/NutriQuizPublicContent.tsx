'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface NutriQuizPublicContentProps {
  /** true = /pt/nutri: escolhe nicho → quiz → resultado (padrão matriz) */
  entradaComNicho?: boolean
}

/**
 * Funil público Nutri (matriz) — paridade com Estética.
 * Quiz de carreira (lead): /pt/nutri/quiz/legacy. Redirecionamento /pt/nutri/quiz → /pt/nutri.
 */
export default function NutriQuizPublicContent({ entradaComNicho = false }: NutriQuizPublicContentProps) {
  const config = getPublicFlowConfig('nutri')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
