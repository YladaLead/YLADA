import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import { validateProtectedAccess } from '@/lib/auth-server'

const SELLER_PUBLIC = new Set(['', '/', '/login'])

function isSellerPublicPath(pathname: string): boolean {
  const path = pathname.replace(/\/$/, '') || '/'
  if (path === '/pt/seller') return true
  const suffix = path.replace(/^\/pt\/seller\/?/, '') || '/'
  return SELLER_PUBLIC.has(suffix) || suffix.startsWith('login')
}

export default async function SellerLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = !pathname || isSellerPublicPath(pathname)
  if (!isPublic) {
    await validateProtectedAccess('seller', {
      requireSubscription: false,
      allowAdmin: true,
      allowSupport: true,
      currentPath: pathname,
    })
  }
  return <>{children}</>
}
