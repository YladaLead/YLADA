import type { Metadata } from 'next'
import FitnessEntradaSocraticaContent from './FitnessEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Fitness | YLADA',
  description:
    'Menos “só uma dúvida”. Alunos mais preparados e WhatsApp com contexto antes da primeira aula ou plano.',
}

export default function FitnessPublicEntryPage() {
  return <FitnessEntradaSocraticaContent />
}
