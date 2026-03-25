import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/med (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Medicina (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/med.',
}

export default function MedV2ArchivePage() {
  return <AreaMinimalLandingById areaId="med" />
}
