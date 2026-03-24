import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

const FITNESS_PUBLIC = new Set(['', '/', '/login'])

function isFitnessPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/fitness') return true
  const suffix = path.replace(/^\/pt\/fitness\/?/, '') || '/'
  return (
    FITNESS_PUBLIC.has(suffix) ||
    suffix.startsWith('login') ||
    suffix.startsWith('como-funciona')
  )
}

export default async function FitnessLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isFitnessPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('fitness', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}
