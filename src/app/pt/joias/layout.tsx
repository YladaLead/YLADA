import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

const JOIAS_PUBLIC = new Set(['', '/', '/login'])

function isJoiasPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/joias') return true
  const suffix = path.replace(/^\/pt\/joias\/?/, '') || '/'
  return (
    JOIAS_PUBLIC.has(suffix) ||
    suffix.startsWith('login') ||
    suffix.startsWith('como-funciona') ||
    suffix.startsWith('exemplo-cliente')
  )
}

export default async function JoiasLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isJoiasPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('joias', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}
