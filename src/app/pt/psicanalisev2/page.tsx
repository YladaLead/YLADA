import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/psicanalise (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Psicanálise (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/psicanalise.',
}

export default function PsicanaliseV2ArchivePage() {
  return <AreaMinimalLandingById areaId="psicanalise" />
}
