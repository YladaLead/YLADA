import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  manifest: '/manifest-nutri.json',
  icons: {
    icon: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png',
    apple: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png',
  },
}

export default function NutriLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

