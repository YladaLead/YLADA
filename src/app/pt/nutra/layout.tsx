import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  manifest: '/manifest-nutra.json',
  icons: {
    icon: '/images/logo/ylada/quadrado/laranja/ylada-quadrado-laranja-13.png',
    apple: '/images/logo/ylada/quadrado/laranja/ylada-quadrado-laranja-13.png',
  },
}

export default function NutraLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

