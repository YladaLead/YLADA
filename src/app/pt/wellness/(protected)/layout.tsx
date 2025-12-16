import { ReactNode } from 'react'
import { validateProtectedAccess } from '@/lib/auth-server'

interface ProtectedLayoutProps {
  children: ReactNode
}

/**
 * Layout protegido para área Wellness
 * 
 * Valida no server-side:
 * - Sessão válida
 * - Perfil correto (wellness) ou admin/suporte
 * - Assinatura ativa (admin/suporte pode bypassar)
 * 
 * Se qualquer validação falhar → redirect server-side
 * Se tudo OK → renderiza children
 */
export default async function ProtectedWellnessLayout({ children }: ProtectedLayoutProps) {
  // Validação completa no server
  // Se falhar, redirect automático (não chega aqui)
  await validateProtectedAccess('wellness', {
    requireSubscription: true,
    allowAdmin: true,
    allowSupport: true,
  })

  // Se chegou aqui, tudo está OK - renderizar children
  return <>{children}</>
}

