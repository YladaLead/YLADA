import type { Metadata } from 'next'
import EsteticaEntradaSocraticaContent from './EsteticaEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Estética | YLADA',
  description:
    'Direct, preço, conversa que não agenda? Em poucos passos: mais clareza antes do contato e menos esforço pra você — com o Noel.',
}

export default function EsteticaPublicEntryPage() {
  return <EsteticaEntradaSocraticaContent />
}
