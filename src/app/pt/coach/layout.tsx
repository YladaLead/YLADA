import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'

export const metadata: Metadata = {
  manifest: '/manifest-coach.json',
  icons: {
    icon: '/images/logo/coach-quadrado.png',
    apple: '/images/logo/coach-quadrado.png',
  },
}

export default function CoachLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ConditionalWidget />
    </>
  )
}

