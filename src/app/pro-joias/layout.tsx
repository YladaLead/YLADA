import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'YLADA Pro Joias',
  description: 'Sistema de gestão e expansão de redes de joias, semijoias e bijuterias — YLADA Pro',
  icons: {
    icon: '/images/logo/ylada/novo/ylada-icon-512.png',
    apple: '/images/logo/ylada/novo/ylada-icon-512.png',
  },
}

export default function ProJoiasRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
