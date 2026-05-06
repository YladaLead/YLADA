import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'YLADA Pro — Estética capilar',
  description: 'Sistema de expansão e qualificação em estética capilar — YLADA Pro',
  icons: {
    icon: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png',
    apple: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png',
  },
}

export default function ProEsteticaCapilarRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
