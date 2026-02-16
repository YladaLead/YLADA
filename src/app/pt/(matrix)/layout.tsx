import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

/**
 * Layout protegido da matriz (app em /pt/home, /pt/trilha, etc.).
 * Valida sessão; perfil ylada.
 */
export default async function MatrixLayout({ children }: { children: ReactNode }) {
  await validateProtectedAccess('ylada', {
    requireSubscription: false,
    allowAdmin: true,
    allowSupport: true,
  })
  return <>{children}</>
}
