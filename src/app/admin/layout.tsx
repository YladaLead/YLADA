import type { Metadata } from 'next'
import type { ReactNode } from 'react'

export const metadata: Metadata = {
  manifest: '/manifest-admin.json',
  icons: {
    icon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
    apple: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
  },
}

export default function AdminLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}

