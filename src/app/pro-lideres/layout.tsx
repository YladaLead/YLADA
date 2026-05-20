import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'YLADA Pro Líderes',
  description: 'Sistema de expansão para equipes — área do líder',
  icons: {
    icon: '/images/logo/ylada/novo/ylada-icon-512.png',
    apple: '/images/logo/ylada/novo/ylada-icon-512.png',
  },
}

export default function ProLideresRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
