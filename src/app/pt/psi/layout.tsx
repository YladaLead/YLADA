import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

const PSI_PUBLIC = new Set(['', '/', '/login'])

function isPsiPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/psi') return true
  const suffix = path.replace(/^\/pt\/psi\/?/, '') || '/'
  return PSI_PUBLIC.has(suffix) || suffix.startsWith('login')
}

export default async function PsiLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isPsiPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('psi', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}
