import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/coach (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Coach (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/coach.',
}

export default function CoachV2ArchivePage() {
  return <AreaMinimalLandingById areaId="coach" />
}
