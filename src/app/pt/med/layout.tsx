import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

const MED_PUBLIC = new Set(['', '/', '/login'])

function isMedPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/med') return true
  const suffix = path.replace(/^\/pt\/med\/?/, '') || '/'
  return (
    MED_PUBLIC.has(suffix) ||
    suffix.startsWith('login') ||
    suffix.startsWith('como-funciona') ||
    suffix.startsWith('exemplo-cliente')
  )
}

export default async function MedLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isMedPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('med', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}
