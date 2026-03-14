import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

export const metadata: Metadata = {
  manifest: '/manifest-nutra.json',
  icons: {
    icon: '/images/logo/ylada/quadrado/laranja/ylada-quadrado-laranja-13.png',
    apple: '/images/logo/ylada/quadrado/laranja/ylada-quadrado-laranja-13.png',
  },
}

const NUTRA_PUBLIC = new Set(['', '/', '/login'])

function isNutraPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/nutra') return true
  const suffix = path.replace(/^\/pt\/nutra\/?/, '') || '/'
  return NUTRA_PUBLIC.has(suffix) || suffix.startsWith('login')
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

