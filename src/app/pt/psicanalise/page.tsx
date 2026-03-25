import type { Metadata } from 'next'
import PsicanaliseEntradaSocraticaContent from './PsicanaliseEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Psicanálise | YLADA',
  description:
    'Menos explicação no primeiro contato. Em poucos passos: analisandos mais preparados e Zap com contexto, com o Noel.',
}

export default function PsicanalisePublicEntryPage() {
  return <PsicanaliseEntradaSocraticaContent />
}
