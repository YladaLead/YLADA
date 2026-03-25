import type { Metadata, Viewport } from 'next'
import type { ReactNode } from 'react'

/**
 * Área Estética: mobile-first + PWA com escopo próprio (manifest-estetica.json).
 * Rotas protegidas validam auth no page ou em layout aninhado.
 */

export const viewport: Viewport = {
  themeColor: '#2563eb',
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
}

export const metadata: Metadata = {
  applicationName: 'YLADA Estética',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'YLADA Estética',
  },
  formatDetection: {
    telephone: false,
    email: false,
    address: false,
  },
  manifest: '/manifest-estetica.json',
}

export default function EsteticaLayout({ children }: { children: ReactNode }) {
  return <>{children}</>
}
