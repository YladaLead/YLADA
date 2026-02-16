import type { Metadata } from 'next'
import type { ReactNode } from 'react'
import { headers } from 'next/headers'
import ConditionalWidget from '@/components/nutri/ConditionalWidget'
import { validateProtectedAccess, isCoachPublicPath } from '@/lib/auth-server'

export const metadata: Metadata = {
  manifest: '/manifest-coach.json',
  icons: {
    icon: '/images/logo/coach-quadrado.png',
    apple: '/images/logo/coach-quadrado.png',
  },
}

/**
 * Layout raiz Coach: em rotas não públicas exige login + assinatura ativa.
 * Sem mensalidade em dia → redirect para /pt/coach/checkout.
 */
export default async function CoachLayout({ children }: { children: ReactNode }) {
  const headersList = await headers()
  const pathname = headersList.get('x-pathname') || headersList.get('x-invoke-path') || ''
  const isPublic = pathname ? isCoachPublicPath(pathname) : false
  if (!isPublic) {
    await validateProtectedAccess('coach', {
      requireSubscription: true,
      allowAdmin: true,
      allowSupport: true,
      excludeRoutesFromSubscription: [],
      currentPath: pathname,
    })
  }
  return (
    <>
      {children}
      <ConditionalWidget />
    </>
  )
}

