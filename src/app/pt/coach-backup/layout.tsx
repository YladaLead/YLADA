import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  manifest: '/manifest-nutri.json',
  icons: {
    icon: '/images/logo/nutri/Logo_Nutri_quadrado.png',
    apple: '/images/logo/nutri/Logo_Nutri_quadrado.png',
  },
}

export default function NutriLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

