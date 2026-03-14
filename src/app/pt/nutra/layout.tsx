import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

export const metadata: Metadata = {
  manifest: '/manifest-nutra.json',
  icons: {
    icon: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
    apple: '/images/logo/ylada/quadrado/azul-claro/ylada-quadrado-azul-claro-31.png',
  },
}

const NUTRA_PUBLIC = new Set(['', '/', '/login', '/oferta', '/checkout'])

function isNutraPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/nutra') return true
  const suffix = path.replace(/^\/pt\/nutra\/?/, '') || '/'
  return NUTRA_PUBLIC.has(suffix) || suffix.startsWith('login') || suffix.startsWith('oferta') || suffix.startsWith('checkout')
}

export default async function NutraLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isNutraPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('nutra', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}

