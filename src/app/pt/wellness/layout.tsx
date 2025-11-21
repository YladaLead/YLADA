import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  manifest: '/manifest-wellness.json',
  icons: {
    icon: '/images/logo/wellness-quadrado.png',
    apple: '/images/logo/wellness-quadrado.png',
  },
}

export default function WellnessLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

