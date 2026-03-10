import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

const ESTETICA_PUBLIC = new Set(['', '/', '/login'])

function isEsteticaPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/estetica') return true
  const suffix = path.replace(/^\/pt\/estetica\/?/, '') || '/'
  return ESTETICA_PUBLIC.has(suffix) || suffix.startsWith('login')
}

export default async function EsteticaLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isEsteticaPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('estetica', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}
