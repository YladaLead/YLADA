import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'YLADA — Piloto',
  description: 'Experiência minimalista para profissionais (teste).',
  robots: { index: false, follow: false },
}

export default function PilotLayout({ children }: { children: React.ReactNode }) {
  return children
}
