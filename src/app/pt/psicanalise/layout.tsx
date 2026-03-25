import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

const PSICANALISE_PUBLIC = new Set(['', '/', '/login'])

function isPsicanalisePublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/psicanalise') return true
  const suffix = path.replace(/^\/pt\/psicanalise\/?/, '') || '/'
  return (
    PSICANALISE_PUBLIC.has(suffix) ||
    suffix.startsWith('login') ||
    suffix.startsWith('como-funciona') ||
    suffix.startsWith('exemplo-cliente')
  )
}

export default async function PsicanaliseLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isPsicanalisePublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('psicanalise', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}
