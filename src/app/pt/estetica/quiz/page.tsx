import type { Metadata } from 'next'
import EsteticaQuizPublicContent from './EsteticaQuizPublicContent'

export const metadata: Metadata = {
  title: 'Quiz · Estética | YLADA',
  description:
    'Poucas perguntas e um fechamento direto: faça sua cliente chegar pronta pra fechar. Comece grátis no YLADA.',
}

export default function EsteticaQuizPage() {
  return <EsteticaQuizPublicContent />
}
