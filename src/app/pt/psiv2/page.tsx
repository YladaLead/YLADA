import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/psi (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Psicologia (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/psi.',
}

export default function PsiV2ArchivePage() {
  return <AreaMinimalLandingById areaId="psi" />
}
