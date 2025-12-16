import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para área Coach
 * 
 * Valida no server-side:
 * - Sessão válida
 * - Perfil correto (coach) ou admin/suporte
 * - Assinatura ativa (admin/suporte pode bypassar)
 * 
 * Se qualquer validação falhar → redirect server-side
 * Se tudo OK → renderiza children
 */
export default async function ProtectedCoachLayout({ children }: ProtectedLayoutProps) {
  await validateProtectedAccess('coach', {
    requireSubscription: true,
    allowAdmin: true,
    allowSupport: true,
  })

  return <>{children}</>
}
