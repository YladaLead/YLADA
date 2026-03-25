import type { Metadata } from 'next'
import CoachEntradaSocraticaContent from './CoachEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Coach | YLADA',
  description:
    'Conversas que não viram sessão? Clientes mais preparados e WhatsApp com contexto antes da primeira conversa.',
}

export default function CoachPublicEntryPage() {
  return <CoachEntradaSocraticaContent />
}
