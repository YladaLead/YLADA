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
 * EXCEÇÃO: Onboarding e Diagnóstico não exigem assinatura
 * (usuário precisa completar diagnóstico antes de assinar)
 * 
 * Se qualquer validação falhar → redirect server-side
 * Se tudo OK → renderiza children
 */
export default async function ProtectedNutriLayout({ children }: ProtectedLayoutProps) {
  await validateProtectedAccess('nutri', {
    requireSubscription: true,
    allowAdmin: true,
    allowSupport: true,
    // Rotas que não exigem assinatura (onboarding flow + perfil)
    // O validateProtectedAccess verifica internamente se a requisição é para essas rotas
    excludeRoutesFromSubscription: ['/onboarding', '/diagnostico', '/configuracao'],
    currentPath: '', // Será detectado internamente via headers se necessário
  })

  return <>{children}</>
}
