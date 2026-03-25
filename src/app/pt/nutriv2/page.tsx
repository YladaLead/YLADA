import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/nutri (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Nutri (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/nutri.',
}

export default function NutriV2ArchivePage() {
  return <AreaMinimalLandingById areaId="nutri" />
}
