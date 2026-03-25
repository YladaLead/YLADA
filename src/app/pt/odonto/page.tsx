import type { Metadata } from 'next'
import OdontoEntradaSocraticaContent from './OdontoEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Odontologia | YLADA',
  description:
    'Preço no escuro, WhatsApp e paciente que some? Em poucos passos: mais clareza antes do contato e menos esforço pra você, com o Noel.',
}

export default function OdontoPublicEntryPage() {
  return <OdontoEntradaSocraticaContent />
}
