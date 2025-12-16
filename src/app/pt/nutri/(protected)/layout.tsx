import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para área Nutri
 * 
 * Valida no server-side:
 * - Sessão válida
 * - Perfil correto (nutri) ou admin/suporte
 * - Assinatura ativa (admin/suporte pode bypassar)
 * 
 * Se qualquer validação falhar → redirect server-side
 * Se tudo OK → renderiza children
 */
export default async function ProtectedNutriLayout({ children }: ProtectedLayoutProps) {
  await validateProtectedAccess('nutri', {
    requireSubscription: true,
    allowAdmin: true,
    allowSupport: true,
  })

  return <>{children}</>
}
