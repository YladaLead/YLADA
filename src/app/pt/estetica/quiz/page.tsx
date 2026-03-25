import type { Metadata } from 'next'
import EsteticaQuizPublicContent from './EsteticaQuizPublicContent'

export const metadata: Metadata = {
  title: 'Quiz · Estética | YLADA',
  description:
    'Responda em poucos passos e veja um diagnóstico rápido do seu atendimento. Depois, comece grátis e use o mesmo método com seus clientes.',
}

export default function EsteticaQuizPage() {
  return <EsteticaQuizPublicContent />
}
