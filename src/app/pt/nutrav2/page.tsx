import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/nutra (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Nutra (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/nutra.',
}

export default function NutraV2ArchivePage() {
  return <AreaMinimalLandingById areaId="nutra" />
}
