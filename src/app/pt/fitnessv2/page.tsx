import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/fitness (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Fitness (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/fitness.',
}

export default function FitnessV2ArchivePage() {
  return <AreaMinimalLandingById areaId="fitness" />
}
