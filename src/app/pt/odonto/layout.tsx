import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

const ODONTO_PUBLIC = new Set(['', '/', '/login'])

function isOdontoPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/odonto') return true
  const suffix = path.replace(/^\/pt\/odonto\/?/, '') || '/'
  return (
    ODONTO_PUBLIC.has(suffix) ||
    suffix.startsWith('login') ||
    suffix.startsWith('como-funciona')
  )
}

export default async function OdontoLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isOdontoPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('odonto', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}
