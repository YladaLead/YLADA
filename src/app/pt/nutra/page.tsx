import type { Metadata } from 'next'
import NutraEntradaSocraticaContent from './NutraEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Nutra · suplementos | YLADA',
  description:
    'Muita conversa e pouca venda? Em poucos passos: mais clareza antes do WhatsApp e indicação com segurança, com o Noel.',
}

export default function NutraPublicEntryPage() {
  return <NutraEntradaSocraticaContent />
}
