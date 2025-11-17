import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  manifest: '/manifest-coach.json',
  icons: {
    icon: '/images/logo/ylada/quadrado/roxo/ylada-quadrado-roxo-19.png',
    apple: '/images/logo/ylada/quadrado/roxo/ylada-quadrado-roxo-19.png',
  },
}

export default function CoachLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

