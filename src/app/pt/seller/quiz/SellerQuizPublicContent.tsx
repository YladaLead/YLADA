'use client'

import YladaPublicEntryFlow from '@/components/ylada/YladaPublicEntryFlow'
import { getPublicFlowConfig } from '@/config/ylada-public-flow-registry'

export interface SellerQuizPublicContentProps {
  entradaComNicho?: boolean
}

export default function SellerQuizPublicContent({ entradaComNicho = false }: SellerQuizPublicContentProps) {
  const config = getPublicFlowConfig('seller')
  if (!config) return null
  return <YladaPublicEntryFlow config={config} entradaComNicho={entradaComNicho} />
}
