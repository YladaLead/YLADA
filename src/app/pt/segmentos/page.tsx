import type { Metadata } from 'next'
import PtSegmentosHubClient from './PtSegmentosHubClient'

export const metadata: Metadata = {
  title: 'Escolha seu segmento | YLADA',
  description:
    'Nutrição, medicina, psicologia, estética e outras áreas: entre no fluxo progressivo do seu segmento.',
  robots: { index: true, follow: true },
}

export default function PtSegmentosPage() {
  return <PtSegmentosHubClient />
}
