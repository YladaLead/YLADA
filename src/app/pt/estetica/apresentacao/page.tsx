import type { Metadata } from 'next'
import EsteticaEntradaSocraticaContent from '../EsteticaEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Apresentação · Estética | YLADA',
  description:
    'Tour em passos: direct, preço, conversa que não agenda? Mais clareza antes do contato e menos esforço com o Noel.',
}

export default function EsteticaApresentacaoPage() {
  return <EsteticaEntradaSocraticaContent />
}
