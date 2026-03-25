import type { Metadata } from 'next'
import NutriEntradaSocraticaContent from './NutriEntradaSocraticaContent'

export const metadata: Metadata = {
  title: 'Nutri | YLADA',
  description:
    'Preço, WhatsApp e paciente que some? Em poucos passos: mais clareza antes da consulta e menos esforço pra você, com o Noel.',
}

export default function NutriPublicEntryPage() {
  return <NutriEntradaSocraticaContent />
}
