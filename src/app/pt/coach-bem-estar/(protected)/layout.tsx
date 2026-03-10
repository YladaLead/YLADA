import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'
import { OfflineBanner } from '@/components/OfflineBanner'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para área Coach de bem-estar.
 * Usa a mesma validação que wellness (assinatura wellness).
 */
export default async function ProtectedCoachBemEstarLayout({ children }: ProtectedLayoutProps) {
  await validateProtectedAccess('coach-bem-estar', {
    requireSubscription: true,
    allowAdmin: true,
    allowSupport: true,
  })

  return (
    <>
      <OfflineBanner />
      {children}
    </>
  )
}
