import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido da matriz central YLADA.
 * Valida sessão; perfil ylada. Sem exigência de assinatura por enquanto.
 */
export default async function ProtectedYladaLayout({ children }: ProtectedLayoutProps) {
  await validateProtectedAccess('ylada', {
    requireSubscription: false,
    allowAdmin: true,
    allowSupport: true,
  })
  return <>{children}</>
}
