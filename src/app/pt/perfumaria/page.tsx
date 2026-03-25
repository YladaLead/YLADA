import type { Metadata } from 'next'
import PerfumariaEntradaSocraticaContent from './PerfumariaEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Perfumaria | YLADA',
  description:
    'Menos explicação no primeiro contato. Clientes mais preparados e WhatsApp com contexto sobre fragrância e ocasião.',
}

export default function PerfumariaPublicEntryPage() {
  return <PerfumariaEntradaSocraticaContent />
}
