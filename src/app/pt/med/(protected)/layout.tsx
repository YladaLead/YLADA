import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para área Medicina (YLADA).
 * Valida sessão e perfil (med). Sem exigência de assinatura por enquanto.
 * Administrador e suporte têm acesso (allowAdmin, allowSupport) mesmo com perfil de outra área.
 */
export default async function ProtectedMedLayout({ children }: ProtectedLayoutProps) {
  await validateProtectedAccess('med', {
    requireSubscription: false,
    allowAdmin: true,
    allowSupport: true,
  })
  return <>{children}</>
}
