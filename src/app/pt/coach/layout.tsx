import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  manifest: '/manifest-coach.json',
  icons: {
    icon: '/images/logo/coach-quadrado.png',
    apple: '/images/logo/coach-quadrado.png',
  },
}

export default function CoachLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

