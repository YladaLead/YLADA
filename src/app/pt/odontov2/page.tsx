import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/odonto (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Odontologia (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/odonto.',
}

export default function OdontoV2ArchivePage() {
  return <AreaMinimalLandingById areaId="odonto" />
}
