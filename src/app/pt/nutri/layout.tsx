import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'

export const metadata: Metadata = {
  manifest: '/manifest-nutri.json',
  icons: {
    icon: '/images/logo/nutri-quadrado.png',
    apple: '/images/logo/nutri-quadrado.png',
  },
}

export default function NutriLayout({ children }: { children: ReactNode }) {
  return (
    <>
      {children}
      <ConditionalWidget />
    </>
  )
}

