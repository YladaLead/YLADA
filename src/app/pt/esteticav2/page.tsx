import AreaMinimalLandingById from '@/components/pilot/AreaMinimalLandingById'
import type { Metadata } from 'next'

/** Entrada minimal anterior a /pt/estetica (teste A/B ou rollback). */
export const metadata: Metadata = {
  title: 'Estética (v2) | YLADA',
  description: 'Entrada minimal anterior ao fluxo progressivo em /pt/estetica.',
}

export default function EsteticaV2ArchivePage() {
  return <AreaMinimalLandingById areaId="estetica" />
}
