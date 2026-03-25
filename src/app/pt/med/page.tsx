import type { Metadata } from 'next'
import MedEntradaSocraticaContent from './MedEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Medicina | YLADA',
  description:
    'Explique menos na triagem do WhatsApp. Em poucos passos: paciente com mais contexto antes da consulta, com o Noel.',
}

export default function MedPublicEntryPage() {
  return <MedEntradaSocraticaContent />
}
