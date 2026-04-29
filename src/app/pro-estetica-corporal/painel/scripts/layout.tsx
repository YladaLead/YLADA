import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Mensagens prontas',
  description: 'Scripts salvos para WhatsApp e acompanhamento — Pro Estética Corporal.',
}

export default function ProEsteticaCorporalScriptsLayout({ children }: { children: ReactNode }) {
  return children
}
