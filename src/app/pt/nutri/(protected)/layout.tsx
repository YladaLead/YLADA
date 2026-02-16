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
 * Sem assinatura: qualquer acesso à área protegida redireciona para /pt/nutri/checkout (planos).
 * Login e checkout ficam fora deste layout e continuam acessíveis.
 */
export default async function ProtectedNutriLayout({ children }: ProtectedLayoutProps) {
  await validateProtectedAccess('nutri', {
    requireSubscription: true,
    allowAdmin: true,
    allowSupport: true,
    excludeRoutesFromSubscription: [], // Nenhuma rota livre: é obrigatório assinar para acessar a plataforma
    currentPath: '',
  })

  return <>{children}</>
}
