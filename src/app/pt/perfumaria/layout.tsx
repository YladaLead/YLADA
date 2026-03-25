import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

const PERFUMARIA_PUBLIC = new Set(['', '/', '/login'])

function isPerfumariaPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/perfumaria') return true
  const suffix = path.replace(/^\/pt\/perfumaria\/?/, '') || '/'
  return (
    PERFUMARIA_PUBLIC.has(suffix) ||
    suffix.startsWith('login') ||
    suffix.startsWith('como-funciona') ||
    suffix.startsWith('exemplo-cliente')
  )
}

export default async function PerfumariaLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isPerfumariaPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('perfumaria', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}
