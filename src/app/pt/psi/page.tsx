import type { Metadata } from 'next'
import PsiEntradaSocraticaContent from './PsiEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Psicologia | YLADA',
  description:
    'Conversas que não evoluem? Em poucos passos: mais clareza antes do WhatsApp e quem chega com mais contexto, com o Noel.',
}

export default function PsiPublicEntryPage() {
  return <PsiEntradaSocraticaContent />
}
