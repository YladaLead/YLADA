import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/perfumaria (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Perfumaria (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/perfumaria.',
}

export default function PerfumariaV2ArchivePage() {
  return <AreaMinimalLandingById areaId="perfumaria" />
}
