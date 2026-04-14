import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'YLADA Pro Estética Corporal',
  description: 'Sistema de expansão e qualificação para estética corporal — YLADA Pro',
  icons: {
    icon: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png',
    apple: '/images/logo/ylada/quadrado/azul-claro/logo_ylada_azul_quadrado.png',
  },
}

export default function ProEsteticaCorporalRootLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
